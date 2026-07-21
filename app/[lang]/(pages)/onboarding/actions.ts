"use server";

import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { db } from "@/app/lib/db";
import { refreshSession } from "@/app/lib/controllers/session";

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
