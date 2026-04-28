/**
 * GET /api/vehicles/dashboard
 *
 * Client-side data endpoint for the vehicle dashboard.
 *
 * Why a Route Handler instead of a Server Action?
 * ────────────────────────────────────────────────
 * Next.js automatically triggers router.refresh() after every Server Action
 * completes (even read-only ones). When TanStack Query uses a Server Action
 * as its queryFn, this causes a full page re-render on every filter/search
 * change. Route Handlers do NOT have this side-effect — they behave like
 * plain HTTP endpoints and return data without touching the router.
 *
 * SSR prefetch in page.tsx still calls getVehiclesWithDashboard() directly
 * (server-to-server, no HTTP overhead), so we get the best of both worlds:
 *   • First paint: SSR data, no loading spinner
 *   • Filter changes: API route fetch, no page reload
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { db } from "@/app/lib/db";
import {
  VehicleCapacityConverter,
  VehicleDocumentConverter,
  VehicleKpiConverter,
  VehicleServiceConverter,
} from "@/app/lib/controllers/utils/vehicleUtils";
import {
  redis,
  withCache,
  hashFilters,
  vehicleCacheKeys,
  VEHICLE_CACHE_TTL,
} from "@/app/lib/redis";
import {
  checkPermission,
} from "@/app/lib/controllers/utils/checkPermission";
import { IssueStatus, Prisma } from "@prisma/client";
import type { VehicleDashboardProps, VehicleFilters, VehicleWithRelations } from "@/app/lib/type/vehicle";

export async function GET(req: NextRequest) {
  try {
    /* ── Auth ─────────────────────────────────────────────────────────── */
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId, companyId } = user;
    if (!companyId) {
      return NextResponse.json({ error: "No company" }, { status: 403 });
    }

    await checkPermission(userId, companyId, [
      "role_admin",
      "role_manager",
      "role_dispatcher",
    ]);

    /* ── Parse filters from query params ─────────────────────────────── */
    const { searchParams } = req.nextUrl;
    const filters: VehicleFilters = {};

    const search = searchParams.get("search");
    if (search) filters.search = search;

    const status = searchParams.getAll("status");
    if (status.length > 0) filters.status = status as VehicleFilters["status"];

    const type = searchParams.getAll("type");
    if (type.length > 0) filters.type = type as VehicleFilters["type"];

    const hasIssues = searchParams.get("hasIssues");
    if (hasIssues !== null) filters.hasIssues = hasIssues === "true";

    const hasDriver = searchParams.get("hasDriver");
    if (hasDriver !== null) filters.hasDriver = hasDriver === "true";

    /* ── Cache key ────────────────────────────────────────────────────── */
    const cacheKey = vehicleCacheKeys.dashboard(
      companyId,
      hashFilters(filters as Record<string, unknown>)
    );

    const data = await withCache(cacheKey, VEHICLE_CACHE_TTL, async () => {
      /* ── Build where clause ─────────────────────────────────────────── */
      const whereClause: Prisma.VehicleWhereInput = { companyId };

      if (filters.search) {
        whereClause.OR = [
          { plate: { contains: filters.search, mode: "insensitive" } },
          { brand: { contains: filters.search, mode: "insensitive" } },
          { model: { contains: filters.search, mode: "insensitive" } },
        ];
      }
      if (filters.status && filters.status.length > 0) {
        whereClause.status = { in: filters.status };
      }
      if (filters.type && filters.type.length > 0) {
        whereClause.type = { in: filters.type };
      }
      if (filters.hasIssues) {
        whereClause.issues = {
          some: { status: { in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS] } },
        };
      }
      if (filters.hasDriver === true) {
        whereClause.driver = { isNot: null };
      } else if (filters.hasDriver === false) {
        whereClause.driver = { is: null };
      }

      /* ── DB query ───────────────────────────────────────────────────── */
      const vehicles = await db.vehicle.findMany({
        where: whereClause,
        select: {
          id: true, fleetNo: true, plate: true, brand: true, model: true,
          year: true, type: true, fuelType: true, maxLoadKg: true,
          nextServiceKm: true, avgFuelConsumption: true, status: true,
          odometerKm: true, fuelLevel: true, currentLat: true,
          currentLng: true, photo: true, createdAt: true, updatedAt: true,
          driver: {
            select: {
              id: true, rating: true,
              user: { select: { name: true, surname: true, avatarUrl: true } },
            },
          },
          issues: {
            select: {
              id: true, title: true, type: true, priority: true,
              status: true, description: true, vehicleId: true,
              companyId: true, createdAt: true, updatedAt: true,
            },
          },
          documents: {
            select: {
              id: true, type: true, name: true, url: true,
              expiryDate: true, status: true, vehicleId: true,
              companyId: true, createdAt: true,
            },
          },
          maintenanceRecords: {
            select: {
              id: true, type: true, date: true, cost: true, status: true,
              description: true, vehicleId: true, createdAt: true, updatedAt: true,
            },
          },
          routes: {
            select: {
              id: true, status: true, startAddress: true, startLat: true,
              startLng: true, endAddress: true, endLat: true, endLng: true,
              createdAt: true, updatedAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const dashboardInput = vehicles as unknown as VehicleDashboardProps[];

      return {
        vehicles: vehicles as unknown as VehicleWithRelations[],
        vehiclesKpis: VehicleKpiConverter(dashboardInput),
        vehiclesCapacity: VehicleCapacityConverter(dashboardInput),
        expiringDocs: VehicleDocumentConverter(dashboardInput),
        plannedServices: VehicleServiceConverter(dashboardInput),
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/vehicles/dashboard] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
