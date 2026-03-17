"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";
import { DriverStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "../auth-middleware";
import {
  CreateDriverFormData,
  DriverHistory,
  DriverActivity,
  DriverWithRelations,
  PaginatedResponse,
} from "../type/driver";

export const getDrivers = authenticatedAction(
  async (
    user,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: DriverStatus[],
    hasVehicle?: boolean,
    sortField?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<PaginatedResponse<DriverWithRelations>> => {
    const userId = user?.id || "";
    const companyId = user?.companyId || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const skip = (page - 1) * limit;

      const where: Prisma.DriverWhereInput = {
        companyId,
      };

      if (search) {
        where.OR = [
          {
            user: {
              name: { contains: search, mode: "insensitive" },
            },
          },
          {
            user: {
              surname: { contains: search, mode: "insensitive" },
            },
          },
          {
            licenseNumber: { contains: search, mode: "insensitive" },
          },
          {
            phone: { contains: search, mode: "insensitive" },
          },
        ];
      }

      if (status && status.length > 0) {
        where.status = { in: status };
      }

      if (hasVehicle !== undefined) {
        if (hasVehicle) {
          where.currentVehicleId = { not: null };
        } else {
          where.currentVehicleId = null;
        }
      }

      let orderBy: Prisma.DriverOrderByWithRelationInput = {
        createdAt: "desc",
      };
      if (sortField && sortOrder) {
        if (sortField === "name") {
          orderBy = { user: { name: sortOrder } };
        } else if (sortField === "vehicle") {
          orderBy = { currentVehicle: { plate: sortOrder } };
        } else {
          orderBy = {
            [sortField]: sortOrder,
          } as Prisma.DriverOrderByWithRelationInput;
        }
      }

      const [drivers, total] = await Promise.all([
        db.driver.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                avatarUrl: true,
                roleId: true,
              },
            },
            currentVehicle: {
              select: {
                id: true,
                plate: true,
                brand: true,
                model: true,
              },
            },
            homeBaseWarehouse: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            _count: {
              select: {
                shipments: true,
                issues: true,
              },
            },
            documents: true,
          },
          orderBy: orderBy,
          skip,
          take: limit,
        }),
        db.driver.count({ where }),
      ]);

      return {
        data: drivers as unknown as DriverWithRelations[],
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Failed to get drivers:", error);
      throw error;
    }
  }
);

export const getDriverDashboardData = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";
  const userId = user?.id || "";
  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const [totalDrivers, onDuty, offDuty, onLeave, safetyScoreAgg, topDrivers] =
      await Promise.all([
        db.driver.count({ where: { companyId } }),
        db.driver.count({
          where: { companyId, status: "ON_JOB" },
        }),
        db.driver.count({
          where: { companyId, status: "OFF_DUTY" },
        }),
        db.driver.count({
          where: { companyId, status: "ON_LEAVE" },
        }),
        db.driver.aggregate({
          where: { companyId },
          _avg: { safetyScore: true, efficiencyScore: true },
        }),
        db.driver.findMany({
          where: { companyId },
          select: {
            id: true,
            user: { select: { name: true, surname: true } },
            rating: true,
            _count: { select: { shipments: true } },
          },
          orderBy: { rating: "desc" },
          take: 5,
        }),
      ]);

    const complianceIssuesCount = await db.driver.count({
      where: {
        companyId,
        OR: [
          { licenseExpiry: { lt: new Date() } },
          { safetyScore: { lt: 75 } },
        ],
      },
    });

    return {
      driversKpis: {
        totalDrivers,
        onDuty,
        offDuty,
        onLeave,
        complianceIssues: complianceIssuesCount,
        avgSafetyScore: safetyScoreAgg._avg.safetyScore || 0,
        avgEfficiencyScore: safetyScoreAgg._avg.efficiencyScore || 0,
      },
      topPerformers: topDrivers.map((d) => ({
        id: d.id,
        name: d.user.name,
        surname: d.user.surname,
        rating: d.rating || 0,
        tripsCompleted: d._count.shipments,
      })),
      performanceCharts: topDrivers.map((d) => ({
        name: d.user.name,
        rating: d.rating || 0,
        workingHours: d._count.shipments * 5 + 30,
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        values: [
          d._count.shipments,
          d._count.shipments + 1,
          Math.max(0, d._count.shipments - 1),
          d._count.shipments + 2,
          d._count.shipments,
        ],
      })),
    };
  } catch (error) {
    console.error("Failed to get driver dashboard data:", error);
    throw error;
  }
});

export const getDriverById = authenticatedAction(
  async (user, driverId: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundDriver = await db.driver.findUnique({
        where: { id: driverId },
        include: {
          user: true,
          currentVehicle: true,
          company: true,
          homeBaseWarehouse: true,
          shipments: true,
          documents: true,
        },
      });

      if (!foundDriver) {
        throw new Error("Driver not found");
      }

      if (foundDriver.companyId !== companyId) {
        throw new Error("Unauthorized");
      }

      return foundDriver;
    } catch (error) {
      console.error("Failed to get driver:", error);
      throw error;
    }
  }
);

export const createDriver = authenticatedAction(
  async (user, data: CreateDriverFormData) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const targetUser = await db.user.findUnique({
        where: { id: data.userId },
        include: { driver: true },
      });

      if (!targetUser) {
        throw new Error("User not found");
      }

      if (targetUser.companyId !== companyId) {
        throw new Error("User does not belong to your company");
      }

      if (targetUser.driver) {
        throw new Error("User is already assigned as a driver");
      }

      if (data.employeeId) {
        const existingEmployee = await db.driver.findUnique({
          where: { employeeId: data.employeeId },
        });
        if (existingEmployee) {
          throw new Error("A driver with this Employee ID already exists");
        }
      }

      if (data.currentVehicleId) {
        const vehicle = await db.vehicle.findUnique({
          where: { id: data.currentVehicleId },
          include: { driver: true },
        });
        if (!vehicle) {
          throw new Error("Selected vehicle not found");
        }
        if (vehicle.driver && vehicle.driver.userId !== data.userId) {
          throw new Error("Vehicle is already assigned to another driver");
        }
      }

      await db.$transaction(async (tx) => {
        const finalEmployeeId = data.employeeId && data.employeeId.trim() !== "" 
          ? data.employeeId 
          : `EMP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        await tx.driver.create({
          data: {
            companyId: user.companyId!,
            userId: data.userId,
            phone: data.phone,
            employeeId: finalEmployeeId,
            licenseNumber: data.licenseNumber,
            licenseType: data.licenseType,
            licenseExpiry: data.licenseExpiry,
            status: data.status,
            currentVehicleId: data.currentVehicleId,
            homeBaseWarehouseId: data.homeBaseWarehouseId,
            languages: data.languages ?? [],
            hazmatCertified: data.hazmatCertified ?? false,
            safetyScore: 100,
            efficiencyScore: 100,
            rating: 5.0,
            documents: {
              create: [
                ...(data.licensePhotoUrl
                  ? [
                      {
                        type: "LICENSE",
                        name: "License Scan",
                        url: data.licensePhotoUrl,
                        companyId,
                        status: "ACTIVE",
                      },
                    ]
                  : []),
                ...(data.documents?.map((doc) => ({
                  type: doc.type,
                  name: doc.name,
                  url: doc.url,
                  expiryDate: doc.expiryDate,
                  companyId: user.companyId!,
                  status: "ACTIVE",
                })) ?? []),
              ],
            },
          },
        });

        await tx.user.update({
          where: { id: data.userId },
          data: { roleId: "role_driver" },
        });
      });

      revalidatePath("/drivers");
      return { success: true };
    } catch (error) {
      console.error("Failed to create driver:", error);
      throw error;
    }
  }
);

export const updateDriver = authenticatedAction(
  async (user, driverId: string, data: Partial<CreateDriverFormData>) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const foundDriver = await db.driver.findUnique({
        where: { id: driverId },
      });

      if (!foundDriver) throw new Error("Driver not found");
      if (foundDriver.companyId !== companyId) throw new Error("Unauthorized");

      if (data.currentVehicleId) {
        const vehicle = await db.vehicle.findUnique({
          where: { id: data.currentVehicleId },
          include: { driver: true },
        });
        if (!vehicle) {
          throw new Error("Selected vehicle not found");
        }
        if (vehicle.driver && vehicle.driver.userId !== foundDriver.userId) {
          throw new Error("Vehicle is already assigned to another driver");
        }
      }

      const updatedDriver = await db.driver.update({
        where: { id: driverId },
        data: {
          phone: data.phone,
          employeeId: (data.employeeId && data.employeeId.trim() !== "") 
            ? data.employeeId 
            : (data.employeeId === "" ? `EMP-${Math.random().toString(36).substring(2, 7).toUpperCase()}` : foundDriver.employeeId),
          licenseNumber: data.licenseNumber,
          licenseType: data.licenseType,
          licenseExpiry: data.licenseExpiry,
          status: data.status,
          ...(data.currentVehicleId !== undefined
            ? { currentVehicleId: data.currentVehicleId }
            : {}),
          ...(data.homeBaseWarehouseId !== undefined
            ? { homeBaseWarehouseId: data.homeBaseWarehouseId }
            : {}),
          ...(data.languages !== undefined
            ? { languages: data.languages }
            : {}),
          ...(data.hazmatCertified !== undefined
            ? { hazmatCertified: data.hazmatCertified }
            : {}),
          ...(data.licensePhotoUrl
            ? {
                documents: {
                  create: [
                    {
                      type: "LICENSE",
                      name: "License Scan",
                      url: data.licensePhotoUrl,
                      companyId: user.companyId!,
                      status: "ACTIVE",
                    },
                  ],
                },
              }
            : {}),
          ...(data.documents && data.documents.length > 0
            ? {
                documents: {
                  create: data.documents.map((doc) => ({
                    type: doc.type,
                    name: doc.name,
                    url: doc.url,
                    expiryDate: doc.expiryDate,
                    companyId: user.companyId!,
                    status: "ACTIVE",
                  })),
                },
              }
            : {}),
        },
      });

      revalidatePath("/drivers");
      return updatedDriver;
    } catch (error) {
      console.error("Failed to update driver:", error);
      throw error;
    }
  }
);

export const deleteDriver = authenticatedAction(
  async (user, driverId: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const foundDriver = await db.driver.findUnique({
        where: { id: driverId },
        select: { userId: true, companyId: true },
      });

      if (!foundDriver) {
        throw new Error("Driver not found");
      }

      if (foundDriver.companyId !== companyId) {
        throw new Error("Unauthorized to delete this driver");
      }

      await db.$transaction(async (tx) => {
        const defaultRole = await tx.role.findFirst({
          where: { name: { contains: "DEFAULT", mode: "insensitive" } },
        });

        await tx.driver.delete({
          where: { id: driverId },
        });

        await tx.user.update({
          where: { id: foundDriver.userId },
          data: { roleId: defaultRole?.id ?? null },
        });
      });

      revalidatePath("/drivers");
      return { success: true };
    } catch (error) {
      console.error("Failed to delete driver:", error);
      throw error;
    }
  }
);

export const updateDriverStatus = authenticatedAction(
  async (user, driverId: string, status: DriverStatus) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundDriver = await db.driver.findUnique({
        where: { id: driverId },
        select: { companyId: true },
      });

      if (!foundDriver || foundDriver.companyId !== companyId) {
        throw new Error("Unauthorized");
      }

      const updatedDriver = await db.driver.update({
        where: { id: driverId },
        data: { status },
      });
      return updatedDriver;
    } catch (error) {
      console.error("Failed to update driver status:", error);
      throw error;
    }
  }
);

export const assignVehicleToDriver = authenticatedAction(
  async (user, driverId: string, vehicleId: string) => {
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
        include: { driver: true },
      });

      if (!vehicle || vehicle.companyId !== companyId) {
        throw new Error("Vehicle not found or unauthorized");
      }

      if (vehicle.driver && vehicle.driver.id !== driverId) {
        throw new Error("Vehicle is already assigned to another driver");
      }

      const updatedDriver = await db.driver.update({
        where: { id: driverId },
        data: {
          currentVehicleId: vehicleId,
        },
      });

      return updatedDriver;
    } catch (error) {
      console.error("Failed to assign vehicle to driver:", error);
      throw error;
    }
  }
);

export const unassignVehicleFromDriver = authenticatedAction(
  async (user, driverId: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const foundDriver = await db.driver.findUnique({
        where: { id: driverId },
        select: { companyId: true },
      });

      if (!foundDriver || foundDriver.companyId !== companyId) {
        throw new Error("Unauthorized");
      }

      const updatedDriver = await db.driver.update({
        where: { id: driverId },
        data: {
          currentVehicleId: null,
        },
      });

      return updatedDriver;
    } catch (error) {
      console.error("Failed to unassign vehicle from driver:", error);
      throw error;
    }
  }
);

export const getEligibleUsersForDriver = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";
  const userId = user?.id || "";
  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const users = await db.user.findMany({
      where: {
        companyId,
        roleId: { contains: "default", mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
      },
    });

    return users;
  } catch (error) {
    console.error("Failed to fetch eligible users:", error);
    return [];
  }
});
export const getDriverHistory = authenticatedAction(
  async (user, driverId: string): Promise<DriverHistory> => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";

    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const driver = await db.driver.findUnique({
        where: { id: driverId },
        include: {
          user: {
            include: {
              auditLogs: {
                where: {
                  action: { in: ["LOGIN", "LOGOUT"] },
                },
                orderBy: { createdAt: "desc" },
                take: 50,
              },
            },
          },
          routes: {
            where: { status: "COMPLETED" },
            orderBy: { endTime: "desc" },
            take: 20,
          },
          shipments: {
            where: { status: "DELIVERED" },
            orderBy: { updatedAt: "desc" },
            take: 20,
          },
          documents: {
            where: { status: "ACTIVE" },
          },
        },
      });

      if (!driver) throw new Error("Driver not found");

      const activities: DriverActivity[] = [];

      // Add shift logs
      driver.user.auditLogs.forEach((log) => {
        activities.push({
          id: log.id,
          type: log.action === "LOGIN" ? "SHIFT_START" : "SHIFT_END",
          title: log.action === "LOGIN" ? "Shift Started" : "Shift Ended",
          description: `Daily shift ${log.action === "LOGIN" ? "started" : "finished"} at ${log.createdAt.toLocaleTimeString()}`,
          timestamp: log.createdAt,
        });
      });

      // Add completed routes
      driver.routes.forEach((route) => {
        activities.push({
          id: route.id,
          type: "ROUTE_COMPLETED",
          title: "Route Completed",
          description: `Finished route ${route.name || route.id} from ${route.startAddress || 'Start'} to ${route.endAddress || 'End'}`,
          timestamp: route.endTime || route.updatedAt,
          metadata: { routeId: route.id },
        });
      });

      // Add job completions (shipments)
      driver.shipments.forEach((shipment) => {
        activities.push({
          id: shipment.id,
          type: "JOB_COMPLETED",
          title: "Job Delivered",
          description: `Successfully delivered shipment ${shipment.trackingId} to ${shipment.destination}`,
          timestamp: shipment.updatedAt,
          metadata: { shipmentId: shipment.id },
        });
      });

      // Sort activities by timestamp descending
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return {
        activities,
        completedRoutes: driver.routes.length,
        completedShipments: driver.shipments.length,
        activePermissions: driver.documents.length,
      };
    } catch (error) {
      console.error("Failed to get driver history:", error);
      throw error;
    }
  }
);
