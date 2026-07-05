"use server";

import { type Prisma, RouteStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
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
import { calcTrend, daysAgo } from "./utils/trendUtils";
import {
  assertDriverAvailableForRoute,
  assertVehicleAvailableForRoute,
} from "./utils/assignmentGuards";
import {
  assertShipmentTransition,
  isTerminalShipmentStatus,
} from "./utils/shipmentTransitions";

// Route lifecycle: PLANNED → ACTIVE → COMPLETED; cancel allowed until completion.
const ROUTE_TRANSITIONS: Record<RouteStatus, RouteStatus[]> = {
  PLANNED: ["ACTIVE", "CANCELED"],
  ACTIVE: ["COMPLETED", "CANCELED"],
  COMPLETED: [],
  CANCELED: ["PLANNED"], // allow re-planning a canceled route
};

async function invalidateRouteCache(companyId: string, routeId?: string) {
  await Promise.all([
    invalidatePattern(routeCacheKeys.companyPattern(companyId)),
    routeId ? redis.del(routeCacheKeys.detail(routeId)) : Promise.resolve(),
  ]);
  revalidatePath("/", "layout");
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
    shipmentId?: string,
    stops?: { address: string; lat?: number; lng?: number }[]
  ) => {
    try {
      await checkPermission(user, user.companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const finalName =
        name && name.trim() !== ""
          ? name
          : `ROUTE-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`;

      const companyId = user.companyId!;
      const existingRoute = await db.route.findFirst({
        where: { name: finalName, companyId },
      });

      if (existingRoute && name && name.trim() !== "") {
        throw new Error("Route name already exists");
      }

      if (driverId) {
        await assertDriverAvailableForRoute(db, { driverId, companyId, date });
      }
      if (vehicleId) {
        await assertVehicleAvailableForRoute(db, {
          vehicleId,
          companyId,
          date,
        });
      }

      let shipmentToAssign: {
        status: import("@prisma/client").ShipmentStatus;
        weightKg: number | null;
        volumeM3: number | null;
      } | null = null;
      if (shipmentId) {
        shipmentToAssign = await db.shipment.findFirst({
          where: { id: shipmentId, companyId },
          select: { status: true, weightKg: true, volumeM3: true },
        });
        if (!shipmentToAssign) {
          throw new Error("Shipment not found or unauthorized");
        }
        assertShipmentTransition(shipmentToAssign.status, "ASSIGNED");

        if (vehicleId) {
          const vehicle = await db.vehicle.findFirst({
            where: { id: vehicleId, companyId },
            select: {
              fleetNo: true,
              maxLoadKg: true,
              currentTrailer: { select: { maxLoadKg: true } },
            },
          });
          const maxWeight =
            (vehicle?.maxLoadKg || 0) +
            (vehicle?.currentTrailer?.maxLoadKg || 0);
          if (vehicle && (shipmentToAssign.weightKg || 0) > maxWeight + 0.01) {
            throw new Error(
              `Vehicle capacity exceeded: shipment weight ${shipmentToAssign.weightKg}kg > max ${maxWeight}kg (vehicle ${vehicle.fleetNo})`
            );
          }
        }
      }

      const newRoute = await db.$transaction(async (tx) => {
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
            companyId,
            stops: {
              create: (stops ?? []).map((stop, index) => ({
                companyId,
                sequence: index,
                address: stop.address,
                lat: stop.lat ?? null,
                lng: stop.lng ?? null,
              })),
            },
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
              status: "ASSIGNED",
              history: {
                create: {
                  status: "ASSIGNED",
                  companyId,
                  description: `Assigned to route: ${finalName}`,
                  createdById: user.id,
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

      // Dispatch Notification
      await createNotification(
        { companyId: user.companyId! },
        {
          title: "Yeni Rota Planlandı 📝",
          message: `${finalName} numaralı yeni bir rota planlandı. Sürücü: ${driverId ? 'Atandı' : 'Bekleniyor'}.`,
          type: "INFO",
          category: "NEW_ASSIGNMENT",
          link: `/dashboard/routes/${newRoute.id}`,
        }
      );

      return { route: newRoute };
    } catch (error) {
      console.error("Failed to create route:", error);
      throw error;
    }
  }
);

export const getRoutes = authenticatedAction(
  async (user, page: number = 1, pageSize: number = 10, status?: string) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
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
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
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
          shipments: {
            include: {
              stops: {
                orderBy: { sequence: "asc" }
              }
            }
          }
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

export interface RouteUpdateData {
  name?: string;
  status?: RouteStatus;
  date?: Date;
  startTime?: Date | null;
  endTime?: Date | null;
  distanceKm?: number | null;
  durationMin?: number | null;
  driverId?: string | null;
  vehicleId?: string | null;
  stops?: { address: string; lat?: number; lng?: number }[];
}

export const updateRoute = authenticatedAction(
  async (user, routeId: string, data: RouteUpdateData) => {
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
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

      const { stops, ...scalarData } = data;
      const updateData: Prisma.RouteUncheckedUpdateInput = { ...scalarData };
      if (updateData.name === "") {
        updateData.name = `ROUTE-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`;
      }
      if (stops) {
        updateData.stops = {
          deleteMany: {},
          create: stops.map((stop, index) => ({
            companyId,
            sequence: index,
            address: stop.address,
            lat: stop.lat ?? null,
            lng: stop.lng ?? null,
          })),
        };
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
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
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
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
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

      if (existingRoute.status === "COMPLETED" || existingRoute.status === "CANCELED") {
        throw new Error("Cannot assign a driver to a completed or canceled route");
      }

      await assertDriverAvailableForRoute(db, {
        driverId,
        companyId,
        date: existingRoute.date,
        excludeRouteId: routeId,
      });

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
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
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

      if (existingRoute.status === "COMPLETED" || existingRoute.status === "CANCELED") {
        throw new Error("Cannot assign a vehicle to a completed or canceled route");
      }

      await assertVehicleAvailableForRoute(db, {
        vehicleId,
        companyId,
        date: existingRoute.date,
        excludeRouteId: routeId,
      });

      // Capacity pre-check: the route may already carry more load than this
      // vehicle (+ attached trailer) allows.
      const [vehicle, currentLoad] = await Promise.all([
        db.vehicle.findFirst({
          where: { id: vehicleId, companyId },
          select: {
            fleetNo: true,
            maxLoadKg: true,
            currentTrailer: {
              select: { maxLoadKg: true, capacityVolumeM3: true },
            },
          },
        }),
        db.shipment.aggregate({
          where: {
            routeId,
            status: { notIn: ["DELIVERED", "RETURNED", "CANCELLED"] },
          },
          _sum: { weightKg: true, volumeM3: true },
        }),
      ]);
      if (vehicle) {
        const totalWeight = currentLoad._sum.weightKg || 0;
        const totalVolume = currentLoad._sum.volumeM3 || 0;
        const maxWeight =
          vehicle.maxLoadKg + (vehicle.currentTrailer?.maxLoadKg || 0);
        if (totalWeight > maxWeight + 0.01) {
          throw new Error(
            `Vehicle capacity exceeded: route load ${totalWeight.toFixed(2)}kg > max ${maxWeight}kg (vehicle ${vehicle.fleetNo})`
          );
        }
        if (
          vehicle.currentTrailer &&
          totalVolume > vehicle.currentTrailer.capacityVolumeM3 + 0.01
        ) {
          throw new Error(
            `Trailer volume exceeded: route volume ${totalVolume.toFixed(2)}m³ > max ${vehicle.currentTrailer.capacityVolumeM3}m³`
          );
        }
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
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
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
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
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
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
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
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
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
  const companyId = user?.companyId;
  try {
    await checkPermission(user, companyId, [
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
    const companyId = user?.companyId || "";
    await checkPermission(user, companyId, [
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
    const companyId = user?.companyId || "";
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    if (!user.companyId) throw new Error("User has no company");

    const [totalVehicles, vehiclesOnTrip, totalShipments, delayedShipments, allVehicles] = await Promise.all([
      db.vehicle.count({ where: { companyId: user.companyId } }),
      db.vehicle.count({
        where: { companyId: user.companyId, status: "ON_TRIP" },
      }),
      db.shipment.count({ where: { companyId: user.companyId } }),
      db.shipment.count({ where: { companyId: user.companyId, status: "DELAYED" } }),
      db.vehicle.findMany({ where: { companyId: user.companyId }, select: { avgFuelConsumption: true } }),
    ]);

    const vehicleUtilization =
      totalVehicles > 0 ? (vehiclesOnTrip / totalVehicles) * 100 : 0;
    const onTimePerformance = 
      totalShipments > 0 ? ((totalShipments - delayedShipments) / totalShipments) * 100 : 100;
      
    let totalFuelConsump = 0;
    let vehiclesWithFuelData = 0;
    for (const v of allVehicles) {
      if (v.avgFuelConsumption) {
        totalFuelConsump += v.avgFuelConsumption;
        vehiclesWithFuelData++;
      }
    }
    const avgFuelConsumption = vehiclesWithFuelData > 0 ? totalFuelConsump / vehiclesWithFuelData : 0;

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
    const companyId = user?.companyId || "";
    await checkPermission(user, companyId, [
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
        name: true,
        stops: true,
      },
    });

    const mapData = activeRoutes
      .filter(
        (r) =>
          r.vehicle &&
          r.vehicle.currentLat !== null &&
          r.vehicle.currentLng !== null
      )
      .map((r: typeof activeRoutes[number]) => ({
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
    const companyId = user?.companyId || "";
    try {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const route = await db.route.findUnique({
        where: { id: routeId, companyId },
        include: { shipments: true, stops: { orderBy: { sequence: "asc" } } },
      });

      if (!route) {
        throw new Error("Route not found or unauthorized");
      }

      if (route.status === status) {
        return route;
      }

      if (!ROUTE_TRANSITIONS[route.status].includes(status)) {
        throw new Error(
          `Invalid route status transition: ${route.status} -> ${status}`
        );
      }

      // Only shipments still in an active lifecycle state follow the route's
      // bulk transitions; DELIVERED / FAILED / RETURNED / CANCELLED keep their
      // individually recorded outcome.
      const activeShipments = route.shipments.filter(
        (s) =>
          !isTerminalShipmentStatus(s.status) && s.status !== "FAILED"
      );
      const activeShipmentIds = activeShipments.map((s) => s.id);

      const updatedRoute = await db.$transaction(async (tx) => {
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
            if (activeShipmentIds.length > 0) {
              await tx.shipment.updateMany({
                where: { id: { in: activeShipmentIds } },
                data: { status: "IN_TRANSIT" },
              });
              for (const shipment of activeShipments) {
                await tx.shipmentHistory.create({
                  data: {
                    shipmentId: shipment.id,
                    companyId,
                    status: "IN_TRANSIT",
                    description: "Route started - Shipment in transit",
                    createdById: userId || null,
                  },
                });
              }
            }

            // Dispatch Notification
            await createNotification(
              { companyId: companyId! },
              {
                title: "Rota Başlatıldı 🚚",
                message: `${route.name || route.id} numaralı rota şu an aktif durumda. Araç yola çıktı.`,
                type: "SUCCESS",
                link: `/dashboard/routes/${route.id}`,
              }
            );
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
            if (activeShipmentIds.length > 0) {
              await tx.shipment.updateMany({
                where: { id: { in: activeShipmentIds } },
                data: { status: "DELIVERED" },
              });
              for (const shipment of activeShipments) {
                await tx.shipmentHistory.create({
                  data: {
                    shipmentId: shipment.id,
                    companyId,
                    status: "DELIVERED",
                    location: route.stops[route.stops.length - 1]?.address || "Destination",
                    description: "Route completed - Shipment completed",
                    createdById: userId || null,
                  },
                });
              }
            }

            const failedCount = route.shipments.filter(
              (s) => s.status === "FAILED"
            ).length;

            // Dispatch Notification
            await createNotification(
              { companyId: companyId! },
              {
                title: "Rota Tamamlandı ✅",
                message:
                  failedCount > 0
                    ? `${route.name || route.id} numaralı rota tamamlandı. ${activeShipmentIds.length} sevkiyat teslim edildi, ${failedCount} sevkiyat teslim edilemedi.`
                    : `${route.name || route.id} numaralı rota başarıyla tamamlandı. Tüm sevkiyatlar teslim edildi.`,
                type: failedCount > 0 ? "WARNING" : "SUCCESS",
                link: `/dashboard/routes/${route.id}`,
              }
            );
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
            if (activeShipmentIds.length > 0) {
              await tx.shipment.updateMany({
                where: { id: { in: activeShipmentIds } },
                data: { status: "PENDING" }, // revert to pending
              });
              for (const shipment of activeShipments) {
                await tx.shipmentHistory.create({
                  data: {
                    shipmentId: shipment.id,
                    companyId,
                    status: "PENDING",
                    description: "Route canceled - Shipment reverted to pending",
                    createdById: userId || null,
                  },
                });
              }
            }

            // Dispatch Notification
            await createNotification(
              { companyId: companyId! },
              {
                title: "Rota İptal Edildi ⚠️",
                message: `${route.name || route.id} numaralı rota iptal edildi. Araç müsait durumuna çekildi.`,
                type: "WARNING",
                link: `/dashboard/routes/${route.id}`,
              }
            );
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
    status?: string | string[]
  ): Promise<{
    routes: RouteWithRelations[];
    totalCount: number;
    stats: RouteStats;
    efficiency: RouteEfficiencyStats;
    mapData: MapRouteData[];
  }> => {
    const companyId = user?.companyId;

    try {
      if (!companyId) throw new Error("User has no company");

      const skip = (page - 1) * pageSize;
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));

      const where: Prisma.RouteWhereInput = { companyId };
      if (status && status !== "ALL") {
        if (Array.isArray(status)) {
          if (status.length > 0) {
            where.status = { in: status as RouteStatus[] };
          }
        } else {
          where.status = status as RouteStatus;
        }
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
        prevActiveCount,
        prevCompletedCount,
        prevDelayedCount,
      ] = await Promise.all([
        checkPermission(user, companyId, [
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
            stops: { orderBy: { sequence: "asc" } },
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
            name: true,
            stops: true,
          },
        }),
        // Previous period counts (30–60 days ago) for trend calculation
        db.route.count({
          where: { companyId, status: { in: ["ACTIVE", "PLANNED"] }, createdAt: { gte: daysAgo(60), lt: daysAgo(30) } },
        }),
        db.route.count({
          where: { companyId, status: "COMPLETED", createdAt: { gte: daysAgo(60), lt: daysAgo(30) } },
        }),
        db.route.count({
          where: { companyId, status: { not: "COMPLETED" }, endTime: { lt: daysAgo(30) }, createdAt: { gte: daysAgo(60) } },
        }),
      ]);

      const utilization =
        totalVehicles > 0 ? (vehiclesOnTrip / totalVehicles) * 100 : 0;

      const typedRoutes: RouteWithRelations[] = routes.map((route) => ({
        ...route,
        stops: route.stops.map((stop) => ({
          address: stop.address,
          lat: stop.lat ?? undefined,
          lng: stop.lng ?? undefined,
        })),
      }));

      return {
        routes: typedRoutes,
        totalCount,
        stats: {
          active: activeCount,
          inProgress: inProgressCount,
          completedToday: completedCount,
          delayed: delayedCount,
        },
        statsTrends: {
          active: calcTrend(activeCount, prevActiveCount),
          completedToday: calcTrend(completedCount, prevCompletedCount),
          delayed: calcTrend(delayedCount, prevDelayedCount),
        },
        efficiency: {
          fuelConsumption: 24.5,
          onTimePerformance: 89,
          vehicleUtilization: utilization,
          recentNotifications: [],
        },
        mapData: locationsData
          .filter((r: typeof locationsData[number]) => !!(r.vehicle?.currentLat && r.vehicle?.currentLng))
          .map((r: typeof locationsData[number]) => ({
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
