import { NextResponse } from "next/server";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { logger } from "@/app/lib/logger";


export async function GET() {
  try {
    const data = await getWarehouses();
    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/warehouses] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
