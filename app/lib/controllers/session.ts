"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { db } from "../db";
import { redis } from "../redis";
import { Prisma } from "@prisma/client";
import type { AuditAction } from "@prisma/client";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return secret;
};
const JWT_SECRET = getJwtSecret();

// ─── Constants ──────────────────────────────────────────────────────────────
const ACCESS_TOKEN_EXPIRY = "24h"; // 24 hours
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const ACTIVITY_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes — don't update lastActivityAt on every single request

// ─── Cookie Configuration ───────────────────────────────────────────────────
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" && !process.env.LOCAL_TESTING,
  path: "/",
  sameSite: "lax" as const,
};

// ─── Types ──────────────────────────────────────────────────────────────────
export type SessionUser = {
  id: string;
  companyId: string | null;
  roleId: string | null;
  roleName: string | null;
  sessionId: string;
  name: string;
  surname: string;
  avatarUrl: string | null;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  notifEmailShipment: boolean;
  notifEmailMaint: boolean;
  notifEmailWeekly: boolean;
  notifPushAssignment: boolean;
  notifPushDelay: boolean;
};

export interface SessionJWTPayload extends JWTPayload {
  id: string;

  role?: string | null;
  companyId?: string | null;
}

// ─── Token Generation ───────────────────────────────────────────────────────

async function generateAccessToken(user: {
  id: string;

  roleId?: string | null;
  companyId?: string | null;
}): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT({
    id: user.id,

    role: user.roleId,
    companyId: user.companyId ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(crypto.randomUUID())
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(secret);
}

function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ─── Session CRUD ───────────────────────────────────────────────────────────

/**
 * Creates a new server-side session for a user.
 *
 * 1. Generates an access token (JWT, 15 min) and refresh token (opaque, 7 days)
 * 2. Persists the session in the database with hashed token for lookup
 * 3. Sets httpOnly cookies for both tokens
 *
 * @returns The raw access token (for immediate response if needed)
 */
export async function createSession(
  user: {
    id: string;

    roleId?: string | null;
    companyId?: string | null;
    name?: string | null;
    surname?: string | null;
    avatarUrl?: string | null;
  },

  deviceInfo?: string,
  ipAddress?: string
): Promise<{ accessToken: string; sessionId: string }> {
  const accessToken = await generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  const tokenHash = hashToken(accessToken);
  const refreshTokenHash = hashToken(refreshToken);
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  // Create session in DB
  try {
    const session = await db.session.create({
      data: {
        userId: user.id,
        token: tokenHash,
        refreshToken: refreshTokenHash,
        deviceInfo: deviceInfo || null,
        ipAddress: ipAddress || null,
        expiresAt,
      },
    });

    // Set cookies
    const cookieStore = await cookies();

    cookieStore.set("token", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 24 * 60 * 60, // 24 hours (seconds)
    });

    cookieStore.set("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60, // 7 days (seconds)
    });

    return { accessToken, sessionId: session.id };
  } catch (error) {
    console.error("Failed to create session in DB:", error);
    throw new Error(
      "Authentication session failed to initialize properly. Please try again."
    );
  }
}

/**
 * Validates the current session by:
 * 1. Reading the access token from the cookie
 * 2. Verifying the JWT signature
 * 3. Looking up the session in the DB (not revoked, not expired)
 * 4. Updating lastActivityAt if stale (throttled)
 *
 * @returns SessionUser or null if invalid/expired
 */
export async function validateSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("token")?.value;

    if (!accessToken) {
      return null;
    }

    // Verify JWT signature & expiry
    let decoded: SessionJWTPayload;
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(accessToken, secret);
      decoded = payload as unknown as SessionJWTPayload;
    } catch {
      return null;
    }

    if (!decoded?.id) {
      return null;
    }

    // Check cache for session
    const tokenHash = hashToken(accessToken);
    const cacheKey = `session:${tokenHash}`;
    type SessionWithUser = Prisma.SessionGetPayload<{
      include: {
        user: {
          select: {
            id: true;
            companyId: true;
            roleId: true;
            status: true;
            name: true;
            surname: true;
            avatarUrl: true;
            timezone: true;
            dateFormat: true;
            timeFormat: true;
            currency: true;
            language: true;
            notifEmailShipment: true;
            notifEmailMaint: true;
            notifEmailWeekly: true;
            notifPushAssignment: true;
            notifPushDelay: true;
            role: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    }>;

    let session: SessionWithUser | null = null;

    try {
      const cached = await redis.get<SessionWithUser>(cacheKey);
      if (cached) {
        cached.expiresAt = new Date(cached.expiresAt);
        cached.lastActivityAt = new Date(cached.lastActivityAt);
        session = cached;
      }
    } catch (err) {
      console.warn("[validateSession] Redis get failed:", err);
    }

    if (!session) {
      session = await db.session.findUnique({
        where: { token: tokenHash },
        include: {
          user: {
            select: {
              id: true,
              companyId: true,
              roleId: true,
              status: true,
              name: true,
              surname: true,
              avatarUrl: true,
              timezone: true,
              dateFormat: true,
              timeFormat: true,
              currency: true,
              language: true,
              notifEmailShipment: true,
              notifEmailMaint: true,
              notifEmailWeekly: true,
              notifPushAssignment: true,
              notifPushDelay: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (session) {
        const remainingTtl = Math.max(
          1,
          Math.min(300, Math.round((new Date(session.expiresAt).getTime() - Date.now()) / 1000))
        );
        await redis.set(cacheKey, session, { ex: remainingTtl }).catch(() => {});
      }
    }

    if (!session) {
      await clearAuthCookies();
      return null;
    }

    // Check session validity
    if (session.isRevoked) {
      await clearAuthCookies();
      return null;
    }

    if (new Date(session.expiresAt) < new Date()) {
      await clearAuthCookies();
      return null;
    }

    // Check user is still active
    if (session.user.status !== "ACTIVE") {
      return null;
    }

    // Throttled update of lastActivityAt
    const timeSinceLastActivity = Date.now() - new Date(session.lastActivityAt).getTime();
    if (timeSinceLastActivity > ACTIVITY_THROTTLE_MS) {
      const newActivity = new Date();
      db.session
        .update({
          where: { id: session.id },
          data: { lastActivityAt: newActivity },
        })
        .then(async () => {
          session.lastActivityAt = newActivity;
          const remainingTtl = Math.max(
            1,
            Math.min(300, Math.round((new Date(session.expiresAt).getTime() - Date.now()) / 1000))
          );
          await redis.set(cacheKey, session, { ex: remainingTtl }).catch(() => {});
        })
        .catch(() => {});
    }

    return {
      id: session.user.id,
      companyId: session.user.companyId,
      roleId: session.user.roleId,
      roleName: session.user.role?.name || null,
      sessionId: session.id,
      name: session.user.name,
      surname: session.user.surname,
      avatarUrl: session.user.avatarUrl,
      timezone: session.user.timezone,
      dateFormat: session.user.dateFormat,
      timeFormat: session.user.timeFormat,
      currency: session.user.currency || "USD",
      language: session.user.language || "en",
      notifEmailShipment: session.user.notifEmailShipment,
      notifEmailMaint: session.user.notifEmailMaint,
      notifEmailWeekly: session.user.notifEmailWeekly,
      notifPushAssignment: session.user.notifPushAssignment,
      notifPushDelay: session.user.notifPushDelay,
    };
  } catch (error) {
    if ((error as { digest?: string })?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error("[validateSession] ❌ Unexpected error:", error);
    return null;
  }
}

/**
 * Refreshes the session by:
 * 1. Reading the refresh token from the cookie
 * 2. Finding the session in DB
 * 3. Issuing a new access token + rotating the refresh token
 * 4. Setting new cookies
 *
 * @returns true if refresh succeeded, false otherwise
 */
export async function refreshSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return false;
    }

    const hashedRefreshToken = hashToken(refreshToken);

    // Find session by refresh token
    const session = await db.session.findUnique({
      where: { refreshToken: hashedRefreshToken },
      include: {
        user: {
          select: {
            id: true,

            roleId: true,
            companyId: true,
            status: true,
            name: true,
            surname: true,
            avatarUrl: true,
            timezone: true,
            dateFormat: true,
            timeFormat: true,
            currency: true,
            language: true,
            notifEmailShipment: true,
            notifEmailMaint: true,
            notifEmailWeekly: true,
            notifPushAssignment: true,
            notifPushDelay: true,
          },
        },
      },
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      await clearAuthCookies();
      return false;
    }

    if (session.user.status !== "ACTIVE") {
      await clearAuthCookies();
      return false;
    }

    // Generate new tokens
    const newAccessToken = await generateAccessToken(session.user);
    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashToken(newAccessToken);
    const newRefreshTokenHash = hashToken(newRefreshToken);

    // Invalidate old token cache entry
    const oldAccessToken = cookieStore.get("token")?.value;
    if (oldAccessToken) {
      await redis.del(`session:${hashToken(oldAccessToken)}`).catch(() => {});
    }

    // Rotate tokens in DB
    await db.session.update({
      where: { id: session.id },
      data: {
        token: newTokenHash,
        refreshToken: newRefreshTokenHash,
        lastActivityAt: new Date(),
      },
    });

    // Set new cookies
    try {
      cookieStore.set("token", newAccessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 24 * 60 * 60, // 24 hours (seconds)
      });

      cookieStore.set("refreshToken", newRefreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60, // 7 days (seconds)
      });
    } catch (cookieError) {
      console.warn(
        "[refreshSession] ⚠️ Could not set cookies (likely called from Server Component). Refresh in middleware instead.",
        cookieError
      );
      // We don't return false here because the DB rotation succeeded.
      // The tokens will be lost if not handled by middleware, but we avoid a crash.
    }

    // Log the refresh event
    await logAuditEvent({
      userId: session.user.id,
      action: "TOKEN_REFRESH",
      ipAddress: session.ipAddress,
      deviceInfo: session.deviceInfo,
    });

    return true;
  } catch (error) {
    if ((error as { digest?: string })?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error("Session refresh failed:", error);
    return false;
  }
}

/**
 * Revokes a specific session (soft-delete).
 */
export async function revokeSession(sessionId: string): Promise<void> {
  const session = await db.session.update({
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
    console.warn(
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

// ─── Audit Logging ──────────────────────────────────────────────────────────

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
    console.error("Failed to write audit log:", error);
  }
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
