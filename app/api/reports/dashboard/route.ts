import { NextResponse } from "next/server";
import { getReportsDataAction } from "@/app/lib/controllers/reports";

export async function GET() {
  try {
    const data = await getReportsDataAction();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[/api/reports/dashboard] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
