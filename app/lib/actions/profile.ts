"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import bcrypt from "bcryptjs";

// ─── Get Current User Profile ─────────────────────────────────────────────
export const getMyProfile = authenticatedAction(async (user) => {
  const found = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      username: true,
      avatarUrl: true,
      roleId: true,
      companyId: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
  if (!found) throw new Error("User not found");
  return found;
});

// ─── Update Profile (name, surname, username, avatarUrl) ──────────────────
export const updateMyProfile = authenticatedAction(
  async (
    user,
    data: {
      name: string;
      surname: string;
      username: string;
      avatarUrl?: string | null;
    }
  ) => {
    // Check username uniqueness if changed
    if (data.username) {
      const existing = await db.user.findFirst({
        where: {
          username: data.username,
          NOT: { id: user.id },
        },
      });
      if (existing) {
        return { error: "Username already taken" };
      }
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        surname: data.surname,
        username: data.username || null,
        avatarUrl: data.avatarUrl,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        username: true,
        avatarUrl: true,
      },
    });

    return { user: updated };
  }
);

// ─── Change Password ──────────────────────────────────────────────────────
export const changeMyPassword = authenticatedAction(
  async (
    user,
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ) => {
    const found = await db.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!found) return { error: "User not found" };

    const isValid = await bcrypt.compare(
      data.currentPassword,
      found.password || ""
    );
    if (!isValid) return { error: "Current password is incorrect" };

    const hashed = await bcrypt.hash(data.newPassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return { success: true };
  }
);
