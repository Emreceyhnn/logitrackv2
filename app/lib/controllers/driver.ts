"use server";

import { db } from "../db";
import { DriverStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "../auth-middleware";
import {
  CreateDriverFormData,
  DriverWithRelations,
  PaginatedResponse,
} from "../type/driver";

// ... imports ...

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
    try {
      const skip = (page - 1) * limit;

      const where: Prisma.DriverWhereInput = {
        companyId: user.companyId,
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
            _count: {
              select: {
                shipments: true,
                issues: true,
              },
            },
          },
          orderBy: orderBy,
          skip,
          take: limit,
        }),
        db.driver.count({ where }),
      ]);

      return {
        data: drivers,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: unknown) {
      console.error("Failed to get drivers:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to get drivers"
      );
    }
  }
);

export const getDriverDashboardData = authenticatedAction(async (user) => {
  try {
    const [totalDrivers, onDuty, offDuty, onLeave, safetyScoreAgg, topDrivers] =
      await Promise.all([
        db.driver.count({ where: { companyId: user.companyId } }),
        db.driver.count({
          where: { companyId: user.companyId, status: "ON_JOB" },
        }),
        db.driver.count({
          where: { companyId: user.companyId, status: "OFF_DUTY" },
        }),
        db.driver.count({
          where: { companyId: user.companyId, status: "ON_LEAVE" },
        }),
        db.driver.aggregate({
          where: { companyId: user.companyId },
          _avg: { safetyScore: true, efficiencyScore: true },
        }),
        db.driver.findMany({
          where: { companyId: user.companyId },
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

    // Actual compliance calculations (expired licenses or low safety score)
    const complianceIssuesCount = await db.driver.count({
      where: {
        companyId: user.companyId,
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
        // Deterministic working hours based on shipments instead of Math.random to avoid hydration mismatch and flickering
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
  } catch (error: unknown) {
    console.error("Failed to get driver dashboard data:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get driver dashboard data"
    );
  }
});

export async function getDriverById(driverId: string) {
  try {
    const driver = await db.driver.findUnique({
      where: { id: driverId },
      include: {
        user: true,
        currentVehicle: true,
        company: true,
        homeBaseWarehouse: true,
        shipments: true,
      },
    });

    if (!driver) {
      throw new Error("Driver not found");
    }

    return driver;
  } catch (error: unknown) {
    console.error("Failed to get driver:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get driver"
    );
  }
}

export const createDriver = authenticatedAction(
  async (user, data: CreateDriverFormData) => {
    try {
      const targetUser = await db.user.findUnique({
        where: { id: data.userId },
        include: { driver: true },
      });

      if (!targetUser) {
        throw new Error("User not found");
      }

      if (targetUser.companyId !== user.companyId) {
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
        await tx.driver.create({
          data: {
            companyId: user.companyId,
            userId: data.userId,
            phone: data.phone,
            employeeId: data.employeeId,
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
                        companyId: user.companyId,
                        status: "ACTIVE",
                      },
                    ]
                  : []),
                ...(data.documents?.map((doc) => ({
                  type: doc.type,
                  name: doc.name,
                  url: doc.url,
                  expiryDate: doc.expiryDate,
                  companyId: user.companyId,
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
    } catch (error: unknown) {
      console.error("Failed to create driver:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create driver"
      );
    }
  }
);

export const updateDriver = authenticatedAction(
  async (user, driverId: string, data: Partial<CreateDriverFormData>) => {
    try {
      const driver = await db.driver.findUnique({
        where: { id: driverId },
      });

      if (!driver) throw new Error("Driver not found");
      if (driver.companyId !== user.companyId) throw new Error("Unauthorized");

      if (data.currentVehicleId) {
        const vehicle = await db.vehicle.findUnique({
          where: { id: data.currentVehicleId },
          include: { driver: true },
        });
        if (!vehicle) {
          throw new Error("Selected vehicle not found");
        }
        if (vehicle.driver && vehicle.driver.userId !== driver.userId) {
          throw new Error("Vehicle is already assigned to another driver");
        }
      }

      const updatedDriver = await db.driver.update({
        where: { id: driverId },
        data: {
          phone: data.phone,
          employeeId: data.employeeId,
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
                      companyId: user.companyId,
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
                    companyId: user.companyId,
                    status: "ACTIVE",
                  })),
                },
              }
            : {}),
        },
      });

      // If document updates happen, they are just added to the driver for now without deleting old ones.
      // Might need a more complex sync if deleting is required.

      revalidatePath("/drivers");
      return updatedDriver;
    } catch (error: unknown) {
      console.error("Failed to update driver:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update driver"
      );
    }
  }
);

export const deleteDriver = authenticatedAction(
  async (user, driverId: string) => {
    try {
      // 1. Fetch driver to check existence and get userId
      const driver = await db.driver.findUnique({
        where: { id: driverId },
        select: { userId: true, companyId: true },
      });

      if (!driver) {
        throw new Error("Driver not found");
      }

      // Security check: ensure driver belongs to user's company
      if (driver.companyId !== user.companyId) {
        throw new Error("Unauthorized to delete this driver");
      }

      await db.$transaction(async (tx) => {
        const defaultRole = await tx.role.findFirst({
          where: { name: "DEFAULT" },
        });

        await tx.driver.delete({
          where: { id: driverId },
        });

        if (defaultRole) {
          await tx.user.update({
            where: { id: driver.userId },
            data: { roleId: defaultRole.id },
          });
        } else {
          // Fallback: If no default role found, maybe just leave them?
          // Or set to null if logic permits.
          // Let's set to null to be safe (they lose permissions but exist).
          await tx.user.update({
            where: { id: driver.userId },
            data: { roleId: null },
          });
        }
      });

      revalidatePath("/drivers");
      return { success: true };
    } catch (error: unknown) {
      console.error("Failed to delete driver:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete driver"
      );
    }
  }
);

export async function updateDriverStatus(
  driverId: string,
  status: DriverStatus
) {
  try {
    const updatedDriver = await db.driver.update({
      where: { id: driverId },
      data: { status },
    });
    return updatedDriver;
  } catch (error: unknown) {
    console.error("Failed to update driver status:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update driver status"
    );
  }
}

export async function assignVehicleToDriver(
  driverId: string,
  vehicleId: string
) {
  try {
    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
      include: { driver: true },
    });

    if (!vehicle) {
      throw new Error("Vehicle not found");
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
  } catch (error: unknown) {
    console.error("Failed to assign vehicle to driver:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to assign vehicle to driver"
    );
  }
}

export async function unassignVehicleFromDriver(driverId: string) {
  try {
    const updatedDriver = await db.driver.update({
      where: { id: driverId },
      data: {
        currentVehicleId: null,
      },
    });

    return updatedDriver;
  } catch (error: unknown) {
    console.error("Failed to unassign vehicle from driver:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to unassign vehicle from driver"
    );
  }
}

export const getEligibleUsersForDriver = authenticatedAction(async (user) => {
  try {
    const users = await db.user.findMany({
      where: {
        companyId: user.companyId,
        roleId: "role_default",
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
      },
    });

    return users;
  } catch (error: unknown) {
    console.error("Failed to fetch eligible users:", error);
    return [];
  }
});
