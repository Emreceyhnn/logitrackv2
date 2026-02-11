"use server";

import { db } from "../db";
import { VehicleStatus } from "@prisma/client";
import { checkPermission } from "./utils/checkPermission";
// import { getUserFromToken } from "./users"; // Deprecated in favor of middleware
import { authenticatedAction } from "../auth-middleware";

export const createVehicle = authenticatedAction(async (user, vehicleData: any) => {
    try {
        await checkPermission(user.id, user.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const vehicle = await db.vehicle.create({
            data: {
                companyId: user.companyId,
                ...vehicleData,
            },
        });
        return vehicle;
    } catch (error) {
        console.error("Failed to create vehicle:", error);
        throw error;
    }
});

export const getVehicles = authenticatedAction(async (user) => {
    try {
        await checkPermission(user.id, user.companyId);

        const vehicles = await db.vehicle.findMany({
            where: { companyId: user.companyId },
            include: {
                driver: {
                    include: {
                        user: {
                            select: { name: true, surname: true }
                        }
                    }
                },
                issues: {
                    where: {
                        status: { in: ["OPEN", "IN_PROGRESS"] }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                documents: true,
                maintenanceRecords: {
                    orderBy: { date: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return vehicles;
    } catch (error) {
        console.error("Failed to get vehicles:", error);
        throw error;
    }
});

export const getVehicleById = authenticatedAction(async (user, vehicleId: string) => {
    try {

        const vehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            include: {
                driver: {
                    include: {
                        user: {
                            select: { name: true, surname: true, avatarUrl: true }
                        }
                    }
                },
                issues: {
                    orderBy: { createdAt: 'desc' }
                },
                maintenanceRecords: {
                    orderBy: { date: 'desc' },
                    take: 5
                }
            }
        });

        if (!vehicle) throw new Error("Vehicle not found");

        if (vehicle.companyId) {
            await checkPermission(user.id, vehicle.companyId);
        }

        return vehicle;
    } catch (error) {
        console.error("Failed to get vehicle:", error);
        throw error;
    }
});

export const updateVehicle = authenticatedAction(async (user, vehicleId: string, data: any) => {
    try {
        const existingVehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            select: { companyId: true }
        });

        if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

        await checkPermission(user.id, existingVehicle.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const updatedVehicle = await db.vehicle.update({
            where: { id: vehicleId },
            data: {
                ...data,

            }
        });

        return updatedVehicle;
    } catch (error) {
        console.error("Failed to update vehicle:", error);
        throw error;
    }
});

export const deleteVehicle = authenticatedAction(async (user, vehicleId: string) => {
    try {
        const existingVehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            select: { companyId: true }
        });

        if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

        await checkPermission(user.id, existingVehicle.companyId, ["role_admin", "role_manager"]);

        await db.vehicle.delete({
            where: { id: vehicleId }
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to delete vehicle:", error);
        throw error;
    }
});

export const assignDriverToVehicle = authenticatedAction(async (user, vehicleId: string, driverId: string | null) => {
    try {
        const existingVehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            select: { companyId: true }
        });

        if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

        await checkPermission(user.id, existingVehicle.companyId, ["role_admin", "role_manager", "role_dispatcher"]);


        if (driverId) {
            const driver = await db.driver.findUnique({
                where: { id: driverId },
                select: { companyId: true }
            });
            if (!driver || driver.companyId !== existingVehicle.companyId) {
                throw new Error("Driver not found or belongs to another company");
            }
        }


        await db.$transaction(async (tx) => {

            if (driverId) {

                const currentDriverOfVehicle = await tx.driver.findUnique({
                    where: { currentVehicleId: vehicleId }
                });


                if (currentDriverOfVehicle) {
                    await tx.driver.update({
                        where: { id: currentDriverOfVehicle.id },
                        data: { currentVehicleId: null }
                    });
                }


                await tx.driver.update({
                    where: { id: driverId },
                    data: { currentVehicleId: vehicleId }
                });
            } else {

                const currentDriverOfVehicle = await tx.driver.findUnique({
                    where: { currentVehicleId: vehicleId }
                });
                if (currentDriverOfVehicle) {
                    await tx.driver.update({
                        where: { id: currentDriverOfVehicle.id },
                        data: { currentVehicleId: null }
                    });
                }
            }
        });

        return { success: true };

    } catch (error) {
        console.error("Failed to assign driver:", error);
        throw error;
    }
});

export const updateVehicleStatus = authenticatedAction(async (user, vehicleId: string, status: VehicleStatus) => {
    try {
        return await updateVehicle(vehicleId, { status });
    } catch (error) {
        console.error("Failed to update status:", error);
        throw error;
    }
});

export const addMaintenanceRecord = authenticatedAction(async (user, vehicleId: string, recordData: { type: string, date: Date, cost: number, description?: string }) => {
    try {
        const existingVehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            select: { companyId: true }
        });

        if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

        await checkPermission(user.id, existingVehicle.companyId, ["role_admin", "role_manager"]);

        const record = await db.maintenanceRecord.create({
            data: {
                vehicleId,
                ...recordData
            }
        });


        await db.vehicle.update({
            where: { id: vehicleId },
            data: { status: "MAINTENANCE" }
        });

        return record;
    } catch (error) {
        console.error("Failed to add maintenance record:", error);
        throw error;
    }
});

export const getOpenIssuesForUser = authenticatedAction(async (user) => {
    try {
        if (!user || !user.companyId) { // Should be guaranteed by authenticatedAction but keeping for safety
            throw new Error("Unauthorized");
        }

        const vehicles = await db.vehicle.findMany({
            where: { companyId: user.companyId },
            include: {
                issues: {
                    where: {
                        status: { in: ["OPEN", "IN_PROGRESS"] }
                    },
                    orderBy: { createdAt: 'desc' },
                    include: {
                        vehicle: {
                            select: { plate: true }
                        }
                    }
                }
            }
        });

        const issues: any[] = [];
        vehicles.forEach(v => {
            if (v.issues && v.issues.length > 0) {
                issues.push(...v.issues);
            }
        });

        return issues.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    } catch (error) {
        console.error("Failed to get open issues:", error);
        return [];
    }
});

export const getVehicleKpiCards = authenticatedAction(async (user) => {
    try {

        await checkPermission(user.id, user.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const vehicles = await db.vehicle.findMany({
            where: { companyId: user.companyId },
            select: {
                id: true,
                status: true,
                _count: {
                    select: {
                        issues: {
                            where: {
                                status: { in: ["OPEN", "IN_PROGRESS"] }
                            }
                        },
                        documents: {
                            where: {
                                expiryDate: {
                                    lt: new Date()
                                }
                            }
                        }
                    }
                }
            }
        });
        console.log(vehicles)
        return vehicles;

    } catch (error) {
        console.error("Failed to get vehicle kpi cards:", error);
        throw error;
    }
});

export const getVehicleCapacityStats = authenticatedAction(async (user) => {
    try {

        await checkPermission(user.id, user.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const vehicles = await db.vehicle.findMany({
            where: { companyId: user.companyId },
            select: {
                id: true,
                plate: true,
                maxLoadKg: true,
            }
        });
        return vehicles;

    } catch (error) {
        console.error("Failed to get vehicle capacity stats:", error);
        throw error;
    }
});
export const getExpiringDocuments = authenticatedAction(async (user) => {
    try {
        await checkPermission(user.id, user.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        // Fetch vehicles that have documents
        const vehicles = await db.vehicle.findMany({
            where: {
                companyId: user.companyId,
                documents: {
                    some: {} // Check if vehicle has any documents
                }
            },
            select: {
                id: true,
                plate: true,
                documents: {
                    select: {
                        type: true,
                        expiryDate: true
                    }
                }
            }
        });

        // Flatten the structure to return a list of documents with vehicle plate
        const expiringDocs: any[] = [];
        vehicles.forEach(v => {
            if (v.documents) {
                v.documents.forEach((d: any) => {
                    if (d.expiryDate) {
                        expiringDocs.push({
                            plate: v.plate,
                            type: d.type,
                            expiresOn: d.expiryDate
                        });
                    }
                });
            }
        });

        return expiringDocs;

    } catch (error) {
        console.error("Failed to fetch expiring documents:", error);
        throw error;
    }
});