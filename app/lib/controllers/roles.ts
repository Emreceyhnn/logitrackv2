"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export async function createRole(
    userId: string,
    companyId: string,
    name: string,
    description?: string,
    permissions: string[] = []
) {
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
    } catch (error: any) {
        console.error("Failed to create role:", error);
        throw new Error(error.message || "Failed to create role");
    }
}

export async function getRoles(userId: string, companyId: string) {
    try {
        await checkPermission(userId, companyId);



        const roles = await db.role.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { users: true }
                }
            }
        });
        return roles;
    } catch (error: any) {
        console.error("Failed to get roles:", error);
        throw new Error(error.message || "Failed to get roles");
    }
}

export async function getRoleById(roleId: string, userId: string, companyId: string) {
    try {
        await checkPermission(userId, companyId);

        const role = await db.role.findUnique({
            where: { id: roleId },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            }
        });

        if (!role) throw new Error("Role not found");

        return role;
    } catch (error: any) {
        console.error("Failed to get role:", error);
        throw new Error(error.message || "Failed to get role");
    }
}

export async function updateRole(roleId: string, userId: string, companyId: string, data: Prisma.RoleUpdateInput) {
    try {
        await checkPermission(userId, companyId, ["role_admin"]);

        const updatedRole = await db.role.update({
            where: { id: roleId },
            data: {
                ...data,
            }
        });

        return updatedRole;
    } catch (error: any) {
        console.error("Failed to update role:", error);
        throw new Error(error.message || "Failed to update role");
    }
}

export async function deleteRole(roleId: string, userId: string, companyId: string) {
    try {
        await checkPermission(userId, companyId, ["role_admin"]);


        const roleInUse = await db.user.findFirst({
            where: { roleId }
        });

        if (roleInUse) {
            throw new Error("Cannot delete role because it is assigned to one or more users");
        }

        await db.role.delete({
            where: { id: roleId }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete role:", error);
        throw new Error(error.message || "Failed to delete role");
    }
}

export async function addPermissionToRole(roleId: string, permission: string, userId: string, companyId: string) {
    try {
        await checkPermission(userId, companyId, ["role_admin"]);

        const role = await db.role.findUnique({ where: { id: roleId } });
        if (!role) throw new Error("Role not found");

        const permissions = role.permissions || [];
        if (permissions.includes(permission)) {
            return role;
        }

        const updatedRole = await db.role.update({
            where: { id: roleId },
            data: {
                permissions: [...permissions, permission]
            }
        });

        return updatedRole;
    } catch (error: any) {
        console.error("Failed to add permission to role:", error);
        throw new Error(error.message || "Failed to add permission to role");
    }
}

export async function removePermissionFromRole(roleId: string, permission: string, userId: string, companyId: string) {
    try {
        await checkPermission(userId, companyId, ["role_admin"]);

        const role = await db.role.findUnique({ where: { id: roleId } });
        if (!role) throw new Error("Role not found");

        const permissions = role.permissions || [];
        const newPermissions = permissions.filter(p => p !== permission);

        const updatedRole = await db.role.update({
            where: { id: roleId },
            data: {
                permissions: newPermissions
            }
        });

        return updatedRole;
    } catch (error: any) {
        console.error("Failed to remove permission from role:", error);
        throw new Error(error.message || "Failed to remove permission from role");
    }
}
