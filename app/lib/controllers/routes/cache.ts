"use server";

import { revalidatePath } from "next/cache";
import { redis, invalidatePattern, routeCacheKeys } from "../../redis";

export async function invalidateRouteCache(companyId: string, routeId?: string) {
  await Promise.all([
    invalidatePattern(routeCacheKeys.companyPattern(companyId)),
    routeId ? redis.del(routeCacheKeys.detail(routeId)) : Promise.resolve(),
  ]);
  revalidatePath("/", "layout");
}
