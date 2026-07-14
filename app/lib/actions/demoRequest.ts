"use server";

import { headers } from "next/headers";
import { db } from "../db";
import { rateLimit } from "../rate-limiter";
import { getUserSession } from "./auth";
import { hasAccess } from "../entitlement";
import { logger } from "@/app/lib/logger";

const TRIAL_DAYS = 7;

export type DemoRequestKind = "DEMO" | "CONTACT";

export interface DemoRequestInput {
  fullName: string;
  email: string;
  company?: string | undefined;
  message?: string | undefined;
  /** "DEMO" for "Request a Demo" CTAs, "CONTACT" for a plain contact message. */
  type?: DemoRequestKind | undefined;
}

export interface DemoRequestResult {
  success?: boolean;
  error?: string;
}

// Basic RFC-5322-ish email check — good enough for a public lead form.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public lead-capture action for the landing "Request a Demo" form.
 *
 * Intentionally unauthenticated: anonymous visitors submit before any tenant
 * exists. `DemoRequest` is not a tenant model, so the tenant-guard extension
 * leaves it untouched and no companyId is injected.
 */
export async function submitDemoRequest(
  input: DemoRequestInput
): Promise<DemoRequestResult> {
  try {
    // Derive the rate-limit key from the request headers, never from client
    // arguments, so a caller can't pick its own bucket.
    const headerStore = await headers();
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerStore.get("x-real-ip") ||
      "127.0.0.1";

    // Max 5 demo requests per hour per IP.
    const ipLimit = await rateLimit(ip, 5, 3600, "rate-limit:demo-request:");
    if (!ipLimit.success) {
      return {
        error: "Too many requests. Please try again in an hour.",
      };
    }

    const fullName = input.fullName?.trim() ?? "";
    const email = input.email?.trim().toLowerCase() ?? "";
    const company = input.company?.trim() || null;
    const message = input.message?.trim() || null;

    if (!fullName) return { error: "VALIDATION_FULLNAME" };
    if (!email) return { error: "VALIDATION_EMAIL_REQUIRED" };
    if (!EMAIL_RE.test(email)) return { error: "VALIDATION_EMAIL_INVALID" };

    const type = input.type === "DEMO" ? "DEMO" : "CONTACT";

    await db.demoRequest.create({
      data: {
        fullName: fullName.slice(0, 200),
        email: email.slice(0, 320),
        company: company?.slice(0, 200) ?? null,
        message: message?.slice(0, 2000) ?? null,
        type,
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("submitDemoRequest failed:", error);
    return { error: "INTERNAL" };
  }
}

/**
 * CTA gating for the landing page: true when the signed-in user currently has
 * dashboard access (active plan or a live trial). Anonymous visitors and users
 * without access get `false` — they see "Sign In" + "Request a Demo" instead of
 * the "enter dashboard / create company" CTA.
 */
export async function hasDashboardAccess(): Promise<boolean> {
  try {
    const session = await getUserSession();
    if (!session?.id) return false;
    return hasAccess(session.accessStatus, session.trialEndsAt);
  } catch (error) {
    logger.error("hasDashboardAccess failed:", error);
    return false;
  }
}

/**
 * Approve a demo request and grant the requester a 7-day trial. Managed by hand
 * for now (no admin UI): call it from a script / server context with the
 * DemoRequest id. Matches the demo request's email to a User and upserts their
 * Subscription to TRIAL. The user sees the new access after their token
 * refreshes (≤1h) or on next sign-in.
 */
export async function approveDemoRequest(
  demoRequestId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const demo = await db.demoRequest.update({
      where: { id: demoRequestId },
      data: { status: "APPROVED" },
      select: { email: true },
    });

    const account = await db.user.findUnique({
      where: { email: demo.email.toLowerCase() },
      select: { id: true },
    });

    // No account yet? The approval still stands; the trial is granted the moment
    // they sign up with that email (createSession resolves entitlement fresh).
    // For now we only grant when the account already exists.
    if (!account) {
      return { success: true };
    }

    const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
    await db.subscription.upsert({
      where: { userId: account.id },
      create: { userId: account.id, status: "TRIAL", trialEndsAt },
      update: { status: "TRIAL", trialEndsAt },
    });

    return { success: true };
  } catch (error) {
    logger.error("approveDemoRequest failed:", error);
    return { error: "INTERNAL" };
  }
}
