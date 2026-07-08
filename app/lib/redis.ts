import { Redis } from "@upstash/redis";
import { createCacheKeys } from "./controllers/utils/cacheFactory";
import { logger } from "@/app/lib/logger";


const redisUrl =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// In environments where Redis must be configured (CI and production) we
// fail-fast on missing credentials. Otherwise CI suffers pointless 50s
// timeouts, and production hits a silent cache-miss on EVERY request
// (try/catch swallows them) — both far worse than a clear error at boot.
// The "dummy" fallback is intentionally kept only for local dev/test,
// where Redis is often not set up.
const redisRequired =
  Boolean(process.env.CI) || process.env.NODE_ENV === "production";
if (redisRequired && (!redisUrl || !redisToken)) {
  throw new Error(
    "🚨 Redis yapılandırması eksik: 'KV_REST_API_URL' ve 'KV_REST_API_TOKEN' " +
      "(veya 'UPSTASH_REDIS_REST_URL' / 'UPSTASH_REDIS_REST_TOKEN') tanımlı değil. " +
      "CI için 'ENV_FILE' secret'ını, production için ortam değişkenlerini kontrol edin."
  );
}

export const redis = new Redis({
  url: redisUrl || "https://dummy.upstash.io",
  token: redisToken || "dummy",
});

export const VEHICLE_CACHE_TTL = 3600;
export const vehicleCacheKeys = createCacheKeys("vehicles");

export const TRAILER_CACHE_TTL = 3600;
export const trailerCacheKeys = {
  ...createCacheKeys("trailers"),
  // Override: trailer list keys carry a "_v2" version bump so a change to the
  // trailer list payload shape does not serve stale entries cached under the
  // old key. (companyPattern's wildcard still covers these for invalidation.)
  list: (companyId: string, filtersHash: string) =>
    `trailers:${companyId}:list_v2:${filtersHash}`,
};

export const DRIVER_CACHE_TTL = 3600;
export const driverCacheKeys = createCacheKeys("drivers");

export const ROUTE_CACHE_TTL = 3600;
export const routeCacheKeys = createCacheKeys("routes");

export const SHIPMENT_CACHE_TTL = 3600;
export const shipmentCacheKeys = createCacheKeys("shipments");

export const OVERVIEW_CACHE_TTL = 300;
export const overviewCacheKeys = {
  dashboard: (companyId: string) => `overview:${companyId}:dashboard`,
};

export const WAREHOUSE_CACHE_TTL = 3600;
export const warehouseCacheKeys = createCacheKeys("warehouses");

export const INVENTORY_CACHE_TTL = 3600;
export const inventoryCacheKeys = {
  ...createCacheKeys("inventories"),
  movements: (companyId: string, warehouseId: string, sku: string) =>
    `inventories:${companyId}:movements:${warehouseId}:${sku}`,
};

export const CUSTOMER_CACHE_TTL = 3600;
export const customerCacheKeys = createCacheKeys("customers");

export const COMPANY_CACHE_TTL = 3600;
export const companyCacheKeys = {
  ...createCacheKeys("companies"),
  // Override: company list key does not include companyId
  list: (filtersHash: string) => `companies:list:${filtersHash}`,
};

export const EXCHANGE_RATE_CACHE_TTL = 3600;

export const exchangeRateCacheKeys = {
  exchangeRate: () => `exchange_rates:usd:v1`,
};

export function hashFilters<T>(filters: T) {
  if (!filters || Object.keys(filters).length === 0) return "all";
  return Buffer.from(JSON.stringify(filters)).toString("base64");
}

// Helper to determine the set key for key tracking
function getTrackingSetKey(key: string): string | null {
  const parts = key.split(":");
  const categories = [
    "vehicles",
    "trailers",
    "drivers",
    "routes",
    "shipments",
    "warehouses",
    "inventories",
    "customers",
    "companies",
  ];
  if (parts.length >= 3 && parts[0] !== undefined && categories.includes(parts[0])) {
    if (parts[1] !== "detail") {
      return `keysSet:${parts[0]}:${parts[1]}`;
    }
  }
  return null;
}

// Helper to determine the set key from invalidation pattern
function getTrackingSetKeyFromPattern(pattern: string): string | null {
  const parts = pattern.split(":");
  if (parts.length >= 2) {
    return `keysSet:${parts[0]}:${parts[1]}`;
  }
  return null;
}

export async function withCache<T>(
  key: string,
  arg2: (() => Promise<T>) | number,
  arg3?: (() => Promise<T>) | number
): Promise<T> {
  const fetcher = (
    typeof arg2 === "function"
      ? arg2
      : typeof arg3 === "function"
        ? arg3
        : undefined
  ) as () => Promise<T>;
  const ttl =
    typeof arg2 === "number"
      ? arg2
      : typeof arg3 === "number"
        ? arg3
        : VEHICLE_CACHE_TTL;

  if (!fetcher) throw new Error("fetcher must be a function");

  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) return cached;
  } catch (err) {
    logger.error("Redis get error:", err);
  }

  const lockKey = `lock:${key}`;
  const lockValue = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  const lockTtl = 15; // 15 seconds lock duration
  let lockAcquired = false;

  try {
    const acquired = await redis.set(lockKey, lockValue, {
      nx: true,
      ex: lockTtl,
    });
    lockAcquired = acquired === "OK";
  } catch (err) {
    logger.error("Redis lock acquire error:", err);
  }

  if (!lockAcquired) {
    // Poll the cache to see if the concurrent request has finished setting it.
    // Max wait: 5 × 50ms = 250ms (was 20 × 100ms = 2,000ms).
    let retries = 0;
    const maxRetries = 5;
    while (retries < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      retries++;
      try {
        const cached = await redis.get<T>(key);
        if (cached !== null && cached !== undefined) return cached;
      } catch (err) {
        logger.error("Redis get retry error:", err);
      }
    }
    // Fallback: If lock owner timed out, call the fetcher directly
    return fetcher();
  }

  try {
    const data = await fetcher();
    try {
      const p = redis.pipeline();
      p.set(key, data, { ex: ttl });

      const setKey = getTrackingSetKey(key);
      if (setKey) {
        p.sadd(setKey, key);
        p.expire(setKey, ttl + 60);
      }
      await p.exec();
    } catch (err) {
      logger.error("Redis cache set error:", err);
    }
    return data;
  } finally {
    if (lockAcquired) {
      try {
        // Lua script to atomically unlock only if we are the owner
        await redis.eval(
          "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
          [lockKey],
          [lockValue]
        );
      } catch (err) {
        logger.error("Redis lock release error:", err);
      }
    }
  }
}

export async function invalidatePattern(pattern: string) {
  const setKey = getTrackingSetKeyFromPattern(pattern);
  if (!setKey) {
    // Fallback to standard SCAN if we cannot determine tracking set key from the pattern
    try {
      let cursor = 0;
      do {
        const result = await redis.scan(cursor, { match: pattern, count: 100 });
        cursor = Number(result[0] || 0);

        const keys = result[1];
        if (keys && keys.length > 0) {
          const p = redis.pipeline();
          keys.forEach((key) => p.del(key));
          await p.exec();
        }
      } while (cursor !== 0);
    } catch (err) {
      logger.error("Redis invalidate scan fallback error:", err);
    }
    return;
  }

  try {
    const keys = await redis.smembers<string[]>(setKey);
    if (keys && keys.length > 0) {
      const p = redis.pipeline();
      keys.forEach((key) => p.del(key));
      p.del(setKey);
      await p.exec();
    }
  } catch (err) {
    logger.error("Redis invalidate pattern error:", err);
  }
}
