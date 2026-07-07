"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { Prisma, WarehouseType } from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { updateWarehouseSchema } from "../../validation/serverSchemas";
import {
  withCache,
  hashFilters,
  warehouseCacheKeys,
  WAREHOUSE_CACHE_TTL,
} from "../../redis";
import { invalidateWarehouseCache } from "./cache";
import { controllerGuard } from "../utils/controllerGuard";

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
    timezone?: string,
    specifications?: string[]
  ) => {
    return controllerGuard("createWarehouse", async () => {
      const companyId = user.companyId || "";

      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      if (!code) {
        throw new Error("Warehouse code is required");
      }
      const warehouseCode = code;

      const existingWarehouse = await db.warehouse.findUnique({
        where: { companyId_code: { companyId, code: warehouseCode } },
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
          timezone: timezone || "UTC",
          specifications: specifications || [],
        },
      });

      await invalidateWarehouseCache(companyId!);

      // Dispatch Notification
      await createNotification(
        { companyId: companyId! },
        {
          title: "Yeni Depo Oluşturuldu 🏗️",
          message: `${name} (${warehouseCode}) isimli yeni depo sisteme tanımlandı.`,
          type: "SUCCESS",
          link: `/dashboard/warehouses/${newWarehouse.id}`,
        }
      );

      return { warehouse: newWarehouse };
    });
  }
);

export const getWarehouses = authenticatedAction(async (user) => {
  return controllerGuard("getWarehouses", async () => {
    await checkPermission(user, user.companyId);

    if (!user.companyId) throw new Error("User has no company");
    const companyId = user.companyId;

    const cacheKey = warehouseCacheKeys.list(companyId, hashFilters({}));
    return await withCache(cacheKey, WAREHOUSE_CACHE_TTL, async () => {
      const warehouses = await db.warehouse.findMany({
        where: { companyId },
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
    });
  });
});

export const getWarehouseById = authenticatedAction(
  async (user, warehouseId: string) => {
    return controllerGuard("getWarehouseById", async () => {
      await checkPermission(user, user.companyId);

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
    });
  }
);

export const updateWarehouse = authenticatedAction(
  async (user, warehouseId: string, data: Record<string, unknown>) => {
    return controllerGuard("updateWarehouse", async () => {
      await checkPermission(user, user.companyId, [
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

      const parsedData = updateWarehouseSchema.parse(data);
      const { managerId, ...restData } = parsedData;

      const updateData: Prisma.WarehouseUpdateInput = { ...restData };

      if (managerId !== undefined) {
        if (managerId === null) {
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

      await invalidateWarehouseCache(user.companyId!, warehouseId);
      return updatedWarehouse;
    });
  }
);

export const deleteWarehouse = authenticatedAction(
  async (user, warehouseId: string) => {
    return controllerGuard("deleteWarehouse", async () => {
      await checkPermission(user, user.companyId, ["role_admin"]);

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

      await invalidateWarehouseCache(user.companyId!, warehouseId);
      return { success: true };
    });
  }
);

export const assignManagerToWarehouse = authenticatedAction(
  async (user, warehouseId: string, managerId: string) => {
    return controllerGuard("assignManagerToWarehouse", async () => {
      await checkPermission(user, user.companyId, ["role_admin"]);

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
          manager: { connect: { id: managerId } },
        },
      });

      await invalidateWarehouseCache(user.companyId!, warehouseId);

      // Dispatch Notification
      await createNotification(
        { companyId: user.companyId!, userId: managerId },
        {
          title: "Depo Yöneticisi Atandınız 👤",
          message: `${updatedWarehouse.name} deposu için yönetici olarak görevlendirildiniz.`,
          type: "INFO",
          link: `/dashboard/warehouses/${updatedWarehouse.id}`,
        }
      );

      return updatedWarehouse;
    });
  }
);
