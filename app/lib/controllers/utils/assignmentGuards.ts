import type { Db } from "../../db";

type DbClient = Db;

function dayRange(date: Date): { gte: Date; lt: Date } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { gte: start, lt: end };
}

/**
 * A driver can be assigned to a route only if they belong to the company,
 * are not on leave, and have no other PLANNED/ACTIVE route on the same day.
 */
export async function assertDriverAvailableForRoute(
  db: DbClient,
  params: {
    driverId: string;
    companyId: string;
    date: Date;
    excludeRouteId?: string;
  }
): Promise<void> {
  const { driverId, companyId, date, excludeRouteId } = params;

  const driver = await db.driver.findFirst({
    where: { id: driverId, companyId },
    select: { status: true, employeeId: true },
  });
  if (!driver) {
    throw new Error("Driver not found or unauthorized");
  }
  if (driver.status === "ON_LEAVE") {
    throw new Error("Driver is on leave and cannot be assigned to a route");
  }

  const conflict = await db.route.findFirst({
    where: {
      driverId,
      companyId,
      date: dayRange(date),
      status: { in: ["PLANNED", "ACTIVE"] },
      ...(excludeRouteId ? { id: { not: excludeRouteId } } : {}),
    },
    select: { id: true, name: true },
  });
  if (conflict) {
    throw new Error(
      `Driver is already assigned to route "${conflict.name || conflict.id}" on the same day`
    );
  }
}

/**
 * A vehicle can be assigned to a route only if it belongs to the company,
 * is not in maintenance / out of order, and has no other PLANNED/ACTIVE
 * route on the same day.
 */
export async function assertVehicleAvailableForRoute(
  db: DbClient,
  params: {
    vehicleId: string;
    companyId: string;
    date: Date;
    excludeRouteId?: string;
  }
): Promise<void> {
  const { vehicleId, companyId, date, excludeRouteId } = params;

  const vehicle = await db.vehicle.findFirst({
    where: { id: vehicleId, companyId, deletedAt: null },
    select: { status: true, fleetNo: true },
  });
  if (!vehicle) {
    throw new Error("Vehicle not found or unauthorized");
  }
  if (vehicle.status === "MAINTENANCE" || vehicle.status === "OUT_OF_ORDER") {
    throw new Error(
      `Vehicle ${vehicle.fleetNo} is ${vehicle.status === "MAINTENANCE" ? "in maintenance" : "out of order"} and cannot be assigned to a route`
    );
  }

  const conflict = await db.route.findFirst({
    where: {
      vehicleId,
      companyId,
      date: dayRange(date),
      status: { in: ["PLANNED", "ACTIVE"] },
      ...(excludeRouteId ? { id: { not: excludeRouteId } } : {}),
    },
    select: { id: true, name: true },
  });
  if (conflict) {
    throw new Error(
      `Vehicle ${vehicle.fleetNo} is already assigned to route "${conflict.name || conflict.id}" on the same day`
    );
  }
}
