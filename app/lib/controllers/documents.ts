"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export async function createDocument(
    userId: string,
    companyId: string,
    type: string,
    name: string,
    url: string,
    expiryDate?: Date,
    driverId?: string,
    vehicleId?: string
) {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager", "role_dispatcher"]);


        if (!driverId && !vehicleId) {
            throw new Error("Document must be associated with a driver or a vehicle");
        }

        if (driverId) {
            const driver = await db.driver.findUnique({ where: { id: driverId }, select: { companyId: true } });
            if (!driver || driver.companyId !== companyId) throw new Error("Invalid driver");
        }

        if (vehicleId) {
            const vehicle = await db.vehicle.findUnique({ where: { id: vehicleId }, select: { companyId: true } });
            if (!vehicle || vehicle.companyId !== companyId) throw new Error("Invalid vehicle");
        }

        const newDocument = await db.document.create({
            data: {
                type,
                name,
                url,
                expiryDate,
                companyId,
                driverId,
                vehicleId
            },
        });

        return { document: newDocument };
    } catch (error: any) {
        console.error("Failed to create document:", error);
        throw new Error(error.message || "Failed to create document");
    }
}

export async function getDocuments(companyId: string, userId: string, entityType?: "driver" | "vehicle", entityId?: string) {
    try {
        await checkPermission(userId, companyId);

        const whereClause: Prisma.DocumentWhereInput = { companyId };

        if (entityType === "driver" && entityId) {
            whereClause.driverId = entityId;
        } else if (entityType === "vehicle" && entityId) {
            whereClause.vehicleId = entityId;
        }

        const documents = await db.document.findMany({
            where: whereClause,
            include: {
                driver: { select: { user: { select: { name: true, surname: true } } } },
                vehicle: { select: { plate: true, brand: true, model: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return documents;
    } catch (error: any) {
        console.error("Failed to get documents:", error);
        throw new Error(error.message || "Failed to get documents");
    }
}

export async function getDocumentById(documentId: string, userId: string) {
    try {
        const document = await db.document.findUnique({
            where: { id: documentId },
            include: {
                driver: true,
                vehicle: true
            }
        });

        if (!document) throw new Error("Document not found");

        if (document.companyId) {
            await checkPermission(userId, document.companyId);
        }

        return document;
    } catch (error: any) {
        console.error("Failed to get document:", error);
        throw new Error(error.message || "Failed to get document");
    }
}

export async function deleteDocument(documentId: string, userId: string) {
    try {
        const existingDocument = await db.document.findUnique({
            where: { id: documentId },
            select: { companyId: true }
        });

        if (!existingDocument?.companyId) throw new Error("Document not found");

        await checkPermission(userId, existingDocument.companyId, ["role_admin", "role_manager"]);

        await db.document.delete({
            where: { id: documentId }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete document:", error);
        throw new Error(error.message || "Failed to delete document");
    }
}

export async function getExpiringDocuments(companyId: string, userId: string, daysThreshold: number = 30) {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

        const expiringDocuments = await db.document.findMany({
            where: {
                companyId,
                expiryDate: {
                    lte: thresholdDate,
                    gte: new Date() // Not expired yet, but expiring soon. Or include expired? Let's just say <= threshold.
                }
            },
            include: {
                driver: { select: { user: { select: { name: true, surname: true } } } },
                vehicle: { select: { plate: true } }
            },
            orderBy: { expiryDate: 'asc' }
        });

        return expiringDocuments;
    } catch (error: any) {
        console.error("Failed to get expiring documents:", error);
        throw new Error(error.message || "Failed to get expiring documents");
    }
}
