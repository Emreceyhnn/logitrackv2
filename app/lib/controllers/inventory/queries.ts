"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { Prisma } from "@prisma/client";
import { controllerGuard } from "../utils/controllerGuard";
import { NotFoundError } from "../../errors";
import { LowStockItem } from "../../type/inventory";
import {
  withCache,
  hashFilters,
  inventoryCacheKeys,
  INVENTORY_CACHE_TTL,
} from "../../redis";

export const getInventory = authenticatedAction(
  async (user, warehouseId?: string) => {
    return controllerGuard("getInventory", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId);

      const whereClause: Prisma.InventoryWhereInput = { companyId };
      if (warehouseId) {
        whereClause.warehouseId = warehouseId;
      }

      const cacheKey = inventoryCacheKeys.list(companyId, hashFilters({ warehouseId }));
      return await withCache(cacheKey, INVENTORY_CACHE_TTL, async () => {
        const inventory = await db.inventory.findMany({
          where: whereClause,
          include: {
            warehouse: { select: { name: true, code: true } },
          },
          orderBy: { name: "asc" },
        });
        return inventory.map((item) => ({
          ...item,
          unitValue: item.unitValue === null ? null : Number(item.unitValue),
        }));
      });
    });
  }
);

export const getInventoryItemById = authenticatedAction(
  async (user, inventoryId: string) => {
    return controllerGuard("getInventoryItemById", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId);

      const cacheKey = inventoryCacheKeys.detail(inventoryId);

      return await withCache(cacheKey, INVENTORY_CACHE_TTL, async () => {
        const item = await db.inventory.findFirst({
          where: { id: inventoryId, companyId },
          include: { warehouse: true },
        });

        if (!item) {
          throw new NotFoundError("Inventory item");
        }

        return item;
      });
    });
  }
);

export const getInventoryBySku = authenticatedAction(
  async (user, sku: string) => {
    return controllerGuard("getInventoryBySku", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId);

      const items = await db.inventory.findMany({
        where: { sku, companyId },
        include: {
          warehouse: { select: { name: true, code: true } },
        },
      });
      return items.map((item) => ({
        ...item,
        unitValue: item.unitValue === null ? null : Number(item.unitValue),
      }));
    });
  }
);

export const getLowStockItems = authenticatedAction(async (user) => {
  return controllerGuard("getLowStockItems", async () => {
    const companyId = user?.companyId || "";
    await checkPermission(user, companyId, [
      "role_admin",
      "role_manager",
      "role_warehouse",
    ]);

    const cacheKey = inventoryCacheKeys.kpis(companyId);

    return await withCache(cacheKey, INVENTORY_CACHE_TTL, async () => {
      const allItems = await db.inventory.findMany({
        where: { companyId },
        include: { warehouse: { select: { name: true } } },
      });

      const lowStockItems = allItems.filter((item) => item.quantity <= item.minStock);

      const typedLowStock: LowStockItem[] = lowStockItems.map((item) => ({
        ...item,
        unitValue: item.unitValue === null ? null : Number(item.unitValue),
      }));
      return typedLowStock;
    });
  });
});

export const getInventoryMovements = authenticatedAction(
  async (user, sku: string, warehouseId: string) => {
    return controllerGuard("getInventoryMovements", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId);

      const cacheKey = inventoryCacheKeys.movements(companyId, warehouseId, sku);

      return await withCache(cacheKey, INVENTORY_CACHE_TTL, async () => {
        const movements = await db.inventoryMovement.findMany({
          where: { sku, warehouseId, companyId },
          include: { user: { select: { name: true, surname: true } } },
          orderBy: { date: "desc" },
          take: 20,
        });

        return movements;
      });
    });
  }
);
