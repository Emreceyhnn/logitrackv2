// Plain module (NOT a "use server" boundary) so it may export the shared cache
// manager object alongside async invalidation helpers. Matches driver/shared.ts.
import { SHIPMENT_CACHE_TTL } from "../../redis";
import { createCacheManager } from "../utils/cacheFactory";

// Shared cache manager instance for all shipment submodules.
export const shipmentCache = createCacheManager("shipments", SHIPMENT_CACHE_TTL);

// Backward-compatible function for existing callers
export async function invalidateShipmentCache(
  companyId: string,
  shipmentId?: string
): Promise<void> {
  await shipmentCache.invalidate(companyId, shipmentId);
}
