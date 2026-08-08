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

/**
 * tr-bugünün başlangıcını (00:00:00) temsil eden Date nesnesini döndürür
 * en-returns a Date object representing the start of today (00:00:00)
 * input ()
 * output (Date)
 */
export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * tr-bir depo bölgesindeki kullanım oranını (yüzde) hesaplar
 * en-calculates the percentage of used capacity in a warehouse zone
 * input (used: number, capacity: number)
 * output (number)
 */
export function zonePct(used: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((used / capacity) * 100));
}

/**
 * tr-çalışanın görevli olduğu depoyu bulur (açıkça belirtilen depo > yönettiği depo > şirketin ilk deposu)
 * en-resolves the warehouse a worker is attached to (explicitly provided > managed > company's first warehouse)
 * input (companyId: string, userId: string, warehouseId?: string)
 * output (Promise<Warehouse | null>)
 */
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
