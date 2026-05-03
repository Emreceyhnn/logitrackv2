import { NextRequest, NextResponse } from "next/server";
import { getWarehousesWithDashboardData } from "@/app/lib/controllers/warehouse";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const data = await getWarehousesWithDashboardData(page, pageSize);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[/api/warehouses/dashboard] error:", error);
    if (error?.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
