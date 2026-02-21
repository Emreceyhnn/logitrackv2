"use server";

import { db } from "../db";
import { DriverStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "../auth-middleware";
import bcrypt from "bcryptjs";
import { CreateDriverFormData } from "../type/driver";

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
  ) => {
    try {
      const skip = (page - 1) * limit;

      const where: any = {
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

      let orderBy: any = { createdAt: "desc" };
      if (sortField && sortOrder) {
        if (sortField === "name") {
          orderBy = { user: { name: sortOrder } };
        } else if (sortField === "vehicle") {
          orderBy = { currentVehicle: { plate: sortOrder } };
        } else {
          orderBy = { [sortField]: sortOrder };
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
    } catch (error: any) {
      console.error("Failed to get drivers:", error);
      throw new Error(error.message || "Failed to get drivers");
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

    // Mock calculations for now
    const complianceIssues = 0;

    return {
      driversKpis: {
        totalDrivers,
        onDuty,
        offDuty,
        onLeave,
        complianceIssues,
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
        workingHours: Math.floor(Math.random() * 20) + 30, // Mock working hours
        days: [0, 0, 0, 0, 0], // Placeholder
        values: [0, 0, 0, 0, 0], // Placeholder
      })),
    };
  } catch (error: any) {
    console.error("Failed to get driver dashboard data:", error);
    throw new Error(error.message || "Failed to get driver dashboard data");
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
  } catch (error: any) {
    console.error("Failed to get driver:", error);
    throw new Error(error.message || "Failed to get driver");
  }
}

export const createDriver = authenticatedAction(
  async (user, data: CreateDriverFormData) => {
    try {
      // 1. Check if user exists and is eligible
      const targetUser = await db.user.findUnique({
        where: { id: data.userId },
        include: { driver: true }, // Check if already a driver
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

      // 2. Find DRIVER role to assign (optional but recommended)
      // Assuming we want to give them specific permissions
      // For now, let's skip role update or assume role management is separate
      // But typically we'd update user.roleId here.

      // 3. Create Driver Profile
      const newDriver = await db.driver.create({
        data: {
          companyId: user.companyId,
          userId: data.userId,
          phone: data.phone,
          employeeId: data.employeeId,
          licenseNumber: data.licenseNumber,
          licenseType: data.licenseType, // Assuming string in DB based on earlier types
          licenseExpiry: data.licenseExpiry,
          status: data.status,
          // Initialize scores
          safetyScore: 100,
          efficiencyScore: 100,
          rating: 5.0,
        },
      });

      // 4. Update User Role (optional, if we have a 'DRIVER' role)
      // const driverRole = await db.role.findFirst({ where: { name: 'DRIVER' } });
      // if (driverRole) { ... }

      revalidatePath("/drivers");
      return newDriver;
    } catch (error: any) {
      console.error("Failed to create driver:", error);
      throw new Error(error.message || "Failed to create driver");
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

      const updatedDriver = await db.driver.update({
        where: { id: driverId },
        data: {
          phone: data.phone,
          employeeId: data.employeeId,
          licenseNumber: data.licenseNumber,
          licenseType: data.licenseType,
          licenseExpiry: data.licenseExpiry,
          status: data.status,
        },
      });

      revalidatePath("/drivers");
      return updatedDriver;
    } catch (error: any) {
      console.error("Failed to update driver:", error);
      throw new Error(error.message || "Failed to update driver");
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

      // 2. Transaction: Delete Driver Profile AND Update User Role
      await db.$transaction(async (tx) => {
        // Find default role to revert to (or just set to null/DEFAULT)
        // Assuming 'DEFAULT' or 'USER' role exists, or just nullify if nullable.
        // Schema says roleId is string?. For now, try to find a basic role or keep undefined (null).
        // If we want to strictly 'demote', we should probably find the 'USER' or 'STAFF' role.
        // Let's assume we just want to remove the DRIVER role.
        // Ideally we should know what the 'default' role is.
        // For safety, let's try to find a role named 'user' or just nullify it if that's allowed logic.
        // Based on schema `Role` model exists.

        const defaultRole = await tx.role.findFirst({
          where: { name: "DEFAULT" },
        }); // Or 'USER'

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
    } catch (error: any) {
      console.error("Failed to delete driver:", error);
      throw new Error(error.message || "Failed to delete driver");
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
  } catch (error: any) {
    console.error("Failed to update driver status:", error);
    throw new Error(error.message || "Failed to update driver status");
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
  } catch (error: any) {
    console.error("Failed to assign vehicle to driver:", error);
    throw new Error(error.message || "Failed to assign vehicle to driver");
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
  } catch (error: any) {
    console.error("Failed to unassign vehicle from driver:", error);
    throw new Error(error.message || "Failed to unassign vehicle from driver");
  }
}

export const getEligibleUsersForDriver = authenticatedAction(async (user) => {
  try {
    const users = await db.user.findMany({
      where: {
        companyId: user.companyId,
        roleId: "role_unassigned",
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
      },
    });

    return users;
  } catch (error: any) {
    console.error("Failed to fetch eligible users:", error);
    return [];
  }
});
