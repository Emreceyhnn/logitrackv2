/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const queryClientMock = {
  invalidateQueries: mock.fn(),
};

const reactQueryMock = {
  useQuery: mock.fn(() => ({ data: null })),
  useMutation: mock.fn((options: any) => ({
    mutateAsync: async (variables: any) => {
      try {
        const res = await options.mutationFn(variables);
        options.onSuccess?.(res);
        return res;
      } catch (e) {
        options.onError?.(e);
        throw e;
      }
    },
  })),
  useQueryClient: mock.fn(() => queryClientMock),
  keepPreviousData: "keepPreviousData",
};

const sonnerMock = {
  toast: {
    success: mock.fn(),
    error: mock.fn(),
  },
};

const shipmentsControllerMock = {
  getShipmentById: mock.fn(),
  getShipmentStats: mock.fn(),
  getShipmentVolumeHistory: mock.fn(),
  getShipmentStatusDistribution: mock.fn(),
  createShipment: mock.fn(),
  updateShipment: mock.fn(),
  deleteShipment: mock.fn(),
  updateShipmentStatus: mock.fn(),
};

const dictContextMock = {
  useDictionary: mock.fn(() => ({
    toasts: {
      successAdd: "Added",
      successUpdate: "Updated",
      successDelete: "Deleted",
      errorGeneric: "Error",
    },
  })),
};

mock.module("@tanstack/react-query", { namedExports: reactQueryMock });
mock.module("sonner", { namedExports: sonnerMock });
mock.module("../lib/controllers/shipments", { namedExports: shipmentsControllerMock });
mock.module("../lib/language/DictionaryContext", { namedExports: dictContextMock });

const globalFetchMock = mock.fn();
(globalThis as any).fetch = globalFetchMock;

// 2. TEST GRUPLARI
describe("useShipments Hook", () => {
  let useShipmentsMod: any;

  before(async () => {
    useShipmentsMod = await import("./useShipments");
  });

  beforeEach(() => {
    reactQueryMock.useQuery.mock.resetCalls();
    reactQueryMock.useMutation.mock.resetCalls();
    sonnerMock.toast.success.mock.resetCalls();
    shipmentsControllerMock.createShipment.mock.resetCalls();
    shipmentsControllerMock.deleteShipment.mock.resetCalls();
  });

  describe("useShipments()", () => {
    it("should_CallUseQueryWithFilters", () => {
      useShipmentsMod.useShipments({ page: 1, limit: 10 });
      expect(reactQueryMock.useQuery.mock.calls.length).toBe(1);
    });
  });

  describe("useShipmentMutations()", () => {
    it("should_ProcessCreateShipmentAndShowToastFromDict", async () => {
      shipmentsControllerMock.createShipment.mock.mockImplementation(async () => true);
      
      const { createShipment } = useShipmentsMod.useShipmentMutations();
      await createShipment.mutateAsync({ customerId: "c-1", origin: "O", destination: "D", status: "PENDING" });

      expect(shipmentsControllerMock.createShipment.mock.calls.length).toBe(1);
      expect(sonnerMock.toast.success.mock.calls[0].arguments[0]).toBe("Added");
    });
  });
});
