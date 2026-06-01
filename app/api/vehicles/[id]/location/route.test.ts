/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

const mockNextResponse = {
  json: mock.fn((body: any, init?: { status?: number }) => ({
    _body: body,
    _status: init?.status ?? 200,
  })),
};
mock.module("next/server", {
  namedExports: { NextResponse: mockNextResponse, NextRequest: class {} },
});

// Mock Firebase Admin
const mockFirebaseRef = {
  set: mock.fn(async () => {}),
  once: mock.fn(async () => ({ val: () => ({ lat: 41.0, lng: 29.0, speed: 60, heading: 90 }) })),
};
mock.module("@/app/lib/firebase-admin", {
  namedExports: {
    adminDb: { ref: mock.fn(() => mockFirebaseRef) },
  },
});

// Mock Prisma
const vehicleFindUniqueMock = mock.fn();
mock.module("@/app/lib/db", {
  namedExports: {
    db: { vehicle: { findUnique: vehicleFindUniqueMock } },
  },
});

describe("POST /api/vehicles/[id]/location", () => {
  let POST: any;
  let GET: any;

  before(async () => {
    const mod = await import("./route");
    POST = mod.POST;
    GET = mod.GET;
  });

  beforeEach(() => {
    vehicleFindUniqueMock.mock.resetCalls();
    mockFirebaseRef.set.mock.resetCalls();
    mockFirebaseRef.once.mock.resetCalls();
    mockNextResponse.json.mock.resetCalls();
  });

  function makePostRequest(body: any) {
    return {
      json: async () => body,
    } as any;
  }

  function makeParams(id: string) {
    return { params: Promise.resolve({ id }) };
  }

  // ─── POST tests ────────────────────────────────────────────────────────────
  it("should_Return404_WhenVehicleNotFound_OnPOST", async () => {
    vehicleFindUniqueMock.mock.mockImplementationOnce(async () => null);
    const res: any = await POST(makePostRequest({ lat: 41, lng: 29 }), makeParams("v-missing"));
    expect(res._status).toBe(404);
  });

  it("should_Return400_WhenLatLngNotNumbers", async () => {
    vehicleFindUniqueMock.mock.mockImplementationOnce(async () => ({ id: "v1", plate: "34ABC" }));
    const res: any = await POST(makePostRequest({ lat: "invalid", lng: 29 }), makeParams("v1"));
    expect(res._status).toBe(400);
  });

  it("should_Return422_WhenCoordinatesOutOfRange", async () => {
    vehicleFindUniqueMock.mock.mockImplementationOnce(async () => ({ id: "v1", plate: "34ABC" }));
    const res: any = await POST(makePostRequest({ lat: 200, lng: 29 }), makeParams("v1"));
    expect(res._status).toBe(422);
  });

  it("should_PushToFirebase_AndReturn200_WhenValidPayload", async () => {
    vehicleFindUniqueMock.mock.mockImplementationOnce(async () => ({ id: "v1", plate: "34ABC" }));
    const res: any = await POST(makePostRequest({ lat: 41.0, lng: 29.0, speed: 60 }), makeParams("v1"));
    expect(mockFirebaseRef.set.mock.calls.length).toBe(1);
    expect(res._status).toBe(200);
    expect(res._body.success).toBe(true);
    expect(res._body.vehicleId).toBe("v1");
  });

  // ─── GET tests ─────────────────────────────────────────────────────────────
  it("should_Return404_WhenVehicleNotFound_OnGET", async () => {
    vehicleFindUniqueMock.mock.mockImplementationOnce(async () => null);
    const res: any = await GET({} as any, makeParams("v-missing"));
    expect(res._status).toBe(404);
  });

  it("should_ReturnLiveLocation_WhenFirebaseHasData", async () => {
    vehicleFindUniqueMock.mock.mockImplementationOnce(async () => ({
      id: "v1", plate: "34ABC", currentLat: 41.0, currentLng: 29.0
    }));
    const res: any = await GET({} as any, makeParams("v1"));
    expect(res._body.vehicleId).toBe("v1");
    expect(res._body.source).toBe("firebase_rtdb");
    expect(res._body.liveLocation).toBeTruthy();
  });
});
