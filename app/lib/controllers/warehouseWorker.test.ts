import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";
import { rejects } from "node:assert";

// 1. MOCK'LAR (Imports'dan ÖNCE tanımlanmalı!)

type MockedTx = {
  inventoryMovement: { create: ReturnType<typeof mock.fn> };
  inventory: { update: ReturnType<typeof mock.fn> };
};

const txMock: MockedTx = {
  inventoryMovement: { create: mock.fn() },
  inventory: { update: mock.fn() },
};

const dbMock = {
  warehouse: {
    findFirst: mock.fn(),
  },
  inventory: {
    findUnique: mock.fn(),
  },
  inventoryMovement: {
    create: mock.fn(),
  },
  warehouseTask: {
    findUnique: mock.fn(),
    update: mock.fn(),
  },
  issue: {
    create: mock.fn(),
  },
  $transaction: mock.fn(async (cb: (tx: MockedTx) => Promise<unknown>) =>
    cb(txMock)
  ),
};

const authMiddlewareMock = {
  authenticatedAction: mock.fn((cb: unknown) => cb),
};

const checkPermissionMock = {
  checkPermission: mock.fn(),
};

const nextCacheMock = {
  revalidatePath: mock.fn(),
};

mock.module("../db.ts", { namedExports: { db: dbMock } });
mock.module("../auth-middleware.ts", { namedExports: authMiddlewareMock });
mock.module("./utils/checkPermission.ts", { namedExports: checkPermissionMock });
mock.module("next/cache", { namedExports: nextCacheMock });

const user = { id: "user-1", companyId: "company-1" };

// 2. TEST GRUPLARI
describe("WarehouseWorker Controller", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let controller: any;

  before(async () => {
    controller = await import("./warehouseWorker");
  });

  beforeEach(() => {
    dbMock.warehouse.findFirst.mock.resetCalls();
    dbMock.inventory.findUnique.mock.resetCalls();
    dbMock.inventoryMovement.create.mock.resetCalls();
    dbMock.warehouseTask.findUnique.mock.resetCalls();
    dbMock.warehouseTask.update.mock.resetCalls();
    dbMock.issue.create.mock.resetCalls();
    txMock.inventoryMovement.create.mock.resetCalls();
    txMock.inventory.update.mock.resetCalls();
    checkPermissionMock.checkPermission.mock.resetCalls();
    nextCacheMock.revalidatePath.mock.resetCalls();
  });

  describe("logWarehouseMovement()", () => {
    it("pozitif olmayan miktarı reddeder", async () => {
      await rejects(
        controller.logWarehouseMovement(user, "wh-1", "SKU-1", 0, "PICK"),
        /Quantity must be positive/
      );
    });

    it("şirkete ait olmayan depoyu reddeder", async () => {
      dbMock.warehouse.findFirst.mock.mockImplementationOnce(async () => null);
      await rejects(
        controller.logWarehouseMovement(user, "wh-x", "SKU-1", 5, "PICK"),
        /Invalid warehouse or unauthorized/
      );
    });

    it("PICK hareketini negatif miktarla yazar ve envanteri düşer", async () => {
      dbMock.warehouse.findFirst.mock.mockImplementationOnce(async () => ({
        id: "wh-1",
        companyId: "company-1",
      }));
      dbMock.inventory.findUnique.mock.mockImplementationOnce(async () => ({
        id: "inv-1",
        name: "Widget",
        quantity: 10,
        allocatedQuantity: 4,
      }));
      txMock.inventoryMovement.create.mock.mockImplementationOnce(
        async () => ({ id: "mv-1" })
      );

      const res = await controller.logWarehouseMovement(
        user,
        "wh-1",
        "SKU-1",
        5,
        "PICK"
      );

      expect(res).toEqual({ success: true, movementId: "mv-1" });
      const createArg =
        txMock.inventoryMovement.create.mock.calls[0].arguments[0];
      expect(createArg.data.quantity).toBe(-5);
      expect(createArg.data.type).toBe("PICK");
      // Envanter düşümü: min(quantity, mevcut) mantığı
      const updateArg = txMock.inventory.update.mock.calls[0].arguments[0];
      expect(updateArg.data.quantity.decrement).toBe(5);
      expect(updateArg.data.allocatedQuantity.decrement).toBe(4);
    });

    it("PACK hareketini pozitif miktarla yazar ve envantere dokunmaz", async () => {
      dbMock.warehouse.findFirst.mock.mockImplementationOnce(async () => ({
        id: "wh-1",
        companyId: "company-1",
      }));
      dbMock.inventory.findUnique.mock.mockImplementationOnce(
        async () => null
      );
      txMock.inventoryMovement.create.mock.mockImplementationOnce(
        async () => ({ id: "mv-2" })
      );

      const res = await controller.logWarehouseMovement(
        user,
        "wh-1",
        "SKU-2",
        3,
        "PACK"
      );

      expect(res.movementId).toBe("mv-2");
      const createArg =
        txMock.inventoryMovement.create.mock.calls[0].arguments[0];
      expect(createArg.data.quantity).toBe(3);
      expect(txMock.inventory.update.mock.calls.length).toBe(0);
    });
  });

  describe("advanceWarehouseTask()", () => {
    it("başka şirketin görevini reddeder", async () => {
      dbMock.warehouseTask.findUnique.mock.mockImplementationOnce(
        async () => ({ id: "t-1", companyId: "other-company" })
      );
      await rejects(
        controller.advanceWarehouseTask(user, "t-1"),
        /Task not found or unauthorized/
      );
    });

    it("tamamlanmış görevi tekrar ilerletmez", async () => {
      dbMock.warehouseTask.findUnique.mock.mockImplementationOnce(
        async () => ({
          id: "t-1",
          companyId: "company-1",
          status: "COMPLETED",
          doneUnits: 10,
          totalUnits: 10,
        })
      );

      const res = await controller.advanceWarehouseTask(user, "t-1");
      expect(res).toEqual({ success: true, done: 10, complete: true });
      expect(dbMock.warehouseTask.update.mock.calls.length).toBe(0);
    });

    it("görevi ilerletir ve hedefe ulaşınca COMPLETED yapar", async () => {
      dbMock.warehouseTask.findUnique.mock.mockImplementationOnce(
        async () => ({
          id: "t-1",
          companyId: "company-1",
          status: "IN_PROGRESS",
          doneUnits: 8,
          totalUnits: 10,
        })
      );

      const res = await controller.advanceWarehouseTask(user, "t-1", 5);
      expect(res).toEqual({ success: true, done: 10, complete: true });
      const updateArg = dbMock.warehouseTask.update.mock.calls[0].arguments[0];
      expect(updateArg.data.status).toBe("COMPLETED");
      expect(updateArg.data.doneUnits).toBe(10);
    });
  });

  describe("requestRestock()", () => {
    it("geçersiz depoda hata fırlatır", async () => {
      dbMock.warehouse.findFirst.mock.mockImplementationOnce(async () => null);
      await rejects(
        controller.requestRestock(user, "wh-x", "A1"),
        /Invalid warehouse or unauthorized/
      );
    });

    it("RESTOCK_REQUEST hareketi oluşturur", async () => {
      dbMock.warehouse.findFirst.mock.mockImplementationOnce(async () => ({
        id: "wh-1",
        companyId: "company-1",
      }));

      const res = await controller.requestRestock(user, "wh-1", "A1");
      expect(res).toEqual({ success: true });
      const createArg =
        dbMock.inventoryMovement.create.mock.calls[0].arguments[0];
      expect(createArg.data.type).toBe("RESTOCK_REQUEST");
      expect(createArg.data.sku).toBe("ZONE-A1");
    });
  });

  describe("reportWarehouseIssue()", () => {
    it("saha sorununu OPEN statüsüyle kaydeder", async () => {
      dbMock.warehouse.findFirst.mock.mockImplementationOnce(async () => ({
        id: "wh-1",
        companyId: "company-1",
      }));
      dbMock.issue.create.mock.mockImplementationOnce(async () => ({
        id: "issue-1",
      }));

      const res = await controller.reportWarehouseIssue(
        user,
        "wh-1",
        "  Forklift arızalı  "
      );
      expect(res).toEqual({ success: true, issueId: "issue-1" });
      const createArg = dbMock.issue.create.mock.calls[0].arguments[0];
      expect(createArg.data.title).toBe("Forklift arızalı");
      expect(createArg.data.status).toBe("OPEN");
    });
  });
});
