"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { Prisma } from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { invalidateWarehouseCache } from "./cache";

export const addInventoryItem = authenticatedAction(
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
    cargoType: string = "General Cargo",
    imageUrl?: string,
    unitValue?: number,
    currency: string = "USD"
  ) => {
    try {
      await checkPermission(user, user.companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const existingWarehouse = await db.warehouse.findUnique({
        where: { id: warehouseId },
        select: { companyId: true },
      });

      if (
        !existingWarehouse ||
        existingWarehouse.companyId !== user.companyId
      ) {
        throw new Error("Warehouse not found or unauthorized");
      }

      // Auto-generate SKU if not provided
      const itemSku =
        sku ||
        `SKU-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`;

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

      const result = await db.$transaction(async (tx) => {
        const newItem = await tx.inventory.create({
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
            imageUrl,
            unitValue: unitValue || 0,
            currency,
            companyId: user.companyId!,
          },
        });

        await tx.inventoryMovement.create({
          data: {
            warehouseId,
            sku: itemSku,
            quantity,
            type: "PUTAWAY",
            notes: "Initial inventory entry",
            userId: user.id,
            companyId: user.companyId!,
          },
        });

        return newItem;
      });

      // Notification check for initial stock
      if (result.quantity <= result.minStock) {
        await createNotification(
          { companyId: user.companyId!, roleId: "role_manager" },
          {
            title: "Düşük Stok Uyarısı! ⚠️",
            message: `${result.name} (SKU: ${result.sku}) kritik stok seviyesinde kaydedildi.`,
            type: "WARNING",
            link: `/dashboard/inventory?warehouseId=${result.warehouseId}`,
          }
        );
      }

      return result;
    } catch (error) {
      console.error("Failed to add inventory item:", error);
      throw error;
    }
  }
);

export const updateInventoryItem = authenticatedAction(
  async (user, inventoryId: string, data: Prisma.InventoryUpdateInput) => {
    try {
      await checkPermission(user, user.companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const currentItem = await db.inventory.findUnique({
        where: { id: inventoryId },
        select: {
          sku: true,
          warehouseId: true,
          companyId: true,
          quantity: true,
        },
      });

      if (!currentItem || currentItem.companyId !== user.companyId) {
        throw new Error("Inventory item not found or unauthorized");
      }

      const updateData = { ...data };
      if (updateData.sku === "") {
        updateData.sku = `SKU-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`;
      }

      const updatedItem = await db.$transaction(async (tx) => {
        const item = await tx.inventory.update({
          where: { id: inventoryId },
          data: updateData,
        });

        if (
          data.quantity !== undefined &&
          typeof data.quantity === "number" &&
          data.quantity !== currentItem.quantity
        ) {
          await tx.inventoryMovement.create({
            data: {
              warehouseId: currentItem.warehouseId,
              sku:
                (typeof updateData.sku === "string" ? updateData.sku : null) ||
                currentItem.sku,
              quantity: data.quantity - currentItem.quantity,
              type: "ADJUSTMENT",
              userId: user.id,
              companyId: user.companyId!,
            },
          });
        }

        return item;
      });

      await invalidateWarehouseCache(user.companyId!, updatedItem.warehouseId);

      // Notification check for stock levels
      if (updatedItem.quantity <= updatedItem.minStock) {
        await createNotification(
          { companyId: user.companyId!, roleId: "role_manager" },
          {
            title: "Kritik Stok Seviyesi! 🚨",
            message: `${updatedItem.name} (SKU: ${updatedItem.sku}) stok seviyesi ${updatedItem.quantity}'e düştü. (Min: ${updatedItem.minStock})`,
            type: "ERROR",
            link: `/dashboard/inventory?warehouseId=${updatedItem.warehouseId}`,
          }
        );
      }

      return updatedItem;
    } catch (error) {
      console.error("Failed to update inventory item:", error);
      throw error;
    }
  }
);

export const deleteInventoryItem = authenticatedAction(
  async (user, inventoryId: string) => {
    try {
      await checkPermission(user, user.companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const existingItem = await db.inventory.findUnique({
        where: { id: inventoryId },
        select: { companyId: true },
      });

      if (!existingItem || existingItem.companyId !== user.companyId) {
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

export const getLowStockItems = authenticatedAction(
  async (user, warehouseId: string) => {
    try {
      await checkPermission(user, user.companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const existingWarehouse = await db.warehouse.findUnique({
        where: { id: warehouseId },
        select: { companyId: true },
      });

      if (
        !existingWarehouse ||
        existingWarehouse.companyId !== user.companyId
      ) {
        throw new Error("Warehouse not found or unauthorized");
      }

      const lowStockItems = await db.inventory.findMany({
        where: {
          warehouseId,
          quantity: {
            lte: db.inventory.fields.minStock,
          },
        },
      });

      return lowStockItems;
    } catch (error) {
      console.error("Failed to get low stock items:", error);
      throw error;
    }
  }
);
