import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";

const validateSessionMock = mock.fn<(...args: any[]) => any>();
const redirectMock = mock.fn<(...args: any[]) => any>();
const headersMock = mock.fn<(...args: any[]) => any>();

mock.module("./controllers/session", {
  namedExports: {
    validateSession: validateSessionMock,
  },
});

mock.module("next/navigation", {
  namedExports: {
    redirect: redirectMock,
  },
});

mock.module("next/headers", {
  namedExports: {
    headers: headersMock,
  },
});

mock.module("react", {
  namedExports: {
    cache: (fn: any) => fn,
  },
});

mock.module("./constants", {
  namedExports: {
    DEFAULT_LOCALE: "en",
    LOCALES: ["en", "tr", "de"],
  },
});

describe("auth-middleware.ts", () => {
  let getAuthenticatedUser: any;
  let authenticatedAction: any;
  let maybeAuthenticatedAction: any;

  before(async () => {
    const mod = await import("./auth-middleware");
    getAuthenticatedUser = mod.getAuthenticatedUser;
    authenticatedAction = mod.authenticatedAction;
    maybeAuthenticatedAction = mod.maybeAuthenticatedAction;
  });

  beforeEach(() => {
    validateSessionMock.mock.resetCalls();
    redirectMock.mock.resetCalls();
    headersMock.mock.resetCalls();
    
    redirectMock.mock.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });
  });

  describe("getAuthenticatedUser", () => {
    it("should return the formatted user when validateSession succeeds", async () => {
      validateSessionMock.mock.mockImplementation(async () => ({
        id: "user-1",
        name: "John",
        surname: "Doe",
        avatarUrl: null,
        companyId: "comp-1",
        roleId: "role-1",
        roleName: "Admin",
        sessionId: "sess-1",
        timezone: "UTC",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "24h",
        currency: "EUR",
        language: "tr",
        notifEmailShipment: true,
        notifEmailMaint: false,
        notifEmailWeekly: true,
        notifPushAssignment: true,
        notifPushDelay: false,
      }));

      const user = await getAuthenticatedUser();
      expect(user).toBeDefined();
      expect(user?.id).toBe("user-1");
      expect(user?.currency).toBe("EUR");
      expect(user?.language).toBe("tr");
    });

    it("should return null when validateSession returns null", async () => {
      validateSessionMock.mock.mockImplementation(async () => null);
      const user = await getAuthenticatedUser();
      expect(user).toBeNull();
    });

    it("should handle session check failure and return null", async () => {
      validateSessionMock.mock.mockImplementation(async () => {
        throw new Error("Database error");
      });
      const consoleMock = mock.method(console, "error", () => {});

      const user = await getAuthenticatedUser();
      expect(user).toBeNull();
      consoleMock.mock.restore();
    });

    it("should throw DYNAMIC_SERVER_USAGE errors", async () => {
      validateSessionMock.mock.mockImplementation(async () => {
        const err = new Error("Dynamic");
        (err as any).digest = "DYNAMIC_SERVER_USAGE";
        throw err;
      });

      await expect(getAuthenticatedUser()).rejects.toThrow("Dynamic");
    });
  });

  describe("authenticatedAction", () => {
    it("should redirect if user is not authenticated (fallback locale)", async () => {
      validateSessionMock.mock.mockImplementation(async () => null);
      
      headersMock.mock.mockImplementation(async () => {
        return new Map([["other", "value"]]);
      });

      const action = authenticatedAction(async () => "success");
      
      await expect(action()).rejects.toThrow("NEXT_REDIRECT");
      expect(redirectMock.mock.calls.length).toBe(1);
      expect(redirectMock.mock.calls[0].arguments[0]).toBe("/en");
    });

    it("should redirect to correct locale if referer contains locale", async () => {
      validateSessionMock.mock.mockImplementation(async () => null);
      
      headersMock.mock.mockImplementation(async () => {
        return new Map([["referer", "http://localhost:3000/tr/dashboard"]]);
      });

      const action = authenticatedAction(async () => "success");
      
      await expect(action()).rejects.toThrow("NEXT_REDIRECT");
      expect(redirectMock.mock.calls.length).toBe(1);
      expect(redirectMock.mock.calls[0].arguments[0]).toBe("/tr");
    });

    it("should execute action with user if authenticated", async () => {
      validateSessionMock.mock.mockImplementation(async () => ({
        id: "user-1",
        name: "John",
        surname: "Doe",
        currency: "USD",
        language: "en",
      }));

      const action = authenticatedAction(async (user: any, arg1: any) => {
        return `${user.name} - ${arg1}`;
      });

      const result = await action("test-arg");
      expect(result).toBe("John - test-arg");
    });
  });

  describe("maybeAuthenticatedAction", () => {
    it("should execute action with user if authenticated", async () => {
      validateSessionMock.mock.mockImplementation(async () => ({
        id: "user-1",
      }));

      const action = maybeAuthenticatedAction(async (user: any) => {
        return user?.id;
      });

      const result = await action();
      expect(result).toBe("user-1");
    });

    it("should execute action with null if not authenticated", async () => {
      validateSessionMock.mock.mockImplementation(async () => null);

      const action = maybeAuthenticatedAction(async (user: any) => {
        return user;
      });

      const result = await action();
      expect(result).toBeNull();
    });
  });
});
