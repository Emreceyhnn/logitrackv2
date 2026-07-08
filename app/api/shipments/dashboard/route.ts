import { NextRequest, NextResponse } from "next/server";
import { getShipmentsWithDashboardData } from "@/app/lib/controllers/shipments";
import { ShipmentStatus } from "@/app/lib/type/enums";
import { parseQueryParams, pageParam, pageSizeParam, searchParam, enumParam } from "@/app/lib/api/queryParams";
import { z } from "zod";
import { logger } from "@/app/lib/logger";


const querySchema = z.object({
  page: pageParam,
  pageSize: pageSizeParam(),
  status: enumParam(ShipmentStatus),
  search: searchParam,
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req, querySchema);
    if (!query.success) return query.response;
    const { page, pageSize, status, search } = query.data;

    const data = await getShipmentsWithDashboardData(page, pageSize, status, search);

    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/shipments/dashboard] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
