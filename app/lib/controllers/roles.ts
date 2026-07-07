"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";
import { controllerGuard } from "./utils/controllerGuard";
import { ConflictError, NotFoundError, ForbiddenError } from "../errors";

export const createRole = authenticatedAction(
  async (
    user,
    name: string,
    description?: string,
    permissions: string[] = []
  ) => {
    const companyId = user?.companyId;

    return controllerGuard("createRole", async () => {
      await checkPermission(user, companyId, ["role_admin"]);

      const existingRole = await db.role.findFirst({
        where: { name, OR: [{ companyId }, { companyId: null }] },
      });

      if (existingRole) {
        throw new ConflictError("Role name already exists");
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
    });
  }
);

export const getRoles = authenticatedAction(async (user) => {
  const companyId = user?.companyId;

  return controllerGuard("getRoles", async () => {
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
  });
});

export const getRoleById = authenticatedAction(async (user, roleId: string) => {
  const companyId = user?.companyId;

  return controllerGuard("getRoleById", async () => {
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
      throw new NotFoundError("Role");

    return role;
  });
});

export const updateRole = authenticatedAction(
  async (user, roleId: string, data: Prisma.RoleUpdateInput) => {
    const companyId = user?.companyId;

    return controllerGuard("updateRole", async () => {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const existing = await db.role.findUnique({ where: { id: roleId } });
      if (!existing) throw new NotFoundError("Role");
      if (existing.companyId === null)
        throw new ForbiddenError("System roles are immutable");
      if (existing.companyId !== companyId) throw new ForbiddenError();

      const updatedRole = await db.role.update({
        where: { id: roleId },
        data: {
          ...data,
        },
      });

      return updatedRole;
    });
  }
);

export const deleteRole = authenticatedAction(async (user, roleId: string) => {
  const companyId = user?.companyId;

  return controllerGuard("deleteRole", async () => {
    await checkPermission(user, companyId, ["role_admin", "role_manager"]);

    const existing = await db.role.findUnique({ where: { id: roleId } });
    if (!existing) throw new NotFoundError("Role");
    if (existing.companyId === null)
      throw new ForbiddenError("System roles cannot be deleted");
    if (existing.companyId !== companyId) throw new ForbiddenError();

    const roleInUse = await db.user.findFirst({
      where: { roleId },
    });

    if (roleInUse) {
      throw new ConflictError(
        "Cannot delete role because it is assigned to one or more users"
      );
    }

    await db.role.delete({
      where: { id: roleId },
    });

    return { success: true };
  });
});

export const addPermissionToRole = authenticatedAction(
  async (user, roleId: string, permission: string) => {
    const companyId = user?.companyId;

    return controllerGuard("addPermissionToRole", async () => {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const role = await db.role.findUnique({ where: { id: roleId } });
      if (!role) throw new NotFoundError("Role");
      if (role.companyId === null)
        throw new ForbiddenError("System roles are immutable");
      if (role.companyId !== companyId) throw new ForbiddenError();

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
    });
  }
);

export const removePermissionFromRole = authenticatedAction(
  async (user, roleId: string, permission: string) => {
    const companyId = user?.companyId;

    return controllerGuard("removePermissionFromRole", async () => {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const role = await db.role.findUnique({ where: { id: roleId } });
      if (!role) throw new NotFoundError("Role");
      if (role.companyId === null)
        throw new ForbiddenError("System roles are immutable");
      if (role.companyId !== companyId) throw new ForbiddenError();

      const permissions = role.permissions || [];
      const newPermissions = permissions.filter((p) => p !== permission);

      const updatedRole = await db.role.update({
        where: { id: roleId },
        data: {
          permissions: newPermissions,
        },
      });

      return updatedRole;
    });
  }
);
