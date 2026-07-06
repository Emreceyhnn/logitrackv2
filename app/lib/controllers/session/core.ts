"use server";

import { cookies, headers } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";
import { db } from "../../db";
import { redis } from "../../redis";
import { Prisma } from "@prisma/client";
import {
  getJwtSecret,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_EXPIRY_DAYS,
  ACTIVITY_THROTTLE_MS,
  COOKIE_OPTIONS,
  type SessionUser,
  type SessionJWTPayload,
} from "./internal";
import { clearAuthCookies } from "./manage";
import { logAuditEvent } from "./audit";

/**
 * Narrows a verified jose payload to our session payload with a real runtime
 * check — a token signed with our secret but missing `id` is rejected instead
 * of being blindly cast through.
 */
export async function toSessionPayload(
  payload: JWTPayload
): Promise<SessionJWTPayload | null> {
  const { id, role, companyId } = payload;
  if (typeof id !== "string" || id.length === 0) return null;

  return {
    ...payload,
    id,
    role: typeof role === "string" ? role : null,
    companyId: typeof companyId === "string" ? companyId : null,
  };
}

/**
 * Creates a new server-side session for a user.
 *
 * 1. Generates an access token (JWT, 1 hour) and refresh token (opaque, 7 days)
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
      maxAge: ACCESS_TOKEN_MAX_AGE,
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

    // Verify JWT signature & expiry. The payload itself is not used below —
    // the session row is looked up by token hash — but it must still parse
    // to a valid session payload (non-empty `id`).
    try {
      const secret = new TextEncoder().encode(getJwtSecret());
      const { payload } = await jwtVerify(accessToken, secret);
      if (!(await toSessionPayload(payload))) return null;
    } catch {
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
        maxAge: ACCESS_TOKEN_MAX_AGE,
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

    // Extract current IP and User Agent from headers
    const headerStore = await headers();
    const currentIp = headerStore.get("x-forwarded-for")?.split(",")[0].trim() || headerStore.get("x-real-ip") || session.ipAddress || "127.0.0.1";
    const currentDevice = headerStore.get("user-agent") || session.deviceInfo || "Unknown Device";

    // Log the refresh event
    await logAuditEvent({
      userId: session.user.id,
      action: "TOKEN_REFRESH",
      ipAddress: currentIp,
      deviceInfo: currentDevice,
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
