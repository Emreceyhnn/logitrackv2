import { NextRequest, NextResponse } from "next/server";
import { getShipments } from "@/app/lib/controllers/shipments";
import { ShipmentStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    const filters: {
      page?: number;
      limit?: number;
      search?: string;
      status?: ShipmentStatus;
      unassigned?: boolean;
    } = {};

    const page = searchParams.get("page");
    if (page) filters.page = parseInt(page, 10);

    const limit = searchParams.get("limit");
    if (limit) filters.limit = parseInt(limit, 10);

    const search = searchParams.get("search");
    if (search) filters.search = search;

    const status = searchParams.get("status");
    if (status) filters.status = status as ShipmentStatus;

    const unassigned = searchParams.get("unassigned");
    if (unassigned !== null) filters.unassigned = unassigned === "true";

    const data = await getShipments(filters);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[/api/shipments] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
