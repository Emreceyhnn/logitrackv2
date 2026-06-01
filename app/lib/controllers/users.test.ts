/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";
import { rejects } from "node:assert";

// 1. MOCK'LAR (Imports'dan ÖNCE tanımlanmalı!)

// Prisma DB Mock
const dbMock = {
  user: {
    findUnique: mock.fn(),
    findFirst: mock.fn(),
    findMany: mock.fn(),
    create: mock.fn(),
    update: mock.fn(),
    upsert: mock.fn(),
  },
  session: {
    findMany: mock.fn(),
  },
  role: {
    findFirst: mock.fn(),
  },
};

// Redis Mock
const redisMock = {
  del: mock.fn(),
};

// Auth & Session Mock
const authMiddlewareMock = {
  authenticatedAction: mock.fn((cb) => cb),
  maybeAuthenticatedAction: mock.fn((cb) => cb),
};

const sessionMock = {
  createSession: mock.fn(),
  revokeSession: mock.fn(),
  clearAuthCookies: mock.fn(),
  logAuditEvent: mock.fn(),
  validateSession: mock.fn(),
};

const checkPermissionMock = {
  checkPermission: mock.fn(),
};

// Next.js Headers Mock
const headersMock = {
  headers: mock.fn(async () => ({
    get: mock.fn(() => "127.0.0.1"),
  })),
};

// Rate Limiter Mock
const rateLimiterMock = {
  rateLimit: mock.fn(async () => ({ success: true })),
};

// Notifications Mock
const notificationsMock = {
  sendNotificationAction: mock.fn(),
};

// Bcrypt Mock
const bcryptMock = {
  hash: mock.fn(async () => "hashed-password"),
  compare: mock.fn(async () => true),
};

// Jose Mock
const joseMock = {
  jwtVerify: mock.fn(),
};

// Modülleri Sisteme Enjekte Etme
mock.module("../db", {
  namedExports: { db: dbMock },
});

mock.module("../redis", {
  namedExports: { redis: redisMock },
});

mock.module("../auth-middleware", {
  namedExports: authMiddlewareMock,
});

mock.module("./session", {
  namedExports: sessionMock,
});

mock.module("./utils/checkPermission", {
  namedExports: checkPermissionMock,
});

mock.module("next/headers", {
  namedExports: headersMock,
});

mock.module("../rate-limiter", {
  namedExports: rateLimiterMock,
});

mock.module("@/app/lib/actions/notifications", {
  namedExports: { sendNotificationAction: notificationsMock.sendNotificationAction },
});

mock.module("bcryptjs", {
  defaultExport: bcryptMock,
});

mock.module("jose", {
  namedExports: joseMock,
});

// 2. TEST GRUPLARI
describe("Users Controller", () => {
  let usersController: any;

  before(async () => {
    // Dynamically import the module after mocks are defined
    usersController = await import("./users");
  });

  beforeEach(() => {
    // Reset all mock calls before each test
    dbMock.user.findFirst.mock.resetCalls();
    dbMock.user.findUnique.mock.resetCalls();
    dbMock.user.findMany.mock.resetCalls();
    dbMock.user.create.mock.resetCalls();
    
    sessionMock.createSession.mock.resetCalls();
    sessionMock.logAuditEvent.mock.resetCalls();
    rateLimiterMock.rateLimit.mock.resetCalls();
    checkPermissionMock.checkPermission.mock.resetCalls();
    bcryptMock.hash.mock.resetCalls();
  });

  describe("RegisterUser() metodu", () => {
    it("should_RegisterUser_AndCreateSession_WhenDataIsValid", async () => {
      // Arrange
      dbMock.user.findFirst.mock.mockImplementation(async () => null); // Email doesn't exist
      dbMock.user.create.mock.mockImplementation(async (args: any) => ({
        id: "user-1",
        ...args.data,
      }));
      rateLimiterMock.rateLimit.mock.mockImplementation(async () => ({ success: true }));

      // Act
      const result = await usersController.RegisterUser(
        null, // No authenticated user (guest registration)
        "John",
        "Doe",
        "secret-password",
        "john.doe@example.com"
      );

      // Assert
      expect(result.error).toBeUndefined();
      expect(result.user?.id).toBe("user-1");
      expect(result.user?.email).toBe("john.doe@example.com");
      
      expect(dbMock.user.create.mock.calls.length).toBe(1);
      expect(bcryptMock.hash.mock.calls.length).toBe(1);
      expect(sessionMock.createSession.mock.calls.length).toBe(1);
      expect(sessionMock.logAuditEvent.mock.calls.length).toBe(1);
      expect(rateLimiterMock.rateLimit.mock.calls.length).toBe(1);
    });

    it("should_ReturnError_WhenEmailAlreadyExists", async () => {
      // Arrange
      dbMock.user.findFirst.mock.mockImplementation(async () => ({
        id: "existing-user",
        email: "john.doe@example.com",
      }));
      rateLimiterMock.rateLimit.mock.mockImplementation(async () => ({ success: true }));

      // Act
      const result = await usersController.RegisterUser(
        null,
        "John",
        "Doe",
        "secret-password",
        "john.doe@example.com"
      );

      // Assert
      expect(result.error).toBe("Email already exists");
      expect(result.field).toBe("email");
      
      expect(dbMock.user.create.mock.calls.length).toBe(0);
      expect(sessionMock.createSession.mock.calls.length).toBe(0);
    });

    it("should_ReturnRateLimitError_WhenTooManyAttempts", async () => {
      // Arrange
      rateLimiterMock.rateLimit.mock.mockImplementation(async () => ({ success: false }));

      // Act
      const result = await usersController.RegisterUser(
        null,
        "John",
        "Doe",
        "secret-password",
        "john.doe@example.com"
      );

      // Assert
      expect(result.error).toContain("Too many registration attempts from this IP");
      
      expect(dbMock.user.findFirst.mock.calls.length).toBe(0);
      expect(dbMock.user.create.mock.calls.length).toBe(0);
    });
  });

  describe("getUsers() metodu", () => {
    const mockUser = {
      id: "admin-1",
      companyId: "company-1",
    };

    it("should_ReturnUsersList_WhenUserHasPermission", async () => {
      // Arrange
      const mockUsersList = [
        { id: "u-1", name: "User 1" },
        { id: "u-2", name: "User 2" },
      ];
      dbMock.user.findMany.mock.mockImplementation(async () => mockUsersList);

      // Act
      const result = await usersController.getUsers(mockUser);

      // Assert
      expect(result.length).toBe(2);
      expect(result[0].name).toBe("User 1");
      expect(dbMock.user.findMany.mock.calls.length).toBe(1);
      expect(checkPermissionMock.checkPermission.mock.calls.length).toBe(1);
    });
  });
});
