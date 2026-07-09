"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { type Prisma, ShipmentStatus } from "@prisma/client";
import { InventoryShipmentItem } from "../../type/add-shipment";
import { invalidateInventoryCache } from "../inventory";
import {
  assertShipmentTransition,
  isTerminalShipmentStatus,
} from "../utils/shipmentTransitions";
import { invalidateShipmentCache } from "./cache";
import { controllerGuard } from "../utils/controllerGuard";
import type { ShipmentStopInput } from "./types";
import { logger } from "@/app/lib/logger";
import { NotFoundError } from "../../errors";


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
    return controllerGuard("updateShipment", async () => {
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        select: { companyId: true, status: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      // A status change coming through the generic edit path must still obey
      // the lifecycle state machine — the edit dialog is not a backdoor.
      const nextStatus = (data as { status?: ShipmentStatus }).status;
      if (nextStatus && nextStatus !== existingShipment.status) {
        assertShipmentTransition(existingShipment.status, nextStatus);
      }

      const updateData = { ...data } as Prisma.ShipmentUpdateInput & {
        inventoryItems?: InventoryShipmentItem[];
        stops?: ShipmentStopInput[];
      };
      // companyId must never come from client input — it's fixed to the
      // authenticated user's tenant, otherwise a caller could reassign a
      // shipment to a company they don't belong to (tenant hijacking).
      delete (updateData as Record<string, unknown>).companyId;
      delete (updateData as Record<string, unknown>).company;
      if (updateData.trackingId === "") {
        updateData.trackingId = `TRK-${Math.random().toString(36).substring(2, 9).toLocaleUpperCase('en-US')}`;
      }

      // Convert empty strings on FK fields to undefined (guards against Prisma P2003)
      const fkFields = [
        "customerId",
        "customerLocationId",
        "routeId",
        "originWarehouseId",
        "driverId",
        "trailerId",
      ];
      for (const field of fkFields) {
        const val = (updateData as Record<string, unknown>)[field];
        if (val === "" || val === null) {
          (updateData as Record<string, unknown>)[field] = undefined;
        }
      }

      // Every FK the client can set must resolve to a row owned by this same
      // tenant — otherwise a caller could bind their shipment to another
      // company's customer/driver/trailer/route/warehouse (read-only
      // cross-tenant linkage, mirrors the createShipment ownership checks).
      const updateFields = updateData as Record<string, unknown>;
      const asFkId = (field: string): string | undefined => {
        const val = updateFields[field];
        return typeof val === "string" && val ? val : undefined;
      };

      const customerIdFk = asFkId("customerId");
      const customerLocationIdFk = asFkId("customerLocationId");
      const routeIdFk = asFkId("routeId");
      const originWarehouseIdFk = asFkId("originWarehouseId");
      const driverIdFk = asFkId("driverId");
      const trailerIdFk = asFkId("trailerId");

      const [
        customerOwner,
        customerLocationOwner,
        routeOwner,
        warehouseOwner,
        driverOwner,
        trailerOwner,
      ] = await Promise.all([
        customerIdFk
          ? db.customer.findUnique({ where: { id: customerIdFk }, select: { companyId: true } })
          : null,
        customerLocationIdFk
          ? db.customerLocation.findUnique({ where: { id: customerLocationIdFk }, select: { companyId: true } })
          : null,
        routeIdFk
          ? db.route.findUnique({ where: { id: routeIdFk }, select: { companyId: true } })
          : null,
        originWarehouseIdFk
          ? db.warehouse.findUnique({ where: { id: originWarehouseIdFk }, select: { companyId: true } })
          : null,
        driverIdFk
          ? db.driver.findUnique({ where: { id: driverIdFk }, select: { companyId: true } })
          : null,
        trailerIdFk
          ? db.trailer.findUnique({ where: { id: trailerIdFk }, select: { companyId: true } })
          : null,
      ]);

      if (customerIdFk && (!customerOwner || customerOwner.companyId !== companyId)) {
        throw new NotFoundError("Customer");
      }
      if (customerLocationIdFk && (!customerLocationOwner || customerLocationOwner.companyId !== companyId)) {
        throw new NotFoundError("Customer location");
      }
      if (routeIdFk && (!routeOwner || routeOwner.companyId !== companyId)) {
        throw new NotFoundError("Route");
      }
      if (originWarehouseIdFk && (!warehouseOwner || warehouseOwner.companyId !== companyId)) {
        throw new NotFoundError("Warehouse");
      }
      if (driverIdFk && (!driverOwner || driverOwner.companyId !== companyId)) {
        throw new NotFoundError("Driver");
      }
      if (trailerIdFk && (!trailerOwner || trailerOwner.companyId !== companyId)) {
        throw new NotFoundError("Trailer");
      }

      // Handle items synchronization if provided
      const items = updateData.inventoryItems;
      if (items) {
        delete updateData.inventoryItems;

        // Use a transaction for safety
        const updatedShipment = await db.$transaction(
          async (tx) => {
            // 1. Get old items to restore inventory
            const oldShipment = await tx.shipment.findUnique({
              where: { id: shipmentId },
              include: { items: true },
            });

            if (!oldShipment) throw new Error("Shipment not found");

            // Check trackingId uniqueness if it's being updated
            if (
              updateData.trackingId &&
              updateData.trackingId !== oldShipment.trackingId
            ) {
              const duplicate = await tx.shipment.findUnique({
                where: { trackingId: updateData.trackingId as string },
              });
              if (duplicate) {
                throw new Error(
                  "Tracking ID already exists in another shipment"
                );
              }
            }

            const oldWarehouseId = oldShipment.originWarehouseId;

            if (oldWarehouseId) {
              await Promise.all(
                oldShipment!.items.map(async (oldItem) => {
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
                        allocatedQuantity: { decrement: oldItem.quantity },
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
                })
              );
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
                    companyId: companyId!,
                    sku: item.sku,
                    name: item.name,
                    quantity: item.quantity,
                    unit: item.unit,
                    // Omit when undefined so Prisma applies the schema defaults.
                    ...(item.weightKg !== undefined ? { weightKg: item.weightKg } : {}),
                    ...(item.volumeM3 !== undefined ? { volumeM3: item.volumeM3 } : {}),
                    ...(item.palletCount !== undefined ? { palletCount: item.palletCount } : {}),
                    ...(item.cargoType !== undefined ? { cargoType: item.cargoType } : {}),
                  })),
                },
                stops: {
                  create: stops.map((stop: ShipmentStopInput) => ({
                    companyId: companyId!,
                    customerId: stop.customerId || null,
                    customerLocationId: stop.customerLocationId || null,
                    address: stop.address,
                    lat: stop.lat,
                    lng: stop.lng,
                    sequence: stop.sequence,
                    contactEmail: stop.contactEmail || null,
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
          }
        );

        // Non-blocking invalidation to prevent hanging on slow Redis
        Promise.all([
          invalidateShipmentCache(companyId!, shipmentId),
          invalidateInventoryCache(companyId!),
        ]).catch((err) => logger.error("Cache invalidation failed:", err));

        return updatedShipment;
      }

      const updatedShipment = await db.shipment.update({
        where: { id: shipmentId },
        data: updateData,
      });

      // ── Trailer Status Management ──────────────────────────────────────────
      if (
        updatedShipment.trailerId &&
        isTerminalShipmentStatus(updatedShipment.status)
      ) {
        // Check if there are any other active shipments on this trailer
        const otherActiveShipments = await db.shipment.count({
          where: {
            trailerId: updatedShipment.trailerId,
            status: {
              in: [
                ShipmentStatus.PENDING,
                ShipmentStatus.PROCESSING,
                ShipmentStatus.IN_TRANSIT,
                ShipmentStatus.ASSIGNED,
                ShipmentStatus.DELAYED,
              ],
            },
            id: { not: shipmentId },
          },
        });

        if (otherActiveShipments === 0) {
          // If no other active shipments, we could potentially set trailer to AVAILABLE
          // but only if it's not currently attached to a vehicle in a way that implies it's still "IN_USE"
          // However, user specifically asked for "automatic AVAILABLE"
          await db.trailer.update({
            where: { id: updatedShipment.trailerId },
            data: { status: "AVAILABLE" },
          });
        }
      }

      invalidateShipmentCache(companyId!, shipmentId).catch((err) =>
        logger.error("Cache invalidation failed:", err)
      );
      return updatedShipment;
    });
  }
);

export const deleteShipment = authenticatedAction(
  async (user, shipmentId: string) => {
    const userId = user?.id;
    const companyId = user?.companyId;
    return controllerGuard("deleteShipment", async () => {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const existingShipment = await db.shipment.findUnique({
        where: { id: shipmentId },
        include: { items: true },
      });

      if (!existingShipment || existingShipment.companyId !== companyId) {
        throw new Error("Shipment not found or unauthorized");
      }

      await db.$transaction(async (tx) => {
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
        invalidateInventoryCache(companyId!),
      ]).catch((err) => logger.error("Cache invalidation failed:", err));
      return { success: true };
    });
  }
);
