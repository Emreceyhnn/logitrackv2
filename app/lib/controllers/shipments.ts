"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export async function createShipment(
    userId: string,
    companyId: string,
    customerId: string,
    origin: string,
    destination: string,
    status: string = "PENDING",
    itemsCount: number = 1,
    trackingId?: string
) {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager", "role_dispatcher"]);


        const finalTrackingId = trackingId || `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;


        const existingShipment = await db.shipment.findUnique({
            where: { trackingId: finalTrackingId },
        });

        if (existingShipment) {
            throw new Error("Tracking ID already exists");
        }

        const newShipment = await db.shipment.create({
            data: {
                trackingId: finalTrackingId,
                customerId,
                origin,
                destination,
                status,
                itemsCount,
                companyId,
                history: {
                    create: {
                        status,
                        description: "Shipment created",
                        createdBy: userId
                    }
                }
            },
        });

        return { shipment: newShipment };
    } catch (error: any) {
        console.error("Failed to create shipment:", error);
        throw new Error(error.message || "Failed to create shipment");
    }
}

// ... (getShipments and getShipmentById omitted for brevity, they don't change logic, just maybe return type if include changes, but that's handled by Prisma types)

export async function assignDriverToShipment(shipmentId: string, driverId: string, userId: string) {
    try {
        const existingShipment = await db.shipment.findUnique({
            where: { id: shipmentId },
            select: { companyId: true, status: true }
        });

        if (!existingShipment?.companyId) throw new Error("Shipment not found");

        await checkPermission(userId, existingShipment.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const updatedShipment = await db.shipment.update({
            where: { id: shipmentId },
            data: {
                driverId,
                status: "assigned",
                history: {
                    create: {
                        status: "assigned",
                        description: `Driver assigned`,
                        createdBy: userId
                    }
                }
            }
        });

        return updatedShipment;
    } catch (error: any) {
        console.error("Failed to assign driver to shipment:", error);
        throw new Error(error.message || "Failed to assign driver to shipment");
    }
}

export async function assignRouteToShipment(shipmentId: string, routeId: string, userId: string) {
    try {
        const existingShipment = await db.shipment.findUnique({
            where: { id: shipmentId },
            select: { companyId: true, status: true }
        });

        if (!existingShipment?.companyId) throw new Error("Shipment not found");

        await checkPermission(userId, existingShipment.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const updatedShipment = await db.shipment.update({
            where: { id: shipmentId },
            data: {
                routeId,
                status: "planned",
                history: {
                    create: {
                        status: "planned",
                        description: `Route assigned`,
                        createdBy: userId
                    }
                }
            }
        });

        return updatedShipment;
    } catch (error: any) {
        console.error("Failed to assign route to shipment:", error);
        throw new Error(error.message || "Failed to assign route to shipment");
    }
}

export async function updateShipmentStatus(shipmentId: string, status: string, userId: string, location?: string, description?: string) {
    try {
        const existingShipment = await db.shipment.findUnique({
            where: { id: shipmentId },
            select: { companyId: true }
        });

        if (!existingShipment?.companyId) throw new Error("Shipment not found");

        await checkPermission(userId, existingShipment.companyId, ["role_admin", "role_manager", "role_dispatcher", "role_driver"]);

        const updatedShipment = await db.shipment.update({
            where: { id: shipmentId },
            data: {
                status,
                history: {
                    create: {
                        status,
                        location,
                        description: description || `Status updated to ${status}`,
                        createdBy: userId
                    }
                }
            }
        });

        return updatedShipment;
    } catch (error: any) {
        console.error("Failed to update shipment status:", error);
        throw new Error(error.message || "Failed to update shipment status");
    }
}

export async function getShipments(companyId: string, userId: string) {
    try {
        await checkPermission(userId, companyId);

        const shipments = await db.shipment.findMany({
            where: { companyId },
            include: {
                customer: true,
                driver: {
                    include: {
                        user: {
                            select: { name: true, surname: true, avatarUrl: true }
                        }
                    }
                },
                route: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return shipments;
    } catch (error: any) {
        console.error("Failed to get shipments:", error);
        throw new Error(error.message || "Failed to get shipments");
    }
}

export async function getShipmentById(shipmentId: string, userId: string) {
    try {
        const shipment = await db.shipment.findUnique({
            where: { id: shipmentId },
            include: {
                customer: true,
                driver: {
                    include: {
                        user: {
                            select: { name: true, surname: true, avatarUrl: true }
                        }
                    }
                },
                route: true,
                company: true,
                history: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!shipment) throw new Error("Shipment not found");

        if (shipment.companyId) {
            await checkPermission(userId, shipment.companyId);
        }

        return shipment;
    } catch (error: any) {
        console.error("Failed to get shipment:", error);
        throw new Error(error.message || "Failed to get shipment");
    }
}

export async function updateShipment(shipmentId: string, userId: string, data: Prisma.ShipmentUpdateInput) {
    try {
        const existingShipment = await db.shipment.findUnique({
            where: { id: shipmentId },
            select: { companyId: true }
        });

        if (!existingShipment?.companyId) throw new Error("Shipment not found");

        await checkPermission(userId, existingShipment.companyId, ["role_admin", "role_manager", "role_dispatcher"]);

        const updatedShipment = await db.shipment.update({
            where: { id: shipmentId },
            data: {
                ...data,
            }
        });

        return updatedShipment;
    } catch (error: any) {
        console.error("Failed to update shipment:", error);
        throw new Error(error.message || "Failed to update shipment");
    }
}

export async function deleteShipment(shipmentId: string, userId: string) {
    try {
        const existingShipment = await db.shipment.findUnique({
            where: { id: shipmentId },
            select: { companyId: true }
        });

        if (!existingShipment?.companyId) throw new Error("Shipment not found");

        await checkPermission(userId, existingShipment.companyId, ["role_admin", "role_manager"]);

        await db.shipment.delete({
            where: { id: shipmentId }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete shipment:", error);
        throw new Error(error.message || "Failed to delete shipment");
    }
}



export async function getShipmentByTrackingId(trackingId: string, userId: string) {
    try {
        const shipment = await db.shipment.findUnique({
            where: { trackingId },
            include: {
                customer: true,
                driver: true,
                route: true,
                history: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!shipment) throw new Error("Shipment not found");

        if (shipment.companyId) {
            await checkPermission(userId, shipment.companyId);
        }

        return shipment;
    } catch (error: any) {
        console.error("Failed to get shipment by tracking ID:", error);
        throw new Error(error.message || "Failed to get shipment");
    }
}
