import test, { mock } from "node:test";
import assert from "node:assert";
import { SignJWT } from "jose";
import crypto from "crypto";
import { Prisma } from "@prisma/client";

process.env.JWT_SECRET = "super-secret-key-at-least-32-characters-long";
process.env.KV_REST_API_URL = "https://mock-url.upstash.io";
process.env.KV_REST_API_TOKEN = "mock-token";

let mockCookiesState: { token?: string; refreshToken?: string } = {};

mock.module("next/headers", {
  namedExports: {
    cookies: async () => ({
      get: (name: string) => {
        if (name === "token") return mockCookiesState.token ? { value: mockCookiesState.token } : null;
        if (name === "refreshToken") return mockCookiesState.refreshToken ? { value: mockCookiesState.refreshToken } : null;
        return null;
      },
      delete: (name: string) => {
        if (name === "token") delete mockCookiesState.token;
        if (name === "refreshToken") delete mockCookiesState.refreshToken;
      },
      set: (name: string, value: string) => {
        if (name === "token") mockCookiesState.token = value;
        if (name === "refreshToken") mockCookiesState.refreshToken = value;
      }
    }),
    headers: async () => ({
      get: () => {
        return null;
      },
    }),
  },
});

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

test("session cache controller tests", async (t) => {
  const { db } = await import("../db");
  const { validateSession, revokeSession, revokeAllUserSessions } = await import("../controllers/session");

  // Keep references to restore
  const originalSessionFindUnique = db.session.findUnique;
  const originalSessionUpdate = db.session.update;
  const originalSessionUpdateMany = db.session.updateMany;
  const originalSessionFindMany = db.session.findMany;
  const originalFetch = globalThis.fetch;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const testToken = await new SignJWT({ id: "test-user-id" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret);
  const testTokenHash = hashToken(testToken);

  let dbState: Record<string, string> = {};
  let dbFindUniqueCalled = 0;
  let dbUpdateCalled = 0;

  t.beforeEach(() => {
    mockCookiesState = { token: testToken };
    dbState = {};
    dbFindUniqueCalled = 0;
    dbUpdateCalled = 0;

    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      const body = init?.body ? JSON.parse(init.body as string) : null;
      if (!Array.isArray(body)) {
        return {
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ error: "Invalid command body" })
        } as unknown as Response;
      }

      const isNested = Array.isArray(body[0]);
      const commands = (isNested ? body : [body]) as unknown[][];

      const results = commands.map((cmdArray: unknown[]) => {
        const cmd = String(cmdArray[0]).toLowerCase();

        if (cmd === "get") {
          const key = String(cmdArray[1]);
          const val = dbState[key];
          return { result: val !== undefined ? val : null };
        }

        if (cmd === "set") {
          const key = String(cmdArray[1]);
          const val = cmdArray[2];
          dbState[key] = typeof val === "string" ? val : JSON.stringify(val);
          return { result: "OK" };
        }

        if (cmd === "del") {
          const key = String(cmdArray[1]);
          let count = 0;
          if (dbState[key] !== undefined) {
            delete dbState[key];
            count = 1;
          }
          return { result: count };
        }

        return { result: null };
      });

      const responsePayload = isNested ? results : results[0];

      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        text: async () => JSON.stringify(responsePayload)
      } as unknown as Response;
    }) as unknown as typeof globalThis.fetch;

    // Default db mock
    db.session.findUnique = (async () => {
      dbFindUniqueCalled++;
      return {
        id: "session-1",
        isRevoked: false,
        expiresAt: new Date(Date.now() + 3600000),
        lastActivityAt: new Date(Date.now() - 3600000), // 1 hour ago (will trigger throttled update)
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
    }) as unknown as typeof db.session.findUnique;

    db.session.update = (async () => {
      dbUpdateCalled++;
      return { id: "session-1" };
    }) as unknown as typeof db.session.update;
  });

  t.afterEach(() => {
    globalThis.fetch = originalFetch;
    db.session.findUnique = originalSessionFindUnique;
    db.session.update = originalSessionUpdate;
    db.session.updateMany = originalSessionUpdateMany;
    db.session.findMany = originalSessionFindMany;
  });

  await t.test("validateSession on cache miss: queries DB, caches the session in Redis, and returns the user", async () => {
    const user = await validateSession();

    assert.ok(user);
    assert.strictEqual(user.id, "test-user-id");
    assert.strictEqual(dbFindUniqueCalled, 1);
    
    // Check it was set in Redis cache
    const cacheKey = `session:${testTokenHash}`;
    assert.ok(dbState[cacheKey], "Session must be cached in Redis");
    const cached = JSON.parse(dbState[cacheKey]) as { id: string; user: { id: string } };
    assert.strictEqual(cached.id, "session-1");
    assert.strictEqual(cached.user.id, "test-user-id");
  });

  await t.test("validateSession on cache hit: reads from Redis directly and bypasses DB queries", async () => {
    const cacheKey = `session:${testTokenHash}`;
    const mockCachedSession = {
      id: "session-1",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      lastActivityAt: new Date(Date.now()).toISOString(), // current time, won't trigger activity update
      isRevoked: false,
      user: {
        id: "test-user-id",
        companyId: "test-company-id",
        roleId: "role-admin-id",
        status: "ACTIVE",
        name: "TestCached",
        surname: "UserCached",
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

    dbState[cacheKey] = JSON.stringify(mockCachedSession);

    const user = await validateSession();

    assert.ok(user);
    assert.strictEqual(user.name, "TestCached");
    assert.strictEqual(dbFindUniqueCalled, 0, "DB findUnique should not have been called on cache hit");
    assert.strictEqual(dbUpdateCalled, 0, "DB update should not have been called because activity is fresh");
  });

  await t.test("revokeSession soft-deletes session in DB and deletes cache key from Redis", async () => {
    let updateArgs: Prisma.SessionUpdateArgs | null = null;
    db.session.update = (async (args: Prisma.SessionUpdateArgs) => {
      updateArgs = args;
      return { id: "session-1", token: "revoked-token-hash" };
    }) as unknown as typeof db.session.update;

    const cacheKey = "session:revoked-token-hash";
    dbState[cacheKey] = JSON.stringify({ id: "session-1" });

    await revokeSession("session-1");

    assert.ok(updateArgs);
    const actualUpdate = updateArgs as Prisma.SessionUpdateArgs;
    assert.strictEqual(actualUpdate.where.id, "session-1");
    assert.deepStrictEqual(actualUpdate.data, { isRevoked: true });
    assert.strictEqual(dbState[cacheKey], undefined, "Cached session should be removed from Redis");
  });

  await t.test("revokeAllUserSessions invalidates all sessions in DB and deletes all session cache keys from Redis", async () => {
    let updateManyArgs: Prisma.SessionUpdateManyArgs | null = null;
    let findManyArgs: Prisma.SessionFindManyArgs | null = null;

    db.session.findMany = (async (args: Prisma.SessionFindManyArgs) => {
      findManyArgs = args;
      return [
        { token: "user-session-token-1" },
        { token: "user-session-token-2" },
      ] as unknown as Promise<Array<{ token: string | null }>>;
    }) as unknown as typeof db.session.findMany;

    db.session.updateMany = (async (args: Prisma.SessionUpdateManyArgs) => {
      updateManyArgs = args;
      return { count: 2 };
    }) as unknown as typeof db.session.updateMany;

    const key1 = "session:user-session-token-1";
    const key2 = "session:user-session-token-2";
    dbState[key1] = JSON.stringify({ id: "s1" });
    dbState[key2] = JSON.stringify({ id: "s2" });

    await revokeAllUserSessions("test-user-id");

    assert.ok(findManyArgs);
    const actualFindMany = findManyArgs as Prisma.SessionFindManyArgs;
    assert.deepStrictEqual(actualFindMany.where, { userId: "test-user-id", isRevoked: false });

    assert.ok(updateManyArgs);
    const actualUpdateMany = updateManyArgs as Prisma.SessionUpdateManyArgs;
    assert.deepStrictEqual(actualUpdateMany.where, { userId: "test-user-id", isRevoked: false });
    assert.deepStrictEqual(actualUpdateMany.data, { isRevoked: true });

    assert.strictEqual(dbState[key1], undefined);
    assert.strictEqual(dbState[key2], undefined);
  });
});
