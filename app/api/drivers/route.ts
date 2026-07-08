import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/app/lib/logger";
import { parseQueryParams, pageParam, pageSizeParam, searchParam, enumArrayParam, boolParam, sortOrderParam, sortFieldParam } from "@/app/lib/api/queryParams";
import { z } from "zod";
import { getDrivers } from "@/app/lib/controllers/driver";
import { DriverStatus } from "@/app/lib/type/enums";

const querySchema = z.object({
  page: pageParam,
  limit: pageSizeParam(),
  search: searchParam,
  status: enumArrayParam(DriverStatus),
  hasVehicle: boolParam,
  sortField: sortFieldParam,
  sortOrder: sortOrderParam,
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req, querySchema);
    if (!query.success) return query.response;
    
    const { page, limit, search, status, hasVehicle, sortField, sortOrder } = query.data;

    const data = await getDrivers(page, limit, search, status as DriverStatus[] | undefined, hasVehicle, sortField, sortOrder);
    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/drivers] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
