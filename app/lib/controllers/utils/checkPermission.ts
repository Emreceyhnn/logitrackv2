"use server";

import { db } from "../../db";

export async function checkPermission(
  userId: string,
  companyId: string | null,
  requiredRoles: string[] = [],
  options: { allowNoCompany?: boolean } = {}
) {
  if (!companyId && !options.allowNoCompany) {
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

    // Map internal role identifiers to all possible DB role names (case-insensitive)
    const roleMapping: Record<string, string[]> = {
      role_admin: [
        "administrator",
        "admin",
        "company admin",
        "super admin",
        "companyadmin",
        "superadmin",
      ],
      role_manager: ["manager", "operations manager", "fleet manager"],
      role_dispatcher: ["dispatcher"],
      role_driver: ["driver"],
      role_warehouse: [
        "warehouse",
        "warehouse manager",
        "warehouse operator",
        "warehouseoperator",
      ],
    };

    const normalizedRequired = requiredRoles.flatMap((r) => {
      const roleKey = r.toLowerCase();
      const mapped = roleMapping[roleKey] || [];
      return [roleKey, ...mapped];
    });

    // Case-insensitive comparison against the user's actual role name
    const userRoleNameLower = userRoleName.toLowerCase();

    if (!normalizedRequired.includes(userRoleNameLower)) {
      throw new Error(
        `Insufficient permissions. Required roles: ${requiredRoles.join(", ")}`
      );
    }
  }

  return user;
}
