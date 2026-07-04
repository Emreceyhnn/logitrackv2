/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";
import { rejects } from "node:assert";

// 1. MOCK'LAR (Imports'dan ÖNCE tanımlanmalı!)

// Prisma DB Mock
const dbMock = {
  route: {
    findFirst: mock.fn(),
    findUnique: mock.fn(),
    create: mock.fn(),
    findMany: mock.fn(),
    count: mock.fn(),
    update: mock.fn(),
    delete: mock.fn(),
  },
  warehouse: {
    findUnique: mock.fn(),
  },
  customer: {
    findUnique: mock.fn(),
  },
  driver: {
    update: mock.fn(),
  },
  shipment: {
    update: mock.fn(),
  },
  vehicle: {
    count: mock.fn(),
  },
  $transaction: mock.fn(async (cb) => cb(dbMock)),
};

// Redis & Cache Mock
const redisMock = {
  del: mock.fn(async () => 1),
};

const cacheUtilsMock = {
  redis: redisMock,
  withCache: mock.fn(async (key, ttl, cb) => cb()),
  invalidatePattern: mock.fn(async () => 1),
  hashFilters: mock.fn(() => "mock-hash"),
  routeCacheKeys: {
    companyPattern: mock.fn(() => "company-pattern"),
    detail: mock.fn(() => "detail-key"),
    list: mock.fn(() => "list-key"),
  },
  ROUTE_CACHE_TTL: 3600,
};

// Shipments Cache Mock
const shipmentsCacheMock = {
  invalidateShipmentCache: mock.fn(async () => {}),
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
  sendNotificationAction: mock.fn(async () => {}),
};

// Trend Utils Mock
const trendUtilsMock = {
  calcTrend: mock.fn(),
  daysAgo: mock.fn(),
};

// Modülleri Sisteme Enjekte Etme
mock.module("../db.ts", {
  namedExports: { db: dbMock },
});

mock.module("../redis.ts", {
  namedExports: cacheUtilsMock,
});

mock.module("./shipments.ts", {
  namedExports: shipmentsCacheMock,
});

mock.module("../auth-middleware.ts", {
  namedExports: authMiddlewareMock,
});

mock.module("./utils/checkPermission.ts", {
  namedExports: checkPermissionMock,
});

mock.module("../actions/notifications.ts", {
  namedExports: { sendNotificationAction: notificationsMock.sendNotificationAction },
});

mock.module("./utils/trendUtils.ts", {
  namedExports: trendUtilsMock,
});

mock.module("next/cache", { namedExports: { revalidatePath: () => {} } });

// 2. TEST GRUPLARI
describe("Routes Controller", () => {
  let routesController: any;

  before(async () => {
    // Test edilecek modülü mocklardan SONRA dinamik import ile alıyoruz
    routesController = await import("./routes");
  });

  beforeEach(() => {
    // Her testten önce mockları sıfırla
    dbMock.route.findFirst.mock.resetCalls();
    dbMock.route.findUnique.mock.resetCalls();
    dbMock.route.create.mock.resetCalls();
    dbMock.route.findMany.mock.resetCalls();
    dbMock.warehouse.findUnique.mock.resetCalls();
    dbMock.customer.findUnique.mock.resetCalls();
    dbMock.driver.update.mock.resetCalls();
    dbMock.shipment.update.mock.resetCalls();
    dbMock.$transaction.mock.resetCalls();
    
    redisMock.del.mock.resetCalls();
    cacheUtilsMock.invalidatePattern.mock.resetCalls();
    shipmentsCacheMock.invalidateShipmentCache.mock.resetCalls();
    checkPermissionMock.checkPermission.mock.resetCalls();
    notificationsMock.sendNotificationAction.mock.resetCalls();
  });

  describe("createRoute() metodu", () => {
    const mockUser = {
      id: "user-1",
      companyId: "company-1",
    };

    it("should_CreateRoute_AndAssignDriver_WhenValidDataProvided", async () => {
      // Arrange
      dbMock.route.findFirst.mock.mockImplementation(async () => null); // Route name doesn't exist
      
      const expectedRoute = {
        id: "route-1",
        name: "ROUTE-TEST",
      };
      dbMock.route.create.mock.mockImplementation(async () => expectedRoute);

      const routeArgs = [
        mockUser,
        "ROUTE-TEST",
        new Date(), // date
        new Date(), // startTime
        new Date(), // endTime
        150, // distanceKm
        120, // durationMin
        "driver-1", // driverId
        "vehicle-1", // vehicleId
      ];

      // Act
      const result = await routesController.createRoute(...routeArgs);

      // Assert
      expect(result.route.id).toBe("route-1");
      expect(dbMock.route.create.mock.calls.length).toBe(1);
      expect(dbMock.driver.update.mock.calls.length).toBe(1); // Driver is assigned to vehicle
      expect(cacheUtilsMock.invalidatePattern.mock.calls.length).toBe(1); // route cache invalidated
      expect(notificationsMock.sendNotificationAction.mock.calls.length).toBe(1); // notification sent
    });

    it("should_ThrowError_WhenRouteNameAlreadyExists", async () => {
      // Arrange
      dbMock.route.findFirst.mock.mockImplementation(async () => ({
        id: "existing-route",
        name: "ROUTE-TEST",
      }));

      const routeArgs = [
        mockUser,
        "ROUTE-TEST",
        new Date(),
        new Date(),
        new Date(),
        150,
        120,
        "driver-1",
        "vehicle-1",
      ];

      // Act & Assert
      await expect(
        routesController.createRoute(...routeArgs)
      ).rejects.toThrow("Route name already exists");

      expect(dbMock.route.create.mock.calls.length).toBe(0);
    });
  });

  describe("getRoutes() metodu", () => {
    const mockUser = {
      id: "user-1",
      companyId: "company-1",
    };

    it("should_ReturnRoutesList_WhenCalled", async () => {
      // Arrange
      const mockRoutes = [
        { id: "route-1", name: "R1" },
        { id: "route-2", name: "R2" },
      ];
      dbMock.route.findMany.mock.mockImplementation(async () => mockRoutes);
      dbMock.route.count.mock.mockImplementation(async () => 2);

      // Act
      const result = await routesController.getRoutes(mockUser, 1, 10, "ALL");

      // Assert
      expect(result.totalCount).toBe(2);
      expect(result.routes.length).toBe(2);
      expect(dbMock.route.findMany.mock.calls.length).toBe(1);
      expect(checkPermissionMock.checkPermission.mock.calls.length).toBe(1);
    });
  });
});
