"use server";

import { db } from "../db";
import { DriverStatus } from "@prisma/client";

export async function getDriverById(driverId: string) {
    try {
        const driver = await db.driver.findUnique({
            where: { id: driverId },
            include: {
                user: true,
                currentVehicle: true,
                company: true,
                homeBaseWarehouse: true,
                shipments: true
            }
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

export async function updateDriver(driverId: string, data: {
    licenseNumber?: string;
    licenseType?: string;
    licenseExpiry?: Date;
    phone?: string;
    status?: DriverStatus;
    employeeId?: string;
    homeBaseWarehouseId?: string;
}) {
    try {
        const updatedDriver = await db.driver.update({
            where: { id: driverId },
            data: {
                licenseNumber: data.licenseNumber,
                licenseType: data.licenseType,
                licenseExpiry: data.licenseExpiry,
                phone: data.phone,
                status: data.status,
                employeeId: data.employeeId,
                homeBaseWarehouseId: data.homeBaseWarehouseId
            },
        });
        return updatedDriver;
    } catch (error: any) {
        console.error("Failed to update driver:", error);
        throw new Error(error.message || "Failed to update driver");
    }
}

export async function deleteDriver(driverId: string) {
    try {
        // First fetch the driver to get the user ID
        const driver = await db.driver.findUnique({
            where: { id: driverId },
            select: { userId: true }
        });

        if (!driver) {
            throw new Error("Driver not found");
        }


        const deletedDriver = await db.driver.delete({
            where: { id: driverId },
        });


        return deletedDriver;
    } catch (error: any) {
        console.error("Failed to delete driver:", error);
        throw new Error(error.message || "Failed to delete driver");
    }
}

export async function updateDriverStatus(driverId: string, status: DriverStatus) {
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

export async function assignVehicleToDriver(driverId: string, vehicleId: string) {
    try {
        // Check if vehicle is already assigned
        const vehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            include: { driver: true }
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
                currentVehicleId: vehicleId
            }
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
                currentVehicleId: null
            }
        });

        return updatedDriver;
    } catch (error: any) {
        console.error("Failed to unassign vehicle from driver:", error);
        throw new Error(error.message || "Failed to unassign vehicle from driver");
    }
}
