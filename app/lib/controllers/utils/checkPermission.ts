"use server";

import { db } from "../../db";
import rolesConfig from "@/roles.json";

export interface CheckPermissionUser {
  id: string;
  companyId: string | null;
  roleName?: string | null;
  role?: { name: string } | null;
}

export async function checkPermission(
  userOrUserId: CheckPermissionUser | string,
  companyId: string | null,
  requiredRoles: string[] = [],
  options: { allowNoCompany?: boolean } = {}
) {
  if (!companyId && !options.allowNoCompany) {
    throw new Error("No company assigned to this user");
  }

  let resolvedUser: {
    id: string;
    companyId: string | null;
    roleName: string | null;
  };

  if (typeof userOrUserId === "string") {
    const dbUser = await db.user.findUnique({
      where: { id: userOrUserId },
      select: {
        id: true,
        companyId: true,
        role: { select: { name: true } },
      },
    });

    if (!dbUser) {
      throw new Error("User not found");
    }

    resolvedUser = {
      id: dbUser.id,
      companyId: dbUser.companyId,
      roleName: dbUser.role?.name ?? null,
    };
  } else {
    resolvedUser = {
      id: userOrUserId.id,
      companyId: userOrUserId.companyId,
      roleName: userOrUserId.roleName ?? userOrUserId.role?.name ?? null,
    };
  }

  if (resolvedUser.companyId !== companyId) {
    throw new Error("User is not authorized to access this company");
  }

  if (requiredRoles.length > 0) {
    const userRoleName = resolvedUser.roleName ?? "";

    // Map internal role identifiers dynamically from roles.json (case-insensitive)
    const roleMapping: Record<string, string[]> = {};
    for (const r of rolesConfig) {
      roleMapping[r.id] = (r.names || [r.name]).map((name) => name.toLowerCase());
    }

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

  return resolvedUser;
}
