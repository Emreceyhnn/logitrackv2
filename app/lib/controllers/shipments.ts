"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma, Customer, CustomerLocation, ShipmentStatus, ShipmentPriority } from "@prisma/client";

interface CustomerWithLocations extends Customer {
  locations: CustomerLocation[];
}

export const createShipment = authenticatedAction(
  async (
    user,
    customerId: string | null | undefined,
    origin: string,
    destination: string,
    status: ShipmentStatus = ShipmentStatus.PENDING,
    itemsCount: number = 1,
    weightKg: number = 0,
    volumeM3: number = 0,
    palletCount: number = 0,
    cargoType: string = "General Cargo",
    destinationLat?: number,
    destinationLng?: number,
    originLat?: number,
    originLng?: number,
    trackingId?: string,
    customerLocationId?: string,
    priority: ShipmentPriority = ShipmentPriority.MEDIUM,
    type: string = "Standard Freight",
    slaDeadline?: Date | null,
    contactEmail?: string,
    billingAccount?: string
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

      // Fetch customer details to potentially get default location if destination is not provided
      const customer = customerId
        ? ((await db.customer.findUnique({
            where: { id: customerId },
            include: { locations: true },
          })) as CustomerWithLocations | null)
        : null;

      const defaultCustomerLocation = customer?.locations?.find(
        (l) => l.isDefault
      );
      const firstCustomerLocation = customer?.locations?.[0];

      const finalDestination =
        destination ||
        defaultCustomerLocation?.address ||
        firstCustomerLocation?.address ||
        "";
      const finalDestinationLat =
        typeof destinationLat === "number"
          ? destinationLat
          : typeof defaultCustomerLocation?.lat === "number"
            ? defaultCustomerLocation.lat
            : typeof firstCustomerLocation?.lat === "number"
              ? firstCustomerLocation.lat
              : undefined;
      const finalDestinationLng =
        typeof destinationLng === "number"
          ? destinationLng
          : typeof defaultCustomerLocation?.lng === "number"
            ? defaultCustomerLocation.lng
            : typeof firstCustomerLocation?.lng === "number"
              ? firstCustomerLocation.lng
              : undefined;

      const newShipment = await db.shipment.create({
        data: {
          trackingId: finalTrackingId,
          customerId: customerId || undefined,
          customerLocationId: customerLocationId || undefined,
          origin,
          originLat,
          originLng,
          destination: finalDestination,
          destinationLat: finalDestinationLat,
          destinationLng: finalDestinationLng,
          status,
          itemsCount,
          weightKg,
          volumeM3,
          palletCount,
          cargoType,
          companyId,
          priority,
          type,
          slaDeadline,
          contactEmail,
          billingAccount,
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
          status: ShipmentStatus.ASSIGNED,
          history: {
            create: {
              status: ShipmentStatus.ASSIGNED,
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
          status: ShipmentStatus.PLANNED,
          history: {
            create: {
              status: ShipmentStatus.PLANNED,
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
    status: ShipmentStatus,
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
        customer: {
          include: { locations: true },
        },
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
  async (
    user,
    shipmentId: string,
    data: Prisma.ShipmentUpdateInput | Prisma.ShipmentUncheckedUpdateInput
  ) => {
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

      const updateData = { ...data };
      if (updateData.trackingId === "") {
        updateData.trackingId = `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      }

      const updatedShipment = await db.shipment.update({
        where: { id: shipmentId },
        data: updateData,
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
          status: { in: [ShipmentStatus.PENDING, ShipmentStatus.IN_TRANSIT, ShipmentStatus.PROCESSING] },
        },
      }),
      db.shipment.count({
        where: { companyId, status: ShipmentStatus.DELAYED },
      }),
      db.shipment.count({
        where: { companyId, status: ShipmentStatus.IN_TRANSIT },
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
