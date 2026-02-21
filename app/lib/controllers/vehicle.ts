"use server";

import { db } from "../db";
import { VehicleStatus } from "@prisma/client";
import { checkPermission } from "./utils/checkPermission";
import { authenticatedAction } from "../auth-middleware";
import {
  VehicleCapacityConverter,
  VehicleDocumentConverter,
  VehicleKpiConverter,
} from "./utils/vehicleUtils";

export const createVehicle = authenticatedAction(
  async (user, vehicleData: any) => {
    try {
      await checkPermission(user.id, user.companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const vehicle = await db.vehicle.create({
        data: {
          companyId: user.companyId,
          ...vehicleData,
        },
      });
      return vehicle;
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      throw error;
    }
  }
);

import { VehicleFilters } from "../type/vehicle";

export const getVehicles = authenticatedAction(
  async (user, filters?: VehicleFilters) => {
    try {
      await checkPermission(user.id, user.companyId);

      const whereClause: any = {
        companyId: user.companyId,
      };

      if (filters) {
        if (filters.search) {
          whereClause.OR = [
            { plate: { contains: filters.search, mode: "insensitive" } },
            { brand: { contains: filters.search, mode: "insensitive" } },
            { model: { contains: filters.search, mode: "insensitive" } },
          ];
        }

        if (filters.status && filters.status.length > 0) {
          whereClause.status = { in: filters.status };
        }

        if (filters.type && filters.type.length > 0) {
          whereClause.type = { in: filters.type };
        }

        if (filters.hasIssues) {
          whereClause.issues = {
            some: {
              status: { in: ["OPEN", "IN_PROGRESS"] },
            },
          };
        }

        if (filters.hasDriver === true) {
          whereClause.driver = { isNot: null };
        } else if (filters.hasDriver === false) {
          whereClause.driver = { is: null };
        }
      }

      const vehicles = await db.vehicle.findMany({
        where: whereClause,
        select: {
          id: true,
          fleetNo: true,
          plate: true,
          brand: true,
          model: true,
          year: true,
          type: true,
          maxLoadKg: true,
          fuelType: true,
          nextServiceKm: true,
          avgFuelConsumption: true,
          status: true,
          odometerKm: true,
          fuelLevel: true,
          currentLat: true,
          currentLng: true,
          driver: {
            select: {
              id: true,
              rating: true,
              user: {
                select: { name: true, surname: true, avatarUrl: true },
              },
            },
          },
          issues: true,
          documents: true,
          maintenanceRecords: true,
          routes: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return vehicles;
    } catch (error) {
      console.error("Failed to get vehicles:", error);
      throw error;
    }
  }
);

export const getVehicleById = authenticatedAction(
  async (user, vehicleId: string) => {
    try {
      const vehicle = await db.vehicle.findUnique({
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
        },
      });

      if (!vehicle) throw new Error("Vehicle not found");

      if (vehicle.companyId) {
        await checkPermission(user.id, vehicle.companyId);
      }

      return vehicle;
    } catch (error) {
      console.error("Failed to get vehicle:", error);
      throw error;
    }
  }
);

export const updateVehicle = authenticatedAction(
  async (user, vehicleId: string, data: any) => {
    try {
      const existingVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

      await checkPermission(user.id, existingVehicle.companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const updatedVehicle = await db.vehicle.update({
        where: { id: vehicleId },
        data: {
          ...data,
        },
      });

      return updatedVehicle;
    } catch (error) {
      console.error("Failed to update vehicle:", error);
      throw error;
    }
  }
);

export const deleteVehicle = authenticatedAction(
  async (user, vehicleId: string) => {
    try {
      const existingVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

      await checkPermission(user.id, existingVehicle.companyId, [
        "role_admin",
        "role_manager",
      ]);

      await db.vehicle.delete({
        where: { id: vehicleId },
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      throw error;
    }
  }
);

export const createVehicleIssue = authenticatedAction(
  async (
    user,
    vehicleId: string,
    issueData: {
      title: string;
      type: string;
      priority: string;
      description?: string;
    }
  ) => {
    try {
      const existingVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

      await checkPermission(user.id, existingVehicle.companyId);

      const issue = await db.issue.create({
        data: {
          title: issueData.title,
          type: issueData.type,
          priority: issueData.priority,
          description: issueData.description || null,
          status: "OPEN",
          vehicleId,
          companyId: existingVehicle.companyId,
        },
      });

      return issue;
    } catch (error) {
      console.error("Failed to create vehicle issue:", error);
      throw error;
    }
  }
);

export const assignDriverToVehicle = authenticatedAction(
  async (user, vehicleId: string, driverId: string | null) => {
    try {
      const existingVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

      await checkPermission(user.id, existingVehicle.companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (driverId) {
        const driver = await db.driver.findUnique({
          where: { id: driverId },
          select: { companyId: true },
        });
        if (!driver || driver.companyId !== existingVehicle.companyId) {
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

      return { success: true };
    } catch (error) {
      console.error("Failed to assign driver:", error);
      throw error;
    }
  }
);

export const updateVehicleStatus = authenticatedAction(
  async (user, vehicleId: string, status: VehicleStatus) => {
    try {
      return await updateVehicle(vehicleId, { status });
    } catch (error) {
      console.error("Failed to update status:", error);
      throw error;
    }
  }
);

export const addMaintenanceRecord = authenticatedAction(
  async (
    user,
    vehicleId: string,
    recordData: { type: string; date: Date; cost: number; description?: string }
  ) => {
    try {
      const existingVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

      await checkPermission(user.id, existingVehicle.companyId, [
        "role_admin",
        "role_manager",
      ]);

      const record = await db.maintenanceRecord.create({
        data: {
          vehicleId,
          ...recordData,
        },
      });

      await db.vehicle.update({
        where: { id: vehicleId },
        data: { status: "MAINTENANCE" },
      });

      return record;
    } catch (error) {
      console.error("Failed to add maintenance record:", error);
      throw error;
    }
  }
);

export const getOpenIssuesForUser = authenticatedAction(async (user) => {
  try {
    if (!user || !user.companyId) {
      // Should be guaranteed by authenticatedAction but keeping for safety
      throw new Error("Unauthorized");
    }

    const vehicles = await db.vehicle.findMany({
      where: { companyId: user.companyId },
      include: {
        issues: {
          where: {
            status: { in: ["OPEN", "IN_PROGRESS"] },
          },
          orderBy: { createdAt: "desc" },
          include: {
            vehicle: {
              select: { plate: true },
            },
          },
        },
      },
    });

    const issues: any[] = [];
    vehicles.forEach((v) => {
      if (v.issues && v.issues.length > 0) {
        issues.push(...v.issues);
      }
    });

    return issues.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Failed to get open issues:", error);
    return [];
  }
});

/* ------------------------------- INDICATORS ------------------------------- */

export const getVehiclesDashboardData = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const vehicles = await db.vehicle.findMany({
      where: { companyId: user.companyId },
      select: {
        id: true,
        plate: true,
        status: true,
        maxLoadKg: true,

        issues: {
          where: {
            status: {
              in: ["OPEN", "IN_PROGRESS"],
            },
          },
          select: { id: true },
        },

        documents: {
          where: {
            expiryDate: {
              lt: new Date(),
            },
          },
          select: {
            type: true,
            expiryDate: true,
          },
        },
      },
    });

    const vehiclesKpis = VehicleKpiConverter(vehicles);

    const vehiclesCapacity = VehicleCapacityConverter(vehicles);

    const expiringDocs = VehicleDocumentConverter(vehicles);

    return { vehiclesKpis, vehiclesCapacity, expiringDocs };
  } catch (error) {
    console.error("Failed to get vehicle kpi cards:", error);
    throw error;
  }
});

/* ----------------------------- MISSING ACTIONS ---------------------------- */

export const unassignDriverFromVehicle = authenticatedAction(
  async (user, vehicleId: string) => {
    try {
      const existingVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

      await checkPermission(user.id, existingVehicle.companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      // Find the driver currently assigned to this vehicle
      const driver = await db.driver.findUnique({
        where: { currentVehicleId: vehicleId },
      });

      if (driver) {
        await db.driver.update({
          where: { id: driver.id },
          data: { currentVehicleId: null },
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to unassign driver:", error);
      throw error;
    }
  }
);

export const getAvailableDrivers = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const drivers = await db.driver.findMany({
      where: {
        companyId: user.companyId,
        currentVehicleId: null, // Only fetch drivers not currently assigned
        status: { not: "OFF_DUTY" }, // Optional: only show active drivers
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

    return drivers;
  } catch (error) {
    console.error("Failed to get available drivers:", error);
    throw error;
  }
});

export const uploadVehicleDocument = authenticatedAction(
  async (
    user,
    vehicleId: string,
    documentData: {
      type: string;
      name: string;
      url: string;
      expiryDate?: Date;
      status: string;
    }
  ) => {
    try {
      const existingVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

      await checkPermission(user.id, existingVehicle.companyId, [
        "role_admin",
        "role_manager",
      ]);

      const doc = await db.document.create({
        data: {
          vehicleId,
          companyId: existingVehicle.companyId,
          ...documentData,
        },
      });

      return doc;
    } catch (error) {
      console.error("Failed to upload document:", error);
      throw error;
    }
  }
);

export const updateIssue = authenticatedAction(
  async (
    user,
    issueId: string,
    data: {
      status?: string;
      priority?: string;
      description?: string;
    }
  ) => {
    try {
      const issue = await db.issue.findUnique({
        where: { id: issueId },
        select: { companyId: true },
      });

      if (!issue?.companyId) throw new Error("Issue not found");

      await checkPermission(user.id, issue.companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const updatedIssue = await db.issue.update({
        where: { id: issueId },
        data,
      });

      return updatedIssue;
    } catch (error) {
      console.error("Failed to update issue:", error);
      throw error;
    }
  }
);
