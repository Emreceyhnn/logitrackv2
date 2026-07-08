import { NextRequest, NextResponse } from "next/server";
import { getWarehousesWithDashboardData } from "@/app/lib/controllers/warehouse";
import { parseQueryParams, pageParam, pageSizeParam } from "@/app/lib/api/queryParams";
import { z } from "zod";
import { logger } from "@/app/lib/logger";


const querySchema = z.object({
  page: pageParam,
  pageSize: pageSizeParam(),
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req, querySchema);
    if (!query.success) return query.response;
    const { page, pageSize } = query.data;

    const data = await getWarehousesWithDashboardData(page, pageSize);

    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/warehouses/dashboard] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
