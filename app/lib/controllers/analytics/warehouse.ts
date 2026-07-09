"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { controllerGuard } from "../utils/controllerGuard";

export const getWarehouseCapacity = authenticatedAction(async (user) => {
  return controllerGuard("getWarehouseCapacity", async () => {
    await checkPermission(user, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const warehouses = await db.warehouse.findMany({
      where: { companyId: user.companyId },
      include: {
        _count: { select: { inventory: true } },
      },
    });

    const warehouseIds = warehouses.map((w) => w.id);

    const palletSums = await db.inventory.groupBy({
      by: ["warehouseId"],
      where: { warehouseId: { in: warehouseIds } },
      _sum: { palletCount: true, volumeM3: true },
    });

    const palletMap = new Map(
      palletSums.map((p) => [
        p.warehouseId,
        {
          pallets: p._sum.palletCount ?? 0,
          volume: p._sum.volumeM3 ?? 0,
        },
      ])
    );

    return warehouses.map((w) => {
      const used = palletMap.get(w.id) ?? { pallets: 0, volume: 0 };
      const palletCapacity = w.capacityPallets || 5000;
      const volumeCapacity = w.capacityVolumeM3 || 100000;
      const palletUsed = Math.round(used.pallets);
      const volumeUsed = Math.round(used.volume);
      const capacityPct = Math.min(Math.round((palletUsed / palletCapacity) * 100), 100);
      const volumePct = Math.min(Math.round((volumeUsed / volumeCapacity) * 100), 100);

      return {
        warehouseName: w.name,
        warehouseId: w.id,
        capacity: capacityPct,
        volume: volumePct,
        palletUsed,
        palletCapacity,
        volumeUsed,
        volumeCapacity,
      };
    });
  }, { fallback: [] });
});

export const getLowStockItems = authenticatedAction(async (user) => {
  return controllerGuard("getLowStockItems", async () => {
    await checkPermission(user, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const lowStock = await db.inventory.findMany({
      where: {
        companyId: user.companyId,
        quantity: { lte: db.inventory.fields.minStock },
      },
      take: 8,
      include: { warehouse: true },
      orderBy: { quantity: "asc" },
    });

    return lowStock.map((i) => ({
      item: i.name,
      sku: i.sku,
      warehouseId: i.warehouse.name,
      onHand: i.quantity,
      minStock: i.minStock,
    }));
  }, { fallback: [] });
});
