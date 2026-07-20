"use server";

import { db } from "../../db";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";
import { UserStatus } from "@prisma/client";
import { invalidatePattern, driverCacheKeys } from "../../redis";
import { invalidateCompanyCache, ensureStandardRoles } from "./shared";
import { controllerGuard } from "../utils/controllerGuard";

export const removeCompanyUser = authenticatedAction(
  async (user, targetUserId: string) => {
    const companyId = user?.companyId || "";

    return controllerGuard("removeCompanyUser", async () => {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const targetUser = await db.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser || targetUser.companyId !== companyId) {
        throw new Error("Unauthorized: User not found or not in your company");
      }

      const updatedUser = await db.user.update({
        where: { id: targetUserId },
        data: {
          companyId: null,
        },
      });
      await invalidateCompanyCache(companyId);
      return updatedUser;
    });
  }
);

export const addCompanyUser = authenticatedAction(
  async (
    user,
    targetUserId: string,
    roleName: string,
    driverData?: {
      employeeId: string;
      phone: string;
      licenseType?: string;
      licenseNumber?: string;
      licenseExpiry?: string;
    }
  ) => {
    const companyId = user?.companyId || "";

    return controllerGuard("addCompanyUser", async () => {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const targetUser = await db.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser) throw new Error("User not found");
      if (targetUser.companyId && targetUser.companyId !== companyId) {
        throw new Error("Unauthorized: User is already associated with another company");
      }

      await ensureStandardRoles();

      let updatedUser;

      if (roleName === "role_driver" && driverData) {
        // Run as a transaction to ensure both user update and driver creation succeed
        updatedUser = await db.$transaction(async (tx) => {
          // Check if employeeId is already taken
          if (driverData.employeeId) {
            const existingEmployee = await tx.driver.findFirst({
              where: {
                companyId,
                employeeId: driverData.employeeId,
              },
            });
            if (existingEmployee) {
              throw new Error("A driver with this Employee ID already exists");
            }
          }

          // Check if user already has a driver record
          const existingDriver = await tx.driver.findFirst({
            where: { userId: targetUserId, companyId },
          });
          if (existingDriver) {
            throw new Error("This user is already registered as a driver");
          }

          const userUpdate = await tx.user.update({
            where: { id: targetUserId },
            data: {
              companyId,
              roleId: roleName,
            },
          });

          await tx.driver.create({
            data: {
              companyId,
              userId: targetUserId,
              phone: driverData.phone,
              employeeId: driverData.employeeId,
              licenseType: driverData.licenseType || null,
              licenseNumber: driverData.licenseNumber || null,
              licenseExpiry: driverData.licenseExpiry ? new Date(driverData.licenseExpiry) : null,
              status: "OFF_DUTY",
              safetyScore: 100,
              efficiencyScore: 100,
              rating: 5.0,
            },
          });

          return userUpdate;
        });

        // Invalidate driver lists cache
        await invalidatePattern(driverCacheKeys.companyPattern(companyId));
      } else {
        updatedUser = await db.user.update({
          where: { id: targetUserId },
          data: {
            companyId,
            roleId: roleName,
          },
        });
      }

      await invalidateCompanyCache(companyId);
      return updatedUser;
    });
  }
);

export const updateCompanyMember = authenticatedAction(
  async (
    user,
    targetUserId: string,
    data: { name: string; surname: string; roleId: string; status: UserStatus }
  ) => {
    const companyId = user?.companyId || "";

    return controllerGuard("updateCompanyMember", async () => {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const targetUser = await db.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser || targetUser.companyId !== companyId) {
        throw new Error("Unauthorized: User not found or not in your company");
      }

      await ensureStandardRoles();

      const updatedUser = await db.user.update({
        where: { id: targetUserId },
        data: {
          name: data.name,
          surname: data.surname,
          roleId: data.roleId,
          status: data.status,
        },
      });

      await invalidateCompanyCache(companyId);
      return updatedUser;
    });
  }
);
