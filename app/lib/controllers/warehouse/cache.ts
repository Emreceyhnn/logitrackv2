"use server";

import { WAREHOUSE_CACHE_TTL } from "../../redis";
import { createCacheManager } from "../utils/cacheFactory";

// Shared cache manager instance for all warehouse submodules.
export const warehouseCache = createCacheManager("warehouses", WAREHOUSE_CACHE_TTL);

// Backward-compatible function for existing callers
export async function invalidateWarehouseCache(
  companyId: string,
  warehouseId?: string
): Promise<void> {
  await warehouseCache.invalidate(companyId, warehouseId);
}
