"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma, WarehouseType } from "@prisma/client";

export const createWarehouse = authenticatedAction(
  async (
    user,
    name: string,
    code: string,
    type: WarehouseType,
    address: string,
    city: string,
    country: string,
    lat?: number,
    lng?: number,
    managerId?: string,
    capacityPallets?: number,
    capacityVolumeM3?: number,
    operatingHours?: string,
    specifications?: string[]
  ) => {
    try {
      const companyId = user.companyId;

      await checkPermission(user.id, companyId, ["role_admin", "role_manager"]);

      // Auto-generate code if missing
      const warehouseCode = code || `WH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const existingWarehouse = await db.warehouse.findUnique({
        where: { code: warehouseCode },
      });

      if (existingWarehouse) {
        throw new Error("Warehouse code already exists");
      }

      const newWarehouse = await db.warehouse.create({
        data: {
          name,
          code: warehouseCode,
          type,
          address,
          city,
          country,
          lat,
          lng,
          companyId: companyId,
          managerId,
          capacityPallets: capacityPallets || 5000,
          capacityVolumeM3: capacityVolumeM3 || 100000,
          operatingHours: operatingHours || "08:00 - 18:00",
          specifications: specifications || [],
        },
      });

      return { warehouse: newWarehouse };
    } catch (error) {
      console.error("Failed to create warehouse:", error);
      throw error;
    }
  }
);

export const getWarehouses = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

    if (!user.companyId) throw new Error("User has no company");

    const warehouses = await db.warehouse.findMany({
      where: { companyId: user.companyId },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            inventory: true,
            drivers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return warehouses;
  } catch (error) {
    console.error("Failed to get warehouses:", error);
    throw error;
  }
});

export const getWarehouseById = authenticatedAction(
  async (user, warehouseId: string) => {
    try {
      await checkPermission(user.id, user.companyId);

      const warehouse = await db.warehouse.findUnique({
        where: { id: warehouseId },
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true,
              avatarUrl: true,
            },
          },
          inventory: true,
          drivers: {
            include: {
              user: {
                select: { name: true, surname: true, avatarUrl: true },
              },
            },
          },
        },
      });

      if (!warehouse || warehouse.companyId !== user.companyId) {
        throw new Error("Warehouse not found or unauthorized");
      }

      return warehouse;
    } catch (error) {
      console.error("Failed to get warehouse:", error);
      throw error;
    }
  }
);

export const updateWarehouse = authenticatedAction(
  async (user, warehouseId: string, data: any) => {
    try {
      await checkPermission(user.id, user.companyId, [
        "role_admin",
        "role_manager",
      ]);

      const existingWarehouse = await db.warehouse.findUnique({
        where: { id: warehouseId },
        select: { companyId: true, managerId: true },
      });

      if (
        !existingWarehouse ||
        existingWarehouse.companyId !== user.companyId
      ) {
        throw new Error("Warehouse not found or unauthorized");
      }

      const { managerId, ...restData } = data;
      const updateData: any = { ...restData };
      
      if (updateData.code === "") {
        updateData.code = `WH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      }

      if (managerId !== undefined) {
        if (managerId === null) {
          // Only disconnect if it was actually connected
          if (existingWarehouse.managerId) {
            updateData.manager = { disconnect: true };
          }
        } else {
          updateData.manager = { connect: { id: managerId } };
        }
      }

      const updatedWarehouse = await db.warehouse.update({
        where: { id: warehouseId },
        data: updateData,
      });

      return updatedWarehouse;
    } catch (error) {
      console.error("Failed to update warehouse:", error);
      throw error;
    }
  }
);

export const deleteWarehouse = authenticatedAction(
  async (user, warehouseId: string) => {
    try {
      await checkPermission(user.id, user.companyId, ["role_admin"]);

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

      await db.warehouse.delete({
        where: { id: warehouseId },
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to delete warehouse:", error);
      throw error;
    }
  }
);

export const assignManagerToWarehouse = authenticatedAction(
  async (user, warehouseId: string, managerId: string) => {
    try {
      await checkPermission(user.id, user.companyId, ["role_admin"]);

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

      const updatedWarehouse = await db.warehouse.update({
        where: { id: warehouseId },
        data: {
          managerId,
        },
      });

      return updatedWarehouse;
    } catch (error) {
      console.error("Failed to assign manager to warehouse:", error);
      throw error;
    }
  }
);

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
    unitValue: number = 0
  ) => {
    try {
      await checkPermission(user.id, user.companyId, [
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
          companyId: user.companyId!,
          imageUrl,
          unitValue,
        },
      });

      return newItem;
    } catch (error) {
      console.error("Failed to add inventory item:", error);
      throw error;
    }
  }
);

export const updateInventoryItem = authenticatedAction(
  async (user, inventoryId: string, data: Prisma.InventoryUpdateInput) => {
    try {
      await checkPermission(user.id, user.companyId, [
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

      const updateData = { ...data };
      if (updateData.sku === "") {
        updateData.sku = `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      }

      const updatedItem = await db.inventory.update({
        where: { id: inventoryId },
        data: updateData,
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
    try {
      await checkPermission(user.id, user.companyId, [
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
      await checkPermission(user.id, user.companyId, [
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

export const getWarehouseStats = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

    if (!user.companyId) throw new Error("User has no company");

    const warehouses = await db.warehouse.findMany({
      where: { companyId: user.companyId },
      select: { capacityPallets: true, capacityVolumeM3: true },
    });

    const totalWarehouses = warehouses.length;

    const inventoryStats = await db.inventory.aggregate({
      where: { companyId: user.companyId },
      _count: { sku: true },
      _sum: { quantity: true },
    });

    const totalCapacityPallets = warehouses.reduce(
      (acc, w) => acc + (w.capacityPallets || 0),
      0
    );
    const totalCapacityVolume = warehouses.reduce(
      (acc, w) => acc + (w.capacityVolumeM3 || 0),
      0
    );

    return {
      totalWarehouses,
      totalSkus: inventoryStats._count.sku,
      totalItems: inventoryStats._sum.quantity || 0,
      totalCapacityPallets,
      totalCapacityVolume,
    };
  } catch (error) {
    console.error("Failed to get warehouse stats:", error);
    return {
      totalWarehouses: 0,
      totalSkus: 0,
      totalItems: 0,
      totalCapacityPallets: 0,
      totalCapacityVolume: 0,
    };
  }
});

export const getRecentStockMovements = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

    if (!user.companyId) throw new Error("User has no company");

    const movements = await db.inventoryMovement.findMany({
      where: { companyId: user.companyId },
      include: {
        warehouse: { select: { code: true, name: true } },
      },
      take: 10,
      orderBy: { date: "desc" },
    });

    const enrichedMovements = await Promise.all(
      movements.map(async (m) => {
        const inventoryItem = await db.inventory.findFirst({
          where: {
            warehouseId: m.warehouseId,
            sku: m.sku,
          },
          select: { name: true },
        });
        return {
          ...m,
          itemName: inventoryItem?.name || m.sku,
        };
      })
    );

    return enrichedMovements;
  } catch (error) {
    console.error("Failed to get stock movements:", error);
    return [];
  }
});
