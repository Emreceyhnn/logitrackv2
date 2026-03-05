"use server";

import { db } from "../../db";

export async function checkPermission(
  userId: string,
  companyId: string | null,
  requiredRoles: string[] = []
) {
  if (!companyId) {
    throw new Error("No company assigned to this user");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      roleId: true,
      companyId: true,
      role: { select: { name: true } },
    },
  });

  if (!user || user.companyId !== companyId) {
    throw new Error("User is not authorized to access this company");
  }

  if (requiredRoles.length > 0) {
    const userRoleName = user.role?.name ?? "";

    // Map internal role identifiers to potential DB names
    const roleMapping: Record<string, string[]> = {
      role_admin: ["Administrator", "admin"],
      role_manager: ["manager"],
      role_dispatcher: ["Dispatcher"],
      role_driver: ["driver"],
      role_warehouse: ["warehouse", "warehouse manager"],
    };

    const normalizedRequired = requiredRoles.flatMap((r) => {
      const roleKey = r.toLowerCase();
      const mapped = roleMapping[roleKey] || [];
      return [roleKey, ...mapped];
    });

    if (!normalizedRequired.includes(userRoleName)) {
      throw new Error(
        `Insufficient permissions. Required roles: ${requiredRoles.join(", ")}`
      );
    }
  }

  return user;
}
