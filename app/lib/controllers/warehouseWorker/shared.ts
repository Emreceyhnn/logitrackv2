// Shared constants and helpers for the warehouse-worker submodules. Plain module
// (not a "use server" boundary) so it may export constants and sync/async helpers.

import { db } from "../../db";

export const PICKS_TARGET = 240;
export const PACKS_TARGET = 180;
export const WW_ROLES = [
  "role_admin",
  "role_manager",
  "role_warehouse",
  "role_dispatcher",
];

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function zonePct(used: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((used / capacity) * 100));
}

export function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/** Resolve the warehouse a worker is attached to (managed → else company's first). */
export async function resolveWarehouse(
  companyId: string,
  userId: string,
  warehouseId?: string
) {
  if (warehouseId) {
    const wh = await db.warehouse.findFirst({
      where: { id: warehouseId, companyId },
    });
    if (wh) return wh;
  }
  const managed = await db.warehouse.findFirst({
    where: { companyId, managerId: userId },
    orderBy: { createdAt: "asc" },
  });
  if (managed) return managed;
  return db.warehouse.findFirst({
    where: { companyId },
    orderBy: { createdAt: "asc" },
  });
}
