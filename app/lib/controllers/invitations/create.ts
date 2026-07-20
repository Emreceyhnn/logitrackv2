"use server";

import { db } from "../../db";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";
import { controllerGuard } from "../utils/controllerGuard";
import { ensureStandardRoles } from "../company/shared";
import { rateLimit } from "../../rate-limiter";
import { generateRefreshToken, hashToken } from "../session/internal";
import { sendDriverInviteEmail } from "../../services/email";
import { createDriverInvitationSchema } from "../../validation/serverSchemas";
import { ConflictError, RateLimitError, ValidationError } from "../../errors";

const INVITE_EXPIRY_DAYS = 7;

export const createDriverInvitation = authenticatedAction(
  async (
    user,
    email: string,
    driverData: {
      employeeId: string;
      phone: string;
      licenseType?: string;
      licenseNumber?: string;
      licenseExpiry?: string;
    }
  ) => {
    const companyId = user?.companyId || "";
    return controllerGuard("createDriverInvitation", async () => {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const parsed = createDriverInvitationSchema.safeParse({ email, ...driverData });
      if (!parsed.success) {
        throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid data");
      }

      const limit = await rateLimit(user.id, 20, 3600, "rate-limit:send-invite:");
      if (!limit.success) throw new RateLimitError();

      await ensureStandardRoles();

      const existingUser = await db.user.findFirst({ where: { email: parsed.data.email } });
      if (existingUser?.companyId) {
        throw new ConflictError("This email is already associated with a company");
      }

      const existingInvite = await db.invitation.findFirst({
        where: { companyId, email: parsed.data.email, status: "PENDING", expiresAt: { gt: new Date() } },
      });
      if (existingInvite) throw new ConflictError("An invitation is already pending for this email");

      const existingEmployee = await db.driver.findFirst({
        where: { companyId, employeeId: parsed.data.employeeId },
      });
      if (existingEmployee) throw new Error("A driver with this Employee ID already exists");

      const rawToken = generateRefreshToken();
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

      const invitation = await db.invitation.create({
        data: {
          email: parsed.data.email,
          companyId,
          roleId: "role_driver",
          tokenHash,
          driverData: {
            employeeId: parsed.data.employeeId,
            phone: parsed.data.phone,
            licenseType: parsed.data.licenseType || null,
            licenseNumber: parsed.data.licenseNumber || null,
            licenseExpiry: parsed.data.licenseExpiry || null,
          },
          invitedById: user.id,
          expiresAt,
        },
      });

      const company = await db.company.findUnique({ where: { id: companyId }, select: { name: true } });
      const base = process.env.NEXT_PUBLIC_BASE_URL || "";
      const inviteUrl = `${base}/en/auth/accept-invite?token=${rawToken}`;

      await sendDriverInviteEmail(parsed.data.email, inviteUrl, company?.name || "Your company");

      return { id: invitation.id, email: invitation.email, expiresAt: invitation.expiresAt };
    });
  }
);
