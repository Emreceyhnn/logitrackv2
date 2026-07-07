// Plain module (NOT a "use server" boundary) so it may export the shared cache
// manager object alongside async invalidation helpers. Matches driver/shared.ts.
import { ROUTE_CACHE_TTL } from "../../redis";
import { createCacheManager } from "../utils/cacheFactory";

// Shared cache manager instance for all route submodules.
export const routeCache = createCacheManager("routes", ROUTE_CACHE_TTL);

// Backward-compatible function for existing callers
export async function invalidateRouteCache(
  companyId: string,
  routeId?: string
): Promise<void> {
  await routeCache.invalidate(companyId, routeId);
}
