"use server";

import { db } from "../../db";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { controllerGuard } from "../utils/controllerGuard";
import { WW_ROLES } from "./shared";

/**
 * Log a stock movement from the warehouse floor. PICK removes on-hand stock;
 * STOCK_IN and PUTAWAY add it (incoming goods); PACK is ledger-only (units are
 * already off-hand from an earlier PICK). Writes the movement in every case.
 */
type FloorMovementKind = "PICK" | "PACK" | "STOCK_IN" | "PUTAWAY";
const INBOUND_KINDS: readonly FloorMovementKind[] = ["STOCK_IN", "PUTAWAY"];

export const logWarehouseMovement = authenticatedAction(
  async (
    user,
    warehouseId: string,
    sku: string,
    quantity: number,
    kind: FloorMovementKind
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    return controllerGuard("logWarehouseMovement", async () => {
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

      const isInbound = INBOUND_KINDS.includes(kind);

      const movement = await db.$transaction(
        async (tx) => {
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
          } else if (isInbound && inventoryNode) {
            // Incoming goods raise on-hand stock; allocation is untouched
            // (nothing has been reserved against these units yet).
            await tx.inventory.update({
              where: { id: inventoryNode.id },
              data: { quantity: { increment: quantity } },
            });
          }

          return mv;
        }
      );

      revalidatePath("/", "layout");
      return { success: true, movementId: movement.id };
    });
  }
);

/**
 * Reconcile a physical count against the system for one SKU (eksik/fazla). The
 * DB quantity is the source of truth for "expected" — the client-supplied
 * `expected` is recorded for audit only, never trusted for the maths — so the
 * signed delta and the new on-hand are computed against the live row. Writes an
 * ADJUSTMENT movement carrying the reason and sets inventory to `counted`.
 */
export const adjustWarehouseStock = authenticatedAction(
  async (
    user,
    warehouseId: string,
    sku: string,
    counted: number,
    reason: string,
    expected?: number
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    return controllerGuard("adjustWarehouseStock", async () => {
      await checkPermission(user, companyId, WW_ROLES);
      if (!companyId) throw new Error("User has no company");
      if (!Number.isFinite(counted) || counted < 0)
        throw new Error("Counted quantity must be zero or positive");
      const note = reason?.trim();
      if (!note) throw new Error("Adjustment reason is required");

      const warehouse = await db.warehouse.findFirst({
        where: { id: warehouseId, companyId },
      });
      if (!warehouse) throw new Error("Invalid warehouse or unauthorized");

      const inventoryNode = await db.inventory.findUnique({
        where: { warehouseId_sku: { warehouseId, sku } },
      });
      if (!inventoryNode)
        throw new Error("No inventory record for this SKU to adjust");

      // Expected = live on-hand; delta is signed (negative = eksik, positive =
      // fazla). A zero delta is a no-op we surface as such rather than writing
      // an empty ledger row.
      const systemExpected = inventoryNode.quantity;
      const delta = counted - systemExpected;
      if (delta === 0)
        return { success: true, movementId: null, delta: 0, counted };

      const movement = await db.$transaction(async (tx) => {
        const mv = await tx.inventoryMovement.create({
          data: {
            warehouseId,
            sku,
            quantity: delta,
            type: "ADJUSTMENT",
            notes:
              expected !== undefined && expected !== systemExpected
                ? `${note} (counted ${counted} vs system ${systemExpected}; worker expected ${expected})`
                : `${note} (counted ${counted} vs system ${systemExpected})`,
            userId,
            companyId,
            date: new Date(),
          },
        });

        // Setting on-hand to the counted value keeps the correction accurate
        // even if the row shifted between read and write.
        await tx.inventory.update({
          where: { id: inventoryNode.id },
          data: { quantity: counted },
        });

        return mv;
      });

      revalidatePath("/", "layout");
      return { success: true, movementId: movement.id, delta, counted };
    });
  }
);

/** Advance a task's progress; auto-completes when done reaches total. */
export const advanceWarehouseTask = authenticatedAction(
  async (user, taskId: string, delta?: number) => {
    const companyId = user?.companyId || "";
    return controllerGuard("advanceWarehouseTask", async () => {
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
    });
  }
);

/**
 * Raise a restock request (recorded as a RESTOCK_REQUEST movement). Pass `sku`
 * (and optionally `quantity`) to target a specific item — the worker saw *this*
 * product run low; omit `sku` for the legacy zone-wide request.
 */
export const requestRestock = authenticatedAction(
  async (
    user,
    warehouseId: string,
    zone: string,
    sku?: string,
    quantity?: number
  ) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    return controllerGuard("requestRestock", async () => {
      await checkPermission(user, companyId, WW_ROLES);
      if (!companyId) throw new Error("User has no company");

      const warehouse = await db.warehouse.findFirst({
        where: { id: warehouseId, companyId },
      });
      if (!warehouse) throw new Error("Invalid warehouse or unauthorized");

      const targetSku = sku?.trim();
      // quantity is a requested amount, not a stock mutation, so we record it on
      // the movement for the replenisher but never touch inventory here.
      const qty =
        targetSku && Number.isFinite(quantity) && (quantity as number) > 0
          ? Math.floor(quantity as number)
          : 0;

      await db.inventoryMovement.create({
        data: {
          warehouseId,
          sku: targetSku || `ZONE-${zone}`,
          quantity: qty,
          type: "RESTOCK_REQUEST",
          notes: targetSku
            ? `Restock requested — ${targetSku}${qty ? ` × ${qty}` : ""} (Zone ${zone})`
            : `Restock requested — Zone ${zone}`,
          userId,
          companyId,
        },
      });

      revalidatePath("/", "layout");
      return { success: true };
    });
  }
);

/** File an issue from the warehouse floor. */
export const reportWarehouseIssue = authenticatedAction(
  async (user, warehouseId: string, title: string, description?: string) => {
    const companyId = user?.companyId || "";
    return controllerGuard("reportWarehouseIssue", async () => {
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
    });
  }
);
