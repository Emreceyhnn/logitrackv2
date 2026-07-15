/**
 * Route deviation alerting.
 *
 * Bridges the pure detection state machine (`routeDeviation.ts`) to the app's
 * data and notification layers: resolves the vehicle's in-progress route, runs
 * the corridor check, and raises an in-app notification when an excursion is
 * confirmed.
 *
 * Called on the GPS ingestion path, so it never throws: a tracking-feature
 * failure must not reject a vehicle's location push.
 */

import { db } from "@/app/lib/db";
import { runWithTenant } from "@/app/lib/tenant-context";
import { sendNotificationAction } from "@/app/lib/actions/notifications";
import { evaluateDeviation, type DeviationOutcome } from "./routeDeviation";
import { logger } from "@/app/lib/logger";

export interface RouteDeviationCheckResult {
  outcome: DeviationOutcome;
  routeId: string | null;
  notified: boolean;
}

const NOT_ON_ROUTE: RouteDeviationCheckResult = {
  outcome: { status: "skipped", reason: "vehicle has no active route" },
  routeId: null,
  notified: false,
};

/**
 * Checks a freshly-received GPS ping against the vehicle's active route
 * corridor and notifies the company if the vehicle has strayed.
 *
 * `companyId` must already be authorised for the caller — it scopes both the
 * route lookup and the notification target.
 */
export async function checkRouteDeviation(params: {
  companyId: string;
  vehicleId: string;
  plate: string;
  lat: number;
  lng: number;
}): Promise<RouteDeviationCheckResult> {
  const { companyId, vehicleId, plate, lat, lng } = params;

  try {
    // Only ACTIVE routes are being driven; PLANNED/COMPLETED vehicles are free
    // to be anywhere. Tenant context keeps the lookup inside the caller's
    // company (see db.ts tenant-guard).
    const route = await runWithTenant(companyId, () =>
      db.route.findFirst({
        where: { vehicleId, status: "ACTIVE" },
        orderBy: { date: "desc" },
        select: {
          id: true,
          name: true,
          shape: true,
          bufferMeters: true,
          driverId: true,
        },
      })
    );

    if (!route) return NOT_ON_ROUTE;

    const outcome = await evaluateDeviation({
      routeId: route.id,
      vehicleId,
      shape: route.shape,
      bufferMeters: route.bufferMeters,
      point: [lat, lng],
    });

    if (outcome.status !== "anomaly") {
      return { outcome, routeId: route.id, notified: false };
    }

    const distanceKm = (outcome.distanceMeters / 1000).toFixed(1);
    const routeLabel = route.name ?? route.id;

    await sendNotificationAction(
      { companyId },
      {
        title: "Rota Sapması Tespit Edildi! 🚨",
        message:
          `${plate} plakalı araç ${routeLabel} rotasının dışına çıktı. ` +
          `Planlanan güzergâha uzaklık: ${distanceKm} km.`,
        type: "WARNING",
        // Reuses the existing delay-alert preference (notifPushDelay): an
        // off-route vehicle is the same operational concern for the same users.
        category: "DELAY_ALERT",
        link: `/dashboard/routes/${route.id}`,
        metadata: {
          kind: "ROUTE_DEVIATION",
          routeId: route.id,
          vehicleId,
          plate,
          distanceMeters: Math.round(outcome.distanceMeters),
          lat,
          lng,
        },
      }
    );

    logger.warn(
      `[routeDeviation] Vehicle ${plate} off route ${routeLabel} by ${distanceKm}km`
    );

    return { outcome, routeId: route.id, notified: true };
  } catch (error) {
    // Never let anomaly detection break location ingestion.
    logger.error("[routeDeviation] Deviation check failed:", error);
    return {
      outcome: { status: "skipped", reason: "deviation check errored" },
      routeId: null,
      notified: false,
    };
  }
}
