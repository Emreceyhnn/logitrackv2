import { NextRequest, NextResponse } from "next/server";
import { getShipments } from "@/app/lib/controllers/shipments";
import { ShipmentStatus } from "@prisma/client";
import { parseQueryParams, pageParam, pageSizeParam, searchParam, enumParam, boolParam } from "@/app/lib/api/queryParams";
import { z } from "zod";
import { logger } from "@/app/lib/logger";


const querySchema = z.object({
  page: pageParam,
  limit: pageSizeParam(),
  search: searchParam,
  status: enumParam(ShipmentStatus),
  unassigned: boolParam,
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req, querySchema);
    if (!query.success) return query.response;
    
    const filters = query.data;

    const data = await getShipments(filters);
    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/shipments] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
