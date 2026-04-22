"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { type Prisma, ShipmentStatus, ShipmentPriority } from "@prisma/client";
import type { Customer, CustomerLocation } from "@prisma/client";
import {
  ShipmentWithRelations,
  ShipmentStats,
  ShipmentVolumeData,
  ShipmentStatusData,
} from "../type/shipment";
import {
  redis,
  withCache,
  invalidatePattern,
  hashFilters,
  shipmentCacheKeys,
  SHIPMENT_CACHE_TTL,
} from "../redis";
import { invalidateInventoryCache } from "./inventory";

export async function invalidateShipmentCache(companyId: string, shipmentId?: string) {
  await Promise.all([
    invalidatePattern(shipmentCacheKeys.companyPattern(companyId)),
    shipmentId ? redis.del(shipmentCacheKeys.detail(shipmentId)) : Promise.resolve(),
  ]);
}

interface CustomerWithLocations extends Customer {
  locations: CustomerLocation[];
}

export const createShipment = authenticatedAction(
  async (
    user,
    data: {
      customerId?: string | null;
      origin: string;
      destination: string;
      status?: ShipmentStatus;
      itemsCount?: number;
      weightKg?: number;
      volumeM3?: number;
      palletCount?: number;
      cargoType?: string;
      destinationLat?: number;
      destinationLng?: number;
      originLat?: number;
      originLng?: number;
      trackingId?: string;
      customerLocationId?: string;
      priority?: ShipmentPriority;
      type?: string;
      slaDeadline?: Date | null;
      contactEmail?: string;
      billingAccount?: string;
      originWarehouseId?: string;
      inventoryItems?: any[];
    }
  ) => {
    const userId = user?.id;
    const companyId = user?.companyId;

    const {
      customerId,
      origin,
      destination,
      status = ShipmentStatus.PENDING,
      itemsCount = 1,
      weightKg = 0,
      volumeM3 = 0,
      palletCount = 0,
      cargoType = "General Cargo",
      destinationLat,
      destinationLng,
      originLat,
      originLng,
      trackingId,
      customerLocationId,
      priority = ShipmentPriority.MEDIUM,
      type = "Standard Freight",
      slaDeadline,
      contactEmail,
      billingAccount,
      originWarehouseId,
      inventoryItems = [],
    } = data;
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

      const newShipment = await db.$transaction(async (tx: any) => {
        const shipment = await tx.shipment.create({
          data: {
            trackingId: finalTrackingId,
            customerId: customerId || undefined,
            customerLocationId: customerLocationId || undefined,
            origin,
            originWarehouseId: originWarehouseId || (origin.length === 36 ? origin : undefined),
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
            items: {
              create: inventoryItems.map((item: any) => ({
                sku: item.sku,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                weightKg: item.weightKg,
                volumeM3: item.volumeM3,
                palletCount: item.palletCount,
                cargoType: item.cargoType,
              })),
            },
          },
        });

        // Decrement inventory stock if it's from a warehouse
        const finalWarehouseId = shipment.originWarehouseId;
        if (finalWarehouseId && inventoryItems.length > 0) {
          for (const item of inventoryItems) {
            // Find inventory item to ensure it exists
            const invItem = await tx.inventory.findUnique({
              where: {
                warehouseId_sku: {
                  warehouseId: finalWarehouseId,
                  sku: item.sku,
                },
              },
            });

            if (invItem) {
              await tx.inventory.update({
                where: { id: invItem.id },
                data: {
                  allocatedQuantity: {
                    increment: item.quantity,
                  },
                },
              });

              // Log inventory movement
              await tx.inventoryMovement.create({
                data: {
                  warehouseId: finalWarehouseId,
                  sku: item.sku,
                  quantity: -item.quantity,
                  type: "ALLOCATION",
                  userId,
                  companyId,
                },
              });
            }
          }
          await invalidatePattern(shipmentCacheKeys.companyPattern(companyId!));
        }

        return shipment;
      });

      await Promise.all([
        invalidateShipmentCache(companyId!),
        invalidateInventoryCache(companyId!)
      ]);
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

      await invalidateShipmentCache(companyId!, shipmentId);
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

      await invalidateShipmentCache(companyId!, shipmentId);
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

      await invalidateShipmentCache(companyId!, shipmentId);
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

    const cacheKey = shipmentCacheKeys.list(companyId, hashFilters({}));
    return await withCache(cacheKey, SHIPMENT_CACHE_TTL, async () => {
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
        items: true,
      },
      orderBy: { createdAt: "desc" },
      });
      return shipments;
    });
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
          items: true,
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

      const updateData = { ...data } as any;
      if (updateData.trackingId === "") {
        updateData.trackingId = `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      }

      // FK alanlarında boş string geldiyse undefined'a çevir (Prisma P2003 önlemi)
      const fkFields = ["customerId", "customerLocationId", "routeId", "originWarehouseId", "driverId"];
      for (const field of fkFields) {
        if (updateData[field] === "" || updateData[field] === null) {
          updateData[field] = undefined;
        }
      }

      // Handle items synchronization if provided
      const items = (updateData as any).inventoryItems;
      if (items) {
        delete updateData.inventoryItems;
        
        // Use a transaction for safety
        const updatedShipment = await db.$transaction(async (tx: any) => {
          // 1. Get old items to restore inventory
          const oldShipment = await tx.shipment.findUnique({
            where: { id: shipmentId },
            include: { items: true },
          });

          if (!oldShipment) throw new Error("Shipment not found");

          // Check trackingId uniqueness if it's being updated
          if (updateData.trackingId && updateData.trackingId !== oldShipment.trackingId) {
            const duplicate = await tx.shipment.findUnique({
              where: { trackingId: updateData.trackingId },
            });
            if (duplicate) {
              throw new Error("Tracking ID already exists in another shipment");
            }
          }

          const oldWarehouseId = oldShipment.originWarehouseId;

          // 2. Revert old inventory if applicable
          if (oldWarehouseId) {
            for (const oldItem of oldShipment!.items) {
              const invItem = await tx.inventory.findUnique({
                where: {
                  warehouseId_sku: {
                    warehouseId: oldWarehouseId,
                    sku: oldItem.sku,
                  },
                },
              });

              if (invItem) {
                await tx.inventory.update({
                  where: { id: invItem.id },
                  data: {
                    allocatedQuantity: {
                      decrement: oldItem.quantity,
                    },
                  },
                });

                await tx.inventoryMovement.create({
                  data: {
                    warehouseId: oldWarehouseId,
                    sku: oldItem.sku,
                    quantity: oldItem.quantity,
                    type: "ALLOCATION_REVERT",
                    userId,
                    companyId,
                  },
                });
              }
            }
          }

          // 3. Delete existing shipment items
          await tx.shipmentItem.deleteMany({
            where: { shipmentId },
          });

          // 4. Update shipment and create new items
          const updated = await tx.shipment.update({
            where: { id: shipmentId },
            data: {
              ...updateData,
              items: {
                create: items.map((item: any) => ({
                  sku: item.sku,
                  name: item.name,
                  quantity: item.quantity,
                  unit: item.unit,
                  weightKg: item.weightKg,
                  volumeM3: item.volumeM3,
                  palletCount: item.palletCount,
                  cargoType: item.cargoType,
                })),
              },
            },
            include: { items: true },
          });

          // 5. Decrement new inventory if applicable
          const newWarehouseId = updated.originWarehouseId;
          if (newWarehouseId) {
            for (const item of items) {
              const invItem = await tx.inventory.findUnique({
                where: {
                  warehouseId_sku: {
                    warehouseId: newWarehouseId,
                    sku: item.sku,
                  },
                },
              });

              if (invItem) {
                await tx.inventory.update({
                  where: { id: invItem.id },
                  data: {
                    allocatedQuantity: {
                      increment: item.quantity,
                    },
                  },
                });

                await tx.inventoryMovement.create({
                  data: {
                    warehouseId: newWarehouseId,
                    sku: item.sku,
                    quantity: -item.quantity,
                    type: "ALLOCATION",
                    userId,
                    companyId,
                  },
                });
              }
            }
          }

          return updated;
        });
        
        // Non-blocking invalidation to prevent hanging on slow Redis
        Promise.all([
          invalidateShipmentCache(companyId!, shipmentId),
          invalidateInventoryCache(companyId!)
        ]).catch(err => console.error("Cache invalidation failed:", err));
        
        return updatedShipment;
      }

      const updatedShipment = await db.shipment.update({
        where: { id: shipmentId },
        data: updateData,
      });

      invalidateShipmentCache(companyId!, shipmentId).catch(err => 
        console.error("Cache invalidation failed:", err)
      );
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
        include: { items: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      await db.$transaction(async (tx: any) => {
        // Restore inventory stock
        const warehouseId = existingShipment.originWarehouseId;
        if (warehouseId) {
          for (const item of existingShipment.items) {
            const invItem = await tx.inventory.findUnique({
              where: {
                warehouseId_sku: {
                  warehouseId,
                  sku: item.sku,
                },
              },
            });

            if (invItem) {
              await tx.inventory.update({
                where: { id: invItem.id },
                data: {
                  allocatedQuantity: {
                    decrement: item.quantity,
                  },
                },
              });

              await tx.inventoryMovement.create({
                data: {
                  warehouseId,
                  sku: item.sku,
                  quantity: item.quantity,
                  type: "ALLOCATION_CANCEL",
                  userId,
                  companyId,
                },
              });
            }
          }
        }

        await tx.shipment.delete({
          where: { id: shipmentId },
        });
      });

      Promise.all([
        invalidateShipmentCache(companyId!, shipmentId),
        invalidateInventoryCache(companyId!)
      ]).catch(err => console.error("Cache invalidation failed:", err));
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

    rawShipments.forEach((s: { createdAt: Date }) => {
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

      return statusCounts.map((s: any) => ({
        status: s.status,
        count: s._count.status,
      }));
    } catch (error) {
      console.error("Failed to get shipment status distribution:", error);
      return [];
    }
  }
);

export const getShipmentsWithDashboardData = authenticatedAction(
  async (
    user,
    page: number = 1,
    pageSize: number = 10,
    status?: ShipmentStatus | "ALL",
    search?: string
  ): Promise<{
    shipments: ShipmentWithRelations[];
    totalCount: number;
    stats: ShipmentStats;
    volumeHistory: ShipmentVolumeData[];
    statusDistribution: ShipmentStatusData[];
  }> => {
    const userId = user?.id;
    const companyId = user?.companyId;

    try {
      if (!companyId) throw new Error("User has no company");

      const skip = (page - 1) * pageSize;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const where: Prisma.ShipmentWhereInput = { companyId };
      if (status && status !== "ALL") {
        where.status = status;
      }
      if (search) {
        where.OR = [
          { trackingId: { contains: search, mode: "insensitive" } },
          { origin: { contains: search, mode: "insensitive" } },
          { destination: { contains: search, mode: "insensitive" } },
          { customer: { name: { contains: search, mode: "insensitive" } } },
        ];
      }

      // ── Parallel Orchestration ──────────────────────────────────────────
      const cacheKey = shipmentCacheKeys.dashboard(
        companyId,
        hashFilters({ page, pageSize, status, search })
      );

      return await withCache(cacheKey, SHIPMENT_CACHE_TTL, async () => {
        const [
          ,
          shipments,
        totalCount,
        total,
        active,
        delayed,
        inTransit,
        rawVolumeHistory,
        statusCounts,
      ] = await Promise.all([
        checkPermission(userId, companyId, [
          "role_admin",
          "role_manager",
          "role_dispatcher",
        ]),
        db.shipment.findMany({
          where,
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
            items: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
        }),
        db.shipment.count({ where }),
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
        db.shipment.findMany({
          where: {
            companyId,
            createdAt: { gte: sevenDaysAgo },
          },
          select: { createdAt: true },
        }),
        db.shipment.groupBy({
          by: ["status"],
          where: { companyId },
          _count: { status: true },
        }),
      ]);

      // Volume History Transformation
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const volumeByDay: Record<string, number> = {};
      rawVolumeHistory.forEach((s: any) => {
        const dayName = days[s.createdAt.getDay()];
        volumeByDay[dayName] = (volumeByDay[dayName] || 0) + 1;
      });
      const volumeHistory = days.map((day) => ({
        day,
        volume: volumeByDay[day] || 0,
      }));

      return {
        shipments: shipments as unknown as ShipmentWithRelations[],
        totalCount,
        stats: { total, active, delayed, inTransit },
        volumeHistory,
        statusDistribution: statusCounts.map((s: any) => ({
          status: s.status,
          count: s._count.status,
        })),
        };
      });
    } catch (error) {
      console.error("Failed to get shipments combined data:", error);
      throw error;
    }
  }
);
