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
    const companyId = user?.companyId;

    try {
      await checkPermission(user, companyId, ["role_admin"]);

      const existingRole = await db.role.findFirst({
        where: { name, OR: [{ companyId }, { companyId: null }] },
      });

      if (existingRole) {
        throw new Error("Role name already exists");
      }

      const newRole = await db.role.create({
        data: {
          name,
          description,
          permissions,
          companyId,
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
  const companyId = user?.companyId;

  try {
    await checkPermission(user, companyId, ["role_admin", "role_manager"]);

    // System roles (companyId = null) are shared; custom roles are tenant-scoped
    const roles = await db.role.findMany({
      where: { OR: [{ companyId: null }, { companyId }] },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { users: { where: { companyId } } },
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
  const companyId = user?.companyId;

  try {
    await checkPermission(user, companyId, ["role_admin", "role_manager"]);

    const role = await db.role.findUnique({
      where: { id: roleId },
      include: {
        // Never expose other tenants' users through a shared system role
        users: {
          where: { companyId },
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

    if (!role || (role.companyId !== null && role.companyId !== companyId))
      throw new Error("Role not found");

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
    const companyId = user?.companyId;

    try {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const existing = await db.role.findUnique({ where: { id: roleId } });
      if (!existing) throw new Error("Role not found");
      if (existing.companyId === null)
        throw new Error("System roles are immutable");
      if (existing.companyId !== companyId) throw new Error("Unauthorized");

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
  const companyId = user?.companyId;

  try {
    await checkPermission(user, companyId, ["role_admin", "role_manager"]);

    const existing = await db.role.findUnique({ where: { id: roleId } });
    if (!existing) throw new Error("Role not found");
    if (existing.companyId === null)
      throw new Error("System roles cannot be deleted");
    if (existing.companyId !== companyId) throw new Error("Unauthorized");

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
    const companyId = user?.companyId;

    try {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const role = await db.role.findUnique({ where: { id: roleId } });
      if (!role) throw new Error("Role not found");
      if (role.companyId === null)
        throw new Error("System roles are immutable");
      if (role.companyId !== companyId) throw new Error("Unauthorized");

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
    const companyId = user?.companyId;

    try {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const role = await db.role.findUnique({ where: { id: roleId } });
      if (!role) throw new Error("Role not found");
      if (role.companyId === null)
        throw new Error("System roles are immutable");
      if (role.companyId !== companyId) throw new Error("Unauthorized");

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
