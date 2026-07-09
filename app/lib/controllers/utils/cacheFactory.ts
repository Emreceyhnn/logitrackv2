/**
 * Cache Factory — eliminates repeated cache key definitions and invalidation
 * helpers across 10+ controllers.
 *
 * Usage:
 *   const shipmentCache = createCacheManager("shipments", 3600);
 *   await shipmentCache.invalidate(companyId, shipmentId);
 *   return shipmentCache.withCache(companyId, filtersHash, fetcher);
 */

import { revalidatePath } from "next/cache";
import { redis, withCache, invalidatePattern, hashFilters } from "../../redis";

// ─── Cache Key Factory ──────────────────────────────────────────────────────
export interface CacheKeys {
  companyPattern: (companyId: string) => string;
  detail: (entityId: string) => string;
  list: (companyId: string, filtersHash: string) => string;
  dashboard: (companyId: string, filtersHash?: string) => string;
  kpis: (companyId: string) => string;
}

export function createCacheKeys(prefix: string): CacheKeys {
  return {
    companyPattern: (companyId: string) => `${prefix}:${companyId}:*`,
    detail: (entityId: string) => `${prefix}:detail:${entityId}`,
    list: (companyId: string, filtersHash: string) =>
      `${prefix}:${companyId}:list:${filtersHash}`,
    dashboard: (companyId: string, filtersHash?: string) =>
      `${prefix}:${companyId}:dashboard${filtersHash ? ":" + filtersHash : ""}`,
    kpis: (companyId: string) => `${prefix}:${companyId}:kpis`,
  };
}

// ─── Cache Manager ──────────────────────────────────────────────────────────
export interface CacheManager {
  keys: CacheKeys;
  ttl: number;

  /** Invalidate all cache for a company + optional entity detail key. */
  invalidate: (companyId: string, entityId?: string) => Promise<void>;

  /** Cache-through helper: reads from cache, falls back to fetcher. */
  cached: <T>(
    companyId: string,
    filtersHash: string,
    fetcher: () => Promise<T>
  ) => Promise<T>;

  /** Cache-through for dashboard endpoint. */
  cachedDashboard: <T>(
    companyId: string,
    filtersHash: string,
    fetcher: () => Promise<T>
  ) => Promise<T>;

  /** Utility: hash a filters object to a stable cache key suffix. */
  hashFilters: typeof hashFilters;
}

export function createCacheManager(
  prefix: string,
  ttl: number
): CacheManager {
  const keys = createCacheKeys(prefix);

  return {
    keys,
    ttl,
    hashFilters,

    async invalidate(companyId: string, entityId?: string): Promise<void> {
      await Promise.all([
        invalidatePattern(keys.companyPattern(companyId)),
        entityId ? redis.del(keys.detail(entityId)) : Promise.resolve(),
      ]);
      revalidatePath("/", "layout");
    },

    async cached<T>(
      companyId: string,
      filtersHash: string,
      fetcher: () => Promise<T>
    ): Promise<T> {
      const cacheKey = keys.list(companyId, filtersHash);
      return withCache(cacheKey, ttl, fetcher);
    },

    async cachedDashboard<T>(
      companyId: string,
      filtersHash: string,
      fetcher: () => Promise<T>
    ): Promise<T> {
      const cacheKey = keys.dashboard(companyId, filtersHash);
      return withCache(cacheKey, ttl, fetcher);
    },
  };
}
