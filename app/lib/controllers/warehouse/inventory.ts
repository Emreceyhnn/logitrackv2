"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { Prisma } from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { invalidateWarehouseCache } from "./cache";
import { invalidateInventoryCache } from "../inventory/cache";
import { controllerGuard } from "../utils/controllerGuard";

/**
 * tr-depoya yeni bir envanter/stok kalemi ekler ve ilk giriş hareketini (putaway) kaydeder
 * en-adds a new inventory/stock item to the warehouse and records the initial putaway movement
 * input (user: AuthenticatedUser, warehouseId: string, sku: string, name: string, quantity: number, minStock?: number, weightKg?: number, volumeM3?: number, palletCount?: number, cargoType?: string, imageUrl?: string, unitValue?: number, currency?: string)
 * output (Promise<Inventory>)
 */
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
    return controllerGuard("addInventoryItem", async () => {
      await checkPermission(user, user.companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const existingWarehouse = await db.warehouse.findFirst({
        where: { id: warehouseId, companyId: user.companyId! },
        select: { companyId: true },
      });

      if (!existingWarehouse) {
        throw new Error("Warehouse not found or unauthorized");
      }

      // Auto-generate SKU if not provided
      const itemSku =
        sku ||
        `SKU-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`;

      const existingItem = await db.inventory.findFirst({
        where: {
          warehouseId,
          sku: itemSku,
          companyId: user.companyId!,
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
            imageUrl: imageUrl ?? null,
            unitValue: unitValue || 0,
            currency,
            unit: "Each",
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

      await invalidateWarehouseCache(user.companyId!, warehouseId);
      await invalidateInventoryCache(user.companyId!, result.id);

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
    });
  }
);

/**
 * tr-mevcut bir envanter kalemini günceller, eğer miktar (quantity) değişirse ayar (adjustment) hareketi oluşturur
 * en-updates an existing inventory item; creates an adjustment movement if the quantity changes
 * input (user: AuthenticatedUser, inventoryId: string, data: Prisma.InventoryUpdateInput)
 * output (Promise<Inventory>)
 */
export const updateInventoryItem = authenticatedAction(
  async (user, inventoryId: string, data: Prisma.InventoryUpdateInput) => {
    return controllerGuard("updateInventoryItem", async () => {
      await checkPermission(user, user.companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const currentItem = await db.inventory.findFirst({
        where: { id: inventoryId, companyId: user.companyId! },
        select: {
          sku: true,
          warehouseId: true,
          companyId: true,
          quantity: true,
        },
      });

      if (!currentItem) {
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
    });
  }
);

/**
 * tr-belirtilen envanter kalemini sistemden siler
 * en-deletes the specified inventory item from the system
 * input (user: AuthenticatedUser, inventoryId: string)
 * output (Promise<{ success: boolean }>)
 */
export const deleteInventoryItem = authenticatedAction(
  async (user, inventoryId: string) => {
    return controllerGuard("deleteInventoryItem", async () => {
      await checkPermission(user, user.companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const existingItem = await db.inventory.findFirst({
        where: { id: inventoryId, companyId: user.companyId! },
        select: { companyId: true },
      });

      if (!existingItem) {
        throw new Error("Inventory item not found or unauthorized");
      }

      await db.inventory.delete({
        where: { id: inventoryId },
      });

      return { success: true };
    });
  }
);

/**
 * tr-stok seviyesi minimum değerin altına düşmüş olan envanter kalemlerini listeler
 * en-lists inventory items whose stock level has fallen below their minimum threshold
 * input (user: AuthenticatedUser, warehouseId: string)
 * output (Promise<Inventory[]>)
 */
export const getLowStockItems = authenticatedAction(
  async (user, warehouseId: string) => {
    return controllerGuard("getLowStockItems", async () => {
      await checkPermission(user, user.companyId, [
        "role_admin",
        "role_manager",
        "role_warehouse",
      ]);

      const existingWarehouse = await db.warehouse.findFirst({
        where: { id: warehouseId, companyId: user.companyId! },
        select: { companyId: true },
      });

      if (!existingWarehouse) {
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
    });
  }
);
