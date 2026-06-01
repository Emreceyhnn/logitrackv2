 
import "dotenv/config";
import { describe, it, mock, beforeEach } from "node:test";
import { expect } from "expect";

// Create mock functions
const mockRef = mock.fn();
const mockOnValue = mock.fn();
const mockOff = mock.fn();

// Mock the firebase module BEFORE importing the code that uses it
mock.module("./firebase.ts", {
  namedExports: {
    db: {},
    ref: mockRef,
    onValue: mockOnValue,
    off: mockOff,
  },
});

describe("Vehicle Tracking", () => {
  beforeEach(() => {
    mockRef.mock.resetCalls();
    mockOnValue.mock.resetCalls();
    mockOff.mock.resetCalls();
  });

  describe("subscribeToVehicleLocation", () => {
    it("should subscribe to a specific vehicle and return unsubscribe function", async () => {
      const { subscribeToVehicleLocation } = await import("./vehicleTracking");
      const vehicleId = "vehicle-123";
      const callback = mock.fn();
      const mockSnapshot = { val: () => ({ lat: 40.7128, lng: -74.006 }) };

      // Setup onValue mock
      mockOnValue.mock.mockImplementationOnce((ref, cb) => {
        cb(mockSnapshot);
      });

      const unsubscribe = subscribeToVehicleLocation(vehicleId, callback);

      expect(mockRef.mock.calls.length).toBe(1);
      expect(mockRef.mock.calls[0].arguments[1]).toBe(`vehicles/locations/${vehicleId}`);
      expect(mockOnValue.mock.calls.length).toBe(1);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0].arguments[0]).toEqual({ lat: 40.7128, lng: -74.006 });

      unsubscribe();
      expect(mockOff.mock.calls.length).toBe(1);
    });
  });

  describe("subscribeToAllVehicles", () => {
    it("should subscribe to all vehicles and return unsubscribe function", async () => {
      const { subscribeToAllVehicles } = await import("./vehicleTracking");
      const callback = mock.fn();
      const mockLocations = {
        "v1": { lat: 10, lng: 20 },
      };
      const mockSnapshot = { val: () => mockLocations };

      mockOnValue.mock.mockImplementationOnce((ref, cb) => {
        cb(mockSnapshot);
      });

      const unsubscribe = subscribeToAllVehicles(callback);

      expect(mockRef.mock.calls.length).toBe(1);
      expect(mockRef.mock.calls[0].arguments[1]).toBe("vehicles/locations");
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0].arguments[0]).toEqual(mockLocations);

      unsubscribe();
      expect(mockOff.mock.calls.length).toBe(1);
    });
  });
});


