/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";
import { rejects } from "node:assert";

// 1. MOCK'LAR (Imports'dan ÖNCE tanımlanmalı!)

// Prisma DB Mock
const dbMock = {
  warehouse: {
    findUnique: mock.fn(),
    create: mock.fn(),
    findMany: mock.fn(),
  },
};

// Redis & Cache Mock
const redisMock = {
  del: mock.fn(),
};

const cacheUtilsMock = {
  redis: redisMock,
  withCache: mock.fn(async (key, ttl, cb) => cb()),
  invalidatePattern: mock.fn(),
  hashFilters: mock.fn(() => "mock-hash"),
  warehouseCacheKeys: {
    companyPattern: mock.fn(() => "company-pattern"),
    detail: mock.fn(() => "detail-key"),
    list: mock.fn(() => "list-key"),
  },
  WAREHOUSE_CACHE_TTL: 3600,
};

// Auth & Permission Mock
const authMiddlewareMock = {
  // Wrap the callback to pass arguments directly for testing
  authenticatedAction: mock.fn((cb) => cb),
};

const checkPermissionMock = {
  checkPermission: mock.fn(),
};

// Notifications Mock
const notificationsMock = {
  sendNotificationAction: mock.fn(),
};

// Utils Mock
const trendUtilsMock = {
  calcTrend: mock.fn(),
  daysAgo: mock.fn(),
};

// Modülleri Sisteme Enjekte Etme
mock.module("../db", {
  namedExports: { db: dbMock },
});

mock.module("../redis", {
  namedExports: cacheUtilsMock,
});

mock.module("../auth-middleware", {
  namedExports: authMiddlewareMock,
});

mock.module("./utils/checkPermission", {
  namedExports: checkPermissionMock,
});

mock.module("../actions/notifications", {
  namedExports: { sendNotificationAction: notificationsMock.sendNotificationAction },
});

mock.module("./utils/trendUtils", {
  namedExports: trendUtilsMock,
});

// 2. TEST GRUPLARI
describe("Warehouse Controller", () => {
  let warehouseController: any;

  before(async () => {
    // Test edilecek modülü mocklardan SONRA dinamik import ile alıyoruz
    warehouseController = await import("./warehouse");
  });

  beforeEach(() => {
    // Her testten önce mockları sıfırla
    dbMock.warehouse.findUnique.mock.resetCalls();
    dbMock.warehouse.create.mock.resetCalls();
    dbMock.warehouse.findMany.mock.resetCalls();
    
    redisMock.del.mock.resetCalls();
    cacheUtilsMock.invalidatePattern.mock.resetCalls();
    checkPermissionMock.checkPermission.mock.resetCalls();
    notificationsMock.sendNotificationAction.mock.resetCalls();
  });

  describe("createWarehouse() metodu", () => {
    const mockUser = {
      id: "user-1",
      companyId: "company-1",
    };

    it("should_CreateWarehouse_AndSendNotification_WhenValidDataProvided", async () => {
      // Arrange
      dbMock.warehouse.findUnique.mock.mockImplementation(async () => null); // No existing warehouse
      dbMock.warehouse.create.mock.mockImplementation(async (args: any) => ({
        id: "wh-1",
        ...args.data,
      }));

      // Act
      const result = await warehouseController.createWarehouse(
        mockUser,
        "Merkez Depo",
        "WH-MRKZ",
        "MAIN",
        "Adres",
        "Istanbul",
        "Turkey"
      );

      // Assert
      expect(result.warehouse.id).toBe("wh-1");
      expect(result.warehouse.name).toBe("Merkez Depo");
      expect(result.warehouse.code).toBe("WH-MRKZ");
      expect(dbMock.warehouse.create.mock.calls.length).toBe(1);
      expect(cacheUtilsMock.invalidatePattern.mock.calls.length).toBe(1);
      expect(notificationsMock.sendNotificationAction.mock.calls.length).toBe(1);
      expect(checkPermissionMock.checkPermission.mock.calls.length).toBe(1);
    });

    it("should_ThrowError_WhenWarehouseCodeAlreadyExists", async () => {
      // Arrange
      dbMock.warehouse.findUnique.mock.mockImplementation(async () => ({
        id: "existing-wh",
        code: "WH-MRKZ",
      }));

      // Act & Assert
      await expect(
        warehouseController.createWarehouse(
          mockUser,
          "Merkez Depo",
          "WH-MRKZ",
          "MAIN",
          "Adres",
          "Istanbul",
          "Turkey"
        )
      ).rejects.toThrow("Warehouse code already exists");

      expect(dbMock.warehouse.create.mock.calls.length).toBe(0);
      expect(notificationsMock.sendNotificationAction.mock.calls.length).toBe(0);
    });
  });

  describe("getWarehouses() metodu", () => {
    const mockUser = {
      id: "user-1",
      companyId: "company-1",
    };

    it("should_ReturnWarehousesList_WhenUserHasCompany", async () => {
      // Arrange
      const mockWarehouses = [
        { id: "wh-1", name: "Depo 1" },
        { id: "wh-2", name: "Depo 2" },
      ];
      dbMock.warehouse.findMany.mock.mockImplementation(async () => mockWarehouses);

      // Act
      const result = await warehouseController.getWarehouses(mockUser);

      // Assert
      expect(result.length).toBe(2);
      expect(result[0].name).toBe("Depo 1");
      expect(dbMock.warehouse.findMany.mock.calls.length).toBe(1);
      // Ensure checkPermission was called
      expect(checkPermissionMock.checkPermission.mock.calls.length).toBe(1);
    });

    it("should_ThrowError_WhenUserHasNoCompany", async () => {
      // Arrange
      const noCompanyUser = { id: "user-2", companyId: null };

      // Act & Assert
      await expect(
        warehouseController.getWarehouses(noCompanyUser)
      ).rejects.toThrow("User has no company");

      expect(dbMock.warehouse.findMany.mock.calls.length).toBe(0);
    });
  });
});
