"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";
import {
  InventoryWithRelations,
  LowStockItem,
  CreateInventoryInput,
  UpdateInventoryInput,
} from "../type/inventory";
import {
  redis,
  withCache,
  invalidatePattern,
  hashFilters,
  inventoryCacheKeys,
  INVENTORY_CACHE_TTL,
} from "../redis";
import { getExchangeRates } from "../services/exchangeRate";


export async function invalidateInventoryCache(companyId: string, inventoryId?: string) {
  await Promise.all([
    invalidatePattern(inventoryCacheKeys.companyPattern(companyId)),
    inventoryId ? redis.del(inventoryCacheKeys.detail(inventoryId)) : Promise.resolve(),
  ]);
}

export const createInventoryItem = authenticatedAction(
  async (user, data: CreateInventoryInput) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      if (!companyId) throw new Error("User has no company");

      const { warehouseId, sku, name, quantity, minStock = 0, weightKg = 0, volumeM3 = 0, palletCount = 0, cargoType = "General Cargo", unitValue = 0, currency = "USD" } = data;

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

      const { newItem, movement } = await db.$transaction(async (tx) => {
        const item = await tx.inventory.create({
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
            unitValue,
            currency: currency ?? "USD",
            companyId,
          },
        });

        const mvt = await tx.inventoryMovement.create({
          data: {
            warehouseId,
            sku: itemSku,
            quantity,
            type: "PUTAWAY",
            notes: "Initial inventory entry",
            userId,
            companyId,
          },
        });

        return { newItem: item, movement: mvt };
      });

      await invalidateInventoryCache(companyId, newItem.id);
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

      const cacheKey = inventoryCacheKeys.list(companyId, hashFilters({ warehouseId }));
      return await withCache(cacheKey, INVENTORY_CACHE_TTL, async () => {
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
      });
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

      const cacheKey = inventoryCacheKeys.detail(inventoryId);

      return await withCache(cacheKey, INVENTORY_CACHE_TTL, async () => {
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
      });
    } catch (error) {
      console.error("Failed to get inventory item:", error);
      throw error;
    }
  }
);

export const updateInventoryItem = authenticatedAction(
  async (user, inventoryId: string, data: UpdateInventoryInput) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    console.log(`[updateInventoryItem] Start update for ${inventoryId}`, { data, companyId, userId });
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const currentItem = await db.inventory.findUnique({
        where: { id: inventoryId },
        select: { sku: true, warehouseId: true, companyId: true, quantity: true },
      });

      if (!currentItem || currentItem.companyId !== companyId) {
        throw new Error("Inventory item not found or unauthorized");
      }

      // If SKU or Warehouse is changing, check for uniqueness
      const newSku = data.sku !== undefined ? data.sku : currentItem.sku;
      const newWarehouseId = data.warehouseId !== undefined ? data.warehouseId : currentItem.warehouseId;

      if (newSku !== currentItem.sku || newWarehouseId !== currentItem.warehouseId) {
        const duplicate = await db.inventory.findUnique({
          where: {
            warehouseId_sku: {
              warehouseId: newWarehouseId,
              sku: newSku,
            },
          },
        });

        if (duplicate && duplicate.id !== inventoryId) {
          throw new Error("Item with this SKU already exists in the target warehouse");
        }
      }

      const updatedItem = await db.$transaction(async (tx) => {
        const item = await tx.inventory.update({
          where: { id: inventoryId },
          data: data as any,
        });
        console.log(`[updateInventoryItem] Item updated in DB:`, item.id);

        // Log movement if quantity changed
        if (data.quantity !== undefined && data.quantity !== currentItem.quantity) {
          await tx.inventoryMovement.create({
            data: {
              warehouseId: newWarehouseId,
              sku: newSku,
              quantity: data.quantity - currentItem.quantity, // Delta
              type: "ADJUSTMENT",
              userId,
              companyId,
            },
          });
        }

        return item;
      });

      await invalidateInventoryCache(companyId!, inventoryId);
      return updatedItem;
    } catch (error) {
      console.error("Failed to update inventory item:", error);
      throw error;
    }
  }
);

export const getInventoryBySku = authenticatedAction(
  async (user, sku: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId);
      if (!companyId) throw new Error("User has no company");

      const items = await db.inventory.findMany({
        where: {
          sku,
          companyId,
        },
        include: {
          warehouse: {
            select: { name: true, code: true },
          },
        },
      });
      return items;
    } catch (error) {
      console.error("Failed to get inventory by SKU:", error);
      throw error;
    }
  }
);

export const adjustInventoryStock = authenticatedAction(
  async (user, inventoryId: string, delta: number, type: string = "ADJUSTMENT", notes?: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const currentItem = await db.inventory.findUnique({
        where: { id: inventoryId },
        select: { sku: true, warehouseId: true, companyId: true, quantity: true },
      });

      if (!currentItem || currentItem.companyId !== companyId) {
        throw new Error("Inventory item not found or unauthorized");
      }

      const updatedItem = await db.$transaction(async (tx) => {
        const item = await tx.inventory.update({
          where: { id: inventoryId },
          data: {
            quantity: {
              increment: delta,
            },
          },
        });

        await tx.inventoryMovement.create({
          data: {
            warehouseId: item.warehouseId,
            sku: item.sku,
            quantity: delta,
            type,
            notes,
            userId,
            companyId,
          },
        });

        return item;
      });

      await invalidateInventoryCache(companyId, inventoryId);
      return updatedItem;
    } catch (error) {
      console.error("Failed to adjust inventory stock:", error);
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

      await invalidateInventoryCache(companyId!, inventoryId);
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

    const cacheKey = inventoryCacheKeys.kpis(companyId);

    return await withCache(cacheKey, INVENTORY_CACHE_TTL, async () => {
      const allItems = await db.inventory.findMany({
        where: { companyId },
        include: {
          warehouse: {
            select: { name: true },
          },
        },
      });

      const lowStockItems = allItems.filter(item => item.quantity <= item.minStock);

      return lowStockItems as unknown as LowStockItem[];
    });
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
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    status?: string[]
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

      // Stock Status filtering
      if (status && status.length > 0) {
        const statusFilters: Prisma.InventoryWhereInput[] = [];
        
        if (status.includes("OUT_OF_STOCK")) {
          statusFilters.push({ quantity: 0 });
        }
        if (status.includes("IN_STOCK")) {
          statusFilters.push({ quantity: { gt: 0 } });
        }

        if (statusFilters.length > 0) {
          where.AND = [
            ...(where.AND as any || []),
            { OR: statusFilters }
          ];
        }
      }

      // Sort logic
      const orderBy: any = {};
      if (sortBy) {
        orderBy[sortBy] = sortOrder || "asc";
      } else {
        orderBy.name = "asc";
      }

      // ── Parallel Orchestration ──────────────────────────────────────────
      const cacheKey = inventoryCacheKeys.dashboard(
        companyId,
        hashFilters({ page, pageSize, warehouseId, search, sortBy, sortOrder, status })
      );

      return await withCache(cacheKey, INVENTORY_CACHE_TTL, async () => {
        const [
          ,
          items,
          totalCount,
          allStatsItems,
          ratesData,
        ] = await Promise.all([
          checkPermission(userId!, companyId, ["role_admin", "role_manager", "role_warehouse"]),
          db.inventory.findMany({
            where,
            include: {
              warehouse: { select: { name: true, code: true } },
            },
            orderBy,
            skip,
            take: pageSize,
          }),
          db.inventory.count({ where }),
          db.inventory.findMany({
            where,
            select: { 
              id: true, 
              name: true, 
              quantity: true, 
              minStock: true, 
              unitValue: true, 
              currency: true,
              warehouse: { select: { name: true } } 
            },
          }),
          getExchangeRates(),
        ]);

        // KPI Calculations & Low Stock Extract
        let totalItems = 0;
        let lowStockCount = 0;
        let outOfStockCount = 0;
        let totalValue = 0;
        const lowStockItems: any[] = [];

        allStatsItems.forEach((item) => {
          totalItems++;
          if (item.quantity === 0) {
            outOfStockCount++;
          } else if (item.quantity <= item.minStock) {
            lowStockCount++;
            if (lowStockItems.length < 10) {
              lowStockItems.push(item);
            }
          }
          
          // Convert to USD for a consistent totalValue
          const rateFrom = (ratesData.rates as any)[item.currency] || 1;
          const itemValueInUsd = (item.unitValue || 0) / rateFrom;
          totalValue += item.quantity * itemValueInUsd;
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
      });
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

      const cacheKey = inventoryCacheKeys.movements(companyId, warehouseId, sku);

      return await withCache(cacheKey, INVENTORY_CACHE_TTL, async () => {
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
      });
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

      const inventoryNode = await db.inventory.findUnique({
        where: { warehouseId_sku: { warehouseId, sku } }
      });

      if (!inventoryNode) {
        throw new Error("Inventory SKU not found in this facility.");
      }

      const movement = await db.inventoryMovement.create({
        data: {
          warehouseId,
          sku,
          quantity: type === "PICK" ? -quantity : quantity,
          type,
          userId,
          companyId,
          date: new Date(),
        }
      });
      
      if (type === "PICK") {
         await db.inventory.update({
            where: { id: inventoryNode.id },
            data: { 
              quantity: { decrement: quantity },
              allocatedQuantity: { decrement: quantity }
            }
         });
      }

      await invalidateInventoryCache(companyId!, inventoryNode.id);
      return { success: true, movement };
    } catch (error) {
      console.error("Failed to log warehouse fulfillment:", error);
      throw error;
    }
  }
);
