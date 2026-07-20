import { NextRequest, NextResponse } from "next/server";
import { getDriverConsoleDashboard } from "@/app/lib/controllers/driverConsole";
import { handleApiError } from "@/app/lib/api/handleApiError";

export async function GET(_req: NextRequest) {
  try {
    const data = await getDriverConsoleDashboard();
    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError("/api/driver-console/dashboard", error);
  }
}
