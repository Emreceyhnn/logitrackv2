"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export const createRole = authenticatedAction(
  async (
    user,
    name: string,
    description?: string,
    permissions: string[] = []
  ) => {
    const userId = user?.id;
    const companyId = user?.companyId;

    try {
      await checkPermission(userId, companyId, ["role_admin"]);

      const existingRole = await db.role.findUnique({
        where: { name },
      });

      if (existingRole) {
        throw new Error("Role name already exists");
      }

      const newRole = await db.role.create({
        data: {
          name,
          description,
          permissions,
        },
      });

      return { role: newRole };
    } catch (error) {
      console.error("Failed to create role:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create role"
      );
    }
  }
);

export const getRoles = authenticatedAction(async (user) => {
  const userId = user?.id;
  const companyId = user?.companyId;

  try {
    await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

    const roles = await db.role.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });
    return roles;
  } catch (error) {
    console.error("Failed to get roles:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get roles"
    );
  }
});

export const getRoleById = authenticatedAction(async (user, roleId: string) => {
  const userId = user?.id;
  const companyId = user?.companyId;

  try {
    await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

    const role = await db.role.findUnique({
      where: { id: roleId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!role) throw new Error("Role not found");

    return role;
  } catch (error) {
    console.error("Failed to get role:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get role"
    );
  }
});

export const updateRole = authenticatedAction(
  async (user, roleId: string, data: Prisma.RoleUpdateInput) => {
    const userId = user?.id;
    const companyId = user?.companyId;

    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const updatedRole = await db.role.update({
        where: { id: roleId },
        data: {
          ...data,
        },
      });

      return updatedRole;
    } catch (error) {
      console.error("Failed to update role:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update role"
      );
    }
  }
);

export const deleteRole = authenticatedAction(async (user, roleId: string) => {
  const userId = user?.id;
  const companyId = user?.companyId;

  try {
    await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

    const roleInUse = await db.user.findFirst({
      where: { roleId },
    });

    if (roleInUse) {
      throw new Error(
        "Cannot delete role because it is assigned to one or more users"
      );
    }

    await db.role.delete({
      where: { id: roleId },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete role:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete role"
    );
  }
});

export const addPermissionToRole = authenticatedAction(
  async (user, roleId: string, permission: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;

    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const role = await db.role.findUnique({ where: { id: roleId } });
      if (!role) throw new Error("Role not found");

      const permissions = role.permissions || [];
      if (permissions.includes(permission)) {
        return role;
      }

      const updatedRole = await db.role.update({
        where: { id: roleId },
        data: {
          permissions: [...permissions, permission],
        },
      });

      return updatedRole;
    } catch (error) {
      console.error("Failed to add permission to role:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to add permission to role"
      );
    }
  }
);

export const removePermissionFromRole = authenticatedAction(
  async (user, roleId: string, permission: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;

    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const role = await db.role.findUnique({ where: { id: roleId } });
      if (!role) throw new Error("Role not found");

      const permissions = role.permissions || [];
      const newPermissions = permissions.filter((p) => p !== permission);

      const updatedRole = await db.role.update({
        where: { id: roleId },
        data: {
          permissions: newPermissions,
        },
      });

      return updatedRole;
    } catch (error) {
      console.error("Failed to remove permission from role:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to remove permission from role"
      );
    }
  }
);
