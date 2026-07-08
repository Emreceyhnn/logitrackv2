"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { type Prisma, ShipmentStatus } from "@prisma/client";
import { ShipmentWithRelations } from "../../type/shipment";
import {
  withCache,
  hashFilters,
  shipmentCacheKeys,
  SHIPMENT_CACHE_TTL,
} from "../../redis";
import { controllerGuard } from "../utils/controllerGuard";

export const getShipments = authenticatedAction(
  async (
    user,
    filters?: {
      page?: number | undefined;
      limit?: number | undefined;
      search?: string | undefined;
      status?: ShipmentStatus | undefined;
      unassigned?: boolean | undefined;
    }
  ): Promise<
    | ShipmentWithRelations[]
    | { shipments: ShipmentWithRelations[]; totalCount: number }
  > => {
    const companyId = user?.companyId;
    return controllerGuard("getShipments", async () => {
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
                route: { include: { stops: { orderBy: { sequence: "asc" } } } },
                items: true,
                stops: true,
              },
              orderBy: { createdAt: "desc" },
              skip,
              take,
            }),
            db.shipment.count({ where }),
          ]);
          const typedShipments: ShipmentWithRelations[] = shipments.map(
            (shipment) => ({
              ...shipment,
              route: shipment.route
                ? {
                    ...shipment.route,
                    stops: shipment.route.stops.map((stop) => ({
                      address: stop.address,
                      lat: stop.lat ?? undefined,
                      lng: stop.lng ?? undefined,
                    })),
                  }
                : null,
            })
          );
          return {
            shipments: typedShipments,
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
              route: { include: { stops: { orderBy: { sequence: "asc" } } } },
              items: true,
              stops: true,
            },
            orderBy: { createdAt: "desc" },
          });
          const typedShipments: ShipmentWithRelations[] = shipments.map(
            (shipment) => ({
              ...shipment,
              route: shipment.route
                ? {
                    ...shipment.route,
                    stops: shipment.route.stops.map((stop) => ({
                      address: stop.address,
                      lat: stop.lat ?? undefined,
                      lng: stop.lng ?? undefined,
                    })),
                  }
                : null,
            })
          );
          return typedShipments;
        }
      });
    });
  }
);

export const getShipmentById = authenticatedAction(
  async (user, shipmentId: string) => {
    const companyId = user?.companyId;
    return controllerGuard("getShipmentById", async () => {
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
    });
  }
);

export const getShipmentByTrackingId = authenticatedAction(
  async (user, trackingId: string) => {
    const companyId = user?.companyId;
    return controllerGuard("getShipmentByTrackingId", async () => {
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
    });
  }
);
