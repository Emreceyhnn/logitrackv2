"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export const createMaintenanceRecord = authenticatedAction(
  async (
    user,
    vehicleId: string,
    type: string,
    date: Date,
    cost: number,
    description?: string
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const vehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!vehicle || vehicle.companyId !== companyId) {
        throw new Error(
          "Invalid vehicle or vehicle does not belong to this company"
        );
      }

      const newRecord = await db.maintenanceRecord.create({
        data: {
          vehicleId,
          type,
          date,
          cost,
          description,
        },
      });

      return { maintenanceRecord: newRecord };
    } catch (error) {
      console.error("Failed to create maintenance record:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to create maintenance record"
      );
    }
  }
);

export const getMaintenanceRecords = authenticatedAction(
  async (user, vehicleId?: string) => {
    const userId = user?.id;
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const whereClause: Prisma.MaintenanceRecordWhereInput = {
        vehicle: {
          companyId: companyId!,
        },
      };

      if (vehicleId) {
        whereClause.vehicleId = vehicleId;
      }

      const records = await db.maintenanceRecord.findMany({
        where: whereClause,
        include: {
          vehicle: {
            select: {
              plate: true,
              brand: true,
              model: true,
            },
          },
        },
        orderBy: { date: "desc" },
      });
      return records;
    } catch (error) {
      console.error("Failed to get maintenance records:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get maintenance records"
      );
    }
  }
);

export const getMaintenanceRecordById = authenticatedAction(
  async (user, recordId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);
      const record = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        include: {
          vehicle: true,
        },
      });

      if (!record) throw new Error("Maintenance record not found");

      if (record.vehicle?.companyId) {
        await checkPermission(userId, record.vehicle.companyId, [
          "role_admin",
          "role_manager",
        ]);
      }

      return record;
    } catch (error) {
      console.error("Failed to get maintenance record:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get maintenance record"
      );
    }
  }
);

export const updateMaintenanceRecord = authenticatedAction(
  async (user, recordId: string, data: Prisma.MaintenanceRecordUpdateInput) => {
    const userId = user?.id;
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);
      const existingRecord = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        include: { vehicle: { select: { companyId: true } } },
      });

      if (!existingRecord?.vehicle?.companyId)
        throw new Error("Maintenance record not found");

      await checkPermission(userId, existingRecord.vehicle.companyId, [
        "role_admin",
        "role_manager",
      ]);

      const updatedRecord = await db.maintenanceRecord.update({
        where: { id: recordId },
        data: {
          ...data,
        },
      });

      return updatedRecord;
    } catch (error) {
      console.error("Failed to update maintenance record:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to update maintenance record"
      );
    }
  }
);

export const deleteMaintenanceRecord = authenticatedAction(
  async (user, recordId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);
      const existingRecord = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        include: { vehicle: { select: { companyId: true } } },
      });

      if (!existingRecord?.vehicle?.companyId)
        throw new Error("Maintenance record not found");

      await checkPermission(userId, existingRecord.vehicle.companyId, [
        "role_admin",
        "role_manager",
      ]);

      await db.maintenanceRecord.delete({
        where: { id: recordId },
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to delete maintenance record:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to delete maintenance record"
      );
    }
  }
);

export const getMaintenanceStats = authenticatedAction(async (user) => {
  const userId = user?.id;
  const companyId = user?.companyId || "";
  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_driver",
      "role_warehouse",
    ]);

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    const records = await db.maintenanceRecord.findMany({
      where: {
        vehicle: { companyId },
        date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        cost: true,
        type: true,
        date: true,
      },
    });

    const totalCost = records.reduce((sum, record) => sum + record.cost, 0);

    const costByType: Record<string, number> = {};
    records.forEach((record) => {
      costByType[record.type] = (costByType[record.type] || 0) + record.cost;
    });

    return {
      totalCost,
      costByType,
      recordCount: records.length,
    };
  } catch (error) {
    console.error("Failed to get maintenance stats:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get maintenance stats"
    );
  }
});
