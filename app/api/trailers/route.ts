import { NextRequest, NextResponse } from "next/server";
import { getTrailers } from "@/app/lib/controllers/trailer";
import { TrailerStatus, TrailerType } from "@prisma/client";
import { TrailerFilters } from "@/app/lib/type/trailer";
import { parseQueryParams, pageParam, pageSizeParam, searchParam, enumArrayParam, boolParam } from "@/app/lib/api/queryParams";
import { z } from "zod";
import { logger } from "@/app/lib/logger";


const querySchema = z.object({
  page: pageParam,
  limit: pageSizeParam(),
  search: searchParam,
  status: enumArrayParam(TrailerStatus),
  type: enumArrayParam(TrailerType),
  isColdChain: boolParam,
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req, querySchema);
    if (!query.success) return query.response;
    
    // query.data matches TrailerFilters shape
    const filters: TrailerFilters = query.data;

    const data = await getTrailers(filters);
    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/trailers] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
