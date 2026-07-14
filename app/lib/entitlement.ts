// Access entitlement — the single source of truth for "can this user create a
// company / reach the dashboard?". Split into two layers:
//
//  - Pure helpers here (no db/redis imports) so the edge middleware can decide
//    access from the JWT summary alone, without a DB round-trip.
//  - `resolveEntitlement` (server-only, in entitlement.server.ts) reads the
//    Subscription row and produces the summary that gets baked into the JWT.

export type AccessStatus = "NONE" | "TRIAL" | "ACTIVE" | "EXPIRED";

/** The compact entitlement summary carried inside the access token. */
export interface AccessSummary {
  accessStatus: AccessStatus;
  /** Trial expiry as epoch ms, or null when not on a trial. */
  trialEndsAt: number | null;
}

/**
 * Effective access decision, computed purely from the JWT summary. A TRIAL is
 * only "live" while now < trialEndsAt, so trial expiry takes effect the instant
 * the clock passes it — no token refresh required for the *downgrade*.
 */
export function hasAccess(
  accessStatus: AccessStatus | null | undefined,
  trialEndsAt: number | null | undefined,
  now: number = Date.now()
): boolean {
  if (accessStatus === "ACTIVE") return true;
  if (accessStatus === "TRIAL") {
    return typeof trialEndsAt === "number" && now < trialEndsAt;
  }
  return false;
}
