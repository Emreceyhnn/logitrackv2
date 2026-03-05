"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";

export const getOverviewStats = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

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
    await checkPermission(user.id, user.companyId);
    return [];
  } catch (error) {
    console.error("Failed to get action required:", error);
    return [];
  }
});

export const getDailyOperations = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

    if (!user.companyId) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [plannedRoutes, completedDeliveries] = await Promise.all([
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
    ]);

    return {
      plannedRoutes,
      completedDeliveries,
      failedDeliveries: 0,
      avgDeliveryTimeMin: 45,
      fuelConsumedLiters: 250,
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
    await checkPermission(user.id, user.companyId);

    if (!user.companyId) return [];

    const vehicles = await db.vehicle.findMany({
      where: { companyId: user.companyId },
      take: 5,
    });

    return vehicles.map((v) => ({
      id: v.id,
      plate: v.plate,
      value: 25 + Math.random() * 10,
    }));
  } catch (error) {
    console.error("Failed to get fuel stats:", error);
    return [];
  }
});

export const getWarehouseCapacity = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

    if (!user.companyId) return [];

    const warehouses = await db.warehouse.findMany({
      where: { companyId: user.companyId },
      include: { inventory: true },
    });

    return warehouses.map((w) => ({
      warehouseName: w.name,
      warehouseId: w.id,
      capacity: 75,
      volume: 60,
    }));
  } catch (error) {
    console.error("Failed to get warehouse capacity:", error);
    return [];
  }
});

export const getLowStockItems = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

    if (!user.companyId) return [];

    const lowStock = await db.inventory.findMany({
      where: { companyId: user.companyId, quantity: { lt: 50 } },
      take: 5,
      include: { warehouse: true },
    });

    return lowStock.map((i) => ({
      item: i.name,
      warehouseId: i.warehouse.name,
      onHand: i.quantity,
    }));
  } catch (error) {
    console.error("Failed to get low stock items:", error);
    return [];
  }
});

export const getShipmentStatusStats = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

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
    await checkPermission(user.id, user.companyId);
    return { picks: 145, packs: 120 };
  } catch (error) {
    console.error("Failed to get picks and packs:", error);
    return { picks: 0, packs: 0 };
  }
});

export const getOnTimeTrends = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);
    return [
      { date: "2026-01-28", value: 92 },
      { date: "2026-01-29", value: 94 },
      { date: "2026-01-30", value: 91 },
      { date: "2026-01-31", value: 95 },
      { date: "2026-02-02", value: 94 },
    ];
  } catch (error) {
    console.error("Failed to get on time trends:", error);
    return [];
  }
});

export const getMapData = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

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
        type: "W",
      })),
      ...vehicles.map((v) => ({
        position: {
          lat: v.currentLat || 40.7128,
          lng: v.currentLng || -74.006,
        },
        name: v.plate,
        id: v.id,
        type: "V",
      })),
      ...customers.map((c) => ({
        position: { lat: 40.75, lng: -74.05 },
        name: c.name,
        id: c.id,
        type: "C",
      })),
    ];
  } catch (error) {
    console.error("Failed to get map data:", error);
    return [];
  }
});

export const getAnalyticsDashboardData = authenticatedAction(async (user) => {
  try {
    await checkPermission(user.id, user.companyId);

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
        weeks: [
          "W1",
          "W2",
          "W3",
          "W4",
          "W5",
          "W6",
          "W7",
          "W8",
          "W9",
          "W10",
          "W11",
          "W12",
          "W13",
        ],
        actuals: [
          120,
          132,
          125,
          145,
          150,
          160,
          155,
          175,
          180,
          null,
          null,
          null,
          null,
        ],
        predicted: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          180,
          195,
          210,
          225,
          240,
        ],
      },
    };
  } catch (error) {
    console.error("Failed to get analytics dashboard data:", error);
    return null;
  }
});
