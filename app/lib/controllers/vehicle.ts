"use server";

import { db } from "../db";
import { VehicleStatus } from "@prisma/client";
import { checkPermission } from "./utils/checkPermission";

export const createVehicle = async (companyId: string, userId: string, vehicleData: any) => {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const vehicle = await db.vehicle.create({
            data: {
                companyId,
                ...vehicleData,
            },
        });
        return vehicle;
    } catch (error) {
        console.error("Failed to create vehicle:", error);
        throw error;
    }
}

export const getVehicles = async (companyId: string, userId: string) => {
    try {
        await checkPermission(userId, companyId);

        const vehicles = await db.vehicle.findMany({
            where: { companyId },
            include: {
                driver: {
                    include: {
                        user: {
                            select: { name: true, surname: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return vehicles;
    } catch (error) {
        console.error("Failed to get vehicles:", error);
        throw error;
    }
}

export const getVehicleById = async (vehicleId: string, userId: string) => {
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
                maintenanceRecords: {
                    orderBy: { date: 'desc' },
                    take: 5
                }
            }
        });

        if (!vehicle) throw new Error("Vehicle not found");

        if (vehicle.companyId) {
            await checkPermission(userId, vehicle.companyId);
        }

        return vehicle;
    } catch (error) {
        console.error("Failed to get vehicle:", error);
        throw error;
    }
}

export const updateVehicle = async (vehicleId: string, userId: string, data: any) => {
    try {
        const existingVehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            select: { companyId: true }
        });

        if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

        await checkPermission(userId, existingVehicle.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

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
}

export const deleteVehicle = async (vehicleId: string, userId: string) => {
    try {
        const existingVehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            select: { companyId: true }
        });

        if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

        await checkPermission(userId, existingVehicle.companyId, ["role_admin", "role_manager"]);

        await db.vehicle.delete({
            where: { id: vehicleId }
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to delete vehicle:", error);
        throw error;
    }
}

export const assignDriverToVehicle = async (vehicleId: string, driverId: string | null, userId: string) => {
    try {
        const existingVehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            select: { companyId: true }
        });

        if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

        await checkPermission(userId, existingVehicle.companyId, ["role_admin", "role_manager", "role_dispatcher"]);


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
}

export const updateVehicleStatus = async (vehicleId: string, status: VehicleStatus, userId: string) => {
    try {
        return await updateVehicle(vehicleId, userId, { status });
    } catch (error) {
        console.error("Failed to update status:", error);
        throw error;
    }
}

export const addMaintenanceRecord = async (vehicleId: string, userId: string, recordData: { type: string, date: Date, cost: number, description?: string }) => {
    try {
        const existingVehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            select: { companyId: true }
        });

        if (!existingVehicle?.companyId) throw new Error("Vehicle not found");

        await checkPermission(userId, existingVehicle.companyId, ["role_admin", "role_manager"]);

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
}