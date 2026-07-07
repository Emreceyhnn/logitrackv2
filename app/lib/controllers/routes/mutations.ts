"use server";

import { type Prisma } from "@prisma/client";
import { sendNotificationAction as createNotification } from "@/app/lib/actions/notifications";
import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { invalidateShipmentCache } from "../shipments/cache";
import {
  assertDriverAvailableForRoute,
  assertVehicleAvailableForRoute,
} from "../utils/assignmentGuards";
import { assertShipmentTransition } from "../utils/shipmentTransitions";
import { invalidateRouteCache } from "./cache";
import type { RouteUpdateData } from "./types";
import { controllerGuard } from "../utils/controllerGuard";
import { NotFoundError } from "../../errors";

export const createRoute = authenticatedAction(
  async (
    user,
    name: string,
    date: Date,
    startTime: Date,
    endTime: Date,
    distanceKm: number,
    durationMin: number,
    driverId: string,
    vehicleId: string,
    shipmentId?: string,
    stops?: { address: string; lat?: number; lng?: number }[]
  ) => {
    return controllerGuard("createRoute", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const finalName =
        name && name.trim() !== ""
          ? name
          : `ROUTE-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`;

      const existingRoute = await db.route.findFirst({
        where: { name: finalName, companyId },
      });

      if (existingRoute && name && name.trim() !== "") {
        throw new Error("Route name already exists");
      }

      if (driverId) {
        await assertDriverAvailableForRoute(db, { driverId, companyId, date });
      }
      if (vehicleId) {
        await assertVehicleAvailableForRoute(db, {
          vehicleId,
          companyId,
          date,
        });
      }

      let shipmentToAssign: {
        status: import("@prisma/client").ShipmentStatus;
        weightKg: number | null;
        volumeM3: number | null;
      } | null = null;
      if (shipmentId) {
        shipmentToAssign = await db.shipment.findFirst({
          where: { id: shipmentId, companyId },
          select: { status: true, weightKg: true, volumeM3: true },
        });
        if (!shipmentToAssign) {
          throw new NotFoundError("Shipment");
        }
        assertShipmentTransition(shipmentToAssign.status, "ASSIGNED");

        if (vehicleId) {
          const vehicle = await db.vehicle.findFirst({
            where: { id: vehicleId, companyId },
            select: {
              fleetNo: true,
              maxLoadKg: true,
              currentTrailer: { select: { maxLoadKg: true } },
            },
          });
          const maxWeight =
            (vehicle?.maxLoadKg || 0) +
            (vehicle?.currentTrailer?.maxLoadKg || 0);
          if (vehicle && (shipmentToAssign.weightKg || 0) > maxWeight + 0.01) {
            throw new Error(
              `Vehicle capacity exceeded: shipment weight ${shipmentToAssign.weightKg}kg > max ${maxWeight}kg (vehicle ${vehicle.fleetNo})`
            );
          }
        }
      }

      const newRoute = await db.$transaction(async (tx) => {
        const route = await tx.route.create({
          data: {
            name: finalName,
            date,
            startTime,
            endTime,
            distanceKm,
            durationMin,
            driverId: driverId || null,
            vehicleId: vehicleId || null,
            companyId,
            stops: {
              create: (stops ?? []).map((stop, index) => ({
                companyId,
                sequence: index,
                address: stop.address,
                lat: stop.lat ?? null,
                lng: stop.lng ?? null,
              })),
            },
          },
        });

        if (driverId && vehicleId) {
          await tx.driver.update({
            where: { id: driverId },
            data: { currentVehicleId: vehicleId },
          });
        }

        if (shipmentId) {
          await tx.shipment.update({
            where: { id: shipmentId },
            data: {
              routeId: route.id,
              status: "ASSIGNED",
              history: {
                create: {
                  status: "ASSIGNED",
                  companyId,
                  description: `Assigned to route: ${finalName}`,
                  createdById: user.id,
                },
              },
            },
          });
        }

        return route;
      });

      await Promise.all([
        invalidateRouteCache(companyId),
        shipmentId ? invalidateShipmentCache(companyId, shipmentId) : Promise.resolve(),
      ]);

      await createNotification(
        { companyId },
        {
          title: "Yeni Rota Planlandı 📝",
          message: `${finalName} numaralı yeni bir rota planlandı. Sürücü: ${driverId ? 'Atandı' : 'Bekleniyor'}.`,
          type: "INFO",
          category: "NEW_ASSIGNMENT",
          link: `/dashboard/routes/${newRoute.id}`,
        }
      );

      return { route: newRoute };
    });
  }
);

export const updateRoute = authenticatedAction(
  async (user, routeId: string, data: RouteUpdateData) => {
    return controllerGuard("updateRoute", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingRoute = await db.route.findUnique({
        where: { id: routeId, companyId },
      });

      if (!existingRoute) {
        throw new NotFoundError("Route");
      }

      const { stops, ...scalarData } = data;
      const updateData: Prisma.RouteUncheckedUpdateInput = { ...scalarData };
      if (updateData.name === "") {
        updateData.name = `ROUTE-${Math.random().toString(36).substring(2, 7).toLocaleUpperCase('en-US')}`;
      }
      if (stops) {
        updateData.stops = {
          deleteMany: {},
          create: stops.map((stop, index) => ({
            companyId,
            sequence: index,
            address: stop.address,
            lat: stop.lat ?? null,
            lng: stop.lng ?? null,
          })),
        };
      }

      const updatedRoute = await db.route.update({
        where: { id: routeId },
        data: updateData,
      });

      await invalidateRouteCache(companyId, routeId);
      return updatedRoute;
    });
  }
);

export const deleteRoute = authenticatedAction(
  async (user, routeId: string) => {
    return controllerGuard("deleteRoute", async () => {
      const companyId = user?.companyId || "";
      await checkPermission(user, companyId, [
        "role_admin",
        "role_manager",
        "role_dispatcher",
      ]);

      const existingRoute = await db.route.findUnique({
        where: { id: routeId, companyId },
      });

      if (!existingRoute) {
        throw new NotFoundError("Route");
      }

      await db.route.delete({ where: { id: routeId } });
      await invalidateRouteCache(companyId, routeId);
      return { success: true };
    });
  }
);
