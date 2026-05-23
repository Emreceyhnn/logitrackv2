import { NextRequest, NextResponse } from "next/server";
import { getTrailers } from "@/app/lib/controllers/trailer";
import { TrailerStatus, TrailerType } from "@prisma/client";
import { TrailerFilters } from "@/app/lib/type/trailer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const filters: TrailerFilters = {};

    const page = searchParams.get("page");
    if (page) filters.page = parseInt(page, 10);

    const limit = searchParams.get("limit");
    if (limit) filters.limit = parseInt(limit, 10);

    const search = searchParams.get("search");
    if (search) filters.search = search;

    const status = searchParams.getAll("status");
    if (status.length > 0) filters.status = status as TrailerStatus[];

    const type = searchParams.getAll("type");
    if (type.length > 0) filters.type = type as TrailerType[];

    const isColdChain = searchParams.get("isColdChain");
    if (isColdChain !== null) filters.isColdChain = isColdChain === "true";

    const data = await getTrailers(filters);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[/api/trailers] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
