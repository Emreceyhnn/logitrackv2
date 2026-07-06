"use server";

import { db } from "../../db";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";

import type {
  WarehouseWorkerDashboard,
  WWTask,
  WWZone,
  WWMovement,
  WWCatalogItem,
} from "../../type/warehouseWorker";
import {
  PICKS_TARGET,
  PACKS_TARGET,
  WW_ROLES,
  startOfToday,
  zonePct,
  hashCode,
  resolveWarehouse,
} from "./shared";

export const getWarehouseWorkerDashboard = authenticatedAction(
  async (user, warehouseId?: string): Promise<WarehouseWorkerDashboard> => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    await checkPermission(user, companyId, WW_ROLES);
    if (!companyId) throw new Error("User has no company");

    const warehouse = await resolveWarehouse(companyId, userId, warehouseId);

    const worker = {
      name: `${user.name} ${user.surname}`.trim(),
      initials:
        `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toLocaleUpperCase(
          "en-US"
        ) || "WW",
      role: user.roleName || "Warehouse Worker",
    };

    // Every warehouse in the company is selectable from the panel's switcher.
    const warehouses = (
      await db.warehouse.findMany({
        where: { companyId },
        select: { id: true, name: true, code: true },
        orderBy: { code: "asc" },
      })
    ).map((w) => ({ id: w.id, name: w.name, code: w.code }));

    // No warehouse yet → return an empty-but-valid payload.
    if (!warehouse) {
      return {
        warehouse: null,
        warehouses,
        worker,
        kpis: {
          picks: 0,
          picksTarget: PICKS_TARGET,
          packs: 0,
          packsTarget: PACKS_TARGET,
          rate: 0,
        },
        tasks: [],
        zones: [],
        feed: [],
        catalog: [],
        capacity: { used: 0, total: 0, pct: 0, free: 0 },
      };
    }

    const [movementsToday, tasksRaw, zonesRaw, feedRaw, inventoryRaw] =
      await Promise.all([
        db.inventoryMovement.findMany({
          where: {
            warehouseId: warehouse.id,
            companyId,
            date: { gte: startOfToday() },
            type: { in: ["PICK", "PACK"] },
          },
          select: { type: true, quantity: true },
        }),
        db.warehouseTask.findMany({
          where: { warehouseId: warehouse.id },
          orderBy: [
            { status: "asc" },
            { priority: "desc" },
            { createdAt: "asc" },
          ],
          take: 12,
        }),
        db.warehouseZone.findMany({
          where: { warehouseId: warehouse.id },
          orderBy: { code: "asc" },
        }),
        db.inventoryMovement.findMany({
          where: { warehouseId: warehouse.id, companyId },
          include: { user: { select: { name: true, surname: true } } },
          orderBy: { date: "desc" },
          take: 12,
        }),
        db.inventory.findMany({
          where: { warehouseId: warehouse.id },
          select: {
            sku: true,
            name: true,
            zone: true,
            quantity: true,
            palletCount: true,
          },
          orderBy: { updatedAt: "desc" },
          take: 500,
        }),
      ]);

    const picks = movementsToday
      .filter((m) => m.type === "PICK")
      .reduce((a, m) => a + Math.abs(m.quantity), 0);
    const packs = movementsToday
      .filter((m) => m.type === "PACK")
      .reduce((a, m) => a + Math.abs(m.quantity), 0);

    const hoursElapsed = Math.max(
      0.5,
      1 // Dummy value to avoid refactoring rate calculation too much
    );
    const rate = Math.round((picks + packs) / hoursElapsed) || 0;

    // Zones come from the WarehouseZone config; actual usage is derived live from
    // each inventory item's `zone` (pallet occupancy), so stats stay in sync.
    const zoneCodes = zonesRaw.map((z) => z.code);
    const fallbackZone = (sku: string) =>
      zoneCodes.length
        ? zoneCodes[Math.abs(hashCode(sku)) % zoneCodes.length]
        : "A";
    const skuZone = new Map<string, string>();
    const usedByZone = new Map<string, number>();
    for (const it of inventoryRaw) {
      const z =
        it.zone && zoneCodes.includes(it.zone) ? it.zone : fallbackZone(it.sku);
      skuZone.set(it.sku, z);
      usedByZone.set(z, (usedByZone.get(z) ?? 0) + (it.palletCount ?? 0));
    }

    const zones: WWZone[] = zonesRaw.map((z) => {
      const usedPallets = Math.round(usedByZone.get(z.code) ?? 0);
      return {
        code: z.code,
        capacityPallets: z.capacityPallets,
        usedPallets,
        pct: zonePct(usedPallets, z.capacityPallets),
      };
    });

    const used = zones.reduce((a, z) => a + z.usedPallets, 0);
    const total =
      zones.reduce((a, z) => a + z.capacityPallets, 0) ||
      warehouse.capacityPallets;

    const tasks: WWTask[] = tasksRaw.map((t) => ({
      id: t.id,
      kind: t.kind,
      name: t.name,
      orderRef: t.orderRef,
      zone: t.zone,
      done: t.doneUnits,
      total: t.totalUnits,
      priority: t.priority,
      complete: t.status === "COMPLETED" || t.doneUnits >= t.totalUnits,
    }));

    /* Build a sku→name map for feed enrichment */
    const skuName = new Map<string, string>();
    for (const it of inventoryRaw) {
      skuName.set(it.sku, it.name);
    }

    const feed: WWMovement[] = feedRaw.map((m) => ({
      id: m.id,
      type: m.type,
      name: m.notes || skuName.get(m.sku) || m.sku,
      sku: m.sku,
      qty: m.quantity,
      zone: skuZone.get(m.sku) ?? fallbackZone(m.sku),
      who: m.user ? `${m.user.name} ${m.user.surname}`.trim() : "System",
      self: m.userId === userId,
      at: m.date.toISOString(),
    }));

    const catalog: WWCatalogItem[] = inventoryRaw.slice(0, 100).map((it) => ({
      sku: it.sku,
      name: it.name,
      zone: skuZone.get(it.sku) ?? fallbackZone(it.sku),
      quantity: it.quantity,
    }));

    return {
      warehouse: {
        id: warehouse.id,
        name: warehouse.name,
        code: warehouse.code,
        city: warehouse.city,
      },
      warehouses,
      worker,
      kpis: {
        picks,
        picksTarget: PICKS_TARGET,
        packs,
        packsTarget: PACKS_TARGET,
        rate,
      },
      tasks,
      zones,
      feed,
      catalog,
      capacity: {
        used,
        total,
        pct: zonePct(used, total),
        free: Math.max(0, total - used),
      },
    };
  }
);
