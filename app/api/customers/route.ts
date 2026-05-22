import { NextRequest, NextResponse } from "next/server";
import { getCustomers } from "@/app/lib/controllers/customer";

export async function GET(req: NextRequest) {
  try {
    const data = await getCustomers();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[/api/customers] error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
