"use server";

import { db } from "../../db";
import { FuelType, Prisma, VehicleStatus } from "@prisma/client";
import { vehicleSchema } from "../../validation/serverSchemas";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";
import { syncVehicleToFirebaseAction as syncVehicleToFirebase } from "../../actions/vehicleTracking";
import { invalidateVehicleCache } from "./cache";

export const createVehicle = authenticatedAction(
  // `unknown` on purpose: the payload is validated by vehicleSchema.parse()
  // below, so callers can pass their own typed shapes without casting.
  async (user, vehicleData: unknown) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (!companyId) throw new Error("User has no company");

      const parsedData = vehicleSchema.parse(vehicleData);

      const vehicleFleetNo =
        parsedData.fleetNo ||
        `FLEET-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`;

      const newVehicle = await db.vehicle.create({
        data: {
          ...parsedData,
          fuelType: parsedData.fuelType as FuelType,
          fleetNo: vehicleFleetNo,
          company: { connect: { id: companyId } },
        },
      });

      await invalidateVehicleCache(companyId);
      // Sync to Firebase (background)
      syncVehicleToFirebase(newVehicle).catch((err) =>
        console.error("Firebase sync failed:", err)
      );

      return newVehicle;
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      throw error;
    }
  }
);

export const getVehicleById = authenticatedAction(
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
        include: {
          driver: {
            include: {
              user: {
                select: { name: true, surname: true, avatarUrl: true },
              },
            },
          },
          issues: {
            orderBy: { createdAt: "desc" },
          },
          maintenanceRecords: {
            orderBy: { date: "desc" },
            take: 5,
          },
          fuelLogs: {
            orderBy: { date: "desc" },
            take: 10,
          },
        },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      return foundVehicle;
    } catch (error) {
      console.error("Failed to get vehicle:", error);
      throw error;
    }
  }
);

const vehicleUpdateSchema = vehicleSchema.partial();

export const updateVehicle = authenticatedAction(
  async (user, vehicleId: string, data: Record<string, unknown>) => {
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

      const parsedData = vehicleUpdateSchema.parse(data);

      const updateData = { ...parsedData };
      if (updateData.fleetNo === "") {
        updateData.fleetNo = `FLEET-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`;
      }

      const updatedVehicle = await db.vehicle.update({
        where: { id: vehicleId },
        data: updateData as Prisma.VehicleUpdateInput,
      });

      await invalidateVehicleCache(companyId, vehicleId);
      // Sync to Firebase (background)
      syncVehicleToFirebase(updatedVehicle).catch((err) =>
        console.error("Firebase sync failed:", err)
      );

      return updatedVehicle;
    } catch (error) {
      console.error("Failed to update vehicle:", error);
      throw error;
    }
  }
);

export const deleteVehicle = authenticatedAction(
  async (user, vehicleId: string) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      // Soft delete: financial/compliance history (fuel, maintenance,
      // documents) must survive, so the row is only marked as deleted.
      await db.driver.updateMany({
        where: { currentVehicleId: vehicleId },
        data: { currentVehicleId: null },
      });
      await db.vehicle.update({
        where: { id: vehicleId },
        data: { deletedAt: new Date(), status: "OUT_OF_ORDER" },
      });

      await invalidateVehicleCache(companyId, vehicleId);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      throw error;
    }
  }
);

export const updateVehicleStatus = authenticatedAction(
  async (user, vehicleId: string, status: VehicleStatus) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true, plate: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      const updatedVehicle = await db.vehicle.update({
        where: { id: vehicleId },
        data: { status: status as VehicleStatus },
      });

      await invalidateVehicleCache(companyId, vehicleId);

      // Dispatch Notification for specific status changes
      if (status === "MAINTENANCE") {
        await createNotification(
          { companyId: companyId! },
          {
            title: "Araç Bakıma Alındı! ⛔",
            message: `${updatedVehicle.plate} plakalı araç şu an bakım durumunda.`,
            type: "ERROR",
            category: "MAINTENANCE_ALERT",
            link: `/dashboard/vehicles/${vehicleId}`,
          }
        );
      }

      return updatedVehicle;
    } catch (error) {
      console.error("Failed to update status:", error);
      throw error;
    }
  }
);
