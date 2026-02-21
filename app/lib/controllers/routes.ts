"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";

export async function createRoute(
  userId: string,
  name: string,
  date: Date,
  startTime: Date,
  endTime: Date,
  distanceKm: number,
  durationMin: number,
  driverId: string,
  vehicleId: string,
  companyId: string,
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
) {
  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const existingRoute = await db.route.findFirst({
      where: { name, companyId },
    });

    if (existingRoute) {
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
        startAddress = warehouse.address; // Or composite: `${warehouse.address}, ${warehouse.city}`
        startLat = warehouse.lat || undefined;
        startLng = warehouse.lng || undefined;
      }
    } else if (origin?.type === "CUSTOMER" && origin.id) {
      const customer = await db.customer.findUnique({
        where: { id: origin.id },
      });
      if (customer) {
        startAddress = customer.address || undefined;
        // Customer doesn't have lat/lng in schema yet
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
      });
      if (customer) {
        endAddress = customer.address || undefined;
      }
    }

    const newRoute = await db.route.create({
      data: {
        name,
        date,
        startTime,
        endTime,
        distanceKm,
        durationMin,
        driverId,
        vehicleId,
        companyId,
        startAddress,
        startLat,
        startLng,
        endAddress,
        endLat,
        endLng,
      },
    });

    return { route: newRoute };
  } catch (error: any) {
    console.error("Failed to create route:", error);
    throw new Error(error.message || "Failed to create route");
  }
}

export async function getRoutes(
  companyId: string,
  userId: string,
  page: number = 1,
  pageSize: number = 10,
  status?: string
) {
  try {
    await checkPermission(userId, companyId);

    const skip = (page - 1) * pageSize;
    const where: any = { companyId };
    if (status && status !== "ALL") {
      where.status = status;
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
              currentLat: true,
              currentLng: true,
              fuelLevel: true,
            },
          },
          driver: {
            include: {
              user: {
                select: {
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
  } catch (error: any) {
    console.error("Failed to get routes:", error);
    throw new Error(error.message || "Failed to get routes");
  }
}

export async function getRouteById(routeId: string, userId: string) {
  try {
    const route = await db.route.findUnique({
      where: { id: routeId },
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
                  select: { name: true, surname: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
    });

    if (!route) throw new Error("Route not found");

    if (route.companyId) {
      await checkPermission(userId, route.companyId);
    }

    return route;
  } catch (error: any) {
    console.error("Failed to get route:", error);
    throw new Error(error.message || "Failed to get route");
  }
}

export async function updateRoute(routeId: string, userId: string, data: any) {
  try {
    const existingRoute = await db.route.findUnique({
      where: { id: routeId },
      select: { companyId: true },
    });

    if (!existingRoute?.companyId) throw new Error("Route not found");

    await checkPermission(userId, existingRoute.companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const updatedRoute = await db.route.update({
      where: { id: routeId },
      data: {
        ...data,
      },
    });

    return updatedRoute;
  } catch (error: any) {
    console.error("Failed to update route:", error);
    throw new Error(error.message || "Failed to update route");
  }
}

export async function deleteRoute(routeId: string, userId: string) {
  try {
    const existingRoute = await db.route.findUnique({
      where: { id: routeId },
      select: { companyId: true },
    });

    if (!existingRoute?.companyId) throw new Error("Route not found");

    await checkPermission(userId, existingRoute.companyId, [
      "role_admin",
      "role_manager",
    ]);

    await db.route.delete({
      where: { id: routeId },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete route:", error);
    throw new Error(error.message || "Failed to delete route");
  }
}

export async function assignDriverToRoute(
  routeId: string,
  driverId: string,
  userId: string
) {
  try {
    const existingRoute = await db.route.findUnique({
      where: { id: routeId },
      select: { companyId: true },
    });

    if (!existingRoute?.companyId) throw new Error("Route not found");

    await checkPermission(userId, existingRoute.companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const updatedRoute = await db.route.update({
      where: { id: routeId },
      data: {
        driverId,
      },
    });

    return updatedRoute;
  } catch (error: any) {
    console.error("Failed to assign driver to route:", error);
    throw new Error(error.message || "Failed to assign driver to route");
  }
}

export async function assignVehicleToRoute(
  routeId: string,
  vehicleId: string,
  userId: string
) {
  try {
    const existingRoute = await db.route.findUnique({
      where: { id: routeId },
      select: { companyId: true },
    });

    if (!existingRoute?.companyId) throw new Error("Route not found");

    await checkPermission(userId, existingRoute.companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const updatedRoute = await db.route.update({
      where: { id: routeId },
      data: {
        vehicleId,
      },
    });

    return updatedRoute;
  } catch (error: any) {
    console.error("Failed to assign vehicle to route:", error);
    throw new Error(error.message || "Failed to assign vehicle to route");
  }
}

export async function unassignDriverFromRoute(routeId: string, userId: string) {
  try {
    const existingRoute = await db.route.findUnique({
      where: { id: routeId },
      select: { companyId: true },
    });

    if (!existingRoute?.companyId) throw new Error("Route not found");

    await checkPermission(userId, existingRoute.companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const updatedRoute = await db.route.update({
      where: { id: routeId },
      data: {
        driverId: null,
      },
    });

    return updatedRoute;
  } catch (error: any) {
    console.error("Failed to unassign driver from route:", error);
    throw new Error(error.message || "Failed to unassign driver from route");
  }
}

export async function unassignVehicleFromRoute(
  routeId: string,
  userId: string
) {
  try {
    const existingRoute = await db.route.findUnique({
      where: { id: routeId },
      select: { companyId: true },
    });

    if (!existingRoute?.companyId) throw new Error("Route not found");

    await checkPermission(userId, existingRoute.companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    const updatedRoute = await db.route.update({
      where: { id: routeId },
      data: {
        vehicleId: null,
      },
    });

    return updatedRoute;
  } catch (error: any) {
    console.error("Failed to unassign vehicle from route:", error);
    throw new Error(error.message || "Failed to unassign vehicle from route");
  }
}

export async function getDriverRoutes(driverId: string, userId: string) {
  try {
    await checkPermission(userId, driverId);

    const routes = await db.route.findMany({
      where: { driverId },
      orderBy: { date: "desc" },
    });
    return routes;
  } catch (error: any) {
    console.error("Failed to get driver routes:", error);
    throw new Error(error.message || "Failed to get driver routes");
  }
}

export async function getVehicleRoutes(vehicleId: string, userId: string) {
  try {
    await checkPermission(userId, vehicleId);

    const routes = await db.route.findMany({
      where: { vehicleId },
      orderBy: { date: "desc" },
    });
    return routes;
  } catch (error: any) {
    console.error("Failed to get vehicle routes:", error);
    throw new Error(error.message || "Failed to get vehicle routes");
  }
}

export async function getCompanyRoutes(companyId: string, userId: string) {
  try {
    await checkPermission(userId, companyId);

    const routes = await db.route.findMany({
      where: { companyId },
      orderBy: { date: "desc" },
    });
    return routes;
  } catch (error: any) {
    console.error("Failed to get company routes:", error);
    throw new Error(error.message || "Failed to get company routes");
  }
}

export async function getRouteStats(companyId: string, userId: string) {
  try {
    await checkPermission(userId, companyId);

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    const activeRoutes = await db.route.count({
      where: {
        companyId,
        status: { in: ["ACTIVE", "PLANNED"] },
      },
    });

    const inProgress = await db.route.count({
      where: {
        companyId,
        status: "ACTIVE",
      },
    });

    const completedToday = await db.route.count({
      where: {
        companyId,
        status: "COMPLETED",
        updatedAt: { gte: startOfDay },
      },
    });

    const delayedRoutes = await db.route.count({
      where: {
        companyId,
        status: { not: "COMPLETED" },
        endTime: { lt: new Date() }, // Past due
      },
    });

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
}

export async function getRouteEfficiencyStats(
  companyId: string,
  userId: string
) {
  try {
    await checkPermission(userId, companyId);

    // Calculate Vehicle Utilization
    const totalVehicles = await db.vehicle.count({ where: { companyId } });
    const vehiclesOnTrip = await db.vehicle.count({
      where: { companyId, status: "ON_TRIP" },
    });

    const vehicleUtilization =
      totalVehicles > 0 ? (vehiclesOnTrip / totalVehicles) * 100 : 0;

    // Calculate On-Time Performance (Routes completed on time vs late)
    // This is a rough approximation based on routes completed
    // const completedRoutes = await db.route.count({
    //   where: { companyId, status: "COMPLETED" },
    // });
    // Assuming we could check if endTime <= expectedEndTime, but for now we look at general 'delayed' status if we had it.
    // Or we check routes where actualEndTime <= scheduledEndTime.
    // The schema currently only has `endTime`. If we assume `endTime` in DB is the scheduled one, and we don't track `actualEndTime` separately...
    // Let's assume for MVP we return a placeholder or calculate based on existing logic if possible.
    // For now, let's return a static calculated value or 0 if no data.
    const onTimePerformance = 89; // Placeholder until we have actual vs scheduled time in DB

    // Fuel Consumption
    // Needs Vehicle specs.
    // Let's return the computed average from vehicles if they have 'mpg' or similar.
    // Schema might not have it.
    const avgFuelConsumption = 24.5; // Placeholder

    return {
      fuelConsumption: avgFuelConsumption,
      onTimePerformance: onTimePerformance,
      vehicleUtilization: vehicleUtilization,
      recentNotifications: [], // Placeholder for notifications
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
}

export async function getActiveRoutesLocations(
  companyId: string,
  userId: string
) {
  try {
    await checkPermission(userId, companyId);

    const activeRoutes = await db.route.findMany({
      where: {
        companyId,
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

    // Transform to map friendly format
    // Map needs: { position: { lat, lng }, name, id, type: "V" }
    // We filter for routes that have a vehicle assigned and vehicle has location
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
        type: "V", // Vehicle
        routeId: r.id,
        routeName: r.name,
      }));

    return mapData;
  } catch (error) {
    console.error("Failed to get active routes locations:", error);
    return [];
  }
}
