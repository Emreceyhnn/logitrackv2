import { NextResponse } from "next/server";
import { getOverviewDashboardData } from "@/app/lib/controllers/overview";
import { logger } from "@/app/lib/logger";


export async function GET() {
  try {
    const data = await getOverviewDashboardData();
    return NextResponse.json(data);
  } catch (error: unknown) {
    logger.error("[/api/overview/dashboard] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
