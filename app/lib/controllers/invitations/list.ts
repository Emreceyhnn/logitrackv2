"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { controllerGuard } from "../utils/controllerGuard";

/** Pending invitations for the caller's email. Used on onboarding. */
export const getMyInvitations = authenticatedAction(async (user) => {
  return controllerGuard("getMyInvitations", async () => {
    if (user.companyId) return [];
    
    const dbUser = await db.user.findUnique({ where: { id: user.id }, select: { email: true } });
    if (!dbUser) return [];

    return db.invitation.findMany({
      where: { 
        email: dbUser.email, 
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      include: {
        company: { select: { name: true } },
        role: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  });
});
