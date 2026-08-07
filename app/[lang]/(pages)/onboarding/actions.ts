"use server";

import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { db } from "@/app/lib/db";
import { refreshSession } from "@/app/lib/controllers/session";
import { hasAccess } from "@/app/lib/entitlement";

export async function checkAndSyncCompany() {
  const user = await getAuthenticatedUser();
  if (!user) return false;

  if (user.companyId) return true;

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { companyId: true }
  });

  if (dbUser?.companyId) {
    await refreshSession();
    return true;
  }

  return false;
}

/**
 * Whether the signed-in user still needs to prove their email address before
 * onboarding lets them create or join a company.
 *
 * Both paths gate on this server-side too (`createCompany` via
 * `requireVerifiedEmail`, join-request creation the same way), so this is a
 * UX gate, not the security boundary — it exists so an unverified user sees a
 * "check your inbox" screen instead of filling out a whole dialog and hitting
 * a rejection at the end.
 */
export async function getEmailVerificationGate(): Promise<{
  needsVerification: boolean;
  email: string | null;
}> {
  const user = await getAuthenticatedUser();
  if (!user) return { needsVerification: false, email: null };

  // The JWT claim is the fast path; sessions minted before emailVerified
  // existed default to false there (see auth-middleware.ts), so re-check the
  // DB once rather than permanently stranding a genuinely verified user.
  if (user.emailVerified) return { needsVerification: false, email: null };

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { email: true, emailVerifiedAt: true },
  });

  if (dbUser?.emailVerifiedAt) {
    // DB says verified but the token predates the claim — refresh so the
    // client doesn't keep re-deriving this on every render.
    await refreshSession();
    return { needsVerification: false, email: null };
  }

  return { needsVerification: true, email: dbUser?.email ?? null };
}

/**
 * Whether the signed-in user may create a company on this page — a live
 * trial or paid plan, same check createCompany itself enforces server-side.
 * A user without one (e.g. a direct signup with no demo-request trial) can
 * still see this page and use "join an existing company"; this only gates
 * the "create a company" card client-side so it renders disabled instead of
 * silently failing after the dialog is filled out.
 */
export async function canCreateCompany(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  if (!user) return false;
  return hasAccess(user.accessStatus, user.trialEndsAt);
}
