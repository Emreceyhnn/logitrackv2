"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "../db";
import type { AuditAction } from "@prisma/client";

// ─── Secrets ────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
const REFRESH_SECRET =
  process.env.REFRESH_SECRET || "fallback_refresh_for_dev_only";

// ─── Constants ──────────────────────────────────────────────────────────────
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const ACTIVITY_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes — don't update lastActivityAt on every single request

// ─── Cookie Configuration ───────────────────────────────────────────────────
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
};

// ─── Types ──────────────────────────────────────────────────────────────────
export type SessionUser = {
  id: string;
  companyId: string | null;
  roleId: string | null;
  sessionId: string;
};

// ─── Token Generation ───────────────────────────────────────────────────────

function generateAccessToken(user: {
  id: string;
  username?: string | null;
  roleId?: string | null;
}): string {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.roleId },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
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
    username?: string | null;
    roleId?: string | null;
  },
  deviceInfo?: string,
  ipAddress?: string
): Promise<{ accessToken: string; sessionId: string }> {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  const tokenHash = hashToken(accessToken);
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  // Create session in DB
  const session = await db.session.create({
    data: {
      userId: user.id,
      token: tokenHash,
      refreshToken: refreshToken,
      deviceInfo: deviceInfo || null,
      ipAddress: ipAddress || null,
      expiresAt,
    },
  });

  // Set cookies
  const cookieStore = await cookies();

  cookieStore.set("token", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60, // 15 minutes in seconds
  });

  cookieStore.set("refreshToken", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60, // 7 days in seconds
  });

  return { accessToken, sessionId: session.id };
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
    const decoded: any = jwt.verify(accessToken, JWT_SECRET);
    if (!decoded?.id) {
      return null;
    }

    // Look up session in DB by token hash
    const tokenHash = hashToken(accessToken);
    const session = await db.session.findUnique({
      where: { token: tokenHash },
      include: {
        user: {
          select: { id: true, companyId: true, roleId: true, status: true },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Check session validity
    if (session.isRevoked) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      return null;
    }

    // Check user is still active
    if (session.user.status !== "ACTIVE") {
      return null;
    }

    // Throttled update of lastActivityAt
    const timeSinceLastActivity = Date.now() - session.lastActivityAt.getTime();
    if (timeSinceLastActivity > ACTIVITY_THROTTLE_MS) {
      // Fire-and-forget update — don't block the request
      db.session
        .update({
          where: { id: session.id },
          data: { lastActivityAt: new Date() },
        })
        .catch(() => {
          // Silently fail — this is non-critical
        });
    }

    return {
      id: session.user.id,
      companyId: session.user.companyId,
      roleId: session.user.roleId,
      sessionId: session.id,
    };
  } catch (error) {
    // JWT verification failed or DB error
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

    // Find session by refresh token
    const session = await db.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            roleId: true,
            companyId: true,
            status: true,
          },
        },
      },
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      return false;
    }

    if (session.user.status !== "ACTIVE") {
      return false;
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(session.user);
    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashToken(newAccessToken);

    // Rotate tokens in DB
    await db.session.update({
      where: { id: session.id },
      data: {
        token: newTokenHash,
        refreshToken: newRefreshToken,
        lastActivityAt: new Date(),
      },
    });

    // Set new cookies
    cookieStore.set("token", newAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60,
    });

    cookieStore.set("refreshToken", newRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60,
    });

    // Log the refresh event
    await logAuditEvent({
      userId: session.user.id,
      action: "TOKEN_REFRESH",
      ipAddress: session.ipAddress,
      deviceInfo: session.deviceInfo,
    });

    return true;
  } catch (error) {
    console.error("Session refresh failed:", error);
    return false;
  }
}

/**
 * Revokes a specific session (soft-delete).
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await db.session.update({
    where: { id: sessionId },
    data: { isRevoked: true },
  });
}

/**
 * Revokes ALL sessions for a user (e.g. password change, security event).
 */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  await db.session.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true },
  });
}

/**
 * Clears auth cookies from the client.
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("refreshToken");
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
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
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
