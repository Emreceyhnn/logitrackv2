"use server";

import { type Prisma, RouteStatus } from "@prisma/client";
import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import {
  RouteWithRelations,
  RouteStats,
  RouteEfficiencyStats,
  MapRouteData,
} from "../type/routes";
import { invalidateShipmentCache } from "./shipments";
import {
  redis,
  withCache,
  invalidatePattern,
  hashFilters,
  routeCacheKeys,
  ROUTE_CACHE_TTL,
} from "../redis";

async function invalidateRouteCache(companyId: string, routeId?: string) {
  await Promise.all([
    invalidatePattern(routeCacheKeys.companyPattern(companyId)),
    routeId ? redis.del(routeCacheKeys.detail(routeId)) : Promise.resolve(),
  ]);
}
export const createRoute = authenticatedAction(
  async (
    user,
    name: string,
    date: Date,
    startTime: Date,
    endTime: Date,
    distanceKm: number,
    durationMin: number,
    driverId: string,
    vehicleId: string,
    origin?: {
      type: "WAREHOUSE" | "CUSTOMER" | "ADDRESS";
      id?: string;
      address?: string;
      lat?: number;
      lng?: number;
    },
    destination?: {
      type: "WAREHOUSE" | "CUSTOMER" | "ADDRESS";
      id?: string;
      address?: string;
      lat?: number;
      lng?: number;
    },
    shipmentId?: string
  ) => {
    try {
      await checkPermission(user.id, user.companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const finalName =
        name && name.trim() !== ""
          ? name
          : `ROUTE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const existingRoute = await db.route.findFirst({
        where: { name: finalName, companyId: user.companyId },
      });

      if (existingRoute && name && name.trim() !== "") {
        throw new Error("Route name already exists");
      }

      let startAddress = origin?.address;
      let startLat = origin?.lat;
      let startLng = origin?.lng;

      if (origin?.type === "WAREHOUSE" && origin.id) {
        const warehouse = await db.warehouse.findUnique({
          where: { id: origin.id },
        });
        if (warehouse) {
          startAddress = warehouse.address;
          startLat = warehouse.lat || undefined;
          startLng = warehouse.lng || undefined;
        }
      } else if (origin?.type === "CUSTOMER" && origin.id) {
        const customer = await db.customer.findUnique({
          where: { id: origin.id },
          include: { locations: true },
        });
        if (customer && customer.locations.length > 0) {
          const defaultLoc =
            customer.locations.find((l) => l.isDefault) ||
            customer.locations[0];
          startAddress = defaultLoc.address || undefined;
          startLat = defaultLoc.lat || undefined;
          startLng = defaultLoc.lng || undefined;
        }
      }

      let endAddress = destination?.address;
      let endLat = destination?.lat;
      let endLng = destination?.lng;

      if (destination?.type === "WAREHOUSE" && destination.id) {
        const warehouse = await db.warehouse.findUnique({
          where: { id: destination.id },
        });
        if (warehouse) {
          endAddress = warehouse.address;
          endLat = warehouse.lat || undefined;
          endLng = warehouse.lng || undefined;
        }
      } else if (destination?.type === "CUSTOMER" && destination.id) {
        const customer = await db.customer.findUnique({
          where: { id: destination.id },
          include: { locations: true },
        });
        if (customer && customer.locations.length > 0) {
          const defaultLoc =
            customer.locations.find((l) => l.isDefault) ||
            customer.locations[0];
          endAddress = defaultLoc.address || undefined;
          endLat = defaultLoc.lat || undefined;
          endLng = defaultLoc.lng || undefined;
        }
      }

      const newRoute = await db.$transaction(async (tx: any) => {
        // Create the route
        const route = await tx.route.create({
          data: {
            name: finalName,
            date,
            startTime,
            endTime,
            distanceKm,
            durationMin,
            driverId: driverId || null,
            vehicleId: vehicleId || null,
            companyId: user.companyId,
            startAddress,
            startLat,
            startLng,
            endAddress,
            endLat,
            endLng,
          },
        });

        // If driver and vehicle are both provided, assign driver to vehicle
        if (driverId && vehicleId) {
          await tx.driver.update({
            where: { id: driverId },
            data: { currentVehicleId: vehicleId },
          });
        }

        // If shipmentId is provided, connect it to the route and update status
        if (shipmentId) {
          await tx.shipment.update({
            where: { id: shipmentId },
            data: {
              routeId: route.id,
              status: "PLANNED",
              history: {
                create: {
                  status: "PLANNED",
                  description: `Assigned to route: ${finalName}`,
                  createdBy: user.id,
                },
              },
            },
          });
        }

        return route;
      });

      await Promise.all([
        invalidateRouteCache(user.companyId!),
        shipmentId ? invalidateShipmentCache(user.companyId!, shipmentId) : Promise.resolve(),
      ]);
      return { route: newRoute };
    } catch (error) {
      console.error("Failed to create route:", error);
      throw error;
    }
  }
);

export const getRoutes = authenticatedAction(
  async (user, page: number = 1, pageSize: number = 10, status?: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const skip = (page - 1) * pageSize;
      const where: Prisma.RouteWhereInput = {
        companyId,
      };

      if (status && status !== "ALL") {
        where.status = status as RouteStatus;
      }

      const cacheKey = routeCacheKeys.list(
        companyId!,
        hashFilters({ page, pageSize, status })
      );

      return await withCache(cacheKey, ROUTE_CACHE_TTL, async () => {
        const [routes, totalCount] = await Promise.all([
          db.route.findMany({
          where,
          include: {
            vehicle: {
              select: {
                id: true,
                plate: true,
                type: true,
                brand: true,
                model: true,
                currentLat: true,
                currentLng: true,
                fuelLevel: true,
              },
            },
            driver: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            shipments: {
              select: {
                id: true,
                status: true,
                origin: true,
                destination: true,
              },
            },
          },
          orderBy: { date: "desc" },
          skip,
          take: pageSize,
        }),
        db.route.count({ where }),
      ]);

      return { routes, totalCount };
      });
    } catch (error) {
      console.error("Failed to get routes:", error);
      throw error;
    }
  }
);

export const getRouteById = authenticatedAction(
  async (user, routeId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const route = await db.route.findUnique({
        where: { id: routeId, companyId },
        include: {
          driver: {
            include: {
              user: {
                select: { name: true, surname: true, avatarUrl: true },
              },
            },
          },
          vehicle: {
            include: {
              driver: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      surname: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!route) {
        throw new Error("Route not found or unauthorized");
      }

      return route;
    } catch (error) {
      console.error("Failed to get route:", error);
      throw error;
    }
  }
);

export const updateRoute = authenticatedAction(
  async (user, routeId: string, data: Prisma.RouteUpdateInput) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingRoute = await db.route.findUnique({
        where: { id: routeId, companyId },
      });

      if (!existingRoute) {
        throw new Error("Route not found or unauthorized");
      }

      const updateData = { ...data };
      if (updateData.name === "") {
        updateData.name = `ROUTE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      }

      const updatedRoute = await db.route.update({
        where: { id: routeId },
        data: updateData,
      });

      await invalidateRouteCache(companyId!, routeId);
      return updatedRoute;
    } catch (error) {
      console.error("Failed to update route:", error);
      throw error;
    }
  }
);

export const deleteRoute = authenticatedAction(
  async (user, routeId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingRoute = await db.route.findUnique({
        where: { id: routeId, companyId },
      });

      if (!existingRoute) {
        throw new Error("Route not found or unauthorized");
      }

      await db.route.delete({
        where: { id: routeId },
      });

      await invalidateRouteCache(companyId!, routeId);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete route:", error);
      throw error;
    }
  }
);

export const assignDriverToRoute = authenticatedAction(
  async (user, routeId: string, driverId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingRoute = await db.route.findUnique({
        where: { id: routeId, companyId },
      });

      if (!existingRoute) {
        throw new Error("Route not found or unauthorized");
      }

      const updatedRoute = await db.route.update({
        where: { id: routeId },
        data: {
          driverId,
        },
      });

      await invalidateRouteCache(companyId!, routeId);
      return updatedRoute;
    } catch (error) {
      console.error("Failed to assign driver to route:", error);
      throw error;
    }
  }
);

export const assignVehicleToRoute = authenticatedAction(
  async (user, routeId: string, vehicleId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingRoute = await db.route.findUnique({
        where: { id: routeId, companyId },
      });

      if (!existingRoute) {
        throw new Error("Route not found or unauthorized");
      }

      const updatedRoute = await db.route.update({
        where: { id: routeId },
        data: {
          vehicleId,
        },
      });

      await invalidateRouteCache(companyId!, routeId);
      return updatedRoute;
    } catch (error) {
      console.error("Failed to assign vehicle to route:", error);
      throw error;
    }
  }
);

export const unassignDriverFromRoute = authenticatedAction(
  async (user, routeId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingRoute = await db.route.findUnique({
        where: { id: routeId, companyId },
      });

      if (!existingRoute) {
        throw new Error("Route not found or unauthorized");
      }

      const updatedRoute = await db.route.update({
        where: { id: routeId },
        data: {
          driverId: null,
        },
      });

      await invalidateRouteCache(companyId!, routeId);
      return updatedRoute;
    } catch (error) {
      console.error("Failed to unassign driver from route:", error);
      throw error;
    }
  }
);

export const unassignVehicleFromRoute = authenticatedAction(
  async (user, routeId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingRoute = await db.route.findUnique({
        where: { id: routeId, companyId },
      });

      if (!existingRoute) {
        throw new Error("Route not found or unauthorized");
      }

      const updatedRoute = await db.route.update({
        where: { id: routeId },
        data: {
          vehicleId: null,
        },
      });

      await invalidateRouteCache(companyId!, routeId);
      return updatedRoute;
    } catch (error) {
      console.error("Failed to unassign vehicle from route:", error);
      throw error;
    }
  }
);

export const getDriverRoutes = authenticatedAction(
  async (user, driverId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const routes = await db.route.findMany({
        where: { driverId, companyId },
        orderBy: { date: "desc" },
      });
      return routes;
    } catch (error) {
      console.error("Failed to get driver routes:", error);
      throw error;
    }
  }
);

export const getVehicleRoutes = authenticatedAction(
  async (user, vehicleId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const routes = await db.route.findMany({
        where: { vehicleId, companyId },
        orderBy: { date: "desc" },
      });
      return routes;
    } catch (error) {
      console.error("Failed to get vehicle routes:", error);
      throw error;
    }
  }
);

export const getCompanyRoutes = authenticatedAction(async (user) => {
  const userId = user?.id;
  const companyId = user?.companyId;
  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    if (!user.companyId) throw new Error("User has no company");

    const routes = await db.route.findMany({
      where: { companyId: user.companyId },
      orderBy: { date: "desc" },
    });
    return routes;
  } catch (error) {
    console.error("Failed to get company routes:", error);
    throw error;
  }
});

export const getRouteStats = authenticatedAction(async (user) => {
  try {
    const userId = user?.id;
    const companyId = user?.companyId;
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    if (!user.companyId) throw new Error("User has no company");

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    const [activeRoutes, inProgress, completedToday, delayedRoutes] =
      await Promise.all([
        db.route.count({
          where: {
            companyId: user.companyId,
            status: { in: ["ACTIVE", "PLANNED"] },
          },
        }),
        db.route.count({
          where: {
            companyId: user.companyId,
            status: "ACTIVE",
          },
        }),
        db.route.count({
          where: {
            companyId: user.companyId,
            status: "COMPLETED",
            updatedAt: { gte: startOfDay },
          },
        }),
        db.route.count({
          where: {
            companyId: user.companyId,
            status: { not: "COMPLETED" },
            endTime: { lt: new Date() },
          },
        }),
      ]);

    return {
      active: activeRoutes,
      inProgress,
      completedToday,
      delayed: delayedRoutes,
    };
  } catch (error) {
    console.error("Failed to get route stats:", error);
    return { active: 0, inProgress: 0, completedToday: 0, delayed: 0 };
  }
});

export const getRouteEfficiencyStats = authenticatedAction(async (user) => {
  try {
    const userId = user?.id;
    const companyId = user?.companyId;
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    if (!user.companyId) throw new Error("User has no company");

    const [totalVehicles, vehiclesOnTrip] = await Promise.all([
      db.vehicle.count({ where: { companyId: user.companyId } }),
      db.vehicle.count({
        where: { companyId: user.companyId, status: "ON_TRIP" },
      }),
    ]);

    const vehicleUtilization =
      totalVehicles > 0 ? (vehiclesOnTrip / totalVehicles) * 100 : 0;
    const onTimePerformance = 89;
    const avgFuelConsumption = 24.5;

    return {
      fuelConsumption: avgFuelConsumption,
      onTimePerformance: onTimePerformance,
      vehicleUtilization: vehicleUtilization,
      recentNotifications: [],
    };
  } catch (error) {
    console.error("Failed to get route efficiency stats:", error);
    return {
      fuelConsumption: 0,
      onTimePerformance: 0,
      vehicleUtilization: 0,
      recentNotifications: [],
    };
  }
});

export const getActiveRoutesLocations = authenticatedAction(async (user) => {
  try {
    const userId = user?.id;
    const companyId = user?.companyId;
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    if (!user.companyId) throw new Error("User has no company");

    const activeRoutes = await db.route.findMany({
      where: {
        companyId: user.companyId,
        status: { in: ["ACTIVE", "PLANNED"] },
      },
      select: {
        id: true,
        status: true,
        vehicle: {
          select: {
            id: true,
            plate: true,
            currentLat: true,
            currentLng: true,
            status: true,
            type: true,
          },
        },
        startLat: true,
        startLng: true,
        endLat: true,
        endLng: true,
        name: true,
      },
    });

    const mapData = activeRoutes
      .filter(
        (r) =>
          r.vehicle &&
          r.vehicle.currentLat !== null &&
          r.vehicle.currentLng !== null
      )
      .map((r: any) => ({
        position: {
          lat: r.vehicle!.currentLat!,
          lng: r.vehicle!.currentLng!,
        },
        name: r.vehicle!.plate,
        id: r.vehicle!.id,
        type: "V",
        routeId: r.id,
        routeName: r.name,
      }));

    return mapData;
  } catch (error) {
    console.error("Failed to get active routes locations:", error);
    return [];
  }
});

export const updateRouteStatus = authenticatedAction(
  async (user, routeId: string, status: RouteStatus) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const route = await db.route.findUnique({
        where: { id: routeId, companyId },
        include: { shipments: true },
      });

      if (!route) {
        throw new Error("Route not found or unauthorized");
      }

      if (route.status === status) {
        return route;
      }

      const updatedRoute = await db.$transaction(async (tx: any) => {
        const updateData: Prisma.RouteUpdateInput = { status };

        if (status === "ACTIVE" && !route.startTime) {
          updateData.startTime = new Date();
        } else if (status === "COMPLETED") {
          updateData.endTime = new Date();
        }

        const newRoute = await tx.route.update({
          where: { id: routeId },
          data: updateData,
        });

        // side-effects based on target status
        if (status === "ACTIVE") {
          // Vehicle to ON_TRIP, Driver to ON_JOB, Shipments to IN_TRANSIT
          if (route.vehicleId) {
            await tx.vehicle.update({
              where: { id: route.vehicleId },
              data: { status: "ON_TRIP" },
            });
          }
          if (route.driverId) {
            await tx.driver.update({
              where: { id: route.driverId },
              data: { status: "ON_JOB" },
            });
          }
          if (route.shipments.length > 0) {
            await tx.shipment.updateMany({
              where: { routeId: route.id },
              data: { status: "IN_TRANSIT" },
            });
            for (const shipment of route.shipments) {
              await tx.shipmentHistory.create({
                data: {
                  shipmentId: shipment.id,
                  status: "IN_TRANSIT",
                  description: "Route started - Shipment in transit",
                  createdBy: userId || "",
                },
              });
            }
          }
        } else if (status === "COMPLETED") {
          // Vehicle to AVAILABLE, Driver to OFF_DUTY, Shipments to DELIVERED
          if (route.vehicleId) {
            await tx.vehicle.update({
              where: { id: route.vehicleId },
              data: { status: "AVAILABLE" },
            });
          }
          if (route.driverId) {
            await tx.driver.update({
              where: { id: route.driverId },
              data: { status: "OFF_DUTY" },
            });
          }
          if (route.shipments.length > 0) {
            await tx.shipment.updateMany({
              where: { routeId: route.id },
              data: { status: "COMPLETED" },
            });
            for (const shipment of route.shipments) {
              await tx.shipmentHistory.create({
                data: {
                  shipmentId: shipment.id,
                  status: "COMPLETED",
                  location: route.endAddress || "Destination",
                  description: "Route completed - Shipment completed",
                  createdBy: userId || "",
                },
              });
            }
          }
        } else if (status === "CANCELED") {
          // Vehicle to AVAILABLE, Driver to OFF_DUTY
          if (route.vehicleId) {
            await tx.vehicle.update({
              where: { id: route.vehicleId },
              data: { status: "AVAILABLE" },
            });
          }
          if (route.driverId) {
            await tx.driver.update({
              where: { id: route.driverId },
              data: { status: "OFF_DUTY" },
            });
          }
          if (route.shipments.length > 0) {
            await tx.shipment.updateMany({
              where: { routeId: route.id },
              data: { status: "PENDING" }, // revert to pending
            });
            for (const shipment of route.shipments) {
              await tx.shipmentHistory.create({
                data: {
                  shipmentId: shipment.id,
                  status: "PENDING",
                  description: "Route canceled - Shipment reverted to pending",
                  createdBy: userId || "",
                },
              });
            }
          }
        }

        return newRoute;
      });

      await invalidateRouteCache(companyId!, routeId);
      return updatedRoute;
    } catch (error) {
      console.error("Failed to update route status:", error);
      throw error;
    }
  }
);

export const getRoutesWithDashboardData = authenticatedAction(
  async (
    user,
    page: number = 1,
    pageSize: number = 10,
    status?: string
  ): Promise<{
    routes: RouteWithRelations[];
    totalCount: number;
    stats: RouteStats;
    efficiency: RouteEfficiencyStats;
    mapData: MapRouteData[];
  }> => {
    const userId = user?.id;
    const companyId = user?.companyId;

    try {
      if (!companyId) throw new Error("User has no company");

      const skip = (page - 1) * pageSize;
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));

      const where: Prisma.RouteWhereInput = { companyId };
      if (status && status !== "ALL") {
        where.status = status as RouteStatus;
      }

      // ── Parallel Orchestration ──────────────────────────────────────────
      // This pattern ensures that checkPermission and all DB fetches start
      // simultaneously for sub-second performance.
      const cacheKey = routeCacheKeys.dashboard(
        companyId,
        hashFilters({ page, pageSize, status })
      );

      return await withCache(cacheKey, ROUTE_CACHE_TTL, async () => {
        const [
          ,
          routes,
        totalCount,
        activeCount,
        inProgressCount,
        completedCount,
        delayedCount,
        totalVehicles,
        vehiclesOnTrip,
        locationsData,
      ] = await Promise.all([
        checkPermission(userId, companyId, [
          "role_admin",
          "role_manager",
          "role_dispatcher",
        ]),
        db.route.findMany({
          where,
          include: {
            vehicle: {
              select: {
                id: true,
                plate: true,
                type: true,
                brand: true,
                model: true,
                currentLat: true,
                currentLng: true,
                fuelLevel: true,
              },
            },
            driver: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            shipments: {
              select: {
                id: true,
                status: true,
                origin: true,
                destination: true,
              },
            },
          },
          orderBy: { date: "desc" },
          skip,
          take: pageSize,
        }),
        db.route.count({ where }),
        db.route.count({
          where: { companyId, status: { in: ["ACTIVE", "PLANNED"] } },
        }),
        db.route.count({
          where: { companyId, status: "ACTIVE" },
        }),
        db.route.count({
          where: {
            companyId,
            status: "COMPLETED",
            updatedAt: { gte: startOfDay },
          },
        }),
        db.route.count({
          where: {
            companyId,
            status: { not: "COMPLETED" },
            endTime: { lt: new Date() },
          },
        }),
        db.vehicle.count({ where: { companyId } }),
        db.vehicle.count({ where: { companyId, status: "ON_TRIP" } }),
        db.route.findMany({
          where: { companyId, status: { in: ["ACTIVE", "PLANNED"] } },
          select: {
            id: true,
            status: true,
            vehicle: {
              select: {
                id: true,
                plate: true,
                currentLat: true,
                currentLng: true,
                status: true,
                type: true,
              },
            },
            startLat: true,
            startLng: true,
            endLat: true,
            endLng: true,
            name: true,
          },
        }),
      ]);

      const utilization =
        totalVehicles > 0 ? (vehiclesOnTrip / totalVehicles) * 100 : 0;

      return {
        routes: routes as unknown as RouteWithRelations[],
        totalCount,
        stats: {
          active: activeCount,
          inProgress: inProgressCount,
          completedToday: completedCount,
          delayed: delayedCount,
        },
        efficiency: {
          fuelConsumption: 24.5,
          onTimePerformance: 89,
          vehicleUtilization: utilization,
          recentNotifications: [],
        },
        mapData: locationsData
          .filter((r: any) => r.vehicle?.currentLat && r.vehicle?.currentLng)
          .map((r: any) => ({
            position: {
              lat: r.vehicle!.currentLat!,
              lng: r.vehicle!.currentLng!,
            },
            name: r.vehicle!.plate,
            id: r.vehicle!.id,
            type: "V",
            routeId: r.id,
            routeName: r.name,
          })),
      };
      });
    } catch (error) {
      console.error("Failed to get routes combined data:", error);
      throw error;
    }
  }
);
