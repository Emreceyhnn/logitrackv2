"use server";

import dayjs from "dayjs";

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
import { getExchangeRates } from "../services/exchangeRate";
import { formatDisplayDate } from "../utils/date";
import { calcTrend, daysAgo } from "./utils/trendUtils";

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
        fuelLogs: [],
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

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const oneHundredEightyDaysAgo = new Date();
    oneHundredEightyDaysAgo.setDate(oneHundredEightyDaysAgo.getDate() - 179);
    oneHundredEightyDaysAgo.setHours(0, 0, 0, 0);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Trend windows: current = last 30 days, previous = 30–60 days ago
    const prevPeriodStart = daysAgo(60);
    const prevPeriodEnd = daysAgo(30);

    const cacheKey = overviewCacheKeys.dashboard(companyId);

    return await withCache(cacheKey, OVERVIEW_CACHE_TTL, async () => {
      // Run all queries in parallel, including the permission check
      const [
        , // permission check only needs to resolve, no value needed
      statsCounts,
      openIssues,
      expiringDocs,
      dailyOpsMetrics,
      fuelLogsRaw,
      exchangeRates,
      vehiclePlates,
      warehousesRaw,
      palletSumsRaw,
      lowStockItemsData,
      shipmentStatusRaw,
      inventoryMovements,
      shipmentVolumeRaw,
      mapDataRaw,
      prevStatsCounts,
    ] = await Promise.all([
      // 0. Parallel Permission Check
      checkPermission(user, companyId, [], { allowNoCompany: true }),

      // 1. Basic Stats
      Promise.all([
        db.shipment.count({
          where: {
            companyId,
            status: { notIn: [ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED] },
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
      db.fuelLog.findMany({
        where: {
          companyId,
          date: { gte: oneHundredEightyDaysAgo },
        },
      }),
      
      // 5b. Exchange Rates for processing
      getExchangeRates(),

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
          quantity: { lte: db.inventory.fields.minStock },
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
          createdAt: { gte: oneHundredEightyDaysAgo },
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
          select: { 
            id: true, 
            name: true,
            locations: {
              select: {
                lat: true,
                lng: true,
                isDefault: true,
              }
            }
          } 
        }),
      ]),

      // 12. Previous period counts for trend calculations (30–60 days ago)
      Promise.all([
        db.shipment.count({
          where: {
            companyId,
            status: { notIn: [ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED] },
            createdAt: { gte: prevPeriodStart, lt: prevPeriodEnd },
          },
        }),
        db.shipment.count({
          where: { companyId, status: ShipmentStatus.DELAYED, createdAt: { gte: prevPeriodStart, lt: prevPeriodEnd } },
        }),
        db.vehicle.count({ where: { companyId, status: VehicleStatus.ON_TRIP } }),
        db.vehicle.count({ where: { companyId, status: VehicleStatus.MAINTENANCE } }),
        db.vehicle.count({ where: { companyId, status: VehicleStatus.AVAILABLE } }),
        db.driver.count({ where: { companyId, status: "ON_JOB", createdAt: { lte: prevPeriodEnd } } }),
        db.warehouse.count({ where: { companyId, createdAt: { lte: prevPeriodEnd } } }),
        db.inventory.count({ where: { companyId, updatedAt: { lte: prevPeriodEnd } } }),
      ]),
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

    // Trend data: current vs. previous 30-day period
    const statsTrends = {
      activeShipments: calcTrend(statsCounts[0], prevStatsCounts[0]),
      delayedShipments: calcTrend(statsCounts[1], prevStatsCounts[1]),
      vehiclesOnTrip: calcTrend(statsCounts[2], prevStatsCounts[2]),
      vehiclesInService: calcTrend(statsCounts[3], prevStatsCounts[3]),
      availableVehicles: calcTrend(statsCounts[4], prevStatsCounts[4]),
      activeDrivers: calcTrend(statsCounts[5], prevStatsCounts[5]),
      warehouses: calcTrend(statsCounts[6], prevStatsCounts[6]),
      inventorySkus: calcTrend(statsCounts[7], prevStatsCounts[7]),
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
        ? `Expires ${formatDisplayDate(doc.expiryDate, user)}`
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
    const rates = exchangeRates.rates;
    const fuelStatsMap = new Map<string, { volume: number; costUsd: number }>();

    fuelLogsRaw.forEach((log) => {
      const current = fuelStatsMap.get(log.vehicleId) || { volume: 0, costUsd: 0 };
      const rate = rates[log.currency || "USD"] || 1;
      const costUsd = log.cost / rate;

      fuelStatsMap.set(log.vehicleId, {
        volume: current.volume + log.volumeLiter,
        costUsd: current.costUsd + costUsd,
      });
    });

    const fuelStats: FuelStat[] = Array.from(fuelStatsMap.entries())
      .sort((a, b) => b[1].volume - a[1].volume)
      .slice(0, 8)
      .map(([id, data]) => ({
        id,
        plate: vehicleMap.get(id) ?? id,
        value: Math.round(data.volume * 10) / 10,
        totalCost: Math.round(data.costUsd),
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
    for (let i = 179; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      
      const dayjsDate = dayjs.utc(d).tz(user.timezone || "UTC");
      const label = dayjsDate.format("MMM DD");
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
      ...mapCustomers.map((c) => {
        const defaultLoc = c.locations.find((l) => l.isDefault) || c.locations[0];
        return {
          position: {
            lat: defaultLoc?.lat ?? 40.7128,
            lng: defaultLoc?.lng ?? -74.006,
          },
          name: c.name,
          id: c.id,
          type: "C" as const,
        };
      }),
    ];

    return {
      stats,
      statsTrends,
      dailyOps,
      fuelStats,
      fuelLogs: fuelLogsRaw.map((log) => ({
        plate: vehicleMap.get(log.vehicleId) ?? "N/A",
        amount: log.volumeLiter,
        date: log.date.toISOString(),
      })),
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
