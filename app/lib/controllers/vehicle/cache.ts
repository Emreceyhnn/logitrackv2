"use server";

import { VEHICLE_CACHE_TTL } from "../../redis";
import { createCacheManager } from "../utils/cacheFactory";

// Shared cache manager instance for all vehicle submodules.
export const vehicleCache = createCacheManager("vehicles", VEHICLE_CACHE_TTL);

// Re-export the invalidate function for backward compatibility
// with existing callers that use `invalidateVehicleCache(companyId, vehicleId)`
export async function invalidateVehicleCache(
  companyId: string,
  vehicleId?: string
): Promise<void> {
  await vehicleCache.invalidate(companyId, vehicleId);
}
