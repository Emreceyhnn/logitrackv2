/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, after } from "node:test";
import { expect } from "expect";
import "dotenv/config";

describe("db.ts Connection & Initialization", async () => {
  const { db } = await import("./db");

  it("should have DATABASE_URL defined in environment", () => {
    expect(process.env.DATABASE_URL).toBeDefined();
  });

  it("should properly instantiate the Prisma client", () => {
    expect(db).toBeDefined();
  });

  it("should establish a direct connection to the database", async () => {
    try {
      const result = await db.$queryRaw`SELECT 1 as result`;
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      throw new Error(`Database connection failed: ${(error as Error).message}`);
    }
  });

  it("should cache prisma instance in globalThis in development", () => {
    const globalPrisma = (globalThis as any).prisma;
    if (process.env.NODE_ENV !== "production") {
      expect(globalPrisma).toBeDefined();
      expect(globalPrisma).toBe(db);
    }
  });

  after(async () => {
    // Disconnect Prisma to close the open TCP sockets.
    if (db) {
      await db.$disconnect();
    }
  });
});
