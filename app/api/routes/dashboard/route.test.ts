/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

function makeRequest(params: Record<string, string> = {}) {
  return { nextUrl: { searchParams: new URLSearchParams(params) } } as any;
}

const mockNextResponse = {
  json: mock.fn((body: any, init?: { status?: number }) => ({
    _body: body,
    _status: init?.status ?? 200,
  })),
};
mock.module("next/server", {
  namedExports: { NextResponse: mockNextResponse, NextRequest: class {} },
});

const getRoutesWithDashboardDataMock = mock.fn();
mock.module("../../../lib/controllers/routes.ts", {
  namedExports: { getRoutesWithDashboardData: getRoutesWithDashboardDataMock },
});

describe("GET /api/routes/dashboard", () => {
  let GET: any;

  before(async () => {
    const mod = await import("./route");
    GET = mod.GET;
  });

  beforeEach(() => {
    getRoutesWithDashboardDataMock.mock.resetCalls();
    mockNextResponse.json.mock.resetCalls();
  });

  it("should_UseDefaultPagination_WhenNoParams", async () => {
    getRoutesWithDashboardDataMock.mock.mockImplementationOnce(async () => ({}));
    await GET(makeRequest());
    expect(getRoutesWithDashboardDataMock.mock.calls[0].arguments).toEqual([1, 10, undefined]);
  });

  it("should_PassStatusFilter", async () => {
    getRoutesWithDashboardDataMock.mock.mockImplementationOnce(async () => ({}));
    await GET(makeRequest({ status: "PLANNED" }));
    expect(getRoutesWithDashboardDataMock.mock.calls[0].arguments[2]).toBe("PLANNED");
  });

  it("should_Return401_WhenNEXT_REDIRECT", async () => {
    getRoutesWithDashboardDataMock.mock.mockImplementationOnce(async () => { throw new Error("NEXT_REDIRECT"); });
    const res: any = await GET(makeRequest());
    expect(res._status).toBe(401);
  });

  it("should_Return500_WhenGenericError", async () => {
    getRoutesWithDashboardDataMock.mock.mockImplementationOnce(async () => { throw new Error("fail"); });
    const res: any = await GET(makeRequest());
    expect(res._status).toBe(500);
  });
});
