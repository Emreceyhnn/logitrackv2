"use server";

import { db } from "../../db";
import { Prisma } from "@prisma/client";
import type { AuditAction } from "@prisma/client";
import { logger } from "@/app/lib/logger";


/**
 * Writes a security event to the audit log.
 */
export async function logAuditEvent(params: {
  userId?: string;
  action: AuditAction;
  ipAddress?: string | null;
  deviceInfo?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        ipAddress: params.ipAddress || null,
        deviceInfo: params.deviceInfo || null,
        metadata: params.metadata !== undefined ? (params.metadata as Prisma.InputJsonValue) : Prisma.DbNull,
      },
    });
  } catch (error) {
    // Audit logging should never break the main flow
    logger.error("Failed to write audit log:", error);
  }
}
