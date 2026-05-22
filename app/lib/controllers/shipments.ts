"use server";

import { db } from "../db";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { type Prisma, ShipmentStatus, ShipmentPriority } from "@prisma/client";
import type { Customer, CustomerLocation } from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import {
  ShipmentWithRelations,
  ShipmentStats,
  ShipmentVolumeData,
  ShipmentStatusData,
} from "../type/shipment";
import { InventoryShipmentItem } from "../type/add-shipment";
import {
  redis,
  withCache,
  invalidatePattern,
  hashFilters,
  shipmentCacheKeys,
  SHIPMENT_CACHE_TTL,
} from "../redis";
import { invalidateInventoryCache } from "./inventory";
import { calcTrend, daysAgo } from "./utils/trendUtils";

export async function invalidateShipmentCache(companyId: string, shipmentId?: string) {
  await Promise.all([
    invalidatePattern(shipmentCacheKeys.companyPattern(companyId)),
    shipmentId ? redis.del(shipmentCacheKeys.detail(shipmentId)) : Promise.resolve(),
  ]);
}

interface CustomerWithLocations extends Customer {
  locations: CustomerLocation[];
}

export interface ShipmentStopInput {
  customerId?: string | null;
  customerLocationId?: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  sequence: number;
  contactEmail?: string | null;
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
      trailerId?: string | null;
      inventoryItems?: InventoryShipmentItem[];
      stops?: ShipmentStopInput[];
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
      trailerId,
      inventoryItems = [],
      stops = [],
    } = data;
    try {
      await checkPermission(user, companyId, [
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

      // ── Trailer Capacity Validation ──────────────────────────────────────────
      if (trailerId) {
        const trailer = await db.trailer.findUnique({ where: { id: trailerId } });
        if (trailer) {
          const currentLoad = await db.shipment.aggregate({
            where: { 
              trailerId, 
              status: { in: [ShipmentStatus.PENDING, ShipmentStatus.PROCESSING, ShipmentStatus.IN_TRANSIT, ShipmentStatus.ASSIGNED, ShipmentStatus.DELAYED] } 
            },
            _sum: { weightKg: true, volumeM3: true }
          });
          
          const totalWeight = (currentLoad._sum.weightKg || 0) + weightKg;
          const totalVolume = (currentLoad._sum.volumeM3 || 0) + volumeM3;

          const tolerance = 0.01;
          if (Math.round(totalWeight * 100) / 100 > trailer.maxLoadKg + tolerance) {
            throw new Error(`Trailer capacity exceeded: Current load ${totalWeight.toFixed(2)}kg > Max ${trailer.maxLoadKg}kg`);
          }
          if (Math.round(totalVolume * 100) / 100 > trailer.capacityVolumeM3 + tolerance) {
            throw new Error(`Trailer capacity exceeded: Current volume ${totalVolume.toFixed(2)}m³ > Max ${trailer.capacityVolumeM3}m³`);
          }
        }
      }

      const newShipment = await db.$transaction(async (tx: Prisma.TransactionClient) => {
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
            trailerId: trailerId || undefined,
            history: {
              create: {
                status: status,
                description: "Shipment created",
                createdById: userId,
              },
            },
            items: {
              create: inventoryItems.map((item: InventoryShipmentItem) => ({
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
            stops: {
              create: stops.map((stop: ShipmentStopInput) => ({
                customerId: stop.customerId || undefined,
                customerLocationId: stop.customerLocationId || undefined,
                address: stop.address,
                lat: stop.lat,
                lng: stop.lng,
                sequence: stop.sequence,
                contactEmail: stop.contactEmail || undefined,
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

      // Dispatch Notification
      await createNotification(
        { companyId: companyId! },
        {
          title: "Yeni Sevkiyat Kaydı 📦",
          message: `${newShipment.trackingId} takip numaralı yeni sevkiyat oluşturuldu.`,
          type: "INFO",
          category: "SHIPMENT_UPDATE",
          link: `/dashboard/shipments/${newShipment.id}`,
        }
      );

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
      await checkPermission(user, companyId, [
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
              createdById: userId,
            },
          },
        },
      });

      await invalidateShipmentCache(companyId!, shipmentId);

      // Dispatch Notification
      await createNotification(
        { companyId: companyId! },
        {
          title: "Sürücü Atandı 👤",
          message: `${updatedShipment.trackingId} numaralı sevkiyata bir sürücü atandı.`,
          type: "SUCCESS",
          category: "NEW_ASSIGNMENT",
          link: `/dashboard/shipments/${updatedShipment.id}`,
        }
      );

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
      await checkPermission(user, companyId, [
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
          status: ShipmentStatus.ASSIGNED,
          history: {
            create: {
              status: ShipmentStatus.ASSIGNED,
              description: `Route assigned`,
              createdById: userId,
            },
          },
        },
      });

      await invalidateShipmentCache(companyId!, shipmentId);

      // Dispatch Notification
      await createNotification(
        { companyId: companyId! },
        {
          title: "Rota Planlandı 🚛",
          message: `${updatedShipment.trackingId} numaralı sevkiyat bir rotaya dahil edildi.`,
          type: "SUCCESS",
          category: "NEW_ASSIGNMENT",
          link: `/dashboard/shipments/${updatedShipment.id}`,
        }
      );

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
      await checkPermission(user, companyId);

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
              createdById: userId,
            },
          },
        },
      });

      await invalidateShipmentCache(companyId!, shipmentId);

      // Dispatch Notification for critical status changes
      if (status === ShipmentStatus.DELAYED || status === ShipmentStatus.CANCELLED) {
        await createNotification(
          { companyId: companyId! },
          {
            title: status === ShipmentStatus.DELAYED ? "Sevkiyat Gecikmesi ⏳" : "Sevkiyat İptal Edildi ❌",
            message: `${updatedShipment.trackingId} numaralı sevkiyatın durumu ${status === ShipmentStatus.DELAYED ? 'GECİKMİŞ' : 'İPTAL EDİLDİ'} olarak güncellendi.`,
            type: status === ShipmentStatus.DELAYED ? "WARNING" : "ERROR",
            category: status === ShipmentStatus.DELAYED ? "DELAY_ALERT" : "SHIPMENT_UPDATE",
            link: `/dashboard/shipments/${updatedShipment.id}`,
          }
        );
      } else if (status === ShipmentStatus.DELIVERED) {
        await createNotification(
          { companyId: companyId! },
          {
            title: "Sevkiyat Teslim Edildi ✅",
            message: `${updatedShipment.trackingId} numaralı sevkiyat başarıyla teslim edildi.`,
            type: "SUCCESS",
            category: "SHIPMENT_UPDATE",
            link: `/dashboard/shipments/${updatedShipment.id}`,
          }
        );
      } else if (status === ShipmentStatus.PROCESSING || status === ShipmentStatus.IN_TRANSIT) {
        await createNotification(
          { companyId: companyId! },
          {
            title: status === ShipmentStatus.PROCESSING ? "Sevkiyat Hazırlanıyor ⚙️" : "Sevkiyat Yolda 🚛",
            message: `${updatedShipment.trackingId} numaralı sevkiyat ${status === ShipmentStatus.PROCESSING ? 'işleme alındı' : 'yola çıktı'}.`,
            type: "INFO",
            category: "SHIPMENT_UPDATE",
            link: `/dashboard/shipments/${updatedShipment.id}`,
          }
        );
      }

      return updatedShipment;
    } catch (error) {
      console.error("Failed to update shipment status:", error);
      throw error;
    }
  }
);

export const getShipments = authenticatedAction(
  async (
    user,
    filters?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: ShipmentStatus;
      unassigned?: boolean;
    }
  ): Promise<
    | ShipmentWithRelations[]
    | { shipments: ShipmentWithRelations[]; totalCount: number }
  > => {
    const companyId = user?.companyId;
    try {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      if (!companyId) throw new Error("User has no company");

      const where: Prisma.ShipmentWhereInput = { companyId };

      if (filters) {
        if (filters.status) {
          where.status = filters.status;
        }
        if (filters.unassigned) {
          where.routeId = null;
        }
        if (filters.search) {
          where.OR = [
            { trackingId: { contains: filters.search, mode: "insensitive" } },
            { origin: { contains: filters.search, mode: "insensitive" } },
            { destination: { contains: filters.search, mode: "insensitive" } },
          ];
        }
      }

      const cacheKey = shipmentCacheKeys.list(
        companyId,
        hashFilters(filters || {})
      );

      return await withCache(cacheKey, SHIPMENT_CACHE_TTL, async () => {
        const skip =
          filters?.page && filters?.limit
            ? (filters.page - 1) * filters.limit
            : undefined;
        const take = filters?.limit;

        if (skip !== undefined && take !== undefined) {
          const [shipments, totalCount] = await Promise.all([
            db.shipment.findMany({
              where,
              include: {
                customer: { include: { locations: true } },
                driver: {
                  include: {
                    user: {
                      select: { name: true, surname: true, avatarUrl: true },
                    },
                  },
                },
                route: true,
                items: true,
                stops: true,
              },
              orderBy: { createdAt: "desc" },
              skip,
              take,
            }),
            db.shipment.count({ where }),
          ]);
          return {
            shipments: shipments as unknown as ShipmentWithRelations[],
            totalCount,
          };
        } else {
          const shipments = await db.shipment.findMany({
            where,
            include: {
              customer: { include: { locations: true } },
              driver: {
                include: {
                  user: {
                    select: { name: true, surname: true, avatarUrl: true },
                  },
                },
              },
              route: true,
              items: true,
              stops: true,
            },
            orderBy: { createdAt: "desc" },
          });
          return shipments as unknown as ShipmentWithRelations[];
        }
      });
    } catch (error) {
      console.error("Failed to get shipments:", error);
      throw error;
    }
  }
);

export const getShipmentById = authenticatedAction(
  async (user, shipmentId: string) => {
    const companyId = user?.companyId;
    try {
      await checkPermission(user, companyId, [
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
          stops: {
            orderBy: {
              sequence: "asc",
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
    data: (Prisma.ShipmentUpdateInput | Prisma.ShipmentUncheckedUpdateInput) & {
      inventoryItems?: InventoryShipmentItem[];
      stops?: ShipmentStopInput[];
    }
  ) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    try {
      await checkPermission(user, companyId, [
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

      const updateData = { ...data } as Prisma.ShipmentUpdateInput & { 
        inventoryItems?: InventoryShipmentItem[];
        stops?: ShipmentStopInput[];
      };
      if (updateData.trackingId === "") {
        updateData.trackingId = `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      }

      // FK alanlarında boş string geldiyse undefined'a çevir (Prisma P2003 önlemi)
      const fkFields = ["customerId", "customerLocationId", "routeId", "originWarehouseId", "driverId", "trailerId"];
      for (const field of fkFields) {
        const val = (updateData as Record<string, unknown>)[field];
        if (val === "" || val === null) {
          (updateData as Record<string, unknown>)[field] = undefined;
        }
      }

      // Handle items synchronization if provided
      const items = updateData.inventoryItems;
      if (items) {
        delete updateData.inventoryItems;
        
        // Use a transaction for safety
        const updatedShipment = await db.$transaction(async (tx: Prisma.TransactionClient) => {
          // 1. Get old items to restore inventory
          const oldShipment = await tx.shipment.findUnique({
            where: { id: shipmentId },
            include: { items: true },
          });

          if (!oldShipment) throw new Error("Shipment not found");

          // Check trackingId uniqueness if it's being updated
          if (updateData.trackingId && updateData.trackingId !== oldShipment.trackingId) {
            const duplicate = await tx.shipment.findUnique({
              where: { trackingId: updateData.trackingId as string },
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

          // 3. Delete existing shipment items and stops
          await tx.shipmentItem.deleteMany({
            where: { shipmentId },
          });
          await tx.shipmentStop.deleteMany({
            where: { shipmentId },
          });

          // 4. Update shipment and create new items/stops
          const stops = updateData.stops || [];
          delete updateData.stops;

          const updated = await tx.shipment.update({
            where: { id: shipmentId },
            data: {
              ...updateData,
              items: {
                create: items.map((item: InventoryShipmentItem) => ({
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
              stops: {
                create: stops.map((stop: ShipmentStopInput) => ({
                  customerId: stop.customerId || undefined,
                  customerLocationId: stop.customerLocationId || undefined,
                  address: stop.address,
                  lat: stop.lat,
                  lng: stop.lng,
                  sequence: stop.sequence,
                  contactEmail: stop.contactEmail || undefined,
                })),
              },
            },
            include: { items: true, stops: true },
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

      // ── Trailer Status Management ──────────────────────────────────────────
      if (updatedShipment.trailerId && (updatedShipment.status === ShipmentStatus.DELIVERED || updatedShipment.status === ShipmentStatus.CANCELLED)) {
        // Check if there are any other active shipments on this trailer
        const otherActiveShipments = await db.shipment.count({
          where: {
            trailerId: updatedShipment.trailerId,
            status: { in: [ShipmentStatus.PENDING, ShipmentStatus.PROCESSING, ShipmentStatus.IN_TRANSIT, ShipmentStatus.ASSIGNED, ShipmentStatus.DELAYED] },
            id: { not: shipmentId }
          }
        });

        if (otherActiveShipments === 0) {
          // If no other active shipments, we could potentially set trailer to AVAILABLE 
          // but only if it's not currently attached to a vehicle in a way that implies it's still "IN_USE"
          // However, user specifically asked for "automatic AVAILABLE"
          await db.trailer.update({
            where: { id: updatedShipment.trailerId },
            data: { status: "AVAILABLE" }
          });
        }
      }

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
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        include: { items: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      await db.$transaction(async (tx: Prisma.TransactionClient) => {
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
    const companyId = user?.companyId;
    try {
      await checkPermission(user, companyId);

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
  const companyId = user?.companyId;
  try {
    await checkPermission(user, companyId);

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
  const companyId = user?.companyId;
  try {
    await checkPermission(user, companyId, ["role_admin", "role_manager"]);

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
    const companyId = user?.companyId;
    try {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

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
    statsTrends: {
      total: { value: number; isUp: boolean } | undefined;
      active: { value: number; isUp: boolean } | undefined;
      delayed: { value: number; isUp: boolean } | undefined;
      inTransit: { value: number; isUp: boolean } | undefined;
    };
    volumeHistory: ShipmentVolumeData[];
    statusDistribution: ShipmentStatusData[];
  }> => {
    const companyId = user?.companyId;

    try {
      if (!companyId) throw new Error("User has no company");

      const skip = (page - 1) * pageSize;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Trend windows
      const periodStart = daysAgo(30);
      const prevPeriodStart = daysAgo(60);
      const prevPeriodEnd = periodStart;

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
        prevTotal,
        prevActive,
        prevDelayed,
        prevInTransit,
      ] = await Promise.all([
        checkPermission(user, companyId, [
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
        // Previous period stats (30–60 days ago)
        db.shipment.count({ where: { companyId, createdAt: { gte: prevPeriodStart, lt: prevPeriodEnd } } }),
        db.shipment.count({
          where: {
            companyId,
            status: { in: [ShipmentStatus.PENDING, ShipmentStatus.IN_TRANSIT, ShipmentStatus.PROCESSING] },
            createdAt: { gte: prevPeriodStart, lt: prevPeriodEnd },
          },
        }),
        db.shipment.count({ where: { companyId, status: ShipmentStatus.DELAYED, createdAt: { gte: prevPeriodStart, lt: prevPeriodEnd } } }),
        db.shipment.count({ where: { companyId, status: ShipmentStatus.IN_TRANSIT, createdAt: { gte: prevPeriodStart, lt: prevPeriodEnd } } }),
      ]);

      // Volume History Transformation
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const volumeByDay: Record<string, number> = {};
      rawVolumeHistory.forEach((s: { createdAt: Date }) => {
        const dayName = days[s.createdAt.getDay()];
        volumeByDay[dayName] = (volumeByDay[dayName] || 0) + 1;
      });
      const volumeHistory = days.map((day) => ({
        day,
        volume: volumeByDay[day] || 0,
      }));

      const statsTrends = {
        total: calcTrend(total, prevTotal),
        active: calcTrend(active, prevActive),
        delayed: calcTrend(delayed, prevDelayed),
        inTransit: calcTrend(inTransit, prevInTransit),
      };

      return {
        shipments: shipments as unknown as ShipmentWithRelations[],
        totalCount,
        stats: { total, active, delayed, inTransit },
        statsTrends,
        volumeHistory,
        statusDistribution: statusCounts.map((s: { status: ShipmentStatus; _count: { status: number } }) => ({
          status: s.status as import("../type/enums").ShipmentStatus,
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
