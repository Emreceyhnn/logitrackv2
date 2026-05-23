import test, { mock } from "node:test";
import assert from "node:assert";
import { SignJWT } from "jose";

process.env.JWT_SECRET = "super-secret-key-at-least-32-characters-long";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const mockToken = await new SignJWT({ id: "test-user-id" })
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("1h")
  .sign(secret);

mock.module("next/headers", {
  namedExports: {
    cookies: async () => ({
      get: () => {
        if (name === "token") return { value: mockToken };
        return null;
      },
    }),
    headers: async () => ({
      get: () => {
        return null;
      },
    }),
  },
});

const mockRedisModule = {
  namedExports: {
    redis: {
      get: async () => null,
      set: async () => "OK",
      del: async () => 1,
    },
    withCache: async (key: string, ttl: number, fetcher: () => Promise<unknown>) => {
      return fetcher();
    },
    overviewCacheKeys: {
      dashboard: (companyId: string) => `overview:${companyId}:dashboard`,
    },
    OVERVIEW_CACHE_TTL: 300,
  },
};

mock.module("../redis", mockRedisModule);

test("overview controller tests", async (t) => {
  const { db } = await import("../db");
  const { getOverviewDashboardData } = await import("../controllers/overview");

  await t.test("Happy Path: getOverviewDashboardData resolves customer location coordinates properly", async () => {
    // Keep track of original functions
    const originalSessionFindUnique = db.session.findUnique;
    const originalShipmentCount = db.shipment.count;
    const originalVehicleCount = db.vehicle.count;
    const originalDriverCount = db.driver.count;
    const originalWarehouseCount = db.warehouse.count;
    const originalInventoryCount = db.inventory.count;
    const originalIssueFindMany = db.issue.findMany;
    const originalDocumentFindMany = db.document.findMany;
    const originalRouteCount = db.route.count;
    const originalFuelLogAggregate = db.fuelLog.aggregate;
    const originalRouteAggregate = db.route.aggregate;
    const originalFuelLogFindMany = db.fuelLog.findMany;
    const originalExchangeRateFindFirst = db.exchangeRate.findFirst;
    const originalVehicleFindMany = db.vehicle.findMany;
    const originalWarehouseFindMany = db.warehouse.findMany;
    const originalInventoryGroupBy = db.inventory.groupBy;
    const originalInventoryFindMany = db.inventory.findMany;
    const originalShipmentFindMany = db.shipment.findMany;
    const originalInventoryMovementGroupBy = db.inventoryMovement.groupBy;
    const originalCustomerFindMany = db.customer.findMany;

    // Apply mocks
    db.session.findUnique = (async () => ({
      id: "session-1",
      isRevoked: false,
      expiresAt: new Date(Date.now() + 3600000),
      lastActivityAt: new Date(),
      user: {
        id: "test-user-id",
        companyId: "test-company-id",
        roleId: "role-admin-id",
        status: "ACTIVE",
        name: "Test",
        surname: "User",
        avatarUrl: null,
        timezone: "UTC",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        currency: "USD",
        language: "en",
        notifEmailShipment: true,
        notifEmailMaint: true,
        notifEmailWeekly: false,
        notifPushAssignment: true,
        notifPushDelay: true,
        role: {
          name: "Administrator",
        },
      },
    })) as never;

    db.shipment.count = (async () => 0) as never;
    db.vehicle.count = (async () => 0) as never;
    db.driver.count = (async () => 0) as never;
    db.warehouse.count = (async () => 0) as never;
    db.inventory.count = (async () => 0) as never;
    db.issue.findMany = (async () => []) as never;
    db.document.findMany = (async () => []) as never;
    db.route.count = (async () => 0) as never;
    db.fuelLog.aggregate = (async () => ({ _sum: { volumeLiter: 0 } })) as never;
    db.route.aggregate = (async () => ({ _avg: { durationMin: 0 } })) as never;
    db.fuelLog.findMany = (async () => []) as never;

    db.exchangeRate.findFirst = (async () => ({
      base: "USD",
      rates: { USD: 1, EUR: 0.9, TRY: 30 },
      date: new Date(),
    })) as never;

    db.vehicle.findMany = (async () => []) as never;
    db.warehouse.findMany = (async () => []) as never;
    db.inventory.groupBy = (async () => []) as never;
    db.inventory.findMany = (async () => []) as never;
    db.shipment.findMany = (async () => []) as never;
    db.inventoryMovement.groupBy = (async () => []) as never;

    let customerFindManyArgs: Record<string, unknown> | null = null;
    db.customer.findMany = (async (args: Record<string, unknown>) => {
      customerFindManyArgs = args;
      return [
        {
          id: "customer-1",
          name: "Customer One",
          locations: [
            { lat: 34.05, lng: -118.24, isDefault: false },
            { lat: 41.0082, lng: 28.9784, isDefault: true },
          ],
        },
        {
          id: "customer-2",
          name: "Customer Two",
          locations: [
            { lat: 37.7749, lng: -122.4194, isDefault: false },
          ],
        },
        {
          id: "customer-3",
          name: "Customer Three",
          locations: [],
        },
      ];
    }) as never;

    try {
      const result = await getOverviewDashboardData();
      
      // Verify query select structure for Issue 29
      assert.ok(customerFindManyArgs?.select);
      assert.deepStrictEqual(customerFindManyArgs.select.locations, {
        select: {
          lat: true,
          lng: true,
          isDefault: true,
        },
      });

      // Filter customers from mapData
      const mappedCustomers = result.mapData.filter((m) => m.type === "C");
      assert.strictEqual(mappedCustomers.length, 3);

      // Verify Customer One matches default location
      const c1 = mappedCustomers.find((c) => c.id === "customer-1");
      assert.ok(c1);
      assert.strictEqual(c1.name, "Customer One");
      assert.deepStrictEqual(c1.position, { lat: 41.0082, lng: 28.9784 });

      // Verify Customer Two matches the first location (as no default exists)
      const c2 = mappedCustomers.find((c) => c.id === "customer-2");
      assert.ok(c2);
      assert.strictEqual(c2.name, "Customer Two");
      assert.deepStrictEqual(c2.position, { lat: 37.7749, lng: -122.4194 });

      // Verify Customer Three matches fallback coordinates
      const c3 = mappedCustomers.find((c) => c.id === "customer-3");
      assert.ok(c3);
      assert.strictEqual(c3.name, "Customer Three");
      assert.deepStrictEqual(c3.position, { lat: 40.7128, lng: -74.006 });

    } finally {
      // Restore all original database functions
      db.session.findUnique = originalSessionFindUnique;
      db.shipment.count = originalShipmentCount;
      db.vehicle.count = originalVehicleCount;
      db.driver.count = originalDriverCount;
      db.warehouse.count = originalWarehouseCount;
      db.inventory.count = originalInventoryCount;
      db.issue.findMany = originalIssueFindMany;
      db.document.findMany = originalDocumentFindMany;
      db.route.count = originalRouteCount;
      db.fuelLog.aggregate = originalFuelLogAggregate;
      db.route.aggregate = originalRouteAggregate;
      db.fuelLog.findMany = originalFuelLogFindMany;
      db.exchangeRate.findFirst = originalExchangeRateFindFirst;
      db.vehicle.findMany = originalVehicleFindMany;
      db.warehouse.findMany = originalWarehouseFindMany;
      db.inventory.groupBy = originalInventoryGroupBy;
      db.inventory.findMany = originalInventoryFindMany;
      db.shipment.findMany = originalShipmentFindMany;
      db.inventoryMovement.groupBy = originalInventoryMovementGroupBy;
      db.customer.findMany = originalCustomerFindMany;
    }
  });
});
