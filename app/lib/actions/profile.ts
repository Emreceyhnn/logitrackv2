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

export const updateMyProfile = authenticatedAction(
  async (
    user,
    data: {
      name: string;
      surname: string;
      avatarUrl?: string | null;
    }
  ) => {
    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        surname: data.surname,

        avatarUrl: data.avatarUrl,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
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
