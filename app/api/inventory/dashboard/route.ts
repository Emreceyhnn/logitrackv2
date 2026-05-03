import { NextRequest, NextResponse } from "next/server";
import { getInventoryWithDashboardData } from "@/app/lib/controllers/inventory";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const warehouseId = searchParams.get("warehouseId") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;
    const status = searchParams.get("status")?.split(",") || undefined;

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
  } catch (error: any) {
    console.error("[/api/inventory/dashboard] error:", error);
    if (error?.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
