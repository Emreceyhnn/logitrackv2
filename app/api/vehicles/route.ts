import { NextRequest, NextResponse } from "next/server";
import { getVehicles } from "@/app/lib/controllers/vehicle";
import { VehicleStatus, VehicleType } from "@prisma/client";
import { VehicleFilters } from "@/app/lib/type/vehicle";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const filters: VehicleFilters = {};

    const search = searchParams.get("search");
    if (search) filters.search = search;

    const status = searchParams.getAll("status");
    if (status.length > 0) filters.status = status as VehicleStatus[];

    const type = searchParams.getAll("type");
    if (type.length > 0) filters.type = type as VehicleType[];

    const hasIssues = searchParams.get("hasIssues");
    if (hasIssues !== null) filters.hasIssues = hasIssues === "true";

    const hasDriver = searchParams.get("hasDriver");
    if (hasDriver !== null) filters.hasDriver = hasDriver === "true";

    const data = await getVehicles(filters);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[/api/vehicles] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
