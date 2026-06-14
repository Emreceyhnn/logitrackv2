import { NextRequest, NextResponse } from "next/server";
import { getRoutes } from "@/app/lib/controllers/routes";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    const rawPage = parseInt(searchParams.get("page") || "0", 10);
    const page = rawPage + 1;
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const status = searchParams.get("status") || undefined;

    const data = await getRoutes(page, pageSize, status);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[/api/routes] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
