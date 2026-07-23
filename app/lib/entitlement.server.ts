import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";
import type { AccessStatus, AccessSummary } from "./entitlement";

/** Length of a self-serve / demo-approved trial, in days. */
export const TRIAL_DAYS = 7;

// ─── Demo-request signup token ─────────────────────────────────────────────
// A brand-new signup gets no trial by default (see resolveEntitlement below) —
// only someone arriving from an approved "Request a Demo" submission should
// land in /onboarding with a live trial. That provenance is carried across
// the redirect to /auth/sign-up as a short-lived, signed JWT (not a plain
// ?ref=demo query param, which anyone could type into the URL bar) binding
// the token to the exact email that filed the demo request.
const DEMO_TOKEN_TTL = "30m";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not defined");
  return secret;
}

export async function createDemoSignupToken(email: string): Promise<string> {
  const secret = new TextEncoder().encode(getJwtSecret());
  return new SignJWT({ email: email.toLowerCase(), purpose: "demo-signup" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(DEMO_TOKEN_TTL)
    .sign(secret);
}

/**
 * Verifies a demo-signup token and returns the email it was issued for, or
 * null if missing/expired/tampered/for a different email than expected.
 * Callers MUST compare the returned email against the email being
 * registered — the token only proves "this email filed a demo request
 * recently," not "this request is that person."
 */
export async function verifyDemoSignupToken(
  token: string | undefined | null,
  expectedEmail: string
): Promise<boolean> {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret);
    return (
      payload.purpose === "demo-signup" &&
      typeof payload.email === "string" &&
      payload.email === expectedEmail.toLowerCase()
    );
  } catch {
    return false;
  }
}

/**
 * Grants (or renews) a user's self-serve trial by upserting their Subscription
 * to TRIAL with a fresh {@link TRIAL_DAYS}-day expiry. Idempotent: calling it
 * again just pushes the expiry out.
 *
 * Callers that mint a token immediately afterwards (e.g. signup) get a token
 * whose entitlement already reflects the trial, so access is instant with no
 * refresh wait. Returns the trial expiry so callers can surface it if needed.
 */
export async function grantTrial(userId: string): Promise<{ trialEndsAt: Date }> {
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  await db.subscription.upsert({
    where: { userId },
    create: { userId, status: "TRIAL", trialEndsAt },
    update: { status: "TRIAL", trialEndsAt },
  });
  return { trialEndsAt };
}

/**
 * Reads a user's Subscription and produces the compact {@link AccessSummary}
 * that gets baked into the access token. A TRIAL whose `trialEndsAt` has passed
 * is reported as EXPIRED so a freshly minted token already reflects the lapse.
 *
 * No subscription row → NONE (the default for a brand-new signup: they must
 * request a demo and be approved before they get a trial).
 */
export async function resolveEntitlement(
  userId: string
): Promise<AccessSummary> {
  const sub = await db.subscription.findUnique({
    where: { userId },
    select: { status: true, trialEndsAt: true },
  });

  if (!sub) return { accessStatus: "NONE", trialEndsAt: null };

  const trialEndsAt = sub.trialEndsAt ? sub.trialEndsAt.getTime() : null;

  let status: AccessStatus = sub.status;
  if (status === "TRIAL" && (trialEndsAt === null || Date.now() >= trialEndsAt)) {
    status = "EXPIRED";
  }

  return { accessStatus: status, trialEndsAt };
}
