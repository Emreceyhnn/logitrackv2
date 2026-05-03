import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsDashboardData } from "@/app/lib/controllers/analytics";

export async function GET(req: NextRequest) {
  try {
    const data = await getAnalyticsDashboardData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[/api/analytics/dashboard] error:", error);
    if (error?.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
