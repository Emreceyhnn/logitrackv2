"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { 
  ShipmentStatus, 
  VehicleStatus, 
  RouteStatus, 
  IssueStatus, 
  IssuePriority, 
  IssueType 
} from "@prisma/client";
import { 
  DashboardData, 
  ActionRequiredItems, 
  OverviewStats, 
  DailyOperationsData, 
  FuelStat, 
  WarehouseCapacityStat, 
  LowStockItemStat, 
  PicksAndPacksData, 
  ShipmentDayStat,
  MapData
} from "../type/overview";
import {
  withCache,
  overviewCacheKeys,
  OVERVIEW_CACHE_TTL,
} from "../redis";

/**
 * Aggregates all data required for the Overview Dashboard in a single server-side pass.
 * This replaces 10 separate server actions to minimize network overhead and database connections.
 */
export const getOverviewDashboardData = authenticatedAction(async (user): Promise<DashboardData & { alerts: ActionRequiredItems[] }> => {
  try {
    if (!user.companyId) {
      return {
        stats: null,
        dailyOps: null,
        fuelStats: [],
        warehouseCapacity: [],
        lowStockItems: [],
        shipmentStatus: [],
        picksAndPacks: null,
        trends: [],
        shipmentVolume: [],
        mapData: [],
        alerts: []
      };
    }

    const companyId = user.companyId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const cacheKey = overviewCacheKeys.dashboard(companyId);

    return await withCache(cacheKey, OVERVIEW_CACHE_TTL, async () => {
      // Run all queries in parallel, including the permission check
      const [
        , // permission check only needs to resolve, no value needed
      statsCounts,
      openIssues,
      expiringDocs,
      dailyOpsMetrics,
      fuelLogs,
      vehiclePlates,
      warehousesRaw,
      palletSumsRaw,
      lowStockItemsData,
      shipmentStatusRaw,
      inventoryMovements,
      shipmentVolumeRaw,
      mapDataRaw
    ] = await Promise.all([
      // 0. Parallel Permission Check
      checkPermission(user.id, companyId, [], { allowNoCompany: true }),

      // 1. Basic Stats
      Promise.all([
        db.shipment.count({
          where: {
            companyId,
            status: { notIn: [ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED, ShipmentStatus.COMPLETED] },
          },
        }),
        db.shipment.count({
          where: { companyId, status: ShipmentStatus.DELAYED },
        }),
        db.vehicle.count({
          where: { companyId, status: VehicleStatus.ON_TRIP },
        }),
        db.vehicle.count({
          where: { companyId, status: VehicleStatus.MAINTENANCE },
        }),
        db.vehicle.count({
          where: { companyId, status: VehicleStatus.AVAILABLE },
        }),
        db.driver.count({
          where: { companyId, status: "ON_JOB" },
        }),
        db.warehouse.count({ where: { companyId } }),
        db.inventory.count({ where: { companyId } }),
      ]),

      // 2. Alerts: Open Issues
      db.issue.findMany({
        where: {
          companyId,
          status: { in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS] },
          priority: { in: [IssuePriority.HIGH, IssuePriority.CRITICAL] },
        },
        take: 10,
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
      }),

      // 3. Alerts: Expiring Docs
      db.document.findMany({
        where: {
          companyId,
          expiryDate: { not: null, lte: thirtyDaysFromNow },
          status: { not: "EXPIRED" },
        },
        take: 5,
        orderBy: { expiryDate: "asc" },
      }),

      // 4. Daily Operations
      Promise.all([
        db.route.count({
          where: { companyId, status: RouteStatus.PLANNED },
        }),
        db.shipment.count({
          where: {
            companyId,
            status: ShipmentStatus.DELIVERED,
            updatedAt: { gte: today },
          },
        }),
        db.shipment.count({
          where: {
            companyId,
            status: ShipmentStatus.CANCELLED,
            updatedAt: { gte: today },
          },
        }),
        db.fuelLog.aggregate({
          where: {
            companyId,
            date: { gte: today },
          },
          _sum: { volumeLiter: true },
        }),
        db.route.aggregate({
          where: {
            companyId,
            status: RouteStatus.COMPLETED,
            updatedAt: { gte: today },
            durationMin: { not: null },
          },
          _avg: { durationMin: true },
        }),
      ]),

      // 5. Fuel Logs (Top 8 vehicles, last 30 days)
      db.fuelLog.groupBy({
        by: ["vehicleId"],
        where: {
          companyId,
          date: { gte: thirtyDaysAgo },
        },
        _sum: { volumeLiter: true, cost: true },
        orderBy: { _sum: { volumeLiter: "desc" } },
        take: 8,
      }),

      // 5b. Parallel Vehicle Plate Fetching (Eliminate waterfall)
      db.vehicle.findMany({
        where: { companyId },
        select: { id: true, plate: true },
      }),

      // 6. Warehouses
      db.warehouse.findMany({
        where: { companyId },
        include: {
          _count: { select: { inventory: true } },
        },
      }),

      // 6b. Parallel Warehouse Pallet Sums (Eliminate waterfall)
      db.inventory.groupBy({
        by: ["warehouseId"],
        where: { companyId },
        _sum: { palletCount: true, volumeM3: true },
      }),

      // 7. Low Stock Items
      db.inventory.findMany({
        where: {
          companyId,
          quantity: { lte: db.inventory.fields.minStock as unknown as number },
        },
        take: 8,
        include: { warehouse: true },
        orderBy: { quantity: "asc" },
      }),

      // 8. Shipment Status
      db.shipment.findMany({
        where: { companyId },
        select: { status: true },
      }),

      // 9. Picks & Packs (Inventory Movements)
      db.inventoryMovement.groupBy({
        by: ["type"],
        where: {
          companyId,
          date: { gte: today },
          type: { in: ["PICK", "PACK"] },
        },
        _sum: { quantity: true },
      }),

      // 10. Shipment Volume (7-day history)
      db.shipment.findMany({
        where: {
          companyId,
          createdAt: { gte: sevenDaysAgo },
        },
        select: { createdAt: true },
      }),

      // 11. Optimized Map Data (Select only required fields)
      Promise.all([
        db.warehouse.findMany({ 
          where: { companyId }, 
          select: { id: true, name: true, lat: true, lng: true } 
        }),
        db.vehicle.findMany({ 
          where: { companyId }, 
          select: { id: true, plate: true, currentLat: true, currentLng: true } 
        }),
        db.customer.findMany({ 
          where: { companyId }, 
          select: { id: true, name: true } 
        }),
      ])
    ]);

    // Data Processing
    
    // 1. Stats
    const stats: OverviewStats = {
      activeShipments: statsCounts[0],
      delayedShipments: statsCounts[1],
      vehiclesOnTrip: statsCounts[2],
      vehiclesInService: statsCounts[3],
      availableVehicles: statsCounts[4],
      activeDrivers: statsCounts[5],
      warehouses: statsCounts[6],
      inventorySkus: statsCounts[7],
    };

    // 2 & 3. Alerts (Issues + Docs)
    const issueAlerts: ActionRequiredItems[] = openIssues.map((issue) => ({
      type: (issue.type === IssueType.VEHICLE
        ? "vehicle"
        : issue.type === IssueType.DRIVER
        ? "driver"
        : issue.type === IssueType.SHIPMENT
        ? "SHIPMENT_DELAY"
        : "vehicle") as ActionRequiredItems["type"],
      title: issue.title,
      message: `${issue.priority} · ${issue.status.replace("_", " ")}`,
      link: issue.type === IssueType.VEHICLE && issue.vehicleId 
        ? `/vehicle?id=${issue.vehicleId}` 
        : issue.type === IssueType.DRIVER && issue.driverId 
        ? `/drivers?id=${issue.driverId}` 
        : issue.type === IssueType.SHIPMENT && issue.shipmentId 
        ? `/shipments?id=${issue.shipmentId}` 
        : undefined,
    }));

    const docAlerts: ActionRequiredItems[] = expiringDocs.map((doc) => ({
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

    const alerts = [...issueAlerts, ...docAlerts];

    // 4. Daily Ops
    const dailyOps: DailyOperationsData = {
      plannedRoutes: dailyOpsMetrics[0],
      completedDeliveries: dailyOpsMetrics[1],
      failedDeliveries: dailyOpsMetrics[2],
      fuelConsumedLiters: Math.round(dailyOpsMetrics[3]._sum.volumeLiter ?? 0),
      avgDeliveryTimeMin: Math.round(dailyOpsMetrics[4]._avg.durationMin ?? 0),
    };

    // 5. Fuel Stats
    const vehicleMap = new Map(vehiclePlates.map((v) => [v.id, v.plate]));
    
    const fuelStats: FuelStat[] = fuelLogs.map((f) => ({
      id: f.vehicleId,
      plate: vehicleMap.get(f.vehicleId) ?? f.vehicleId,
      value: Math.round((f._sum.volumeLiter ?? 0) * 10) / 10,
      totalCost: Math.round(f._sum.cost ?? 0),
    }));

    // 6. Warehouse Capacity
    const palletMap = new Map(palletSumsRaw.map((p) => [p.warehouseId, { pallets: p._sum.palletCount ?? 0, volume: p._sum.volumeM3 ?? 0 }]));

    const warehouseCapacity: WarehouseCapacityStat[] = warehousesRaw.map((w) => {
      const used = palletMap.get(w.id) ?? { pallets: 0, volume: 0 };
      const palletCapacity = w.capacityPallets || 5000;
      const volumeCapacity = w.capacityVolumeM3 || 100000;
      const palletUsed = Math.round(used.pallets);
      const volumeUsed = Math.round(used.volume);
      return {
        warehouseName: w.name,
        warehouseId: w.id,
        capacity: Math.min(Math.round((palletUsed / palletCapacity) * 100), 100),
        volume: Math.min(Math.round((volumeUsed / volumeCapacity) * 100), 100),
        palletUsed,
        palletCapacity,
        volumeUsed,
        volumeCapacity,
      };
    });

    // 7. Low Stock
    const lowStockItems: LowStockItemStat[] = lowStockItemsData.map((i) => ({
      item: i.name,
      sku: i.sku,
      warehouseId: i.warehouse.name,
      onHand: i.quantity,
      minStock: i.minStock,
    }));

    // 8. Shipment Status
    const shipmentStatus = shipmentStatusRaw.map((s) => s.status);

    // 9. Picks & Packs
    let picks = 0;
    let packs = 0;
    inventoryMovements.forEach((m) => {
      if (m.type === "PICK") picks = m._sum.quantity || 0;
      if (m.type === "PACK") packs = m._sum.quantity || 0;
    });
    const picksAndPacks: PicksAndPacksData = { picks, packs };

    // 10. Shipment Volume History
    const shipmentVolume: ShipmentDayStat[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayStart = d.getTime();
      const dayEnd = dayStart + 86399999;
      const count = shipmentVolumeRaw.filter((s) => {
        const t = new Date(s.createdAt).getTime();
        return t >= dayStart && t <= dayEnd;
      }).length;
      shipmentVolume.push({ date: label, count });
    }

    // 11. Map Data
    const [mapWarehouses, mapVehicles, mapCustomers] = mapDataRaw;
    const mapData: MapData[] = [
      ...mapWarehouses.map((w) => ({
        position: { lat: w.lat || 40.7128, lng: w.lng || -74.006 },
        name: w.name,
        id: w.id,
        type: "W" as const,
      })),
      ...mapVehicles.map((v) => ({
        position: { lat: v.currentLat || 40.7128, lng: v.currentLng || -74.006 },
        name: v.plate,
        id: v.id,
        type: "V" as const,
      })),
      ...mapCustomers.map((c) => ({
        position: { lat: 40.75, lng: -74.05 }, // Mocked as in original
        name: c.name,
        id: c.id,
        type: "C" as const,
      })),
    ];

    return {
      stats,
      dailyOps,
      fuelStats,
      warehouseCapacity,
      lowStockItems,
      shipmentStatus,
      picksAndPacks,
      trends: [], // Keeping empty for backward compat if needed
      shipmentVolume,
      mapData,
        alerts
      };
    });
  } catch (error) {
    console.error("Failed to get unified overview dashboard data:", error);
    throw error;
  }
});
