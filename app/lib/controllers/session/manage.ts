"use server";

import { cookies } from "next/headers";
import { db } from "../../db";
import { redis } from "../../redis";
import { revokedTokenKey, REVOCATION_TTL_SECONDS } from "./internal";
import { logger } from "../../logger";

/**
 * tr-belirtilen oturumu kalıcı olarak geçersiz kılar (iptal eder)
 * en-permanently invalidates (revokes) the specified session
 * input (sessionId: string)
 * output (Promise<void>)
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
    // Drop the cached session and add the token hash to the revocation
    // denylist so the JWT-only hot path (getAuthenticatedUser) rejects it
    // immediately instead of waiting for the access token to expire.
    await Promise.all([
      redis.del(`session:${session.token}`).catch(() => {}),
      redis
        .set(revokedTokenKey(session.token), "1", { ex: REVOCATION_TTL_SECONDS })
        .catch(() => {}),
    ]);
  }
}

/**
 * tr-kullanıcının aktif olan tüm oturumlarını iptal eder (ör. şifre değişimi)
 * en-revokes all active sessions of the user (e.g., password change)
 * input (userId: string)
 * output (Promise<void>)
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
      await Promise.all([
        redis.del(`session:${s.token}`).catch(() => {}),
        redis
          .set(revokedTokenKey(s.token), "1", { ex: REVOCATION_TTL_SECONDS })
          .catch(() => {}),
      ]);
    }
  }
}

/**
 * tr-kullanıcının aktif oturumlarının önbelleğini temizler (oturumları iptal ETMEDEN)
 * en-drops the Redis cache for a user's active sessions WITHOUT revoking them
 *
 * Used when a user's identity changed server-side (e.g. an admin added them to a
 * company, changing their companyId) and their still-valid access token now holds
 * stale claims. We must NOT revoke the session — that would invalidate the refresh
 * token too and block the seamless re-mint. Dropping the cached `session:*` entry
 * forces the next validateSession() to re-read from the DB, and the user's own
 * next request refreshes the JWT (refreshSession re-reads companyId) with no re-login.
 *
 * input (userId: string)
 * output (Promise<void>)
 */
export async function invalidateUserSessionCache(userId: string): Promise<void> {
  const activeSessions = await db.session.findMany({
    where: { userId, isRevoked: false },
    select: { token: true },
  });

  await Promise.all(
    activeSessions
      .filter((s) => s.token)
      .map((s) => redis.del(`session:${s.token}`).catch(() => {}))
  );
}

/**
 * tr-istemcideki (tarayıcıdaki) yetkilendirme çerezlerini siler
 * en-clears the authorization cookies from the client (browser)
 * input ()
 * output (Promise<void>)
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
 * tr-süresi dolmuş ve iptal edilmiş oturum kayıtlarını veritabanından temizler
 * en-cleans up expired and revoked session records from the database
 * input ()
 * output (Promise<number>)
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
 * tr-kullanıcının aktif (iptal edilmemiş ve süresi dolmamış) oturumlarını döndürür
 * en-returns the user's active (non-revoked and unexpired) sessions
 * input (userId: string)
 * output (Promise<any[]>)
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
