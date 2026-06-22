/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR (Imports'dan ÖNCE tanımlanmalı!)

// Prisma DB Mock
const dbMock = {
  session: {
    create: mock.fn(),
    findUnique: mock.fn(),
    update: mock.fn(),
    findMany: mock.fn(),
    updateMany: mock.fn(),
    deleteMany: mock.fn(),
  },
  auditLog: {
    create: mock.fn(),
  },
};

// Redis Mock
const redisMock = {
  get: mock.fn(async () => null),
  set: mock.fn(async () => "OK"),
  del: mock.fn(async () => 1),
};

// Cookie Store Mock
const cookieStoreMock = {
  get: mock.fn(),
  set: mock.fn(),
  delete: mock.fn(),
};

// Next.js Headers Mock
const nextHeadersMock = {
  cookies: mock.fn(async () => cookieStoreMock),
  headers: mock.fn(async () => new Map()),
};

// Jose JWT Mock
const joseMock = {
  SignJWT: class {
    setProtectedHeader() { return this; }
    setJti() { return this; }
    setExpirationTime() { return this; }
    async sign() { return "mocked-jwt-token"; }
  },
  jwtVerify: mock.fn(async () => ({
    payload: { id: "user-1", role: "admin", companyId: "company-1" }
  })),
};

// Modülleri Sisteme Enjekte Etme
mock.module("../db.ts", {
  namedExports: { db: dbMock },
});

mock.module("../redis.ts", {
  namedExports: { redis: redisMock },
});

mock.module("next/headers", {
  namedExports: nextHeadersMock,
});

mock.module("jose", {
  namedExports: joseMock,
});

// Environment variable setup
process.env.JWT_SECRET = "super-secret-key-for-testing-only";

// 2. TEST GRUPLARI
describe("Session Controller", () => {
  let sessionController: any;

  before(async () => {
    // Test edilecek modülü mocklardan SONRA dinamik import ile alıyoruz
    sessionController = await import("./session");
  });

  beforeEach(() => {
    // Her testten önce mockları sıfırla
    dbMock.session.create.mock.resetCalls();
    dbMock.session.findUnique.mock.resetCalls();
    dbMock.session.update.mock.resetCalls();
    dbMock.session.findMany.mock.resetCalls();
    dbMock.session.updateMany.mock.resetCalls();
    dbMock.auditLog.create.mock.resetCalls();
    
    redisMock.get.mock.resetCalls();
    redisMock.set.mock.resetCalls();
    redisMock.del.mock.resetCalls();

    cookieStoreMock.get.mock.resetCalls();
    cookieStoreMock.set.mock.resetCalls();
    cookieStoreMock.delete.mock.resetCalls();
  });

  describe("createSession() metodu", () => {
    it("should_CreateSessionAndSetCookies_WhenValidUserProvided", async () => {
      // Arrange
      const mockUser = {
        id: "user-1",
        companyId: "company-1",
        roleId: "role-1",
      };

      dbMock.session.create.mock.mockImplementation(async () => ({
        id: "session-1",
      }));

      // Act
      const result = await sessionController.createSession(mockUser, "Chrome", "127.0.0.1");

      // Assert
      expect(result.accessToken).toBe("mocked-jwt-token");
      expect(result.sessionId).toBe("session-1");
      expect(dbMock.session.create.mock.calls.length).toBe(1);
      expect(cookieStoreMock.set.mock.calls.length).toBe(2); // One for token, one for refreshToken
    });
  });

  describe("validateSession() metodu", () => {
    it("should_ReturnSessionUser_WhenValidTokenExists", async () => {
      // Arrange
      cookieStoreMock.get.mock.mockImplementation(() => ({ value: "valid-token" }));
      
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      dbMock.session.findUnique.mock.mockImplementation(async () => ({
        id: "session-1",
        expiresAt: futureDate,
        lastActivityAt: new Date(),
        isRevoked: false,
        user: {
          id: "user-1",
          companyId: "company-1",
          status: "ACTIVE",
          role: { name: "Admin" },
        },
      }));

      redisMock.get.mock.mockImplementation(async () => null); // Force DB lookup

      // Act
      const result = await sessionController.validateSession();

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe("user-1");
      expect(result?.companyId).toBe("company-1");
      expect(dbMock.session.findUnique.mock.calls.length).toBe(1);
    });

    it("should_ReturnNullAndClearCookies_WhenTokenIsExpired", async () => {
      // Arrange
      cookieStoreMock.get.mock.mockImplementation(() => ({ value: "valid-token" }));
      
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      dbMock.session.findUnique.mock.mockImplementation(async () => ({
        id: "session-1",
        expiresAt: pastDate, // Expired!
        lastActivityAt: new Date(),
        isRevoked: false,
        user: {
          id: "user-1",
          status: "ACTIVE",
        },
      }));

      redisMock.get.mock.mockImplementation(async () => null);

      // Act
      const result = await sessionController.validateSession();

      // Assert
      expect(result).toBeNull();
      expect(cookieStoreMock.delete.mock.calls.length).toBe(2); // token and refreshToken
    });
  });

  describe("revokeSession() metodu", () => {
    it("should_MarkSessionAsRevoked_AndRemoveFromRedis", async () => {
      // Arrange
      dbMock.session.update.mock.mockImplementation(async () => ({
        id: "session-1",
        token: "hashed-token",
        isRevoked: true,
      }));

      // Act
      await sessionController.revokeSession("session-1");

      // Assert
      expect(dbMock.session.update.mock.calls.length).toBe(1);
      expect(redisMock.del.mock.calls.length).toBe(1);
      expect(redisMock.del.mock.calls[0].arguments[0]).toBe("session:hashed-token");
    });
  });

  describe("clearAuthCookies() metodu", () => {
    it("should_DeleteTokenAndRefreshTokenCookies", async () => {
      // Act
      await sessionController.clearAuthCookies();

      // Assert
      expect(cookieStoreMock.delete.mock.calls.length).toBe(2);
      expect(cookieStoreMock.delete.mock.calls[0].arguments[0]).toBe("token");
      expect(cookieStoreMock.delete.mock.calls[1].arguments[0]).toBe("refreshToken");
    });
  });
});
