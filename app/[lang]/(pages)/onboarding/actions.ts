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
