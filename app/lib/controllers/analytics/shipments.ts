"use server";

import dayjs from "dayjs";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { RouteStatus } from "@prisma/client";

export const getShipmentStatusStats = authenticatedAction(async (user) => {
  try {
    await checkPermission(user, user.companyId, [], {
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

export const getShipmentVolumeHistory = authenticatedAction(async (user) => {
  try {
    await checkPermission(user, user.companyId, [], {
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

      const dayjsDate = dayjs.utc(d).tz(user.timezone || "UTC");
      const label = dayjsDate.format("MMM DD");
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
    await checkPermission(user, user.companyId, [], {
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
        status: RouteStatus.COMPLETED,
        updatedAt: { gte: thirtyDaysAgo },
      },
      select: { updatedAt: true },
      orderBy: { updatedAt: "asc" },
    });

    // Group by date
    const byDate = new Map<string, number>();
    completedRoutes.forEach((r) => {
      const label = dayjs(r.updatedAt).format("MMM D");
      byDate.set(label, (byDate.get(label) ?? 0) + 1);
    });

    return Array.from(byDate.entries()).map(([date, value]) => ({ date, value }));
  } catch (error) {
    console.error("Failed to get on time trends:", error);
    return [];
  }
});
