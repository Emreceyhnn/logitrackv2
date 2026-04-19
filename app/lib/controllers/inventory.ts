"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";
import {
  InventoryWithRelations,
  LowStockItem,
} from "../type/inventory";

export const createInventoryItem = authenticatedAction(
  async (
    user,
    warehouseId: string,
    sku: string,
    name: string,
    quantity: number,
    minStock: number = 0,
    weightKg: number = 0,
    volumeM3: number = 0,
    palletCount: number = 0,
    cargoType: string = "General Cargo"
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      if (!companyId) throw new Error("User has no company");

      const warehouse = await db.warehouse.findUnique({
        where: { id: warehouseId },
      });

      if (!warehouse || warehouse.companyId !== companyId) {
        throw new Error("Invalid warehouse or unauthorized");
      }

      // Auto-generate SKU if not provided
      const itemSku = sku || `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const existingItem = await db.inventory.findUnique({
        where: {
          warehouseId_sku: {
            warehouseId,
            sku: itemSku,
          },
        },
      });

      if (existingItem) {
        throw new Error("Item with this SKU already exists in this warehouse");
      }

      const newItem = await db.inventory.create({
        data: {
          warehouseId,
          sku: itemSku,
          name,
          quantity,
          minStock,
          weightKg,
          volumeM3,
          palletCount,
          cargoType,
          companyId,
        },
      });

      return { inventory: newItem };
    } catch (error) {
      console.error("Failed to create inventory item:", error);
      throw error;
    }
  }
);

export const getInventory = authenticatedAction(
  async (user, warehouseId?: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId);

      if (!companyId) throw new Error("User has no company");

      const whereClause: Prisma.InventoryWhereInput = {
        companyId,
      };
      if (warehouseId) {
        whereClause.warehouseId = warehouseId;
      }

      const inventory = await db.inventory.findMany({
        where: whereClause,
        include: {
          warehouse: {
            select: { name: true, code: true },
          },
        },
        orderBy: { name: "asc" },
      });
      return inventory;
    } catch (error) {
      console.error("Failed to get inventory:", error);
      throw error;
    }
  }
);

export const getInventoryItemById = authenticatedAction(
  async (user, inventoryId: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId);

      const item = await db.inventory.findUnique({
        where: { id: inventoryId },
        include: {
          warehouse: true,
        },
      });

      if (!item || item.companyId !== companyId) {
        throw new Error("Inventory item not found or unauthorized");
      }

      return item;
    } catch (error) {
      console.error("Failed to get inventory item:", error);
      throw error;
    }
  }
);

export const updateInventoryItem = authenticatedAction(
  async (user, inventoryId: string, data: Prisma.InventoryUpdateInput) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const existingItem = await db.inventory.findUnique({
        where: { id: inventoryId },
        select: { companyId: true },
      });

      if (!existingItem || existingItem.companyId !== companyId) {
        throw new Error("Inventory item not found or unauthorized");
      }

      const updatedItem = await db.inventory.update({
        where: { id: inventoryId },
        data: {
          ...data,
        },
      });

      return updatedItem;
    } catch (error) {
      console.error("Failed to update inventory item:", error);
      throw error;
    }
  }
);

export const deleteInventoryItem = authenticatedAction(
  async (user, inventoryId: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const existingItem = await db.inventory.findUnique({
        where: { id: inventoryId },
        select: { companyId: true },
      });

      if (!existingItem || existingItem.companyId !== companyId) {
        throw new Error("Inventory item not found or unauthorized");
      }

      await db.inventory.delete({
        where: { id: inventoryId },
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
      throw error;
    }
  }
);

export const getLowStockItems = authenticatedAction(async (user) => {
  const companyId = user?.companyId || "";
  const userId = user?.id || "";
  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_warehouse",
    ]);

    if (!companyId) throw new Error("User has no company");

    const lowStockItems = await db.inventory.findMany({
      where: {
        companyId,
        quantity: {
          lte: db.inventory.fields.minStock,
        },
      },
      include: {
        warehouse: {
          select: { name: true },
        },
      },
    });

    return lowStockItems;
  } catch (error) {
    console.error("Failed to get low stock items:", error);
    throw error;
  }
});

export const getInventoryWithDashboardData = authenticatedAction(
  async (
    user,
    page: number = 1,
    pageSize: number = 10,
    warehouseId?: string,
    search?: string
  ): Promise<{
    items: InventoryWithRelations[];
    totalCount: number;
    stats: {
      totalItems: number;
      lowStockCount: number;
      outOfStockCount: number;
      totalValue: number;
    };
    lowStockItems: LowStockItem[];
  }> => {
    const userId = user?.id;
    const companyId = user?.companyId;

    try {
      if (!companyId) throw new Error("User has no company");

      const skip = (page - 1) * pageSize;

      const where: Prisma.InventoryWhereInput = { companyId };
      if (warehouseId) where.warehouseId = warehouseId;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ];
      }

      // ── Parallel Orchestration ──────────────────────────────────────────
      const [
        ,
        items,
        totalCount,
        allStatsItems,
        lowStockItems,
      ] = await Promise.all([
        checkPermission(userId, companyId, ["role_admin", "role_manager", "role_warehouse"]),
        db.inventory.findMany({
          where,
          include: {
            warehouse: { select: { name: true, code: true } },
          },
          orderBy: { name: "asc" },
          skip,
          take: pageSize,
        }),
        db.inventory.count({ where }),
        // Fetch all items summary for accurate KPI calculation across the filtered set
        db.inventory.findMany({
          where,
          select: { quantity: true, minStock: true, unitValue: true },
        }),
        db.inventory.findMany({
          where: {
            ...where,
            quantity: { lte: db.inventory.fields.minStock },
          },
          include: {
            warehouse: { select: { name: true } },
          },
          take: 10, // Preview of low stock
        }),
      ]);

      // KPI Calculations
      let totalItems = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      let totalValue = 0;

      allStatsItems.forEach((item) => {
        totalItems++;
        if (item.quantity === 0) {
          outOfStockCount++;
        } else if (item.quantity <= item.minStock) {
          lowStockCount++;
        }
        totalValue += item.quantity * (Number(item.unitValue) || 0);
      });

      return {
        items: items as unknown as InventoryWithRelations[],
        totalCount,
        stats: {
          totalItems,
          lowStockCount,
          outOfStockCount,
          totalValue,
        },
        lowStockItems: lowStockItems as unknown as LowStockItem[],
      };
    } catch (error) {
      console.error("Failed to get inventory combined data:", error);
      throw error;
    }
  }
);


export const getInventoryMovements = authenticatedAction(
  async (user, sku: string, warehouseId: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId);

      const movements = await db.inventoryMovement.findMany({
        where: {
          sku,
          warehouseId,
          companyId,
        },
        include: {
          user: {
            select: { name: true, surname: true },
          },
        },
        orderBy: { date: "desc" },
        take: 20,
      });

      return movements;
    } catch (error) {
      console.error("Failed to get inventory movements:", error);
      throw error;
    }
  }
);

export const logWarehouseFulfillment = authenticatedAction(
  async (
    user,
    warehouseId: string,
    sku: string,
    quantity: number,
    type: "PICK" | "PACK"
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
        "role_dispatcher",
      ]);

      if (!companyId) throw new Error("User has no company");

      // Verify the item actually exists here before we pick/pack it
      const inventoryNode = await db.inventory.findUnique({
        where: { warehouseId_sku: { warehouseId, sku } }
      });

      if (!inventoryNode) {
        throw new Error("Inventory SKU not found in this facility.");
      }

      // Record the movement.
      // E.g. If building a future "scan" interface, they fire this endpoint!
      const movement = await db.inventoryMovement.create({
        data: {
          warehouseId,
          sku,
          quantity,
          type, // strictly 'PICK' or 'PACK'
          userId,
          companyId,
          date: new Date(),
        }
      });
      
      // If picking, deduct stock instantly for accuracy 
      // Packing means it's already boxed, stock was already deducted
      if (type === "PICK") {
         await db.inventory.update({
            where: { id: inventoryNode.id },
            data: { quantity: { decrement: quantity } }
         });
      }

      return { success: true, movement };
    } catch (error) {
      console.error("Failed to log warehouse fulfillment:", error);
      throw error;
    }
  }
);
