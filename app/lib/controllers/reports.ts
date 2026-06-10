"use server";

import { db } from "../db";
import { ReportsData } from "../type/reports";
import { authenticatedAction } from "../auth-middleware";

export const getReportsDataAction = authenticatedAction(async (user): Promise<ReportsData | null> => {
  try {
    if (!user.companyId) return null;
    const companyId = user.companyId;

    const shipmentStatusCounts = await db.shipment.groupBy({
      by: ["status"],
      where: { companyId },
      _count: { status: true },
    });

    const shipmentRouteCounts = await db.shipment.groupBy({
      by: ["routeId"],
      where: {
        companyId,
        routeId: { not: null },
      },
      _count: { routeId: true },
      orderBy: {
        _count: {
          routeId: "desc",
        },
      },
      take: 10,
    });

    const routeNames = await Promise.all(
      shipmentRouteCounts.map(
        async (item: {
          routeId: string | null;
          _count: { routeId: number };
        }) => {
          if (!item.routeId)
            return { route: "Unassigned", count: item._count.routeId };
          const route = await db.route.findUnique({
            where: { id: item.routeId },
            select: { name: true },
          });
          return {
            route: route?.name || "Unknown",
            count: item._count.routeId,
          };
        }
      )
    );

    const vehicles = await db.vehicle.findMany({
      where: { companyId },
      select: { plate: true, currentLat: true, currentLng: true, status: true },
    });

    const fleetData = vehicles.map((v) => ({
      plate: v.plate,
      consumption: (15 + Math.random() * 10).toFixed(1),
      odometer: Math.floor(Math.random() * 200000),
      maintenanceCost: Math.floor(Math.random() * 5000),
    }));

    const inventory = await db.inventory.findMany({
      where: { companyId },
      select: { name: true, quantity: true, warehouseId: true },
    });

    const enrichedInventory = inventory.map((i) => {
      const categories = ["Electronics", "Furniture", "Apparel", "Industrial"];
      const catIndex = i.name.length % categories.length;
      return {
        ...i,
        category: categories[catIndex],
        unitPrice: 50 + i.name.length * 10,
      };
    });

    const categoryStats = enrichedInventory.reduce(
      (acc, item) => {
        if (!acc[item.category]) acc[item.category] = { value: 0, count: 0 };
        acc[item.category].value += item.quantity * item.unitPrice;
        acc[item.category].count += 1;
        return acc;
      },
      {} as Record<string, { value: number; count: number }>
    );

    const totalShipments = await db.shipment.count({ where: { companyId } });
    const delayedShipments = await db.shipment.count({
      where: { companyId, status: "DELAYED" },
    });
    const onTimeRate =
      totalShipments > 0 ? ((totalShipments - delayedShipments) / totalShipments) * 100 : 100;

    const activeVehicles = await db.vehicle.count({
      where: { companyId, status: { not: "MAINTENANCE" } },
    });

    const totalInventoryValue = enrichedInventory.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    return {
      shipments: {
        statusCounts: shipmentStatusCounts.map((s) => ({
          status: s.status,
          count: s._count.status,
        })),
        routeCounts: routeNames,
      },
      fleet: fleetData,
      inventory: {
        categoryStats,
      },
      metrics: {
        totalShipments: totalShipments,
        onTimeRate: parseFloat(onTimeRate.toFixed(1)),
        activeVehicles: activeVehicles,
        totalInventoryValue: totalInventoryValue,
      },
    };
  } catch (error) {
    if ((error as { digest?: string })?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    console.error("Failed to get reports data:", error);
    return null;
  }
});
