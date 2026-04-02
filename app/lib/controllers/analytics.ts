"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { MapData } from "../type/overview";

export const getOverviewStats = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return null;

    const [
      activeShipments,
      delayedShipments,
      vehiclesOnTrip,
      vehiclesInService,
      availableVehicles,
      activeDrivers,
      warehouses,
      inventorySkus,
    ] = await Promise.all([
      db.shipment.count({
        where: {
          companyId: user.companyId,
          status: { notIn: ["DELIVERED", "CANCELLED", "COMPLETED"] },
        },
      }),
      db.shipment.count({
        where: { companyId: user.companyId, status: "DELAYED" },
      }),
      db.vehicle.count({
        where: { companyId: user.companyId, status: "ON_TRIP" },
      }),
      db.vehicle.count({
        where: { companyId: user.companyId, status: "MAINTENANCE" },
      }),
      db.vehicle.count({
        where: { companyId: user.companyId, status: "AVAILABLE" },
      }),
      db.driver.count({
        where: { companyId: user.companyId, status: "ON_JOB" },
      }),
      db.warehouse.count({ where: { companyId: user.companyId } }),
      db.inventory.count({ where: { companyId: user.companyId } }),
    ]);

    return {
      activeShipments,
      delayedShipments,
      vehiclesOnTrip,
      vehiclesInService,
      availableVehicles,
      activeDrivers,
      warehouses,
      inventorySkus,
    };
  } catch (error) {
    console.error("Failed to get overview stats:", error);
    throw error;
  }
});

export const getActionRequired = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [openIssues, expiringDocs] = await Promise.all([
      db.issue.findMany({
        where: {
          companyId: user.companyId,
          status: { in: ["OPEN", "IN_PROGRESS"] },
          priority: { in: ["HIGH", "CRITICAL"] },
        },
        take: 10,
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
      }),
      db.document.findMany({
        where: {
          companyId: user.companyId,
          expiryDate: { not: null, lte: thirtyDaysFromNow },
          status: { not: "EXPIRED" },
        },
        take: 5,
        orderBy: { expiryDate: "asc" },
      }),
    ]);

    const issueAlerts = openIssues.map((issue) => ({
      type: (issue.type === "VEHICLE"
        ? "vehicle"
        : issue.type === "DRIVER"
        ? "driver"
        : issue.type === "SHIPMENT"
        ? "SHIPMENT_DELAY"
        : "vehicle") as
        | "vehicle"
        | "driver"
        | "SHIPMENT_DELAY"
        | "DOCUMENT_DUE"
        | "warehouse",
      title: issue.title,
      message: `${issue.priority} · ${issue.status.replace("_", " ")}`,
      link: issue.type === "VEHICLE" && issue.vehicleId 
        ? `/vehicle?id=${issue.vehicleId}` 
        : issue.type === "DRIVER" && issue.driverId 
        ? `/drivers?id=${issue.driverId}` 
        : issue.type === "SHIPMENT" && issue.shipmentId 
        ? `/shipments?id=${issue.shipmentId}` 
        : undefined,
    }));

    const docAlerts = expiringDocs.map((doc) => ({
      type: "DOCUMENT_DUE" as const,
      title: doc.name,
      message: doc.expiryDate
        ? `Expires ${new Date(doc.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        : "Expiry approaching",
      link: doc.driverId 
        ? `/drivers?id=${doc.driverId}` 
        : doc.vehicleId 
        ? `/vehicle?id=${doc.vehicleId}` 
        : undefined,
    }));

    return [...issueAlerts, ...docAlerts];
  } catch (error) {
    console.error("Failed to get action required:", error);
    return [];
  }
});

export const getDailyOperations = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [plannedRoutes, completedDeliveries, failedDeliveries, fuelToday, avgDuration] =
      await Promise.all([
        db.route.count({
          where: { companyId: user.companyId, status: "PLANNED" },
        }),
        db.shipment.count({
          where: {
            companyId: user.companyId,
            status: "DELIVERED",
            updatedAt: { gte: today },
          },
        }),
        db.shipment.count({
          where: {
            companyId: user.companyId,
            status: "CANCELLED",
            updatedAt: { gte: today },
          },
        }),
        db.fuelLog.aggregate({
          where: {
            companyId: user.companyId,
            date: { gte: today },
          },
          _sum: { volumeLiter: true },
        }),
        db.route.aggregate({
          where: {
            companyId: user.companyId,
            status: "COMPLETED",
            updatedAt: { gte: today },
            durationMin: { not: null },
          },
          _avg: { durationMin: true },
        }),
      ]);

    return {
      plannedRoutes,
      completedDeliveries,
      failedDeliveries,
      avgDeliveryTimeMin: Math.round(avgDuration._avg.durationMin ?? 0),
      fuelConsumedLiters: Math.round(fuelToday._sum.volumeLiter ?? 0),
    };
  } catch (error) {
    console.error("Failed to get daily operations:", error);
    return {
      plannedRoutes: 0,
      completedDeliveries: 0,
      failedDeliveries: 0,
      avgDeliveryTimeMin: 0,
      fuelConsumedLiters: 0,
    };
  }
});

export const getFuelStats = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const fuelByVehicle = await db.fuelLog.groupBy({
      by: ["vehicleId"],
      where: {
        companyId: user.companyId,
        date: { gte: thirtyDaysAgo },
      },
      _sum: { volumeLiter: true, cost: true },
      orderBy: { _sum: { volumeLiter: "desc" } },
      take: 8,
    });

    if (fuelByVehicle.length === 0) return [];

    const vehicleIds = fuelByVehicle.map((f) => f.vehicleId);
    const vehicles = await db.vehicle.findMany({
      where: { id: { in: vehicleIds } },
      select: { id: true, plate: true },
    });

    const vehicleMap = new Map(vehicles.map((v) => [v.id, v.plate]));

    return fuelByVehicle.map((f) => ({
      id: f.vehicleId,
      plate: vehicleMap.get(f.vehicleId) ?? f.vehicleId,
      value: Math.round((f._sum.volumeLiter ?? 0) * 10) / 10,
      totalCost: Math.round(f._sum.cost ?? 0),
    }));
  } catch (error) {
    console.error("Failed to get fuel stats:", error);
    return [];
  }
});

export const getWarehouseCapacity = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
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
  } catch (error) {
    console.error("Failed to get warehouse capacity:", error);
    return [];
  }
});

export const getLowStockItems = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const lowStock = await db.inventory.findMany({
      where: {
        companyId: user.companyId,
        quantity: { lte: db.inventory.fields.minStock as unknown as number },
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
  } catch (error) {
    // Fallback: query items where quantity < 50
    try {
      const lowStock = await db.inventory.findMany({
        where: {
          companyId: user.companyId!,
          quantity: { lt: 50 },
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
    } catch {
      console.error("Failed to get low stock items:", error);
      return [];
    }
  }
});

export const getShipmentStatusStats = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const allShipments = await db.shipment.findMany({
      where: { companyId: user.companyId },
      select: { status: true },
    });

    return allShipments.map((s) => s.status);
  } catch (error) {
    console.error("Failed to get shipment status stats:", error);
    return [];
  }
});

export const getPicksAndPacks = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return { picks: 0, packs: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const metrics = await db.inventoryMovement.groupBy({
      by: ["type"],
      where: {
        companyId: user.companyId,
        date: { gte: today },
        type: { in: ["PICK", "PACK"] },
      },
      _sum: { quantity: true },
    });

    let picks = 0;
    let packs = 0;

    metrics.forEach((m) => {
      if (m.type === "PICK") picks = m._sum.quantity || 0;
      if (m.type === "PACK") packs = m._sum.quantity || 0;
    });

    return { picks, packs };
  } catch (error) {
    console.error("Failed to get picks and packs:", error);
    return { picks: 0, packs: 0 };
  }
});

export const getShipmentVolumeHistory = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const shipments = await db.shipment.findMany({
      where: {
        companyId: user.companyId,
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
    });

    // Build 7-day buckets
    const result: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayStart = new Date(d);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);
      const count = shipments.filter((s) => {
        const t = new Date(s.createdAt).getTime();
        return t >= dayStart.getTime() && t <= dayEnd.getTime();
      }).length;
      result.push({ date: label, count });
    }

    return result;
  } catch (error) {
    console.error("Failed to get shipment volume history:", error);
    return [];
  }
});

// Keep for backward compat (on-time trends replaced by shipment volume)
export const getOnTimeTrends = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    // Use last 30 days of completed routes as proxy for on-time rate
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const completedRoutes = await db.route.findMany({
      where: {
        companyId: user.companyId,
        status: "COMPLETED",
        updatedAt: { gte: thirtyDaysAgo },
      },
      select: { updatedAt: true },
      orderBy: { updatedAt: "asc" },
    });

    // Group by date
    const byDate = new Map<string, number>();
    completedRoutes.forEach((r) => {
      const label = new Date(r.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      byDate.set(label, (byDate.get(label) ?? 0) + 1);
    });

    return Array.from(byDate.entries()).map(([date, value]) => ({ date, value }));
  } catch (error) {
    console.error("Failed to get on time trends:", error);
    return [];
  }
});

export const getMapData = authenticatedAction(async (user): Promise<MapData[]> => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const [warehouses, vehicles, customers] = await Promise.all([
      db.warehouse.findMany({ where: { companyId: user.companyId } }),
      db.vehicle.findMany({ where: { companyId: user.companyId } }),
      db.customer.findMany({ where: { companyId: user.companyId } }),
    ]);

    return [
      ...warehouses.map((w) => ({
        position: { lat: w.lat || 40.7128, lng: w.lng || -74.006 },
        name: w.name,
        id: w.id,
        type: "W" as const,
      })),
      ...vehicles.map((v) => ({
        position: {
          lat: v.currentLat || 40.7128,
          lng: v.currentLng || -74.006,
        },
        name: v.plate,
        id: v.id,
        type: "V" as const,
      })),
      ...customers.map((c) => ({
        position: { lat: 40.75, lng: -74.05 },
        name: c.name,
        id: c.id,
        type: "C" as const,
      })),
    ];
  } catch (error) {
    console.error("Failed to get map data:", error);
    return [];
  }
});

export const getAnalyticsDashboardData = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return null;

    const [totalVehicles, activeVehicles, totalShipments, delayedShipments] =
      await Promise.all([
        db.vehicle.count({ where: { companyId: user.companyId } }),
        db.vehicle.count({
          where: { companyId: user.companyId, status: "ON_TRIP" },
        }),
        db.shipment.count({ where: { companyId: user.companyId } }),
        db.shipment.count({
          where: { companyId: user.companyId, status: "DELAYED" },
        }),
      ]);

    const fleetUtilization =
      totalVehicles > 0
        ? Math.round((activeVehicles / totalVehicles) * 100)
        : 0;
    const onTimeRate =
      totalShipments > 0
        ? Math.round(
            ((totalShipments - delayedShipments) / totalShipments) * 100
          )
        : 100;

    return {
      performance: {
        onTimeRate,
        fleetUtilization,
        satisfaction: 4.8,
        satisfactionCount: 128,
      },
      costs: {
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        fuel: [4200, 4100, 4350, 4220, 4500, 4400],
        maintenance: [1200, 800, 1500, 950, 2100, 1100],
        overhead: [3000, 3000, 3100, 3100, 3200, 3200],
        distribution: [
          { id: 0, value: 35, label: "Fuel" },
          { id: 1, value: 25, label: "Maintenance" },
          { id: 2, value: 30, label: "Driver Salaries" },
          { id: 3, value: 10, label: "Insurance/Ops" },
        ],
      },
      forecast: {
        weeks: ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12","W13"],
        actuals: [120,132,125,145,150,160,155,175,180,null,null,null,null],
        predicted: [null,null,null,null,null,null,null,null,180,195,210,225,240],
      },
    };
  } catch (error) {
    console.error("Failed to get analytics dashboard data:", error);
    return null;
  }
});
