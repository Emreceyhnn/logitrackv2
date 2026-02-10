"use server";

import { db } from "../db";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export async function createInventoryItem(
    userId: string,
    companyId: string,
    warehouseId: string,
    sku: string,
    name: string,
    quantity: number,
    minStock: number = 0
) {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager", "role_warehouse"]);


        const warehouse = await db.warehouse.findUnique({
            where: { id: warehouseId },
        });

        if (!warehouse || warehouse.companyId !== companyId) {
            throw new Error("Invalid warehouse");
        }


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
                companyId
            }
        });

        return { inventory: newItem };
    } catch (error: any) {
        console.error("Failed to create inventory item:", error);
        throw new Error(error.message || "Failed to create inventory item");
    }
}

export async function getInventory(companyId: string, userId: string, warehouseId?: string) {
    try {
        await checkPermission(userId, companyId);

        const whereClause: Prisma.InventoryWhereInput = { companyId };
        if (warehouseId) {
            whereClause.warehouseId = warehouseId;
        }

        const inventory = await db.inventory.findMany({
            where: whereClause,
            include: {
                warehouse: {
                    select: { name: true, code: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        return inventory;
    } catch (error: any) {
        console.error("Failed to get inventory:", error);
        throw new Error(error.message || "Failed to get inventory");
    }
}

export async function getInventoryItemById(inventoryId: string, userId: string) {
    try {
        const item = await db.inventory.findUnique({
            where: { id: inventoryId },
            include: {
                warehouse: true
            }
        });

        if (!item) throw new Error("Inventory item not found");

        if (item.companyId) {
            await checkPermission(userId, item.companyId);
        }

        return item;
    } catch (error: any) {
        console.error("Failed to get inventory item:", error);
        throw new Error(error.message || "Failed to get inventory item");
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
                ...data,
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

export async function getLowStockItems(companyId: string, userId: string) {
    try {
        await checkPermission(userId, companyId, ["role_admin", "role_manager", "role_warehouse"]);

        const lowStockItems = await db.inventory.findMany({
            where: {
                companyId,
                quantity: {
                    lte: db.inventory.fields.minStock
                }
            },
            include: {
                warehouse: {
                    select: { name: true }
                }
            }
        });

        return lowStockItems;
    } catch (error: any) {
        console.error("Failed to get low stock items:", error);
        throw new Error(error.message || "Failed to get low stock items");
    }
}
