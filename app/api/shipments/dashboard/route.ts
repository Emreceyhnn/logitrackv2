import { NextRequest, NextResponse } from "next/server";
import { getShipmentsWithDashboardData } from "@/app/lib/controllers/shipments";
import { ShipmentStatus } from "@/app/lib/type/enums";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const status = (searchParams.get("status") as ShipmentStatus) || undefined;
    const search = searchParams.get("search") || undefined;

    const data = await getShipmentsWithDashboardData(page, pageSize, status, search);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[/api/shipments/dashboard] error:", error);
    if (error?.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
