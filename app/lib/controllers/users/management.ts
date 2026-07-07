"use server";

import bcrypt from "bcryptjs";
import { checkPermission } from "../utils/checkPermission";
import { db } from "../../db";
import { redis } from "../../redis";
import { exclude } from "@/app/lib/utils/exclude";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { authenticatedAction } from "../../auth-middleware";
import { getUserFromToken } from "./auth";
import { controllerGuard } from "../utils/controllerGuard";
import { ConflictError, ForbiddenError, NoCompanyError } from "../../errors";

export const getUsers = authenticatedAction(async (user) => {
  return controllerGuard("getUsers", async () => {
    await checkPermission(user, user.companyId, [
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
  });
});

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
    return controllerGuard("updateUser", async () => {
      await checkPermission(user, user.companyId, ["role_admin"]);

      // Check if we are updating ourselves or if we are admin
      const foundUser = await db.user.upsert({
        where: { email },
        update: {
          name,
          surname,
          email,
          avatarUrl,
          roleId: role,
          password: password ? await bcrypt.hash(password, 10) : undefined,
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

      // Invalidate the updated user's cached sessions to ensure they reflect updated profile fields immediately
      const activeSessions = await db.session.findMany({
        where: { userId: foundUser.id },
        select: { token: true },
      });
      for (const s of activeSessions) {
        if (s.token) {
          await redis.del(`session:${s.token}`).catch(() => {});
        }
      }

      return foundUser;
    });
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
    return controllerGuard("createUserForCompany", async () => {
      await checkPermission(user, user.companyId, [
        "role_admin",
        "role_manager",
      ]);

      if (!user.companyId) {
        throw new NoCompanyError();
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const isExist = await db.user.findFirst({
        where: {
          OR: [{ email: userData.email }],
        },
      });

      if (isExist) {
        throw new ConflictError("Email already exists");
      }

      const roleName = userData.role.toLocaleUpperCase('en-US');
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

      // Dispatch Notification for new team member
      await createNotification(
        { companyId: user.companyId! },
        {
          title: "Yeni Ekip Üyesi! 👋",
          message: `${userData.name} ${userData.surname} ekibe katıldı. Rol: ${userData.role}`,
          type: "SUCCESS",
          link: `/dashboard/users`,
        }
      );

      return newUser;
    });
  }
);

export const getUsersForMyCompany = authenticatedAction(
  async (user, token: string) => {
    return controllerGuard("getUsersForMyCompany", async () => {
      await checkPermission(user, user.companyId);

      const requester = await getUserFromToken(token);
      if (!requester || !requester.companyId) {
        throw new ForbiddenError();
      }

      if (requester.companyId !== user.companyId) {
        throw new ForbiddenError("Company mismatch");
      }

      const users = await db.user.findMany({
        where: { companyId: user.companyId },
        include: { role: true, driver: true },
      });

      // Return safe user objects
      return users.map((u) => exclude(u, ["password"]));
    });
  }
);

export const getMyCompanyUsersAction = authenticatedAction(async (user) => {
  return controllerGuard("getMyCompanyUsersAction", async () => {
    await checkPermission(user, user.companyId);

    if (!user.companyId) {
      throw new NoCompanyError();
    }

    const users = await db.user.findMany({
      where: { companyId: user.companyId },
      include: { role: true, driver: true },
    });

    return users.map((u) => exclude(u, ["password"]));
  });
});

export const searchPlatformUsers = authenticatedAction(
  async (user, query: string) => {
    if (!query || query.length < 2) {
      return [];
    }

    return controllerGuard("searchPlatformUsers", async () => {
      await checkPermission(user, user.companyId);

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
    });
  }
);
