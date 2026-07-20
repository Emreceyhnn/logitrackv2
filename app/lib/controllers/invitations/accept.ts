"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { db } from "../../db";
import { maybeAuthenticatedAction } from "../../auth-middleware";
import { rateLimit } from "../../rate-limiter";
import { hashToken } from "../session/internal";
import { createSession, logAuditEvent } from "../session";
import { invalidatePattern, driverCacheKeys } from "../../redis";
import { invalidateCompanyCache } from "../company/shared";
import { acceptInvitationSchema } from "../../validation/serverSchemas";
import { logger } from "@/app/lib/logger";

interface InvitationDriverData {
  employeeId: string;
  phone: string;
  licenseType: string | null;
  licenseNumber: string | null;
  licenseExpiry: string | null;
}

/** Read-only lookup used by the accept-invite page to show the invited email
 * before any form is submitted. Public, unauthenticated. */
export async function getInvitationByToken(
  rawToken: string
): Promise<{ email: string; companyName: string } | { error: string }> {
  const tokenHash = hashToken(rawToken);
  const invitation = await db.invitation.findUnique({
    where: { tokenHash },
    select: { email: true, status: true, expiresAt: true, company: { select: { name: true } } },
  });
  if (!invitation || invitation.status !== "PENDING" || invitation.expiresAt < new Date()) {
    return { error: "This invitation is invalid or has expired." };
  }
  return { email: invitation.email, companyName: invitation.company.name };
}

export const acceptDriverInvitation = maybeAuthenticatedAction(
  async (_user, rawToken: string, name: string, surname: string, password: string) => {
    try {
      const parsed = acceptInvitationSchema.safeParse({ name, surname, password });
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        return { error: first?.message ?? "Invalid data", field: String(first?.path[0] ?? "general") };
      }

      const headerStore = await headers();
      const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "127.0.0.1";
      const userAgent = headerStore.get("user-agent") || "Unknown Device";

      const ipLimit = await rateLimit(ip, 5, 3600, "rate-limit:accept-invite-ip:");
      if (!ipLimit.success) {
        return { error: "Too many attempts. Please try again in an hour." };
      }

      const tokenHash = hashToken(rawToken);
      const invitation = await db.invitation.findUnique({ where: { tokenHash } });
      if (!invitation || invitation.status !== "PENDING" || invitation.expiresAt < new Date()) {
        return { error: "This invitation is invalid or has expired." };
      }

      const isExist = await db.user.findFirst({ where: { email: invitation.email } });
      if (isExist) return { error: "An account with this email already exists. Please sign in instead." };

      const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
      const driverData = invitation.driverData as unknown as InvitationDriverData;

      const newUser = await db.$transaction(async (tx) => {
        const existingEmployee = await tx.driver.findFirst({
          where: { companyId: invitation.companyId, employeeId: driverData.employeeId },
        });
        if (existingEmployee) throw new Error("A driver with this Employee ID already exists");

        const created = await tx.user.create({
          data: {
            name: parsed.data.name,
            surname: parsed.data.surname,
            password: hashedPassword,
            email: invitation.email,
            currency: "USD",
            companyId: invitation.companyId,
            roleId: invitation.roleId,
          },
        });

        await tx.driver.create({
          data: {
            companyId: invitation.companyId,
            userId: created.id,
            phone: driverData.phone,
            employeeId: driverData.employeeId,
            licenseType: driverData.licenseType,
            licenseNumber: driverData.licenseNumber,
            licenseExpiry: driverData.licenseExpiry ? new Date(driverData.licenseExpiry) : null,
            status: "OFF_DUTY",
            safetyScore: 100,
            efficiencyScore: 100,
            rating: 5.0,
          },
        });

        await tx.invitation.update({
          where: { id: invitation.id },
          data: { status: "ACCEPTED", acceptedAt: new Date() },
        });

        return created;
      });

      await invalidatePattern(driverCacheKeys.companyPattern(invitation.companyId));
      await invalidateCompanyCache(invitation.companyId);

      await createSession(newUser, userAgent, ip);
      await logAuditEvent({
        userId: newUser.id,
        action: "REGISTER",
        ipAddress: ip,
        deviceInfo: userAgent,
        metadata: { email: invitation.email, viaInvitation: true },
      });

      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          surname: newUser.surname,
          email: newUser.email,
          companyId: newUser.companyId,
        },
      };
    } catch (error) {
      logger.error("Failed to accept invitation:", error);
      const message = error instanceof Error ? error.message : "Internal server error";
      return { error: message, field: "general" };
    }
  }
);
