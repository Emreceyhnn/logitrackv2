"use server";

import { db } from "../../db";
import { revalidatePath } from "next/cache";
import { authenticatedAction } from "../../auth-middleware";
import { checkPermission } from "../utils/checkPermission";
import { controllerGuard } from "../utils/controllerGuard";
import { WW_ROLES } from "./shared";

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
          }

          return mv;
        }
      );

      revalidatePath("/", "layout");
      return { success: true, movementId: movement.id };
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

/** Raise a restock request for a zone (recorded as a stock movement). */
export const requestRestock = authenticatedAction(
  async (user, warehouseId: string, zone: string) => {
    const companyId = user?.companyId || "";
    const userId = user?.id || "";
    return controllerGuard("requestRestock", async () => {
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
