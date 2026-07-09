import { NextRequest, NextResponse } from "next/server";
import { getRoutes } from "@/app/lib/controllers/routes";
import { parseQueryParams, pageParam, pageSizeParam } from "@/app/lib/api/queryParams";
import { z } from "zod";
import { logger } from "@/app/lib/logger";


const querySchema = z.object({
  page: pageParam,
  pageSize: pageSizeParam(),
  status: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req, querySchema);
    if (!query.success) return query.response;
    const { page, pageSize, status } = query.data;

    const data = await getRoutes(page, pageSize, status);
    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/routes] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
