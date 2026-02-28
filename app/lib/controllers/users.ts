"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import {
  createSession,
  revokeSession,
  clearAuthCookies,
  logAuditEvent,
  validateSession,
} from "./session";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

// ─── Helpers ────────────────────────────────────────────────────────────────

export async function getUserFromToken(token: string) {
  try {
    const decoded: unknown = jwt.verify(token, JWT_SECRET);
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      throw new Error("Invalid token");
    }

    const user = await db.user.findUnique({
      where: { id: (decoded as { id: string }).id },
      include: { company: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Return safe user object
    const { password, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error("Failed to get user from token:", error);
    return null;
  }
}

// ─── User Queries ───────────────────────────────────────────────────────────

export async function getUsers() {
  try {
    const allUsers = await db.user.findMany({
      include: {
        role: true,
        driver: true,
      },
    });
    return allUsers;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users");
  }
}

// ─── Registration ───────────────────────────────────────────────────────────

export async function RegisterUser(
  username: string,
  name: string,
  surname: string,
  password: string,
  email: string,
  deviceInfo?: string,
  ipAddress?: string
) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const isExist = await db.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (isExist) {
      if (isExist.username === username) {
        throw new Error("Username already exists");
      }
      throw new Error("Email already exists");
    }

    const newUser = await db.user.create({
      data: {
        username,
        name,
        surname,
        password: hashedPassword,
        email,
      },
    });

    // Create server-side session (sets httpOnly cookies automatically)
    await createSession(newUser, deviceInfo, ipAddress);

    // Audit log
    await logAuditEvent({
      userId: newUser.id,
      action: "REGISTER",
      ipAddress,
      deviceInfo,
      metadata: { email },
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        username: newUser.username,
        companyId: newUser.companyId,
      },
    };
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to create user";
    console.error("Failed to create user:", error);
    throw new Error(errorMsg);
  }
}

// ─── Login ──────────────────────────────────────────────────────────────────

export async function LoginUser(
  email: string,
  password: string,
  deviceInfo?: string,
  ipAddress?: string
) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Log failed attempt (no userId since user not found)
      await logAuditEvent({
        action: "LOGIN_FAILED",
        ipAddress,
        deviceInfo,
        metadata: { email, reason: "User not found" },
      });
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      // Log failed attempt
      await logAuditEvent({
        userId: user.id,
        action: "LOGIN_FAILED",
        ipAddress,
        deviceInfo,
        metadata: { email, reason: "Invalid password" },
      });
      throw new Error("Invalid credentials");
    }

    // Update lastLoginAt
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create server-side session
    await createSession(user, deviceInfo, ipAddress);

    // Log successful login
    await logAuditEvent({
      userId: user.id,
      action: "LOGIN",
      ipAddress,
      deviceInfo,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        username: user.username,
        companyId: user.companyId,
      },
    };
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to login user";
    console.error("Failed to login user:", error);
    throw new Error(errorMsg);
  }
}

// ─── Logout ─────────────────────────────────────────────────────────────────

export async function LogoutUser() {
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
}

// ─── User Management ────────────────────────────────────────────────────────

export async function updateUser(
  username: string,
  name: string,
  surname: string,
  password: string,
  email: string,
  avatarUrl: string,
  role: string
) {
  try {
    const user = await db.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        name,
        surname,
        password,
        email,
        avatarUrl,
        roleId: role,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw new Error("Failed to update user");
  }
}

export const createUserForCompany = authenticatedAction(
  async (
    requester,
    userData: {
      username: string;
      name: string;
      surname: string;
      email: string;
      password: string;
      role: string;
      avatarUrl?: string;
    }
  ) => {
    if (!requester.companyId) {
      throw new Error("You must belong to a company to add users");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const isExist = await db.user.findFirst({
      where: {
        OR: [{ username: userData.username }, { email: userData.email }],
      },
    });

    if (isExist) {
      if (isExist.username === userData.username) {
        throw new Error("Username already exists");
      }
      throw new Error("Email already exists");
    }

    const roleName = userData.role.toUpperCase();
    const role = await db.role.findFirst({
      where: { name: { equals: roleName, mode: "insensitive" } },
    });

    const newUser = await db.user.create({
      data: {
        username: userData.username,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        password: hashedPassword,
        avatarUrl: userData.avatarUrl,
        companyId: requester.companyId,
        roleId: role ? role.id : undefined,
      },
    });

    return newUser;
  }
);

export async function getUsersForMyCompany(token: string) {
  try {
    const requester = await getUserFromToken(token);
    if (!requester || !requester.companyId) {
      throw new Error("Unauthorized");
    }

    const users = await db.user.findMany({
      where: { companyId: requester.companyId },
      include: { role: true, driver: true },
    });

    // Return safe user objects
    return users.map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safe } = u;
      return safe;
    });
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch company users";
    console.error("Failed to fetch company users:", error);
    throw new Error(errorMsg);
  }
}

export async function getMyCompanyUsersAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("No session token found");
    }

    const requester = await getUserFromToken(token);
    if (!requester || !requester.companyId) {
      throw new Error("Unauthorized or No Company");
    }

    const users = await db.user.findMany({
      where: { companyId: requester.companyId },
      include: { role: true, driver: true },
    });

    return users.map((u) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safe } = u;
      return safe;
    });
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch users";
    console.error("Failed to fetch company users (action):", error);
    throw new Error(errorMsg);
  }
}

export const searchPlatformUsers = authenticatedAction(
  async (requester, query: string) => {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const users = await db.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { surname: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
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
    } catch (error: unknown) {
      console.error("Failed to search platform users:", error);
      throw new Error("Failed to search users");
    }
  }
);
