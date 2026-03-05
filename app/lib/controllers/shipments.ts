"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";

export const createShipment = authenticatedAction(
  async (
    user,
    customerId: string,
    origin: string,
    destination: string,
    status: string = "PENDING",
    itemsCount: number = 1,
    trackingId?: string
  ) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (!companyId) throw new Error("User has no company");

      const finalTrackingId =
        trackingId ||
        `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const existingShipment = await db.shipment.findUnique({
        where: { trackingId: finalTrackingId },
      });

      if (existingShipment) {
        throw new Error("Tracking ID already exists");
      }

      const newShipment = await db.shipment.create({
        data: {
          trackingId: finalTrackingId,
          customerId,
          origin,
          destination,
          status,
          itemsCount,
          companyId,
          history: {
            create: {
              status: status,
              description: "Shipment created",
              createdBy: userId,
            },
          },
        },
      });

      return { shipment: newShipment };
    } catch (error) {
      console.error("Failed to create shipment:", error);
      throw error;
    }
  }
);

export const assignDriverToShipment = authenticatedAction(
  async (user, shipmentId: string, driverId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        select: { companyId: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      const updatedShipment = await db.shipment.update({
        where: { id: shipmentId },
        data: {
          driverId,
          status: "assigned",
          history: {
            create: {
              status: "assigned",
              description: `Driver assigned`,
              createdBy: userId,
            },
          },
        },
      });

      return updatedShipment;
    } catch (error) {
      console.error("Failed to assign driver to shipment:", error);
      throw error;
    }
  }
);

export const assignRouteToShipment = authenticatedAction(
  async (user, shipmentId: string, routeId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        select: { companyId: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      const updatedShipment = await db.shipment.update({
        where: { id: shipmentId },
        data: {
          routeId,
          status: "planned",
          history: {
            create: {
              status: "planned",
              description: `Route assigned`,
              createdBy: userId,
            },
          },
        },
      });

      return updatedShipment;
    } catch (error) {
      console.error("Failed to assign route to shipment:", error);
      throw error;
    }
  }
);

export const updateShipmentStatus = authenticatedAction(
  async (
    user,
    shipmentId: string,
    status: string,
    location?: string,
    description?: string
  ) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        select: { companyId: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      const updatedShipment = await db.shipment.update({
        where: { id: shipmentId },
        data: {
          status,
          history: {
            create: {
              status,
              location,
              description: description || `Status updated to ${status}`,
              createdBy: userId,
            },
          },
        },
      });

      return updatedShipment;
    } catch (error) {
      console.error("Failed to update shipment status:", error);
      throw error;
    }
  }
);

export const getShipments = authenticatedAction(async (user) => {
  const userId = user?.id;
  const companyId = user?.companyId;
  try {
    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    if (!companyId) throw new Error("User has no company");

    const shipments = await db.shipment.findMany({
      where: { companyId },
      include: {
        customer: true,
        driver: {
          include: {
            user: {
              select: { name: true, surname: true, avatarUrl: true },
            },
          },
        },
        route: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return shipments;
  } catch (error) {
    console.error("Failed to get shipments:", error);
    throw error;
  }
});

export const getShipmentById = authenticatedAction(
  async (user, shipmentId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const shipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        include: {
          customer: true,
          driver: {
            include: {
              user: {
                select: { name: true, surname: true, avatarUrl: true },
              },
            },
          },
          route: true,
          company: true,
          history: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!shipment || shipment.companyId !== user.companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      return shipment;
    } catch (error) {
      console.error("Failed to get shipment:", error);
      throw error;
    }
  }
);

export const updateShipment = authenticatedAction(
  async (user, shipmentId: string, data: Prisma.ShipmentUpdateInput) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        select: { companyId: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      const updatedShipment = await db.shipment.update({
        where: { id: shipmentId },
        data: {
          ...data,
        },
      });

      return updatedShipment;
    } catch (error) {
      console.error("Failed to update shipment:", error);
      throw error;
    }
  }
);

export const deleteShipment = authenticatedAction(
  async (user, shipmentId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        select: { companyId: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      await db.shipment.delete({
        where: { id: shipmentId },
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to delete shipment:", error);
      throw error;
    }
  }
);

export const getShipmentByTrackingId = authenticatedAction(
  async (user, trackingId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId);

      const shipment = await db.shipment.findUnique({
        where: { trackingId },
        include: {
          customer: true,
          driver: true,
          route: true,
          history: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!shipment || shipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      return shipment;
    } catch (error) {
      console.error("Failed to get shipment by tracking ID:", error);
      throw error;
    }
  }
);

export const getShipmentStats = authenticatedAction(async (user) => {
  const userId = user?.id;
  const companyId = user?.companyId;
  try {
    await checkPermission(userId, companyId);

    if (!companyId) throw new Error("User has no company");

    const [total, active, delayed, inTransit] = await Promise.all([
      db.shipment.count({ where: { companyId } }),
      db.shipment.count({
        where: {
          companyId,
          status: { in: ["PENDING", "IN_TRANSIT", "PROCESSING"] },
        },
      }),
      db.shipment.count({
        where: { companyId, status: "DELAYED" },
      }),
      db.shipment.count({
        where: { companyId, status: "IN_TRANSIT" },
      }),
    ]);

    return { total, active, delayed, inTransit };
  } catch (error) {
    console.error("Failed to get shipment stats:", error);
    return { total: 0, active: 0, delayed: 0, inTransit: 0 };
  }
});

export const getShipmentVolumeHistory = authenticatedAction(async (user) => {
  const userId = user?.id;
  const companyId = user?.companyId;
  try {
    await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

    if (!companyId) throw new Error("User has no company");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const rawShipments = await db.shipment.findMany({
      where: {
        companyId,
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
    });

    const volumeByDay: Record<string, number> = {};
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    rawShipments.forEach((s) => {
      const dayName = days[s.createdAt.getDay()];
      volumeByDay[dayName] = (volumeByDay[dayName] || 0) + 1;
    });

    return days.map((day) => ({
      day,
      volume: volumeByDay[day] || 0,
    }));
  } catch (error) {
    console.error("Failed to get shipment volume history:", error);
    return [];
  }
});

export const getShipmentStatusDistribution = authenticatedAction(
  async (user) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(userId, companyId, ["role_admin", "role_manager"]);

      if (!companyId) throw new Error("User has no company");

      const statusCounts = await db.shipment.groupBy({
        by: ["status"],
        where: { companyId },
        _count: { status: true },
      });

      return statusCounts.map((s) => ({
        status: s.status,
        count: s._count.status,
      }));
    } catch (error) {
      console.error("Failed to get shipment status distribution:", error);
      return [];
    }
  }
);
