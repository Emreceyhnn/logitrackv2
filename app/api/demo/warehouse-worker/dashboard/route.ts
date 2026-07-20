import { NextResponse } from "next/server";
import { getWarehouseWorkerDashboardMock } from "@/app/lib/mocks/warehouseWorkerMock";

// Public mock endpoint for the Live Demo warehouse-worker panel — no auth, no
// DB. Always returns the same fixed dataset regardless of warehouseId.
export async function GET() {
  return NextResponse.json(getWarehouseWorkerDashboardMock());
}
