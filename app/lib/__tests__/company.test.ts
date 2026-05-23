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

test("getCompanyUsers controller action tests", async (t) => {
  const { db } = await import("../db");
  const { getCompanyUsers } = await import("../controllers/company");

  await t.test("Happy Path: getCompanyUsers returns safe profile fields and excludes password", async () => {
    // Keep track of calls
    let sessionCalls = 0;
    let userCalls = 0;

    const originalSessionFindUnique = db.session.findUnique;
    const originalUserFindMany = db.user.findMany;

    // Direct mock assignment
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

    db.user.findMany = (async (args: any) => {
      userCalls++;
      assert.ok(args.select);
      assert.strictEqual(args.select.password, undefined); // Ensure password is excluded
      return [
        {
          id: "user-1",
          email: "user1@example.com",
          name: "User",
          surname: "One",
          avatarUrl: null,
          roleId: "role-1",
          status: "ACTIVE",
          companyId: "test-company-id",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }) as never;

    try {
      const result = await getCompanyUsers();
      assert.deepStrictEqual(result, [
        {
          id: "user-1",
          email: "user1@example.com",
          name: "User",
          surname: "One",
          avatarUrl: null,
          roleId: "role-1",
          status: "ACTIVE",
          companyId: "test-company-id",
          createdAt: result[0].createdAt,
          updatedAt: result[0].updatedAt,
        },
      ]);

      assert.strictEqual(sessionCalls, 1);
      assert.strictEqual(userCalls, 1);
    } finally {
      // Restore original functions
      db.session.findUnique = originalSessionFindUnique;
      db.user.findMany = originalUserFindMany;
    }
  });
});
