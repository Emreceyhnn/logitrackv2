import { NextRequest, NextResponse } from "next/server";
import { getDrivers } from "@/app/lib/controllers/driver";
import { DriverStatus } from "@/app/lib/type/enums";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || undefined;
    
    const statusParams = searchParams.getAll("status");
    const status = statusParams.length > 0 ? (statusParams as DriverStatus[]) : undefined;
    
    const hasVehicleParam = searchParams.get("hasVehicle");
    const hasVehicle = hasVehicleParam !== null ? hasVehicleParam === "true" : undefined;
    
    const sortField = searchParams.get("sortField") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

    const data = await getDrivers(page, limit, search, status, hasVehicle, sortField, sortOrder);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[/api/drivers] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
