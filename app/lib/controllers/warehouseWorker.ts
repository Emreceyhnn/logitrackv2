"use server";

import { db } from "../db";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "../auth-middleware";
import { checkPermission } from "./utils/checkPermission";
import { Prisma } from "@prisma/client";
import type {
  WarehouseWorkerDashboard,
  WWTask,
  WWZone,
  WWMovement,
  WWCatalogItem,
} from "../type/warehouseWorker";

const PICKS_TARGET = 240;
const PACKS_TARGET = 180;
const SHIFT_AVG_RATE_FALLBACK = 119;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const WW_ROLES = [
  "role_admin",
  "role_manager",
  "role_warehouse",
  "role_dispatcher",
];

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function zonePct(used: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((used / capacity) * 100));
}

/** Resolve the warehouse a worker is attached to (managed → else company's first). */
async function resolveWarehouse(
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

/** Find the user's open shift, or lazily create one for today. */
async function ensureShift(
  userId: string,
  companyId: string,
  warehouseId: string | null
) {
  const existing = await db.workerShift.findFirst({
    where: { userId, status: { not: "ENDED" } },
    orderBy: { shiftStartTime: "desc" },
  });
  if (existing) return existing;
  return db.workerShift.create({
    data: { userId, companyId, warehouseId, status: "ACTIVE" },
  });
}

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
        `${user.name?.[0] ?? ""}${user.surname?.[0] ?? ""}`.toUpperCase() ||
        "WW",
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
      const shift = await ensureShift(userId, companyId, null);
      return {
        warehouse: null,
        warehouses,
        worker,
        shift: {
          id: shift.id,
          status: shift.status,
          startedAt: shift.shiftStartTime.toISOString(),
          elapsedSeconds: Math.max(
            0,
            Math.floor((Date.now() - shift.shiftStartTime.getTime()) / 1000)
          ),
        },
        kpis: {
          picks: 0,
          picksTarget: PICKS_TARGET,
          packs: 0,
          packsTarget: PACKS_TARGET,
          rate: 0,
          shiftAvgRate: SHIFT_AVG_RATE_FALLBACK,
        },
        tasks: [],
        zones: [],
        feed: [],
        catalog: [],
        capacity: { used: 0, total: 0, pct: 0, free: 0 },
      };
    }

    const shift = await ensureShift(userId, companyId, warehouse.id);

    const thirtyDaysAgo = new Date(Date.now() - THIRTY_DAYS_MS);

    const [
      movementsToday,
      tasksRaw,
      zonesRaw,
      feedRaw,
      inventoryRaw,
      completedShifts,
    ] = await Promise.all([
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
      /* Real shift average: completed shifts in the last 30 days for this warehouse */
      db.workerShift.findMany({
        where: {
          warehouseId: warehouse.id,
          status: "ENDED",
          shiftEndTime: { not: null },
          shiftStartTime: { gte: thirtyDaysAgo },
        },
        select: {
          picksLogged: true,
          packsLogged: true,
          shiftStartTime: true,
          shiftEndTime: true,
        },
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
      (Date.now() - shift.shiftStartTime.getTime()) / 3_600_000
    );
    const rate = Math.round((picks + packs) / hoursElapsed) || 0;

    /* Compute real shift average rate from completed shifts in last 30 days */
    let shiftAvgRate = SHIFT_AVG_RATE_FALLBACK;
    if (completedShifts.length > 0) {
      let totalUnits = 0;
      let totalHours = 0;
      for (const s of completedShifts) {
        totalUnits += s.picksLogged + s.packsLogged;
        const hrs =
          (s.shiftEndTime!.getTime() - s.shiftStartTime.getTime()) / 3_600_000;
        totalHours += Math.max(0.5, hrs);
      }
      if (totalHours > 0) {
        shiftAvgRate = Math.round(totalUnits / totalHours);
      }
    }

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
      shift: {
        id: shift.id,
        status: shift.status,
        startedAt: shift.shiftStartTime.toISOString(),
        elapsedSeconds: Math.max(
          0,
          Math.floor((Date.now() - shift.shiftStartTime.getTime()) / 1000)
        ),
      },
      kpis: {
        picks,
        picksTarget: PICKS_TARGET,
        packs,
        packsTarget: PACKS_TARGET,
        rate,
        shiftAvgRate,
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

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/* -------------------------------- mutations -------------------------------- */

/** Log a PICK or PACK: writes a movement, adjusts inventory on PICK, bumps shift counters. */
export const logWarehouseMovement = authenticatedAction(
  async (
    user,
    warehouseId: string,
    sku: string,
    quantity: number,
    kind: "PICK" | "PACK"
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    await checkPermission(user, companyId, WW_ROLES);
    if (!companyId) throw new Error("User has no company");
    if (!Number.isFinite(quantity) || quantity <= 0)
      throw new Error("Quantity must be positive");

    const warehouse = await db.warehouse.findFirst({
      where: { id: warehouseId, companyId },
    });
    if (!warehouse) throw new Error("Invalid warehouse or unauthorized");

    const inventoryNode = await db.inventory.findUnique({
      where: { warehouseId_sku: { warehouseId, sku } },
    });

    const movement = await db.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const mv = await tx.inventoryMovement.create({
          data: {
            warehouseId,
            sku,
            quantity: kind === "PICK" ? -quantity : quantity,
            type: kind,
            notes: inventoryNode?.name ?? sku,
            userId,
            companyId,
            date: new Date(),
          },
        });

        if (kind === "PICK" && inventoryNode) {
          await tx.inventory.update({
            where: { id: inventoryNode.id },
            data: {
              quantity: {
                decrement: Math.min(quantity, inventoryNode.quantity),
              },
              allocatedQuantity: {
                decrement: Math.min(quantity, inventoryNode.allocatedQuantity),
              },
            },
          });
        }

        await tx.workerShift.updateMany({
          where: { userId, status: { not: "ENDED" } },
          data:
            kind === "PICK"
              ? { picksLogged: { increment: quantity } }
              : { packsLogged: { increment: quantity } },
        });

        return mv;
      }
    );

    revalidatePath("/", "layout");
    return { success: true, movementId: movement.id };
  }
);

/** Advance a task's progress; auto-completes when done reaches total. */
export const advanceWarehouseTask = authenticatedAction(
  async (user, taskId: string, delta?: number) => {
    const companyId = user?.companyId || "";
    await checkPermission(user, companyId, WW_ROLES);

    const task = await db.warehouseTask.findUnique({ where: { id: taskId } });
    if (!task || task.companyId !== companyId)
      throw new Error("Task not found or unauthorized");
    if (task.status === "COMPLETED" || task.doneUnits >= task.totalUnits) {
      return { success: true, done: task.totalUnits, complete: true };
    }

    const step =
      delta && delta > 0 ? delta : Math.max(1, Math.ceil(task.totalUnits / 5));
    const nextDone = Math.min(task.totalUnits, task.doneUnits + step);
    const complete = nextDone >= task.totalUnits;

    await db.warehouseTask.update({
      where: { id: taskId },
      data: {
        doneUnits: nextDone,
        status: complete ? "COMPLETED" : "IN_PROGRESS",
      },
    });

    revalidatePath("/", "layout");
    return { success: true, done: nextDone, complete };
  }
);

/** Set the current worker's shift status (ACTIVE / BREAK / ENDED). */
export const setWorkerShiftStatus = authenticatedAction(
  async (user, status: "ACTIVE" | "BREAK" | "ENDED") => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    await checkPermission(user, companyId, WW_ROLES);

    const shift = await db.workerShift.findFirst({
      where: { userId, status: { not: "ENDED" } },
      orderBy: { shiftStartTime: "desc" },
    });
    if (!shift) {
      const created = await db.workerShift.create({
        data: {
          userId,
          companyId,
          status: status === "ENDED" ? "ENDED" : status,
        },
      });
      return { success: true, status: created.status };
    }

    await db.workerShift.update({
      where: { id: shift.id },
      data: { status, shiftEndTime: status === "ENDED" ? new Date() : null },
    });

    revalidatePath("/", "layout");
    return { success: true, status };
  }
);

/** Raise a restock request for a zone (recorded as a stock movement). */
export const requestRestock = authenticatedAction(
  async (user, warehouseId: string, zone: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    await checkPermission(user, companyId, WW_ROLES);
    if (!companyId) throw new Error("User has no company");

    const warehouse = await db.warehouse.findFirst({
      where: { id: warehouseId, companyId },
    });
    if (!warehouse) throw new Error("Invalid warehouse or unauthorized");

    await db.inventoryMovement.create({
      data: {
        warehouseId,
        sku: `ZONE-${zone}`,
        quantity: 0,
        type: "RESTOCK_REQUEST",
        notes: `Restock requested — Zone ${zone}`,
        userId,
        companyId,
      },
    });

    revalidatePath("/", "layout");
    return { success: true };
  }
);

/** File an issue from the warehouse floor. */
export const reportWarehouseIssue = authenticatedAction(
  async (user, warehouseId: string, title: string, description?: string) => {
    const companyId = user?.companyId || "";
    await checkPermission(user, companyId, WW_ROLES);
    if (!companyId) throw new Error("User has no company");

    const warehouse = await db.warehouse.findFirst({
      where: { id: warehouseId, companyId },
    });
    if (!warehouse) throw new Error("Invalid warehouse or unauthorized");

    const issue = await db.issue.create({
      data: {
        title: title?.trim() || "Warehouse floor issue",
        description: description?.trim() || null,
        type: "OTHER",
        priority: "MEDIUM",
        status: "OPEN",
        companyId,
      },
    });

    revalidatePath("/", "layout");
    return { success: true, issueId: issue.id };
  }
);
