"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export async function createMaintenanceRecord(
    userId: string,
    companyId: string,
    vehicleId: string,
    type: string,
    date: Date,
    cost: number,
    description?: string
) {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager", "role_dispatcher"]);


        const vehicle = await db.vehicle.findUnique({
            where: { id: vehicleId },
            select: { companyId: true }
        });

        if (!vehicle || vehicle.companyId !== companyId) {
            throw new Error("Invalid vehicle or vehicle does not belong to this company");
        }

        const newRecord = await db.maintenanceRecord.create({
            data: {
                vehicleId,
                type,
                date,
                cost,
                description,
            },
        });



        return { maintenanceRecord: newRecord };
    } catch (error: any) {
        console.error("Failed to create maintenance record:", error);
        throw new Error(error.message || "Failed to create maintenance record");
    }
}

export async function getMaintenanceRecords(companyId: string, userId: string, vehicleId?: string) {
    try {
        await checkPermission(userId, companyId);

        const whereClause: Prisma.MaintenanceRecordWhereInput = {
            vehicle: {
                companyId: companyId
            }
        };

        if (vehicleId) {
            whereClause.vehicleId = vehicleId;
        }

        const records = await db.maintenanceRecord.findMany({
            where: whereClause,
            include: {
                vehicle: {
                    select: {
                        plate: true,
                        brand: true,
                        model: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });
        return records;
    } catch (error: any) {
        console.error("Failed to get maintenance records:", error);
        throw new Error(error.message || "Failed to get maintenance records");
    }
}

export async function getMaintenanceRecordById(recordId: string, userId: string) {
    try {
        const record = await db.maintenanceRecord.findUnique({
            where: { id: recordId },
            include: {
                vehicle: true
            }
        });

        if (!record) throw new Error("Maintenance record not found");

        if (record.vehicle?.companyId) {
            await checkPermission(userId, record.vehicle.companyId);
        }

        return record;
    } catch (error: any) {
        console.error("Failed to get maintenance record:", error);
        throw new Error(error.message || "Failed to get maintenance record");
    }
}

export async function updateMaintenanceRecord(recordId: string, userId: string, data: Prisma.MaintenanceRecordUpdateInput) {
    try {
        const existingRecord = await db.maintenanceRecord.findUnique({
            where: { id: recordId },
            include: { vehicle: { select: { companyId: true } } }
        });

        if (!existingRecord?.vehicle?.companyId) throw new Error("Maintenance record not found");

        await checkPermission(userId, existingRecord.vehicle.companyId, ["role_admin", "role_manager"]);

        const updatedRecord = await db.maintenanceRecord.update({
            where: { id: recordId },
            data: {
                ...data,
            }
        });

        return updatedRecord;
    } catch (error: any) {
        console.error("Failed to update maintenance record:", error);
        throw new Error(error.message || "Failed to update maintenance record");
    }
}

export async function deleteMaintenanceRecord(recordId: string, userId: string) {
    try {
        const existingRecord = await db.maintenanceRecord.findUnique({
            where: { id: recordId },
            include: { vehicle: { select: { companyId: true } } }
        });

        if (!existingRecord?.vehicle?.companyId) throw new Error("Maintenance record not found");

        await checkPermission(userId, existingRecord.vehicle.companyId, ["role_admin", "role_manager"]);

        await db.maintenanceRecord.delete({
            where: { id: recordId }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete maintenance record:", error);
        throw new Error(error.message || "Failed to delete maintenance record");
    }
}

export async function getMaintenanceStats(companyId: string, userId: string) {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31);

        const records = await db.maintenanceRecord.findMany({
            where: {
                vehicle: { companyId },
                date: {
                    gte: startOfYear,
                    lte: endOfYear
                }
            },
            select: {
                cost: true,
                type: true,
                date: true
            }
        });

        const totalCost = records.reduce((sum, record) => sum + record.cost, 0);

        // Group by type
        const costByType: Record<string, number> = {};
        records.forEach(record => {
            costByType[record.type] = (costByType[record.type] || 0) + record.cost;
        });

        return {
            totalCost,
            costByType,
            recordCount: records.length
        };

    } catch (error: any) {
        console.error("Failed to get maintenance stats:", error);
        throw new Error(error.message || "Failed to get maintenance stats");
    }
}
