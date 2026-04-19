import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token:
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

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

export const OVERVIEW_CACHE_TTL = 60; // 1 minute TTL for global overview to stay fresh

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

export function hashFilters(filters: any) {
  if (!filters || Object.keys(filters).length === 0) return "all";
  return Buffer.from(JSON.stringify(filters)).toString("base64");
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
    if (cached) return cached;
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const data = await fetcher();

  try {
    await redis.set(key, data, { ex: ttl });
  } catch (err) {
    console.error("Redis set error:", err);
  }
  return data;
}

export async function invalidatePattern(pattern: string) {
  try {
    let cursor = 0;
    do {
      const result = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = Number(result[0] || 0);

      const keys = result[1];
      if (keys && keys.length > 0) {
        // pipeline to del keys
        const p = redis.pipeline();
        keys.forEach((key) => p.del(key));
        await p.exec();
      }
    } while (cursor !== 0);
  } catch (err) {
    console.error("Redis invalidate error:", err);
  }
}
