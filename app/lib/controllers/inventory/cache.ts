"use server";

import { revalidatePath } from "next/cache";
import { redis, invalidatePattern, inventoryCacheKeys } from "../../redis";

export async function invalidateInventoryCache(companyId: string, inventoryId?: string) {
  await Promise.all([
    invalidatePattern(inventoryCacheKeys.companyPattern(companyId)),
    inventoryId ? redis.del(inventoryCacheKeys.detail(inventoryId)) : Promise.resolve(),
  ]);
  revalidatePath("/", "layout");
}
