/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

const mockNextResponse = {
  json: mock.fn((body: any, init?: { status?: number }) => ({
    _body: body,
    _status: init?.status ?? 200,
  })),
  redirect: mock.fn((url: any) => ({
    _redirect: url.toString(),
    _status: 302,
    cookies: { delete: mock.fn() },
  })),
};
mock.module("next/server", {
  namedExports: { NextResponse: mockNextResponse, NextRequest: class {} },
});

const refreshSessionMock = mock.fn();
mock.module("@/app/lib/controllers/session", {
  namedExports: { refreshSession: refreshSessionMock },
});

mock.module("@/app/lib/constants", {
  namedExports: { DEFAULT_LOCALE: "en", SIGN_IN_ROUTE: "/sign-in" },
});

mock.module("@/app/lib/language/navigation", {
  namedExports: { buildLocalizedHref: (route: string, locale: string) => `/${locale}${route}` },
});

function makeRequest(redirectTo = "/dashboard") {
  const sp = new URLSearchParams({ redirect_to: redirectTo });
  return {
    nextUrl: {
      searchParams: sp,
      clone: () => {
        // Return a mutable url-like object whose toString reflects changes
        const state = { pathname: "/", search: "" };
        return new Proxy(state, {
          set(target, key, value) {
            (target as any)[key] = value;
            return true;
          },
          get(target, key) {
            if (key === "toString") return () => `http://localhost${target.pathname}${target.search}`;
            if (key === "origin") return "http://localhost";
            return (target as any)[key];
          },
        });
      },
      origin: "http://localhost",
    },
  } as any;
}

describe("GET /api/auth/refresh", () => {
  let GET: any;

  before(async () => {
    const mod = await import("./route");
    GET = mod.GET;
  });

  beforeEach(() => {
    refreshSessionMock.mock.resetCalls();
    mockNextResponse.redirect.mock.resetCalls();
    mockNextResponse.json.mock.resetCalls();
  });

  it("should_RedirectToTarget_WhenSessionRefreshSucceeds", async () => {
    refreshSessionMock.mock.mockImplementationOnce(async () => true);
    const res: any = await GET(makeRequest("/dashboard"));
    expect(mockNextResponse.redirect.mock.calls.length).toBe(1);
    expect(res._status).toBe(302);
  });

  it("should_RedirectToSignIn_WhenSessionRefreshFails", async () => {
    refreshSessionMock.mock.mockImplementationOnce(async () => false);
    const res: any = await GET(makeRequest("/en/dashboard"));
    expect(mockNextResponse.redirect.mock.calls.length).toBe(1);
    // URL should point to sign-in
    const redirectUrl: string = res._redirect;
    expect(redirectUrl).toContain("sign-in");
  });
});
