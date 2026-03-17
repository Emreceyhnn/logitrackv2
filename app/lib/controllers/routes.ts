"use server";

import { Prisma, RouteStatus } from "@prisma/client";
import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";

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
    }
  ) => {
    try {
      await checkPermission(user.id, user.companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const finalName = name && name.trim() !== "" 
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
        const customer = (await db.customer.findUnique({
          where: { id: origin.id },
          include: { locations: true } as any
        })) as any;
        if (customer && customer.locations.length > 0) {
          const defaultLoc = customer.locations.find((l: any) => l.isDefault) || customer.locations[0];
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
        const customer = (await db.customer.findUnique({
          where: { id: destination.id },
          include: { locations: true } as any
        })) as any;
        if (customer && customer.locations.length > 0) {
          const defaultLoc = customer.locations.find((l: any) => l.isDefault) || customer.locations[0];
          endAddress = defaultLoc.address || undefined;
          endLat = defaultLoc.lat || undefined;
          endLng = defaultLoc.lng || undefined;
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
            driverId,
            vehicleId,
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

        return route;
      });

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
                    select: { id: true, name: true, surname: true, avatarUrl: true },
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
      .map((r) => ({
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
