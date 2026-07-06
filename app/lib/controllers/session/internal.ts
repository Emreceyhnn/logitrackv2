// Internal (non-action) helpers, constants and types shared across the session
// submodules. This is a plain module — NOT a "use server" boundary — so it may
// export synchronous helpers, constants and types.

import crypto from "crypto";
import { SignJWT, JWTPayload } from "jose";

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return secret;
};

// ─── Constants ──────────────────────────────────────────────────────────────
// Keep the access token short-lived: a stolen/leaked JWT is only usable until
// it expires (server-side revocation via the session row + Redis cache still
// applies within ~5 min, but a short TTL shrinks the offline-replay window).
// The 7-day refresh token, rotated on every use, preserves the login lifetime.
export const ACCESS_TOKEN_EXPIRY = "1h";
export const ACCESS_TOKEN_MAX_AGE = 60 * 60; // seconds — must match ACCESS_TOKEN_EXPIRY
export const REFRESH_TOKEN_EXPIRY_DAYS = 7;
export const ACTIVITY_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes — don't update lastActivityAt on every single request

// ─── Cookie Configuration ───────────────────────────────────────────────────
export const COOKIE_OPTIONS = {
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

export async function generateAccessToken(user: {
  id: string;

  roleId?: string | null;
  companyId?: string | null;
}): Promise<string> {
  const secret = new TextEncoder().encode(getJwtSecret());
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

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
