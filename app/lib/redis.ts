import { Redis } from "@upstash/redis";

// CI/CD (GitHub Actions vb.) ortamlarında eğer şifreler yüklenemezse sistemi fail-fast (anında çökert) ile durduruyoruz.
// Böylece 50 saniyelik anlamsız timeout'lar yerine hatanın ne olduğunu saniyesinde görüyoruz.
if (process.env.CI && !process.env.KV_REST_API_URL) {
  throw new Error(
    "🚨 CRITICAL CI ERROR: 'KV_REST_API_URL' bulunamadı! GitHub 'ENV_FILE' secret'ınız BOŞ geliyor veya hatalı tanımlanmış."
  );
}

export const redis = new Redis({
  url:
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    "https://dummy.upstash.io",
  token:
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    "dummy",
});

export const localCache = new Map<string, { data: unknown; expiresAt: number }>();

const originalGet = redis.get.bind(redis);
redis.get = (async <TData>(key: string): Promise<TData | null> => {
  const localCached = localCache.get(key);
  if (localCached && localCached.expiresAt > Date.now()) {
    return localCached.data as TData;
  }
  const val = await originalGet(key);
  if (val !== null && val !== undefined) {
    localCache.set(key, {
      data: val,
      expiresAt: Date.now() + 5000,
    });
  }
  return val as TData | null;
}) as typeof redis.get;

const originalSet = redis.set.bind(redis);
redis.set = (async (
  key: string,
  value: unknown,
  options?: { ex?: number } & Record<string, unknown>
) => {
  if (options && typeof options.ex === "number") {
    localCache.set(key, {
      data: value,
      expiresAt: Date.now() + options.ex * 1000,
    });
  } else {
    localCache.set(key, {
      data: value,
      expiresAt: Date.now() + 60000,
    });
  }
  return originalSet(key, value, options as Parameters<typeof originalSet>[2]);
}) as typeof redis.set;

const originalDel = redis.del.bind(redis);
redis.del = (async (key: string | string[], ...args: string[]) => {
  if (Array.isArray(key)) {
    key.forEach((k) => localCache.delete(k));
  } else {
    localCache.delete(key);
  }
  return originalDel(key as Parameters<typeof originalDel>[0], ...args);
}) as typeof redis.del;

export const VEHICLE_CACHE_TTL = 3600;

export const vehicleCacheKeys = {
  companyPattern: (companyId: string) => `vehicles:${companyId}:*`,
  detail: (vehicleId: string) => `vehicles:detail:${vehicleId}`,
  list: (companyId: string, filtersHash: string) =>
    `vehicles:${companyId}:list:${filtersHash}`,
  dashboard: (companyId: string, filtersHash?: string) =>
    `vehicles:${companyId}:dashboard${filtersHash ? ":" + filtersHash : ""}`,
  kpis: (companyId: string) => `vehicles:${companyId}:kpis`,
};

export const TRAILER_CACHE_TTL = 3600;

export const trailerCacheKeys = {
  companyPattern: (companyId: string) => `trailers:${companyId}:*`,
  detail: (trailerId: string) => `trailers:detail:${trailerId}`,
  list: (companyId: string, filtersHash: string) =>
    `trailers:${companyId}:list_v2:${filtersHash}`,
  dashboard: (companyId: string, filtersHash?: string) =>
    `trailers:${companyId}:dashboard${filtersHash ? ":" + filtersHash : ""}`,
  kpis: (companyId: string) => `trailers:${companyId}:kpis`,
};

export const DRIVER_CACHE_TTL = 3600;

export const driverCacheKeys = {
  companyPattern: (companyId: string) => `drivers:${companyId}:*`,
  detail: (driverId: string) => `drivers:detail:${driverId}`,
  list: (companyId: string, filtersHash: string) =>
    `drivers:${companyId}:list:${filtersHash}`,
  dashboard: (companyId: string, filtersHash?: string) =>
    `drivers:${companyId}:dashboard${filtersHash ? ":" + filtersHash : ""}`,
  kpis: (companyId: string) => `drivers:${companyId}:kpis`,
};

export const ROUTE_CACHE_TTL = 3600;

export const routeCacheKeys = {
  companyPattern: (companyId: string) => `routes:${companyId}:*`,
  detail: (routeId: string) => `routes:detail:${routeId}`,
  list: (companyId: string, filtersHash: string) =>
    `routes:${companyId}:list:${filtersHash}`,
  dashboard: (companyId: string, filtersHash?: string) =>
    `routes:${companyId}:dashboard${filtersHash ? ":" + filtersHash : ""}`,
  kpis: (companyId: string) => `routes:${companyId}:kpis`,
};

export const SHIPMENT_CACHE_TTL = 3600;

export const shipmentCacheKeys = {
  companyPattern: (companyId: string) => `shipments:${companyId}:*`,
  detail: (shipmentId: string) => `shipments:detail:${shipmentId}`,
  list: (companyId: string, filtersHash: string) =>
    `shipments:${companyId}:list:${filtersHash}`,
  dashboard: (companyId: string, filtersHash?: string) =>
    `shipments:${companyId}:dashboard${filtersHash ? ":" + filtersHash : ""}`,
  kpis: (companyId: string) => `shipments:${companyId}:kpis`,
};

export const OVERVIEW_CACHE_TTL = 300;

export const overviewCacheKeys = {
  dashboard: (companyId: string) => `overview:${companyId}:dashboard`,
};

export const WAREHOUSE_CACHE_TTL = 3600;

export const warehouseCacheKeys = {
  companyPattern: (companyId: string) => `warehouses:${companyId}:*`,
  detail: (warehouseId: string) => `warehouses:detail:${warehouseId}`,
  list: (companyId: string, filtersHash: string) =>
    `warehouses:${companyId}:list:${filtersHash}`,
  dashboard: (companyId: string, filtersHash?: string) =>
    `warehouses:${companyId}:dashboard${filtersHash ? ":" + filtersHash : ""}`,
  kpis: (companyId: string) => `warehouses:${companyId}:kpis`,
};

export const INVENTORY_CACHE_TTL = 3600;

export const inventoryCacheKeys = {
  companyPattern: (companyId: string) => `inventories:${companyId}:*`,
  detail: (inventoryId: string) => `inventories:detail:${inventoryId}`,
  list: (companyId: string, filtersHash: string) =>
    `inventories:${companyId}:list:${filtersHash}`,
  dashboard: (companyId: string, filtersHash?: string) =>
    `inventories:${companyId}:dashboard${filtersHash ? ":" + filtersHash : ""}`,
  kpis: (companyId: string) => `inventories:${companyId}:kpis`,
  movements: (companyId: string, warehouseId: string, sku: string) =>
    `inventories:${companyId}:movements:${warehouseId}:${sku}`,
};

export const CUSTOMER_CACHE_TTL = 3600;

export const customerCacheKeys = {
  companyPattern: (companyId: string) => `customers:${companyId}:*`,
  detail: (customerId: string) => `customers:detail:${customerId}`,
  list: (companyId: string, filtersHash: string) =>
    `customers:${companyId}:list:${filtersHash}`,
  dashboard: (companyId: string, filtersHash?: string) =>
    `customers:${companyId}:dashboard${filtersHash ? ":" + filtersHash : ""}`,
  kpis: (companyId: string) => `customers:${companyId}:kpis`,
};

export const COMPANY_CACHE_TTL = 3600;

export const companyCacheKeys = {
  companyPattern: (companyId: string) => `companies:${companyId}:*`,
  detail: (companyId: string) => `companies:detail:${companyId}`,
  list: (filtersHash: string) => `companies:list:${filtersHash}`,
  dashboard: (companyId: string, filtersHash?: string) =>
    `companies:${companyId}:dashboard${filtersHash ? ":" + filtersHash : ""}`,
  kpis: (companyId: string) => `companies:${companyId}:kpis`,
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
  if (parts.length >= 3 && categories.includes(parts[0])) {
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

  const localCached = localCache.get(key);
  if (localCached && localCached.expiresAt > Date.now()) {
    return localCached.data as T;
  }

  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      localCache.set(key, {
        data: cached,
        expiresAt: Date.now() + ttl * 1000,
      });
      return cached;
    }
  } catch (err) {
    console.error("Redis get error:", err);
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
    console.error("Redis lock acquire error:", err);
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
        console.error("Redis get retry error:", err);
      }
    }
    // Fallback: If lock owner timed out, call the fetcher directly
    return fetcher();
  }

  try {
    const data = await fetcher();
    localCache.set(key, {
      data,
      expiresAt: Date.now() + ttl * 1000,
    });
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
      console.error("Redis cache set error:", err);
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
        console.error("Redis lock release error:", err);
      }
    }
  }
}

export async function invalidatePattern(pattern: string) {
  const prefix = pattern.replace("*", "");
  for (const k of localCache.keys()) {
    if (k.startsWith(prefix)) {
      localCache.delete(k);
    }
  }

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
      console.error("Redis invalidate scan fallback error:", err);
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
    console.error("Redis invalidate pattern error:", err);
  }
}
