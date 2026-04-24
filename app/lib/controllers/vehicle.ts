"use server";

import { db } from "../db";
import {
  Issue,
  MaintenanceStatus,
  Prisma,
  VehicleStatus,
  VehicleType,
  IssueStatus,
  IssuePriority,
  IssueType,
} from "@prisma/client";
import { checkPermission } from "./utils/checkPermission";
import { authenticatedAction } from "../auth-middleware";
import {
  VehicleCapacityConverter,
  VehicleDocumentConverter,
  VehicleKpiConverter,
  VehicleServiceConverter,
} from "./utils/vehicleUtils";
import {
  VehicleFilters,
  VehicleWithRelations,
  VehicleDashboardProps,
} from "../type/vehicle";
import {
  redis,
  withCache,
  invalidatePattern,
  hashFilters,
  vehicleCacheKeys,
  VEHICLE_CACHE_TTL,
} from "../redis";
import { syncVehicleToFirebase } from "../vehicleTracking";

// ── Cache invalidation helper ─────────────────────────────────────────────────
async function invalidateVehicleCache(
  companyId: string,
  vehicleId?: string
): Promise<void> {
  await Promise.all([
    // Wipe all dashboard + kpi keys for this company
    invalidatePattern(vehicleCacheKeys.companyPattern(companyId)),
    // Wipe the specific vehicle detail key (if applicable)
    vehicleId ? redis.del(vehicleCacheKeys.detail(vehicleId)) : Promise.resolve(),
  ]);
}

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

      const vehicleFleetNo =
        fleetNo?.toString() ||
        `FLEET-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const existingVehicle = await db.vehicle.findFirst({
        where: {
          OR: [{ plate: plate.toString() }, { fleetNo: vehicleFleetNo }],
        },
      });

      if (existingVehicle) {
        const conflictField =
          existingVehicle.plate === plate.toString() ? "Plate" : "Fleet Number";
        throw new Error(`${conflictField} already exists in the system.`);
      }

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


      await invalidateVehicleCache(companyId);
      // Sync to Firebase (background)
      syncVehicleToFirebase(newVehicle).catch(err => console.error("Firebase sync failed:", err));
      
      return newVehicle;
    } catch (error) {
      console.error("Failed to create vehicle:", error);
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

      // Check for conflicts if plate or fleetNo are being updated
      if (updateData.plate || updateData.fleetNo) {
        const conflictCheck = await db.vehicle.findFirst({
          where: {
            OR: [
              updateData.plate
                ? { plate: updateData.plate as string }
                : undefined,
              updateData.fleetNo
                ? { fleetNo: updateData.fleetNo as string }
                : undefined,
            ].filter(
              (
                condition
              ): condition is { plate: string } | { fleetNo: string } =>
                condition !== undefined
            ),
            NOT: { id: vehicleId },
          },
        });

        if (conflictCheck) {
          const conflictField =
            conflictCheck.plate === updateData.plate ? "Plate" : "Fleet Number";
          throw new Error(
            `${conflictField} already exists in another vehicle.`
          );
        }
      }

      const updatedVehicle = await db.vehicle.update({
        where: { id: vehicleId },
        data: updateData,
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

      await invalidateVehicleCache(companyId, vehicleId);
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

      await invalidateVehicleCache(companyId, vehicleId);
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

      await invalidateVehicleCache(companyId, vehicleId);
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
        data: { status: status as VehicleStatus },
      });

      await invalidateVehicleCache(companyId, vehicleId);
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
    recordData: {
      type: string;
      date: Date;
      cost: number;
      currency?: string;
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

      await invalidateVehicleCache(companyId, vehicleId);
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

      await invalidateVehicleCache(companyId, vehicleId);
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

      await invalidateVehicleCache(companyId, vehicleId);
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
        select: { companyId: true, vehicleId: true },
      });

      if (!foundIssue || foundIssue.companyId !== companyId) {
        throw new Error("Issue not found or unauthorized");
      }

      const updatedIssue = await db.issue.update({
        where: { id: issueId },
        data,
      });

      await invalidateVehicleCache(companyId, foundIssue.vehicleId ?? undefined);
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
      currency?: string;
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
        include: { vehicle: { select: { companyId: true, id: true } } },
      });

      if (!foundRecord || foundRecord.vehicle.companyId !== companyId) {
        throw new Error("Record not found or unauthorized");
      }

      const updatedRecord = await db.maintenanceRecord.update({
        where: { id: recordId },
        data,
      });

      await invalidateVehicleCache(companyId, foundRecord.vehicle.id);
      return updatedRecord;
    } catch (error) {
      console.error("Failed to update maintenance record:", error);
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

      const whereClause: Prisma.VehicleWhereInput = { companyId };

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

    const cacheKey = vehicleCacheKeys.kpis(companyId);

    return await withCache(cacheKey, VEHICLE_CACHE_TTL, async () => {
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
          maintenanceRecords: {
            where: {
              status: { in: ["SCHEDULED"] },
            },
            select: {
              type: true,
              date: true,
              status: true,
            },
          },
        },
      });

      const vehiclesKpis = VehicleKpiConverter(
        vehicles as unknown as VehicleDashboardProps[]
      );
      const vehiclesCapacity = VehicleCapacityConverter(
        vehicles as unknown as VehicleDashboardProps[]
      );
      const expiringDocs = VehicleDocumentConverter(
        vehicles as unknown as VehicleDashboardProps[]
      );
      const plannedServices = VehicleServiceConverter(
        vehicles as unknown as VehicleDashboardProps[]
      );

      return { vehiclesKpis, vehiclesCapacity, expiringDocs, plannedServices };
    });
  } catch (error) {
    console.error("Failed to get vehicle kpi cards:", error);
    throw error;
  }
});

export const getVehiclesWithDashboard = authenticatedAction(
  async (
    user,
    filters?: VehicleFilters
  ): Promise<{
    vehicles: VehicleWithRelations[];
    vehiclesKpis: ReturnType<typeof VehicleKpiConverter>;
    vehiclesCapacity: ReturnType<typeof VehicleCapacityConverter>;
    expiringDocs: ReturnType<typeof VehicleDocumentConverter>;
    plannedServices: ReturnType<typeof VehicleServiceConverter>;
  }> => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";

    try {
      if (!companyId) throw new Error("User has no company");

      const cacheKey = vehicleCacheKeys.dashboard(
        companyId,
        hashFilters(filters as Record<string, unknown>)
      );

      return await withCache(cacheKey, VEHICLE_CACHE_TTL, async () => {
      const whereClause: Prisma.VehicleWhereInput = { companyId };

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

      // ── Promise.all: checkPermission + findMany paralel ─────────────────────
      // Her iki DB çağrısı aynı anda başlar; checkPermission (~200ms) findMany
      // (~400-800ms) beklenirken eş zamanlı tamamlanır → toplam süre max() olur.
      // checkPermission başarısız olursa Promise.all hemen reject eder.
      const [, vehicles] = await Promise.all([
        checkPermission(userId, companyId, [
          "role_admin",
          "role_manager",
          "role_dispatcher",
        ]),
        db.vehicle.findMany({
          where: whereClause,
          select: {
            // ── Scalars (VehicleWithRelations) ──────────────────────────────
            id: true,
            fleetNo: true,
            plate: true,
            brand: true,
            model: true,
            year: true,
            type: true,
            fuelType: true,
            maxLoadKg: true,
            nextServiceKm: true,
            avgFuelConsumption: true,
            status: true,
            odometerKm: true,
            fuelLevel: true,
            currentLat: true,
            currentLng: true,
            photo: true,
            createdAt: true,
            updatedAt: true,

            // ── Driver ──────────────────────────────────────────────────────
            driver: {
              select: {
                id: true,
                rating: true,
                user: {
                  select: { name: true, surname: true, avatarUrl: true },
                },
              },
            },

            // ── Issues ──────────────────────────────────────────────────────
            issues: {
              select: {
                id: true,
                title: true,
                type: true,
                priority: true,
                status: true,
                description: true,
                vehicleId: true,
                companyId: true,
                createdAt: true,
                updatedAt: true,
              },
            },

            // ── Documents ───────────────────────────────────────────────────
            documents: {
              select: {
                id: true,
                type: true,
                name: true,
                url: true,
                expiryDate: true,
                status: true,
                vehicleId: true,
                companyId: true,
                createdAt: true,
              },
            },

            // ── Maintenance records ──────────────────────────────────────────
            maintenanceRecords: {
              select: {
                id: true,
                type: true,
                date: true,
                cost: true,
                status: true,
                description: true,
                vehicleId: true,
                createdAt: true,
                updatedAt: true,
              },
            },

            // ── Routes ──────────────────────────────────────────────────────
            routes: {
              select: {
                id: true,
                status: true,
                startAddress: true,
                startLat: true,
                startLng: true,
                endAddress: true,
                endLat: true,
                endLng: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      const dashboardInput = vehicles as unknown as VehicleDashboardProps[];

        return {
          vehicles: vehicles as unknown as VehicleWithRelations[],
          vehiclesKpis: VehicleKpiConverter(dashboardInput),
          vehiclesCapacity: VehicleCapacityConverter(dashboardInput),
          expiringDocs: VehicleDocumentConverter(dashboardInput),
          plannedServices: VehicleServiceConverter(dashboardInput),
        };
      }); // end withCache
    } catch (error) {
      console.error("Failed to get vehicles with dashboard data:", error);
      throw error;
    }
  }
);
