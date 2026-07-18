import "server-only";

import { db } from "./db";
import type { AccessStatus, AccessSummary } from "./entitlement";

/** Length of a self-serve / demo-approved trial, in days. */
export const TRIAL_DAYS = 7;

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
