import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";
import { rejects } from "node:assert";

// 1. MOCK'LAR (Imports'dan ÖNCE tanımlanmalı!)

// Prisma DB Mock
const dbMock = {
  shipment: {
    findUnique: mock.fn(),
    create: mock.fn(),
    findMany: mock.fn(),
    count: mock.fn(),
    update: mock.fn(),
    aggregate: mock.fn(),
  },
  customer: {
    findUnique: mock.fn(),
  },
  trailer: {
    findUnique: mock.fn(),
  },
  inventory: {
    findUnique: mock.fn(),
    update: mock.fn(),
  },
  inventoryMovement: {
    create: mock.fn(),
  },
  $transaction: mock.fn(async (cb) => cb(dbMock)),
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
  shipmentCacheKeys: {
    companyPattern: mock.fn(() => "company-pattern"),
    detail: mock.fn(() => "detail-key"),
    list: mock.fn(() => "list-key"),
  },
  SHIPMENT_CACHE_TTL: 3600,
};

// Auth & Permission Mock
const authMiddlewareMock = {
  authenticatedAction: mock.fn((cb) => cb),
};

const checkPermissionMock = {
  checkPermission: mock.fn(),
};

// Notifications Mock
const notificationsMock = {
  sendNotificationAction: mock.fn(),
};

// Inventory Mock
const inventoryMock = {
  invalidateInventoryCache: mock.fn(),
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

mock.module("@/app/lib/actions/notifications", {
  namedExports: { sendNotificationAction: notificationsMock.sendNotificationAction },
});

mock.module("./inventory", {
  namedExports: inventoryMock,
});

// 2. TEST GRUPLARI
describe("Shipments Controller", () => {
  let shipmentsController: any;

  before(async () => {
    // Test edilecek modülü mocklardan SONRA dinamik import ile alıyoruz
    shipmentsController = await import("./shipments");
  });

  beforeEach(() => {
    // Her testten önce mockları sıfırla
    dbMock.shipment.findUnique.mock.resetCalls();
    dbMock.shipment.create.mock.resetCalls();
    dbMock.shipment.findMany.mock.resetCalls();
    dbMock.customer.findUnique.mock.resetCalls();
    dbMock.trailer.findUnique.mock.resetCalls();
    dbMock.$transaction.mock.resetCalls();
    
    redisMock.del.mock.resetCalls();
    cacheUtilsMock.invalidatePattern.mock.resetCalls();
    checkPermissionMock.checkPermission.mock.resetCalls();
    notificationsMock.sendNotificationAction.mock.resetCalls();
    inventoryMock.invalidateInventoryCache.mock.resetCalls();
  });

  describe("createShipment() metodu", () => {
    const mockUser = {
      id: "user-1",
      companyId: "company-1",
    };

    it("should_CreateShipment_AndSendNotification_WhenValidDataProvided", async () => {
      // Arrange
      dbMock.shipment.findUnique.mock.mockImplementation(async () => null); // No existing tracking ID
      dbMock.customer.findUnique.mock.mockImplementation(async () => null); // No customer details
      dbMock.shipment.create.mock.mockImplementation(async (args: any) => ({
        id: "shipment-1",
        trackingId: "TRK-123456",
        ...args.data,
      }));

      const shipmentData = {
        origin: "Istanbul",
        destination: "Ankara",
        weightKg: 1000,
        volumeM3: 5,
        priority: "HIGH",
      };

      // Act
      const result = await shipmentsController.createShipment(mockUser, shipmentData);

      // Assert
      expect(result.shipment.id).toBe("shipment-1");
      expect(result.shipment.origin).toBe("Istanbul");
      expect(result.shipment.destination).toBe("Ankara");
      expect(dbMock.shipment.create.mock.calls.length).toBe(1);
      expect(cacheUtilsMock.invalidatePattern.mock.calls.length).toBe(1);
      expect(notificationsMock.sendNotificationAction.mock.calls.length).toBe(1);
      expect(inventoryMock.invalidateInventoryCache.mock.calls.length).toBe(1);
    });

    it("should_ThrowError_WhenTrackingIdAlreadyExists", async () => {
      // Arrange
      dbMock.shipment.findUnique.mock.mockImplementation(async () => ({
        id: "existing-shipment",
        trackingId: "TRK-EXISTING",
      }));

      const shipmentData = {
        origin: "Istanbul",
        destination: "Ankara",
        trackingId: "TRK-EXISTING",
      };

      // Act & Assert
      await expect(
        shipmentsController.createShipment(mockUser, shipmentData)
      ).rejects.toThrow("Tracking ID already exists");

      expect(dbMock.shipment.create.mock.calls.length).toBe(0);
    });
  });

  describe("getShipments() metodu", () => {
    const mockUser = {
      id: "user-1",
      companyId: "company-1",
    };

    it("should_ReturnShipmentsList_WhenNoFiltersProvided", async () => {
      // Arrange
      const mockShipmentsList = [
        { id: "shipment-1", trackingId: "TRK-1" },
        { id: "shipment-2", trackingId: "TRK-2" },
      ];
      dbMock.shipment.findMany.mock.mockImplementation(async () => mockShipmentsList);

      // Act
      const result = await shipmentsController.getShipments(mockUser);

      // Assert
      expect(result.length).toBe(2);
      expect(result[0].trackingId).toBe("TRK-1");
      expect(dbMock.shipment.findMany.mock.calls.length).toBe(1);
      expect(checkPermissionMock.checkPermission.mock.calls.length).toBe(1);
    });
  });
});
