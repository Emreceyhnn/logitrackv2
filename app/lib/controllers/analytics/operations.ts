"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import {
  ShipmentStatus,
  VehicleStatus,
  RouteStatus,
  IssueStatus,
  IssuePriority,
  IssueType,
} from "@prisma/client";
import { formatDisplayDate } from "../../utils/date";
import { controllerGuard } from "../utils/controllerGuard";

export const getOverviewStats = authenticatedAction(async (user) => {
  return controllerGuard("getOverviewStats", async () => {
    await checkPermission(user, user.companyId, [], {
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
          status: { notIn: [ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED] },
        },
      }),
      db.shipment.count({
        where: { companyId: user.companyId, status: ShipmentStatus.DELAYED },
      }),
      db.vehicle.count({
        where: { companyId: user.companyId, status: VehicleStatus.ON_TRIP },
      }),
      db.vehicle.count({
        where: { companyId: user.companyId, status: VehicleStatus.MAINTENANCE },
      }),
      db.vehicle.count({
        where: { companyId: user.companyId, status: VehicleStatus.AVAILABLE },
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
  });
});

export const getActionRequired = authenticatedAction(async (user) => {
  return controllerGuard("getActionRequired", async () => {
    await checkPermission(user, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return [];

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [openIssues, expiringDocs] = await Promise.all([
      db.issue.findMany({
        where: {
          companyId: user.companyId,
          status: { in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS] },
          priority: { in: [IssuePriority.HIGH, IssuePriority.CRITICAL] },
        },
        select: {
          type: true,
          title: true,
          priority: true,
          status: true,
          vehicleId: true,
          driverId: true,
          shipmentId: true,
          createdAt: true,
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
        select: {
          name: true,
          expiryDate: true,
          driverId: true,
          vehicleId: true,
        },
        take: 5,
        orderBy: { expiryDate: "asc" },
      }),
    ]);

    const issueAlerts = openIssues.map((issue) => ({
      type: (issue.type === IssueType.VEHICLE
        ? "vehicle"
        : issue.type === IssueType.DRIVER
        ? "driver"
        : issue.type === IssueType.SHIPMENT
        ? "SHIPMENT_DELAY"
        : "vehicle") as
        | "vehicle"
        | "driver"
        | "SHIPMENT_DELAY"
        | "DOCUMENT_DUE"
        | "warehouse",
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

    const docAlerts = expiringDocs.map((doc) => ({
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

    return [...issueAlerts, ...docAlerts];
  }, { fallback: [] });
});

export const getDailyOperations = authenticatedAction(async (user) => {
  return controllerGuard("getDailyOperations", async () => {
    await checkPermission(user, user.companyId, [], {
      allowNoCompany: true,
    });

    if (!user.companyId) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [plannedRoutes, completedDeliveries, failedDeliveries, fuelToday, avgDuration] =
      await Promise.all([
        db.route.count({
          where: { companyId: user.companyId, status: RouteStatus.PLANNED },
        }),
        db.shipment.count({
          where: {
            companyId: user.companyId,
            status: ShipmentStatus.DELIVERED,
            updatedAt: { gte: today },
          },
        }),
        db.shipment.count({
          where: {
            companyId: user.companyId,
            status: ShipmentStatus.CANCELLED,
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
            status: RouteStatus.COMPLETED,
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
  }, {
    fallback: {
      plannedRoutes: 0,
      completedDeliveries: 0,
      failedDeliveries: 0,
      avgDeliveryTimeMin: 0,
      fuelConsumedLiters: 0,
    },
  });
});

export const getPicksAndPacks = authenticatedAction(async (user) => {
  return controllerGuard("getPicksAndPacks", async () => {
    await checkPermission(user, user.companyId, [], {
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
  }, { fallback: { picks: 0, packs: 0 } });
});
