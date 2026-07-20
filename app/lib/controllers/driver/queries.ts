"use server";

import { db } from "../../db";
import { checkPermission } from "../utils/checkPermission";
import { DriverStatus, Prisma } from "@prisma/client";
import { authenticatedAction } from "../../auth-middleware";
import {
  DriverHistory,
  DriverActivity,
  DriverWithRelations,
  PaginatedResponse,
} from "../../type/driver";
import { controllerGuard } from "../utils/controllerGuard";
import { NotFoundError } from "../../errors";
import { driverCache } from "./shared";

export const getEligibleUsersForDriver = authenticatedAction(async (user) => {
  return controllerGuard("getEligibleUsersForDriver", async () => {
    const companyId = user?.companyId || "";
    await checkPermission(user, companyId, [
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
  });
});

export const getDriverHistory = authenticatedAction(
  async (user, driverId: string): Promise<DriverHistory> => {
    return controllerGuard("getDriverHistory", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const driver = await db.driver.findFirst({
        where: { id: driverId, companyId },
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
            include: { stops: { orderBy: { sequence: "asc" } } },
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

      if (!driver) {
        throw new NotFoundError("Driver");
      }

      const activities: DriverActivity[] = [];

      // Add completed routes
      driver.routes.forEach((route) => {
        const stopsArr = route.stops;
        const startAddr = stopsArr.length > 0 ? stopsArr[0]?.address : null;
        const endAddr = stopsArr.length > 0 ? stopsArr[stopsArr.length - 1]?.address : null;
        activities.push({
          id: route.id,
          type: "ROUTE_COMPLETED",
          title: "Route Completed",
          description: `Finished route ${route.name || route.id} from ${startAddr || "Start"} to ${endAddr || "End"}`,
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
    });
  }
);

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
    return controllerGuard("getDrivers", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId, [
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

      return await driverCache.cached(
        companyId,
        driverCache.hashFilters({ page, limit, search, status, hasVehicle, sortField, sortOrder }),
        async () => {
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

        const typedDrivers: DriverWithRelations[] = drivers;

        return {
          data: typedDrivers,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };
        }
      );
    });
  }
);
