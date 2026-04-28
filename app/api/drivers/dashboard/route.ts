/**
 * GET /api/drivers/dashboard
 *
 * Client-side data endpoint for the driver dashboard.
 *
 * Why a Route Handler instead of a Server Action?
 * ────────────────────────────────────────────────
 * Next.js automatically triggers router.refresh() after every Server Action
 * completes (even read-only ones) when called from the client. When TanStack Query uses a Server Action
 * as its queryFn, this causes a full page re-render on every filter/search
 * change. Route Handlers do NOT have this side-effect — they behave like
 * plain HTTP endpoints and return data without touching the router.
 *
 * SSR prefetch in page.tsx still calls getDriverWithDashboardData() directly
 * (server-to-server, no HTTP overhead), so we get the best of both worlds:
 *   • First paint: SSR data, no loading spinner
 *   • Filter changes: API route fetch, no page reload
 */

import { NextRequest, NextResponse } from "next/server";
import { getDriverWithDashboardData } from "@/app/lib/controllers/driver";
import { DriverFilters } from "@/app/lib/type/driver";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const filters: DriverFilters = {
      page: 1,
      limit: 10,
    };

    const page = searchParams.get("page");
    if (page) filters.page = parseInt(page);

    const limit = searchParams.get("limit");
    if (limit) filters.limit = parseInt(limit);

    const search = searchParams.get("search");
    if (search) filters.search = search;

    const status = searchParams.getAll("status");
    if (status.length > 0) filters.status = status as DriverFilters["status"];

    const hasVehicle = searchParams.get("hasVehicle");
    if (hasVehicle !== null) filters.hasVehicle = hasVehicle === "true";

    const sortField = searchParams.get("sortField");
    if (sortField) filters.sortField = sortField;

    const sortOrder = searchParams.get("sortOrder");
    if (sortOrder) filters.sortOrder = sortOrder as "asc" | "desc";

    const data = await getDriverWithDashboardData(filters);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[/api/drivers/dashboard] error:", error);
    if (error?.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
