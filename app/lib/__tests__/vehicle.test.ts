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
      get: (name: string) => {
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

test("vehicle controller tests", async (t) => {
  const { db } = await import("../db");
  const { getAvailableDrivers } = await import("../controllers/vehicle");

  await t.test("Happy Path: getAvailableDrivers filters with status ON_JOB", async () => {
    let sessionCalls = 0;
    let findManyCalls = 0;
    let findManyArgs: { where?: { companyId: string; currentVehicleId: null; status: string } } | null = null;

    const originalSessionFindUnique = db.session.findUnique;
    const originalDriverFindMany = db.driver.findMany;

    db.session.findUnique = (async () => {
      sessionCalls++;
      return {
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
      };
    }) as never;

    db.driver.findMany = (async (args: { where?: { companyId: string; currentVehicleId: null; status: string } }) => {
      findManyCalls++;
      findManyArgs = args;
      return [
        {
          id: "driver-1",
          rating: 4.5,
          status: "ON_JOB",
          user: {
            name: "John",
            surname: "Doe",
            avatarUrl: null,
          },
        },
      ];
    }) as never;

    try {
      const result = await getAvailableDrivers();
      
      assert.strictEqual(sessionCalls, 1);
      assert.strictEqual(findManyCalls, 1);
      
      const args = findManyArgs as unknown as {
        where: {
          companyId: string;
          currentVehicleId: string | null;
          status: string;
        };
      };

      assert.strictEqual(args.where.companyId, "test-company-id");
      assert.strictEqual(args.where.currentVehicleId, null);
      assert.strictEqual(args.where.status, "ON_JOB");
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].id, "driver-1");
    } finally {
      db.session.findUnique = originalSessionFindUnique;
      db.driver.findMany = originalDriverFindMany;
    }
  });
});
