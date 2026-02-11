"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";
import { Prisma, WarehouseType } from "@prisma/client";

export async function createWarehouse(
    userId: string,
    companyId: string,
    name: string,
    code: string,
    type: WarehouseType,
    address: string,
    city: string,
    country: string,
    lat?: number,
    lng?: number,
    managerId?: string
) {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager"]);


        const existingWarehouse = await db.warehouse.findUnique({
            where: { code },
        });

        if (existingWarehouse) {
            throw new Error("Warehouse code already exists");
        }

        const newWarehouse = await db.warehouse.create({
            data: {
                name,
                code,
                type,
                address,
                city,
                country,
                lat,
                lng,
                companyId,
                managerId,
            },
        });

        return { warehouse: newWarehouse };
    } catch (error: any) {
        console.error("Failed to create warehouse:", error);
        throw new Error(error.message || "Failed to create warehouse");
    }
}

export async function getWarehouses(companyId: string, userId: string) {
    try {
        await checkPermission(userId, companyId);

        const warehouses = await db.warehouse.findMany({
            where: { companyId },
            include: {
                manager: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                        avatarUrl: true
                    }
                },
                _count: {
                    select: {
                        inventory: true,
                        drivers: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return warehouses;
    } catch (error: any) {
        console.error("Failed to get warehouses:", error);
        throw new Error(error.message || "Failed to get warehouses");
    }
}

export async function getWarehouseById(warehouseId: string, userId: string) {
    try {
        const warehouse = await db.warehouse.findUnique({
            where: { id: warehouseId },
            include: {
                manager: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                        avatarUrl: true
                    }
                },
                inventory: true,
                drivers: {
                    include: {
                        user: {
                            select: { name: true, surname: true, avatarUrl: true }
                        }
                    }
                }
            }
        });

        if (!warehouse) throw new Error("Warehouse not found");

        if (warehouse.companyId) {
            await checkPermission(userId, warehouse.companyId);
        }

        return warehouse;
    } catch (error: any) {
        console.error("Failed to get warehouse:", error);
        throw new Error(error.message || "Failed to get warehouse");
    }
}

export async function updateWarehouse(warehouseId: string, userId: string, data: Prisma.WarehouseUpdateInput) {
    try {
        const existingWarehouse = await db.warehouse.findUnique({
            where: { id: warehouseId },
            select: { companyId: true }
        });

        if (!existingWarehouse?.companyId) throw new Error("Warehouse not found");

        await checkPermission(userId, existingWarehouse.companyId, ["role_admin", "role_manager"]);

        const updatedWarehouse = await db.warehouse.update({
            where: { id: warehouseId },
            data: {
                ...data,
            }
        });

        return updatedWarehouse;
    } catch (error: any) {
        console.error("Failed to update warehouse:", error);
        throw new Error(error.message || "Failed to update warehouse");
    }
}

export async function deleteWarehouse(warehouseId: string, userId: string) {
    try {
        const existingWarehouse = await db.warehouse.findUnique({
            where: { id: warehouseId },
            select: { companyId: true }
        });

        if (!existingWarehouse?.companyId) throw new Error("Warehouse not found");

        await checkPermission(userId, existingWarehouse.companyId, ["role_admin"]);

        await db.warehouse.delete({
            where: { id: warehouseId }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete warehouse:", error);
        throw new Error(error.message || "Failed to delete warehouse");
    }
}

export async function assignManagerToWarehouse(warehouseId: string, managerId: string, userId: string) {
    try {
        const existingWarehouse = await db.warehouse.findUnique({
            where: { id: warehouseId },
            select: { companyId: true }
        });

        if (!existingWarehouse?.companyId) throw new Error("Warehouse not found");

        await checkPermission(userId, existingWarehouse.companyId, ["role_admin"]);

        const updatedWarehouse = await db.warehouse.update({
            where: { id: warehouseId },
            data: {
                managerId,
            }
        });

        return updatedWarehouse;
    } catch (error: any) {
        console.error("Failed to assign manager to warehouse:", error);
        throw new Error(error.message || "Failed to assign manager to warehouse");
    }
}

export async function addInventoryItem(warehouseId: string, sku: string, name: string, quantity: number, userId: string, minStock: number = 0) {
    try {
        const existingWarehouse = await db.warehouse.findUnique({
            where: { id: warehouseId },
            select: { companyId: true }
        });

        if (!existingWarehouse?.companyId) throw new Error("Warehouse not found");

        await checkPermission(userId, existingWarehouse.companyId, ["role_admin", "role_manager", "role_warehouse"]);

        const existingItem = await db.inventory.findUnique({
            where: {
                warehouseId_sku: {
                    warehouseId,
                    sku
                }
            }
        });

        if (existingItem) {
            throw new Error("Item with this SKU already exists in this warehouse");
        }

        const newItem = await db.inventory.create({
            data: {
                warehouseId,
                sku,
                name,
                quantity,
                minStock,
                companyId: existingWarehouse.companyId
            }
        });

        return newItem;
    } catch (error: any) {
        console.error("Failed to add inventory item:", error);
        throw new Error(error.message || "Failed to add inventory item");
    }
}

export async function updateInventoryItem(inventoryId: string, userId: string, data: Prisma.InventoryUpdateInput) {
    try {
        const existingItem = await db.inventory.findUnique({
            where: { id: inventoryId },
            select: { companyId: true }
        });

        if (!existingItem?.companyId) throw new Error("Inventory item not found");

        await checkPermission(userId, existingItem.companyId, ["role_admin", "role_manager", "role_warehouse"]);

        const updatedItem = await db.inventory.update({
            where: { id: inventoryId },
            data: {
                ...data
            }
        });

        return updatedItem;
    } catch (error: any) {
        console.error("Failed to update inventory item:", error);
        throw new Error(error.message || "Failed to update inventory item");
    }
}

export async function deleteInventoryItem(inventoryId: string, userId: string) {
    try {
        const existingItem = await db.inventory.findUnique({
            where: { id: inventoryId },
            select: { companyId: true }
        });

        if (!existingItem?.companyId) throw new Error("Inventory item not found");

        await checkPermission(userId, existingItem.companyId, ["role_admin", "role_manager", "role_warehouse"]);

        await db.inventory.delete({
            where: { id: inventoryId }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete inventory item:", error);
        throw new Error(error.message || "Failed to delete inventory item");
    }
}

export async function getLowStockItems(warehouseId: string, userId: string) {
    try {
        const existingWarehouse = await db.warehouse.findUnique({
            where: { id: warehouseId },
            select: { companyId: true }
        });

        if (!existingWarehouse?.companyId) throw new Error("Warehouse not found");

        await checkPermission(userId, existingWarehouse.companyId, ["role_admin", "role_manager", "role_warehouse"]);

        const lowStockItems = await db.inventory.findMany({
            where: {
                warehouseId,
                quantity: {
                    lte: db.inventory.fields.minStock
                }
            }
        });

        return lowStockItems;
    } catch (error: any) {
        console.error("Failed to get low stock items:", error);
        throw new Error(error.message || "Failed to get low stock items");
    }
}

export async function getWarehouseStats(companyId: string, userId: string) {
    try {
        await checkPermission(userId, companyId);

        const warehouses = await db.warehouse.findMany({
            where: { companyId },
            select: { capacityPallets: true, capacityVolumeM3: true }
        });

        const totalWarehouses = warehouses.length;

        const inventoryStats = await db.inventory.aggregate({
            where: { companyId },
            _count: { sku: true },
            _sum: { quantity: true }
        });

        const totalCapacityPallets = warehouses.reduce((acc, w) => acc + w.capacityPallets, 0);
        const totalCapacityVolume = warehouses.reduce((acc, w) => acc + w.capacityVolumeM3, 0);

        return {
            totalWarehouses,
            totalSkus: inventoryStats._count.sku,
            totalItems: inventoryStats._sum.quantity || 0,
            totalCapacityPallets,
            totalCapacityVolume
        };
    } catch (error) {
        console.error("Failed to get warehouse stats:", error);
        return { totalWarehouses: 0, totalSkus: 0, totalItems: 0, totalCapacityPallets: 0, totalCapacityVolume: 0 };
    }
}

export async function getRecentStockMovements(companyId: string, userId: string) {
    try {
        await checkPermission(userId, companyId);

        const movements = await db.inventoryMovement.findMany({
            where: { companyId },
            include: {
                warehouse: { select: { code: true, name: true } }
            },
            take: 10,
            orderBy: { date: 'desc' }
        });

        const enrichedMovements = await Promise.all(movements.map(async (m) => {
            const inventoryItem = await db.inventory.findFirst({
                where: {
                    warehouseId: m.warehouseId,
                    sku: m.sku
                },
                select: { name: true }
            });
            return {
                ...m,
                itemName: inventoryItem?.name || m.sku
            };
        }));

        return enrichedMovements;
    } catch (error) {
        console.error("Failed to get stock movements:", error);
        return [];
    }
}
