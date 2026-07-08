import { NextRequest, NextResponse } from "next/server";
import { getCompanyWithDashboardData } from "@/app/lib/controllers/company";
import { parseQueryParams, pageParam, pageSizeParam, searchParam } from "@/app/lib/api/queryParams";
import { z } from "zod";
import { logger } from "@/app/lib/logger";


const querySchema = z.object({
  page: pageParam,
  pageSize: pageSizeParam(),
  search: searchParam,
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req, querySchema);
    if (!query.success) return query.response;
    const { page, pageSize, search } = query.data;

    const data = await getCompanyWithDashboardData({
      page,
      pageSize,
      search,
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/company/dashboard] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
