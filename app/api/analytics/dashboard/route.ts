import { NextResponse } from "next/server";
import { getAnalyticsDashboardData } from "@/app/lib/controllers/analytics";
import { logger } from "@/app/lib/logger";


export async function GET() {
  try {
    const data = await getAnalyticsDashboardData();
    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/analytics/dashboard] error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
