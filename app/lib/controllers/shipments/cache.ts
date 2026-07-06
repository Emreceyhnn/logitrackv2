"use server";

import { revalidatePath } from "next/cache";
import { redis, invalidatePattern, shipmentCacheKeys } from "../../redis";

export async function invalidateShipmentCache(
  companyId: string,
  shipmentId?: string
) {
  await Promise.all([
    invalidatePattern(shipmentCacheKeys.companyPattern(companyId)),
    shipmentId
      ? redis.del(shipmentCacheKeys.detail(shipmentId))
      : Promise.resolve(),
  ]);
  revalidatePath("/", "layout");
}
