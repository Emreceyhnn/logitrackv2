"use server";

import { db } from "../../db";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";
import { invalidateVehicleCache } from "./cache";

export const assignDriverToVehicle = authenticatedAction(
  async (user, vehicleId: string, driverId: string | null) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      if (driverId) {
        const foundDriver = await db.driver.findUnique({
          where: { id: driverId },
          select: { companyId: true },
        });
        if (!foundDriver || foundDriver.companyId !== companyId) {
          throw new Error("Driver not found or belongs to another company");
        }
      }

      await db.$transaction(async (tx) => {
        if (driverId) {
          const currentDriverOfVehicle = await tx.driver.findUnique({
            where: { currentVehicleId: vehicleId },
          });

          if (currentDriverOfVehicle) {
            await tx.driver.update({
              where: { id: currentDriverOfVehicle.id },
              data: { currentVehicleId: null },
            });
          }

          await tx.driver.update({
            where: { id: driverId },
            data: { currentVehicleId: vehicleId },
          });
        } else {
          const currentDriverOfVehicle = await tx.driver.findUnique({
            where: { currentVehicleId: vehicleId },
          });
          if (currentDriverOfVehicle) {
            await tx.driver.update({
              where: { id: currentDriverOfVehicle.id },
              data: { currentVehicleId: null },
            });
          }
        }
      });

      await invalidateVehicleCache(companyId, vehicleId);

      // If a driver was assigned, notify them
      if (driverId) {
        const driverUser = await db.user.findFirst({
          where: { driver: { id: driverId } },
          select: { id: true },
        });

        if (driverUser) {
          const vehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            select: { plate: true },
          });

          await createNotification(
            { userId: driverUser.id },
            {
              title: "Yeni Araç Atandı! 🚛",
              message: `${vehicle?.plate} plakalı araç size atandı. Yolculuğa başlamaya hazır mısınız?`,
              type: "SUCCESS",
              category: "NEW_ASSIGNMENT",
              link: `/dashboard/vehicles/${vehicleId}`,
            }
          );
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to assign driver:", error);
      throw error;
    }
  }
);

export const unassignDriverFromVehicle = authenticatedAction(
  async (user, vehicleId: string) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      const foundDriver = await db.driver.findUnique({
        where: { currentVehicleId: vehicleId },
      });

      if (foundDriver) {
        await db.driver.update({
          where: { id: foundDriver.id },
          data: { currentVehicleId: null },
        });
      }

      await invalidateVehicleCache(companyId, vehicleId);
      return { success: true };
    } catch (error) {
      console.error("Failed to unassign driver:", error);
      throw error;
    }
  }
);

export const getAvailableDrivers = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";
  try {
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    if (!companyId) throw new Error("User has no company");

    const availableDrivers = await db.driver.findMany({
      where: {
        companyId,
        currentVehicleId: null,
        status: "ON_JOB",
      },
      select: {
        id: true,
        rating: true,
        status: true,
        user: {
          select: {
            name: true,
            surname: true,
            avatarUrl: true,
          },
        },
      },
    });

    return availableDrivers;
  } catch (error) {
    console.error("Failed to get available drivers:", error);
    throw error;
  }
});
