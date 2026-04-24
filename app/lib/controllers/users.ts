"use server";

import bcrypt from "bcryptjs";
import { checkPermission } from "./utils/checkPermission";
import jwt from "jsonwebtoken";
import { db } from "../db";
import {
  authenticatedAction,
  maybeAuthenticatedAction,
  AuthenticatedUser,
} from "../auth-middleware";
import {
  createSession,
  revokeSession,
  clearAuthCookies,
  logAuditEvent,
  validateSession,
  SessionJWTPayload,
} from "./session";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

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
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId);

      const decoded = jwt.verify(token, JWT_SECRET) as SessionJWTPayload;
      if (!decoded || typeof decoded !== "object" || !decoded.id) {
        throw new Error("Invalid token");
      }

      const foundUser = await db.user.findUnique({
        where: { id: decoded.id },
        include: { company: true },
      });

      if (!foundUser) {
        throw new Error("User not found");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safeUser } = foundUser;
      return safeUser;
    } catch (error) {
      console.error("Failed to get user from token:", error);
      return null;
    }
  }
);

export const getUsers = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [
      "role_admin",
      "role_manager",
    ]);

    const allUsers = await db.user.findMany({
      where: {
        companyId: user.companyId,
      },
      include: {
        role: true,
        driver: true,
      },
    });
    return allUsers;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
});

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
      // If user exists, they must be an admin to register others
      if (user) {
        await checkPermission(user.id, user.companyId, ["role_admin"]);
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
      await createSession(newUser, deviceInfo, ipAddress);

      // Audit log
      await logAuditEvent({
        userId: newUser.id,
        action: "REGISTER",
        ipAddress,
        deviceInfo,
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
    user: AuthenticatedUser | null,
    email: string,
    password: string,
    deviceInfo?: string,
    ipAddress?: string
  ) => {
    try {
      // Note: Login typically doesn't check companyId since they might not be in one yet
      // But authenticatedAction already verifies the user.

      const foundUser = await db.user.findUnique({
        where: { email },
      });

      if (!foundUser) {
        await logAuditEvent({
          action: "LOGIN_FAILED",
          ipAddress,
          deviceInfo,
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
          ipAddress,
          deviceInfo,
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
      await createSession(foundUser, deviceInfo, ipAddress);

      // Log successful login
      await logAuditEvent({
        userId: foundUser.id,
        action: "LOGIN",
        ipAddress,
        deviceInfo,
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

      // Log logout
      await logAuditEvent({
        userId: sessionUser.id,
        action: "LOGOUT",
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

// ─── User Management ────────────────────────────────────────────────────────

export const updateUser = authenticatedAction(
  async (
    user,
    name: string,
    surname: string,
    password: string, // Password should be hashed if it's being updated
    email: string,
    avatarUrl: string,
    role: string
  ) => {
    try {
      await checkPermission(user.id, user.companyId, ["role_admin"]);

      // Check if we are updating ourselves or if we are admin
      const foundUser = await db.user.upsert({
        where: { email },
        update: {
          name,
          surname,
          email,
          avatarUrl,
          roleId: role,
          // Password update logic should be handled separately and hashed
          // password: password ? await bcrypt.hash(password, 10) : undefined,
        },
        create: {
          name,
          surname,
          password: await bcrypt.hash(password, 10), // Password must be hashed on creation
          email,
          avatarUrl,
          roleId: role,
          companyId: user.companyId, // Set current user's company
        },
      });
      return foundUser;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }
);

export const createUserForCompany = authenticatedAction(
  async (
    user,
    userData: {
      name: string;
      surname: string;
      email: string;
      password: string;
      role: string;
      avatarUrl?: string;
    }
  ) => {
    try {
      await checkPermission(user.id, user.companyId, [
        "role_admin",
        "role_manager",
      ]);

      if (!user.companyId) {
        throw new Error("You must belong to a company to add users");
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const isExist = await db.user.findFirst({
        where: {
          OR: [{ email: userData.email }],
        },
      });

      if (isExist) {
        throw new Error("Email already exists");
      }

      const roleName = userData.role.toUpperCase();
      const foundRole = await db.role.findFirst({
        where: { name: { equals: roleName, mode: "insensitive" } },
      });

      const newUser = await db.user.create({
        data: {
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          password: hashedPassword,
          avatarUrl: userData.avatarUrl,
          companyId: user.companyId,
          roleId: foundRole ? foundRole.id : undefined,
        },
      });

      return newUser;
    } catch (error) {
      console.error("Failed to create user for company:", error);
      throw error;
    }
  }
);

export const getUsersForMyCompany = authenticatedAction(
  async (user, token: string) => {
    try {
      await checkPermission(user.id, user.companyId);

      const requester = await getUserFromToken(token);
      if (!requester || !requester.companyId) {
        throw new Error("Unauthorized");
      }

      if (requester.companyId !== user.companyId) {
        throw new Error("Company mismatch");
      }

      const users = await db.user.findMany({
        where: { companyId: user.companyId },
        include: { role: true, driver: true },
      });

      // Return safe user objects
      return users.map((u) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safe } = u;
        return safe;
      });
    } catch (error) {
      console.error("Failed to fetch company users:", error);
      throw error;
    }
  }
);

export const getMyCompanyUsersAction = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

    if (!user.companyId) {
      throw new Error("Unauthorized or No Company");
    }

    const users = await db.user.findMany({
      where: { companyId: user.companyId },
      include: { role: true, driver: true },
    });

    return users.map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safe } = u;
      return safe;
    });
  } catch (error) {
    console.error("Failed to fetch company users (action):", error);
    throw error;
  }
});

export const searchPlatformUsers = authenticatedAction(
  async (user, query: string) => {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      await checkPermission(user.id, user.companyId);

      const users = await db.user.findMany({
        where: {
          companyId: null,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { surname: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 10,
      });

      return users.map((u) => ({
        id: u.id,
        name: `${u.name} ${u.surname}`.trim(),
        email: u.email,
        avatar: u.avatarUrl || null,
      }));
    } catch (error) {
      console.error("Failed to search platform users:", error);
      throw error;
    }
  }
);

export const updateUserRegionalSettings = authenticatedAction(
  async (
    user,
    settings: {
      timezone: string;
      dateFormat: string;
      timeFormat: string;
      language?: string;
      currency?: string;
    }
  ) => {
    try {
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          timezone: settings.timezone,
          dateFormat: settings.dateFormat,
          timeFormat: settings.timeFormat,
          ...(settings.currency ? { currency: settings.currency } : {}),
        },
      });

      // Log audit event
      await logAuditEvent({
        userId: user.id,
        action: "SETTINGS_UPDATE",
        metadata: { ...settings, type: "regional_settings_update" },
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Failed to update regional settings:", error);
      throw error;
    }
  }
);
