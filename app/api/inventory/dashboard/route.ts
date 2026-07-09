import { NextRequest, NextResponse } from "next/server";
import { getInventoryWithDashboardData } from "@/app/lib/controllers/inventory";
import { parseQueryParams, pageParam, pageSizeParam, searchParam, sortFieldParam, sortOrderParam } from "@/app/lib/api/queryParams";
import { z } from "zod";
import { logger } from "@/app/lib/logger";


const querySchema = z.object({
  page: pageParam,
  pageSize: pageSizeParam(),
  warehouseId: z.string().trim().min(1).optional(),
  search: searchParam,
  sortBy: sortFieldParam,
  sortOrder: sortOrderParam,
  status: z.string().optional().transform(v => v ? v.split(",") : undefined),
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req, querySchema);
    if (!query.success) return query.response;
    const { page, pageSize, warehouseId, search, sortBy, sortOrder, status } = query.data;

    const data = await getInventoryWithDashboardData(
      page,
      pageSize,
      warehouseId,
      search,
      sortBy,
      sortOrder,
      status
    );

    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/inventory/dashboard] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
