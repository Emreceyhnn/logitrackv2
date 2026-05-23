import test, { mock } from "node:test";
import assert from "node:assert";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

process.env.JWT_SECRET = "super-secret-key-at-least-32-characters-long";
process.env.KV_REST_API_URL = "https://mock-url.upstash.io";
process.env.KV_REST_API_TOKEN = "mock-token";

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

test("users controller - updateUser tests", async (t) => {
  const { db } = await import("../db");
  const { updateUser } = await import("../controllers/users");

  // Keep references to restore
  const originalSessionFindUnique = db.session.findUnique;
  const originalUserUpsert = db.user.upsert;
  const originalSessionFindMany = db.session.findMany;
  const originalFetch = globalThis.fetch;

  let dbState: Record<string, string> = {};
  const deletedKeys: string[] = [];

  t.beforeEach(() => {
    dbState = {};
    deletedKeys.length = 0;

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
          deletedKeys.push(key);
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

    // Setup generic mock for session validation in middleware
    db.session.findUnique = (async () => {
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
          name: "Admin",
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
  });

  t.afterEach(() => {
    globalThis.fetch = originalFetch;
    db.session.findUnique = originalSessionFindUnique;
    db.user.upsert = originalUserUpsert;
    db.session.findMany = originalSessionFindMany;
  });

  await t.test("Happy Path: updateUser updates and hashes password and invalidates active session cache keys", async () => {
    let upsertArgs: Prisma.UserUpsertArgs | null = null;
    let findManyArgs: Prisma.SessionFindManyArgs | null = null;

    db.user.upsert = (async (args: Prisma.UserUpsertArgs) => {
      upsertArgs = args;
      return {
        id: "target-user-id",
        email: "target@example.com",
        name: "NewName",
        surname: "NewSurname",
        avatarUrl: "new-avatar",
        roleId: "new-role-id",
        password: "hashed-pwd",
        status: "ACTIVE",
        companyId: "test-company-id",
        timezone: "UTC",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        currency: "USD",
        language: "en",
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        notifEmailShipment: true,
        notifEmailMaint: true,
        notifEmailWeekly: false,
        notifPushAssignment: true,
        notifPushDelay: true,
      };
    }) as unknown as typeof db.user.upsert;

    db.session.findMany = (async (args: Prisma.SessionFindManyArgs) => {
      findManyArgs = args;
      return [
        { token: "session-token-hash-1" },
        { token: "session-token-hash-2" },
      ] as unknown as Promise<Array<{ token: string | null }>>;
    }) as unknown as typeof db.session.findMany;

    const result = await updateUser(
      "NewName",
      "NewSurname",
      "new-secret-password",
      "target@example.com",
      "new-avatar",
      "new-role-id"
    );

    // Verify user upsert properties
    assert.ok(upsertArgs, "upsert should have been called");
    const actualUpsert = upsertArgs as Prisma.UserUpsertArgs;
    assert.strictEqual(actualUpsert.where.email, "target@example.com");
    assert.strictEqual(actualUpsert.update.name, "NewName");
    assert.strictEqual(actualUpsert.update.surname, "NewSurname");
    assert.strictEqual(actualUpsert.update.email, "target@example.com");
    assert.strictEqual(actualUpsert.update.avatarUrl, "new-avatar");
    assert.strictEqual(actualUpsert.update.roleId, "new-role-id");

    // Verify password hashing on update block
    const updatePasswordHash = actualUpsert.update.password;
    assert.ok(updatePasswordHash, "update password should be provided");
    const isUpdatePasswordHashed = await bcrypt.compare("new-secret-password", updatePasswordHash as string);
    assert.ok(isUpdatePasswordHashed, "update password must be correctly hashed");

    // Verify password hashing on create block
    const createPasswordHash = actualUpsert.create.password;
    assert.ok(createPasswordHash, "create password should be provided");
    const isCreatePasswordHashed = await bcrypt.compare("new-secret-password", createPasswordHash as string);
    assert.ok(isCreatePasswordHashed, "create password must be correctly hashed");

    // Verify session fetch & Redis key invalidation
    assert.ok(findManyArgs, "db.session.findMany should have been called");
    const actualFindManyArgs = findManyArgs as Prisma.SessionFindManyArgs;
    assert.deepStrictEqual(actualFindManyArgs.where, { userId: "target-user-id" });
    assert.deepStrictEqual(deletedKeys, ["session:session-token-hash-1", "session:session-token-hash-2"]);

    // Verify result returned
    assert.strictEqual(result.id, "target-user-id");
  });

  await t.test("Edge Case: updateUser does not update password if password argument is empty/undefined", async () => {
    let upsertArgs: Prisma.UserUpsertArgs | null = null;

    db.user.upsert = (async (args: Prisma.UserUpsertArgs) => {
      upsertArgs = args;
      return {
        id: "target-user-id",
        email: "target@example.com",
        name: "NewName",
        surname: "NewSurname",
        avatarUrl: "new-avatar",
        roleId: "new-role-id",
        password: "hashed-pwd",
        status: "ACTIVE",
        companyId: "test-company-id",
        timezone: "UTC",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        currency: "USD",
        language: "en",
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        notifEmailShipment: true,
        notifEmailMaint: true,
        notifEmailWeekly: false,
        notifPushAssignment: true,
        notifPushDelay: true,
      };
    }) as unknown as typeof db.user.upsert;

    db.session.findMany = (async () => []) as unknown as typeof db.session.findMany;

    await updateUser(
      "NewName",
      "NewSurname",
      "", // Empty password
      "target@example.com",
      "new-avatar",
      "new-role-id"
    );

    assert.ok(upsertArgs);
    const actualUpsert = upsertArgs as Prisma.UserUpsertArgs;
    assert.strictEqual(actualUpsert.update.password, undefined, "password should remain undefined in update payload if not provided");
  });
});
