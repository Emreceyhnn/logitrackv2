"use server";

import { revalidatePath } from "next/cache";
import { redis, invalidatePattern, vehicleCacheKeys } from "../../redis";

// ── Cache invalidation helper ─────────────────────────────────────────────────
export async function invalidateVehicleCache(
  companyId: string,
  vehicleId?: string
): Promise<void> {
  await Promise.all([
    // Wipe all dashboard + kpi keys for this company
    invalidatePattern(vehicleCacheKeys.companyPattern(companyId)),
    // Wipe the specific vehicle detail key (if applicable)
    vehicleId
      ? redis.del(vehicleCacheKeys.detail(vehicleId))
      : Promise.resolve(),
  ]);
  revalidatePath("/", "layout");
}
