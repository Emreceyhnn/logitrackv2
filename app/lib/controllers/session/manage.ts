"use server";

import { cookies } from "next/headers";
import { db } from "../../db";
import { redis } from "../../redis";
import { logger } from "../../logger";

/**
 * Revokes a specific session (soft-delete).
 */
export async function revokeSession(sessionId: string): Promise<void> {
  // Read the token first so we can invalidate the Redis cache entry.
  const session = await db.session.findUnique({
    where: { id: sessionId },
    select: { token: true },
  });

  // Idempotent: a session that was already deleted (e.g. by
  // cleanExpiredSessions, a concurrent logout, or an expired-then-cleaned
  // row) is a no-op success — not a P2025 crash. updateMany matches 0 rows
  // silently instead of throwing.
  await db.session.updateMany({
    where: { id: sessionId },
    data: { isRevoked: true },
  });

  if (session?.token) {
    await redis.del(`session:${session.token}`).catch(() => {});
  }
}

/**
 * Revokes ALL sessions for a user (e.g. password change, security event).
 */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  const activeSessions = await db.session.findMany({
    where: { userId, isRevoked: false },
    select: { token: true },
  });

  await db.session.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true },
  });

  for (const s of activeSessions) {
    if (s.token) {
      await redis.del(`session:${s.token}`).catch(() => {});
    }
  }
}

/**
 * Clears auth cookies from the client.
 */
export async function clearAuthCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("refreshToken");
  } catch (error) {
    logger.warn(
      "[clearAuthCookies] ⚠️ Could not delete cookies (likely called during render). This is expected if not in a Server Action/Route Handler.",
      error
    );
  }
}

/**
 * Deletes expired and revoked sessions from the database.
 * Can be called periodically via a cron job or admin trigger.
 */
export async function cleanExpiredSessions(): Promise<number> {
  const result = await db.session.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { isRevoked: true }],
    },
  });
  return result.count;
}

/**
 * Returns active (non-revoked, non-expired) sessions for a user.
 * Useful for "active devices" UI.
 */
export async function getUserActiveSessions(userId: string) {
  return db.session.findMany({
    where: {
      userId,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      deviceInfo: true,
      ipAddress: true,
      lastActivityAt: true,
      createdAt: true,
    },
    orderBy: { lastActivityAt: "desc" },
  });
}
