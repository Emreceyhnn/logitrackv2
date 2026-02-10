"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";

export async function createRoute(userId: string, name: string, date: Date, startTime: Date, endTime: Date, distanceKm: number, durationMin: number, driverId: string, vehicleId: string, companyId: string) {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const existingRoute = await db.route.findFirst({
            where: { name, companyId },
        });

        if (existingRoute) {
            throw new Error("Route name already exists");
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
            },
        });

        return { route: newRoute };
    } catch (error: any) {
        console.error("Failed to create route:", error);
        throw new Error(error.message || "Failed to create route");
    }
}

export async function getRoutes(companyId: string, userId: string) {
    try {
        await checkPermission(userId, companyId);

        const routes = await db.route.findMany({
            where: { companyId },
            orderBy: { date: 'desc' }
        });
        return routes;
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
                            select: { name: true, surname: true, avatarUrl: true }
                        }
                    }
                },
                vehicle: {
                    include: {
                        driver: {
                            include: {
                                user: {
                                    select: { name: true, surname: true, avatarUrl: true }
                                }
                            }
                        }
                    }
                }
            }
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
            select: { companyId: true }
        });

        if (!existingRoute?.companyId) throw new Error("Route not found");

        await checkPermission(userId, existingRoute.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const updatedRoute = await db.route.update({
            where: { id: routeId },
            data: {
                ...data,
            }
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
            select: { companyId: true }
        });

        if (!existingRoute?.companyId) throw new Error("Route not found");

        await checkPermission(userId, existingRoute.companyId, ["role_admin", "role_manager"]);

        await db.route.delete({
            where: { id: routeId }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete route:", error);
        throw new Error(error.message || "Failed to delete route");
    }
}

export async function assignDriverToRoute(routeId: string, driverId: string, userId: string) {
    try {
        const existingRoute = await db.route.findUnique({
            where: { id: routeId },
            select: { companyId: true }
        });

        if (!existingRoute?.companyId) throw new Error("Route not found");

        await checkPermission(userId, existingRoute.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const updatedRoute = await db.route.update({
            where: { id: routeId },
            data: {
                driverId,
            }
        });

        return updatedRoute;
    } catch (error: any) {
        console.error("Failed to assign driver to route:", error);
        throw new Error(error.message || "Failed to assign driver to route");
    }
}

export async function assignVehicleToRoute(routeId: string, vehicleId: string, userId: string) {
    try {
        const existingRoute = await db.route.findUnique({
            where: { id: routeId },
            select: { companyId: true }
        });

        if (!existingRoute?.companyId) throw new Error("Route not found");

        await checkPermission(userId, existingRoute.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const updatedRoute = await db.route.update({
            where: { id: routeId },
            data: {
                vehicleId,
            }
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
            select: { companyId: true }
        });

        if (!existingRoute?.companyId) throw new Error("Route not found");

        await checkPermission(userId, existingRoute.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const updatedRoute = await db.route.update({
            where: { id: routeId },
            data: {
                driverId: null,
            }
        });

        return updatedRoute;
    } catch (error: any) {
        console.error("Failed to unassign driver from route:", error);
        throw new Error(error.message || "Failed to unassign driver from route");
    }
}

export async function unassignVehicleFromRoute(routeId: string, userId: string) {
    try {
        const existingRoute = await db.route.findUnique({
            where: { id: routeId },
            select: { companyId: true }
        });

        if (!existingRoute?.companyId) throw new Error("Route not found");

        await checkPermission(userId, existingRoute.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const updatedRoute = await db.route.update({
            where: { id: routeId },
            data: {
                vehicleId: null,
            }
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
            orderBy: { date: 'desc' }
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
            orderBy: { date: 'desc' }
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
            orderBy: { date: 'desc' }
        });
        return routes;
    } catch (error: any) {
        console.error("Failed to get company routes:", error);
        throw new Error(error.message || "Failed to get company routes");
    }
}


