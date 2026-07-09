"use server";

import dayjs from "dayjs";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { MapData } from "../../type/overview";
import { ShipmentStatus, VehicleStatus } from "@prisma/client";
import { getExchangeRates } from "../../services/exchangeRate";
import { controllerGuard } from "../utils/controllerGuard";

export const getFuelStats = authenticatedAction(async (user) => {
  return controllerGuard("getFuelStats", async () => {
    await checkPermission(user, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const fuelByVehicleRaw = await db.fuelLog.findMany({
      where: {
        companyId: user.companyId,
        date: { gte: thirtyDaysAgo },
      },
      select: { vehicleId: true, currency: true, cost: true, volumeLiter: true },
    });

    if (fuelByVehicleRaw.length === 0) return [];

    const rates = (await getExchangeRates()).rates;
    const statsMap = new Map<string, { volume: number; costUsd: number }>();

    fuelByVehicleRaw.forEach((log) => {
      const current = statsMap.get(log.vehicleId) || { volume: 0, costUsd: 0 };
      const rate = rates[log.currency || "USD"] || 1;
      const costUsd = Number(log.cost) / rate;

      statsMap.set(log.vehicleId, {
        volume: current.volume + log.volumeLiter,
        costUsd: current.costUsd + costUsd,
      });
    });

    // Take top 8 by volume
    const topVehicles = Array.from(statsMap.entries())
      .sort((a, b) => b[1].volume - a[1].volume)
      .slice(0, 8);

    const vehicleIds = topVehicles.map(([id]) => id);
    const vehicles = await db.vehicle.findMany({
      where: { id: { in: vehicleIds }, deletedAt: null },
      select: { id: true, plate: true },
    });

    const vehicleMap = new Map(vehicles.map((v) => [v.id, v.plate]));

    return topVehicles.map(([id, data]) => ({
      id,
      plate: vehicleMap.get(id) ?? id,
      value: Math.round(data.volume * 10) / 10,
      totalCost: Math.round(data.costUsd),
    }));
  }, { fallback: [] });
});

export const getMapData = authenticatedAction(async (user): Promise<MapData[]> => {
  return controllerGuard("getMapData", async () => {
    await checkPermission(user, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const [warehouses, vehicles, customers] = await Promise.all([
      db.warehouse.findMany({
        where: { companyId: user.companyId },
        select: { id: true, name: true, lat: true, lng: true },
      }),
      db.vehicle.findMany({
        where: { companyId: user.companyId, deletedAt: null },
        select: { id: true, plate: true, currentLat: true, currentLng: true },
      }),
      db.customer.findMany({
        where: { companyId: user.companyId },
        select: {
          id: true,
          name: true,
          locations: {
            select: { lat: true, lng: true, isDefault: true },
          },
        },
      }),
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
      ...customers.map((c) => {
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
  }, { fallback: [] });
});

export const getAnalyticsDashboardData = authenticatedAction(async (user) => {
  return controllerGuard("getAnalyticsDashboardData", async () => {
    await checkPermission(user, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return null;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [totalVehicles, activeVehicles, totalShipments, delayedShipments, fuelLogs, maintenanceRecords] =
      await Promise.all([
        db.vehicle.count({ where: { companyId: user.companyId } }),
        db.vehicle.count({
          where: { companyId: user.companyId, status: VehicleStatus.ON_TRIP },
        }),
        db.shipment.count({ where: { companyId: user.companyId } }),
        db.shipment.count({
          where: { companyId: user.companyId, status: ShipmentStatus.DELAYED },
        }),
        db.fuelLog.findMany({
          where: { companyId: user.companyId, date: { gte: sixMonthsAgo } },
          select: { date: true, cost: true },
        }),
        db.maintenanceRecord.findMany({
          where: { vehicle: { companyId: user.companyId }, date: { gte: sixMonthsAgo } },
          select: { date: true, cost: true },
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

    const months: string[] = [];
    const fuelCosts: number[] = [0, 0, 0, 0, 0, 0];
    const maintenanceCosts: number[] = [0, 0, 0, 0, 0, 0];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(dayjs(d).format("MMM"));
    }

    const getMonthIndex = (date: Date) => {
      const diff = dayjs().month() - dayjs(date).month();
      const adjustedDiff = diff < 0 ? diff + 12 : diff;
      return 5 - adjustedDiff;
    };

    fuelLogs.forEach((log) => {
      const idx = getMonthIndex(log.date);
      if (idx >= 0 && idx < 6) fuelCosts[idx] = (fuelCosts[idx] ?? 0) + Number(log.cost);
    });

    maintenanceRecords.forEach((record) => {
      const idx = getMonthIndex(record.date);
      if (idx >= 0 && idx < 6) maintenanceCosts[idx] = (maintenanceCosts[idx] ?? 0) + Number(record.cost);
    });

    const totalFuel = fuelCosts.reduce((a, b) => a + b, 0);
    const totalMaintenance = maintenanceCosts.reduce((a, b) => a + b, 0);
    const totalCost = totalFuel + totalMaintenance;

    return {
      performance: {
        onTimeRate,
        fleetUtilization,
        satisfaction: 4.8,
        satisfactionCount: 128,
      },
      costs: {
        months: months,
        fuel: fuelCosts.map(c => Math.round(c)),
        maintenance: maintenanceCosts.map(c => Math.round(c)),
        overhead: [0, 0, 0, 0, 0, 0],
        distribution: [
          { id: 0, value: totalCost > 0 ? Math.round((totalFuel / totalCost) * 100) : 0, label: "Fuel" },
          { id: 1, value: totalCost > 0 ? Math.round((totalMaintenance / totalCost) * 100) : 0, label: "Maintenance" },
          { id: 2, value: 0, label: "Driver Salaries" },
          { id: 3, value: 0, label: "Insurance/Ops" },
        ],
      },
      forecast: {
        weeks: ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12","W13"],
        actuals: [0,0,0,0,0,0,0,0,0,0,0,0,0],
        predicted: [null,null,null,null,null,null,null,null,10,12,15,18,20],
      },
    };
  }, { fallback: null });
});
