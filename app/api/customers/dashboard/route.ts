import { NextRequest, NextResponse } from "next/server";
import { getCustomersWithDashboardData } from "@/app/lib/controllers/customer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search") || undefined;

    const data = await getCustomersWithDashboardData(page, pageSize, search);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[/api/customers/dashboard] error:", error);
    if (error?.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
