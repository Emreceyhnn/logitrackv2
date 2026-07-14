import "server-only";

import { db } from "./db";
import type { AccessStatus, AccessSummary } from "./entitlement";

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
