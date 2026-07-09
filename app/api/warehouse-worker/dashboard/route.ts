import { NextRequest, NextResponse } from "next/server";
import { getWarehouseWorkerDashboard } from "@/app/lib/controllers/warehouseWorker";
import { parseQueryParams } from "@/app/lib/api/queryParams";
import { z } from "zod";
import { logger } from "@/app/lib/logger";


const querySchema = z.object({
  warehouseId: z.string().trim().min(1).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const query = parseQueryParams(req, querySchema);
    if (!query.success) return query.response;
    const { warehouseId } = query.data;

    const data = await getWarehouseWorkerDashboard(warehouseId);

    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/warehouse-worker/dashboard] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
