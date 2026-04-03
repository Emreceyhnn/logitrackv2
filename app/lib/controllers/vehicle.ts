"use server";

import { db } from "../db";
import { Issue, MaintenanceStatus, Prisma, VehicleStatus, VehicleType, IssueStatus, IssuePriority, IssueType } from "@prisma/client";
import { checkPermission } from "./utils/checkPermission";
import { authenticatedAction } from "../auth-middleware";
import {
  VehicleCapacityConverter,
  VehicleDocumentConverter,
  VehicleKpiConverter,
} from "./utils/vehicleUtils";
import { VehicleFilters, VehicleWithRelations } from "../type/vehicle";

export const createVehicle = authenticatedAction(
  async (user, vehicleData: Record<string, unknown>) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (!companyId) throw new Error("User has no company");

      interface VehicleInput {
        year?: number | string;
        odometerKm?: number | string;
        maxLoadKg?: number | string;
        fuelLevel?: number | string;
        avgFuelConsumption?: number | string;
        nextServiceKm?: number | string;
        registrationExpiry?: string | Date;
        inspectionExpiry?: string | Date;
        plate?: string;
        fleetNo?: string;
        brand?: string;
        model?: string;
        type?: VehicleType; // The enum type
        fuelType?: string;
        engineSize?: string;
        transmission?: string;
        techNotes?: string;
        photo?: string;
        enableAlerts?: boolean;
      }

      const {
        year,
        odometerKm,
        maxLoadKg,
        fuelLevel,
        avgFuelConsumption,
        nextServiceKm,
        registrationExpiry,
        inspectionExpiry,
        plate,
        fleetNo,
        brand,
        model,
        type,
        fuelType,
        engineSize,
        transmission,
        techNotes,
        photo,
        enableAlerts,
      } = vehicleData as unknown as VehicleInput;

      if (year === undefined || year === null)
        throw new Error("Year is required");
      if (maxLoadKg === undefined || maxLoadKg === null)
        throw new Error("Max load capacity is required");
      if (!plate) throw new Error("Plate is required");
      if (!type) throw new Error("Vehicle type is required");

      const vehicleFleetNo = fleetNo?.toString() || `FLEET-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const newVehicle = await db.vehicle.create({
        data: {
          plate: plate.toString(),
          fleetNo: vehicleFleetNo,
          brand: brand?.toString() || "",
          model: model?.toString() || "",
          type: type as VehicleType,
          fuelType: fuelType?.toString() || "DIESEL",
          year: parseInt(year.toString()),
          maxLoadKg: parseInt(maxLoadKg.toString()),
          odometerKm: odometerKm ? parseInt(odometerKm.toString()) : null,
          fuelLevel: fuelLevel ? parseInt(fuelLevel.toString()) : null,
          avgFuelConsumption: avgFuelConsumption
            ? parseFloat(avgFuelConsumption.toString())
            : null,
          nextServiceKm: nextServiceKm
            ? parseInt(nextServiceKm.toString())
            : null,
          registrationExpiry: registrationExpiry
            ? new Date(registrationExpiry as string)
            : null,
          inspectionExpiry: inspectionExpiry
            ? new Date(inspectionExpiry as string)
            : null,
          engineSize: engineSize?.toString() || null,
          transmission: transmission?.toString() || null,
          techNotes: techNotes?.toString() || null,
          photo: photo?.toString() || null,
          enableAlerts: enableAlerts === true,
          company: { connect: { id: companyId } },
        },
      });
      return newVehicle;
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      throw error;
    }
  }
);

export const getVehicles = authenticatedAction(
  async (user, filters?: VehicleFilters): Promise<VehicleWithRelations[]> => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (!companyId) throw new Error("User has no company");

      const whereClause: Prisma.VehicleWhereInput = {
        companyId,
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
              status: { in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS] },
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
        include: {
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
        },
        orderBy: { createdAt: "desc" },
      });
      return vehicles as unknown as VehicleWithRelations[];
    } catch (error) {
      console.error("Failed to get vehicles:", error);
      throw error;
    }
  }
);

export const getVehicleById = authenticatedAction(
  async (user, vehicleId: string) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
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

export const updateVehicle = authenticatedAction(
  async (user, vehicleId: string, data: Partial<Prisma.VehicleUpdateInput>) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
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

      const updateData = { ...data };
      if (updateData.fleetNo === "") {
        updateData.fleetNo = `FLEET-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      }

      const updatedVehicle = await db.vehicle.update({
        where: { id: vehicleId },
        data: updateData,
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
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

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
      type: IssueType;
      priority: IssuePriority;
      description?: string;
    }
  ) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
        "role_driver",
      ]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      const issue = await db.issue.create({
        data: {
          title: issueData.title,
          type: issueData.type,
          priority: issueData.priority,
          description: issueData.description || null,
          status: IssueStatus.OPEN,
          vehicleId,
          companyId,
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
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
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

      return { success: true };
    } catch (error) {
      console.error("Failed to assign driver:", error);
      throw error;
    }
  }
);

export const updateVehicleStatus = authenticatedAction(
  async (user, vehicleId: string, status: VehicleStatus) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
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

      const updatedVehicle = await db.vehicle.update({
        where: { id: vehicleId },
        data: { status },
      });

      return updatedVehicle;
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
    recordData: { type: string; date: Date; cost: number; status?: MaintenanceStatus; description?: string }
  ) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
        "role_driver",
      ]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

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
  const userId = user?.id || "";
  const companyId = user?.companyId || "";
  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
      "role_driver",
    ]);

    if (!companyId) throw new Error("User has no company");

    const vehiclesWithIssues = await db.vehicle.findMany({
      where: { companyId },
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

    const issues: Issue[] = [];
    vehiclesWithIssues.forEach((v) => {
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

export const getVehiclesDashboardData = authenticatedAction(async (user) => {
  const userId = user?.id || "";
  const companyId = user?.companyId || "";
  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    if (!companyId) throw new Error("User has no company");

    const vehicles = await db.vehicle.findMany({
      where: { companyId },
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

export const unassignDriverFromVehicle = authenticatedAction(
  async (user, vehicleId: string) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
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

      return { success: true };
    } catch (error) {
      console.error("Failed to unassign driver:", error);
      throw error;
    }
  }
);

export const getAvailableDrivers = authenticatedAction(async (user) => {
  const userId = user?.id || "";
  const companyId = user?.companyId || "";
  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    if (!companyId) throw new Error("User has no company");

    const availableDrivers = await db.driver.findMany({
      where: {
        companyId,
        currentVehicleId: null,
        status: { not: "OFF_DUTY" },
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
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const foundVehicle = await db.vehicle.findUnique({
        where: { id: vehicleId },
        select: { companyId: true },
      });

      if (!foundVehicle || foundVehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      const doc = await db.document.create({
        data: {
          vehicleId,
          companyId,
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
      status?: IssueStatus;
      priority?: IssuePriority;
      description?: string;
    }
  ) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundIssue = await db.issue.findUnique({
        where: { id: issueId },
        select: { companyId: true },
      });

      if (!foundIssue || foundIssue.companyId !== companyId) {
        throw new Error("Issue not found or unauthorized");
      }

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

export const updateMaintenanceRecord = authenticatedAction(
  async (
    user,
    recordId: string,
    data: {
      type?: string;
      date?: Date;
      cost?: number;
      status?: MaintenanceStatus;
      description?: string;
    }
  ) => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundRecord = await db.maintenanceRecord.findUnique({
        where: { id: recordId },
        include: { vehicle: { select: { companyId: true } } },
      });

      if (!foundRecord || foundRecord.vehicle.companyId !== companyId) {
        throw new Error("Record not found or unauthorized");
      }

      const updatedRecord = await db.maintenanceRecord.update({
        where: { id: recordId },
        data,
      });

      return updatedRecord;
    } catch (error) {
      console.error("Failed to update maintenance record:", error);
      throw error;
    }
  }
);


