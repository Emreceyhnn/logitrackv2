"use server";

import { db } from "../../db";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { controllerGuard } from "../utils/controllerGuard";
import { NotFoundError } from "../../errors";
import type { DriverStatus, FuelType, IssuePriority, ShipmentStatus } from "@prisma/client";
import { createFuelLog } from "../fuel";
import { createVehicleIssue } from "../vehicle/issues";
import { updateShipmentStatus } from "../shipments/assign";
import { DC_ROLES, getDriverForUser } from "./shared";

/** Toggle the calling driver's own duty status. */
export const updateDriverDutyStatus = authenticatedAction(
  async (user, status: DriverStatus) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    return controllerGuard("updateDriverDutyStatus", async () => {
      await checkPermission(user, companyId, DC_ROLES);
      const driver = await getDriverForUser(userId, companyId);
      if (!driver) throw new NotFoundError("Driver");

      await db.driver.update({ where: { id: driver.id }, data: { status } });

      revalidatePath("/", "layout");
      return { success: true, status };
    });
  }
);

/** Mark (or unmark) one of the calling driver's own route stops as arrived. */
export const updateRouteStopArrival = authenticatedAction(
  async (user, routeStopId: string, arrived: boolean) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    return controllerGuard("updateRouteStopArrival", async () => {
      await checkPermission(user, companyId, DC_ROLES);
      const driver = await getDriverForUser(userId, companyId);
      if (!driver) throw new NotFoundError("Driver");

      const stop = await db.routeStop.findFirst({
        where: { id: routeStopId, companyId },
        include: { route: { select: { driverId: true } } },
      });
      if (!stop || stop.route.driverId !== driver.id) {
        throw new NotFoundError("Route stop");
      }

      await db.routeStop.update({
        where: { id: routeStopId },
        data: { arrivedAt: arrived ? new Date() : null },
      });

      revalidatePath("/", "layout");
      return { success: true };
    });
  }
);

/** Driver-console wrapper around createFuelLog — derives driver/vehicle server-side. */
export const submitFuelLog = authenticatedAction(
  async (
    user,
    data: {
      volumeLiter: number;
      cost: number;
      odometerKm: number;
      location?: string;
      fuelType: FuelType;
      receiptUrl?: string;
      currency?: string;
    }
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    return controllerGuard("submitFuelLog", async () => {
      await checkPermission(user, companyId, DC_ROLES);
      const driver = await getDriverForUser(userId, companyId);
      if (!driver) throw new NotFoundError("Driver");
      if (!driver.currentVehicleId) throw new NotFoundError("Assigned vehicle");

      const log = await createFuelLog({
        vehicleId: driver.currentVehicleId,
        driverId: driver.id,
        volumeLiter: data.volumeLiter,
        cost: data.cost,
        odometerKm: data.odometerKm,
        location: data.location,
        fuelType: data.fuelType,
        receiptUrl: data.receiptUrl,
        currency: data.currency,
      });

      revalidatePath("/", "layout");
      return log;
    });
  }
);

/** Driver-console wrapper around createVehicleIssue — derives vehicle/driver server-side. */
export const reportVehicleIssue = authenticatedAction(
  async (
    user,
    data: { title: string; priority: IssuePriority; description?: string }
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    return controllerGuard("reportVehicleIssue", async () => {
      await checkPermission(user, companyId, DC_ROLES);
      const driver = await getDriverForUser(userId, companyId);
      if (!driver) throw new NotFoundError("Driver");
      if (!driver.currentVehicleId) throw new NotFoundError("Assigned vehicle");

      const issue = await createVehicleIssue(driver.currentVehicleId, {
        title: data.title,
        type: "VEHICLE",
        priority: data.priority,
        description: data.description,
        driverId: driver.id,
      });

      revalidatePath("/", "layout");
      return issue;
    });
  }
);

/** Driver-console wrapper around updateShipmentStatus — adds an ownership check. */
export const updateMyShipmentStatus = authenticatedAction(
  async (
    user,
    shipmentId: string,
    status: ShipmentStatus,
    location?: string,
    description?: string
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    return controllerGuard("updateMyShipmentStatus", async () => {
      await checkPermission(user, companyId, DC_ROLES);
      const driver = await getDriverForUser(userId, companyId);
      if (!driver) throw new NotFoundError("Driver");

      const shipment = await db.shipment.findFirst({
        where: { id: shipmentId, companyId },
        select: { driverId: true },
      });
      if (!shipment || shipment.driverId !== driver.id) {
        throw new NotFoundError("Shipment");
      }

      const updated = await updateShipmentStatus(shipmentId, status, location, description);

      revalidatePath("/", "layout");
      return updated;
    });
  }
);
