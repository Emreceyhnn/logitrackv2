"use server";

import { revalidatePath } from "next/cache";
import { redis, invalidatePattern, warehouseCacheKeys } from "../../redis";

export async function invalidateWarehouseCache(
  companyId: string,
  warehouseId?: string
) {
  await Promise.all([
    invalidatePattern(warehouseCacheKeys.companyPattern(companyId)),
    warehouseId
      ? redis.del(warehouseCacheKeys.detail(warehouseId))
      : Promise.resolve(),
  ]);
  revalidatePath("/", "layout");
}
