import { NextRequest, NextResponse } from "next/server";
import { getVehicles } from "@/app/lib/controllers/vehicle";
import { VehicleStatus, VehicleType } from "@prisma/client";
import { VehicleFilters } from "@/app/lib/type/vehicle";
import { parseQueryParams, searchParam, enumArrayParam, boolParam } from "@/app/lib/api/queryParams";
import { z } from "zod";
import { logger } from "@/app/lib/logger";


const querySchema = z.object({
  search: searchParam,
  status: enumArrayParam(VehicleStatus),
  type: enumArrayParam(VehicleType),
  hasIssues: boolParam,
  hasDriver: boolParam,
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req, querySchema);
    if (!query.success) return query.response;
    
    // query.data matches VehicleFilters shape
    const filters: VehicleFilters = query.data;

    const data = await getVehicles(filters);
    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/vehicles] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
