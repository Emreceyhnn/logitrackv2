import { NextRequest, NextResponse } from "next/server";
import { getOverviewDashboardData } from "@/app/lib/controllers/overview";

export async function GET(req: NextRequest) {
  try {
    const data = await getOverviewDashboardData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[/api/overview/dashboard] error:", error);
    if (error?.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
