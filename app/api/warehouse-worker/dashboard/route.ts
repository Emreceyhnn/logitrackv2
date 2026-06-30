import { NextRequest, NextResponse } from "next/server";
import { getWarehouseWorkerDashboard } from "@/app/lib/controllers/warehouseWorker";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const warehouseId = searchParams.get("warehouseId") || undefined;

    const data = await getWarehouseWorkerDashboard(warehouseId);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[/api/warehouse-worker/dashboard] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
