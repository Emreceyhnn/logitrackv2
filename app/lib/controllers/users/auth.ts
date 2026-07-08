"use server";

import bcrypt from "bcryptjs";
import { checkPermission } from "../utils/checkPermission";
import { jwtVerify } from "jose";
import { db } from "../../db";
import { exclude } from "@/app/lib/utils/exclude";
import {
  authenticatedAction,
  maybeAuthenticatedAction,
  AuthenticatedUser,
} from "../../auth-middleware";
import {
  createSession,
  revokeSession,
  clearAuthCookies,
  logAuditEvent,
  validateSession,
  toSessionPayload,
} from "../session";
import { headers } from "next/headers";
import { rateLimit } from "../../rate-limiter";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not defined");
  return secret;
};

export const getUserFromToken = authenticatedAction(
  async (
    user,
    token: string
  ): Promise<Omit<
    import("@prisma/client").User & {
      company: import("@prisma/client").Company | null;
    },
    "password"
  > | null> => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId);

      const secret = new TextEncoder().encode(getJwtSecret());
      const { payload } = await jwtVerify(token, secret);
      const decoded = await toSessionPayload(payload);
      if (!decoded) {
        throw new Error("Invalid token");
      }

      const foundUser = await db.user.findUnique({
        where: { id: decoded.id },
        include: { company: true },
      });

      if (!foundUser) {
        throw new Error("User not found");
      }

      return exclude(foundUser, ["password"]);
    } catch (error) {
      console.error("Failed to get user from token:", error);
      throw new Error("Authentication failed: Invalid token or user not found");
    }
  }
);

export const RegisterUser = maybeAuthenticatedAction(
  async (
    user: AuthenticatedUser | null,
    name: string,
    surname: string,
    password: string,
    email: string,
    avatarUrl?: string,
    deviceInfo?: string,
    ipAddress?: string
  ) => {
    try {
      const headerStore = await headers();
      const ip = ipAddress || headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "127.0.0.1";
      const userAgent = deviceInfo || headerStore.get("user-agent") || "Unknown Device";

      // Rate limit registration by IP: Max 5 attempts per hour
      const ipLimit = await rateLimit(ip, 5, 3600, "rate-limit:register-ip:");
      if (!ipLimit.success) {
        return { error: "Too many registration attempts from this IP. Please try again in an hour." };
      }

      // If user exists, they must be an admin to register others
      if (user) {
        await checkPermission(user, user.companyId, ["role_admin"]);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const isExist = await db.user.findFirst({
        where: {
          OR: [{ email }],
        },
      });

      if (isExist) {
        return { error: "Email already exists", field: "email" };
      }

      const newUser = await db.user.create({
        data: {
          name,
          surname,
          password: hashedPassword,
          email,
          avatarUrl,
          companyId: user?.companyId || null, // Guest registration has no company initially
        },
      });

      // Create server-side session (sets httpOnly cookies automatically)
      // Note: This creates a session for the newly registered user, not the admin.
      await createSession(newUser, userAgent, ip);

      // Audit log
      await logAuditEvent({
        userId: newUser.id,
        action: "REGISTER",
        ipAddress: ip,
        deviceInfo: userAgent,
        metadata: { email, avatarUrl },
      });

      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          surname: newUser.surname,
          email: newUser.email,
          avatarUrl: newUser.avatarUrl,
          companyId: newUser.companyId,
        },
      };
    } catch (error) {
      console.error("Failed to create user:", error);
      const message =
        error instanceof Error ? error.message : "Internal server error";
      return { error: message, field: "general" };
    }
  }
);

// ─── Login ──────────────────────────────────────────────────────────────────

export const LoginUser = maybeAuthenticatedAction(
  async (
    _user: AuthenticatedUser | null,
    email: string,
    password: string,
    deviceInfo?: string,
    ipAddress?: string
  ) => {
    try {
      const headerStore = await headers();
      const ip = ipAddress || headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "127.0.0.1";
      const userAgent = deviceInfo || headerStore.get("user-agent") || "Unknown Device";

      // 1. IP Rate Limiting: Max 5 login attempts per minute
      const ipLimit = await rateLimit(ip, 5, 60, "rate-limit:login-ip:");
      if (!ipLimit.success) {
        return { error: "Too many login attempts. Please try again later." };
      }

      // 2. Email Rate Limiting: Max 5 login attempts per minute per email (prevent distributed brute force on single account)
      const emailLimit = await rateLimit(email.toLocaleLowerCase('en-US').trim(), 5, 60, "rate-limit:login-email:");
      if (!emailLimit.success) {
        return { error: "Too many login attempts for this account. Please try again later." };
      }

      // Note: Login typically doesn't check companyId since they might not be in one yet
      // But authenticatedAction already verifies the user.

      const foundUser = await db.user.findUnique({
        where: { email },
      });

      if (!foundUser) {
        await logAuditEvent({
          action: "LOGIN_FAILED",
          ipAddress: ip,
          deviceInfo: userAgent,
          metadata: { email, reason: "User not found" },
        });
        return { error: "Invalid credentials" };
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        foundUser.password || ""
      );
      if (!isPasswordValid) {
        await logAuditEvent({
          userId: foundUser.id,
          action: "LOGIN_FAILED",
          ipAddress: ip,
          deviceInfo: userAgent,
          metadata: { email, reason: "Invalid password" },
        });
        return { error: "Invalid credentials" };
      }

      // Update lastLoginAt
      await db.user.update({
        where: { id: foundUser.id },
        data: { lastLoginAt: new Date() },
      });

      // Create server-side session
      await createSession(foundUser, userAgent, ip);

      // Log successful login
      await logAuditEvent({
        userId: foundUser.id,
        action: "LOGIN",
        ipAddress: ip,
        deviceInfo: userAgent,
      });

      return {
        user: {
          id: foundUser.id,
          name: foundUser.name,
          surname: foundUser.surname,
          email: foundUser.email,
          companyId: foundUser.companyId,
          timezone: foundUser.timezone,
          dateFormat: foundUser.dateFormat,
          timeFormat: foundUser.timeFormat,
          currency: foundUser.currency || "USD",
          language: foundUser.language || "en",
        },
      };
    } catch (error) {
      console.error("Critical Login Error:", error);
      const message =
        error instanceof Error ? error.message : "Internal server error";
      return { error: message };
    }
  }
);

// ─── Logout ─────────────────────────────────────────────────────────────────

export const LogoutUser = authenticatedAction(async () => {
  try {
    // Get current session
    const sessionUser = await validateSession();

    if (sessionUser?.sessionId) {
      // Revoke the session in DB
      await revokeSession(sessionUser.sessionId);

      const headerStore = await headers();
      const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "127.0.0.1";
      const userAgent = headerStore.get("user-agent") || "Unknown Device";

      // Log logout
      await logAuditEvent({
        userId: sessionUser.id,
        action: "LOGOUT",
        ipAddress: ip,
        deviceInfo: userAgent,
      });
    }

    // Clear cookies regardless
    await clearAuthCookies();

    return { success: true };
  } catch (error) {
    console.error("Failed to logout:", error);
    // Even if something fails, clear cookies
    await clearAuthCookies();
    return { success: true };
  }
});
