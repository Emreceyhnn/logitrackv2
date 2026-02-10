"use server";

import { db } from "../../db";

export async function checkPermission(userId: string, companyId: string, requiredRoles: string[] = []) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { roleId: true, companyId: true }
    });

    if (!user || user.companyId !== companyId) {
        throw new Error("User is not authorized to access this company");
    }

    if (requiredRoles.length > 0) {
        const userRoleId = user.roleId || "";

        if (!requiredRoles.includes(userRoleId)) {
            throw new Error(`Insufficient permissions. Required roles: ${requiredRoles.join(", ")}`);
        }
    }
    return user;
}