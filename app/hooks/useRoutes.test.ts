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

const routesControllerMock = {
  getRouteStats: mock.fn(),
  getRouteEfficiencyStats: mock.fn(),
  getActiveRoutesLocations: mock.fn(),
  deleteRoute: mock.fn(),
};

mock.module("@tanstack/react-query", { namedExports: reactQueryMock });
mock.module("sonner", { namedExports: sonnerMock });
mock.module("../lib/controllers/routes", { namedExports: routesControllerMock });

const globalFetchMock = mock.fn();
(globalThis as any).fetch = globalFetchMock;

// 2. TEST GRUPLARI
describe("useRoutes Hook", () => {
  let useRoutesMod: any;

  before(async () => {
    useRoutesMod = await import("./useRoutes");
  });

  beforeEach(() => {
    reactQueryMock.useQuery.mock.resetCalls();
    reactQueryMock.useMutation.mock.resetCalls();
    sonnerMock.toast.success.mock.resetCalls();
    routesControllerMock.deleteRoute.mock.resetCalls();
  });

  describe("useRoutes()", () => {
    it("should_CallUseQueryWithPaginationParams", () => {
      useRoutesMod.useRoutes(1, 10);
      expect(reactQueryMock.useQuery.mock.calls.length).toBe(1);
    });
  });

  describe("useRouteMutations()", () => {
    it("should_ProcessDeleteRouteAndShowToast", async () => {
      routesControllerMock.deleteRoute.mock.mockImplementation(async () => true);
      
      const { deleteRoute } = useRoutesMod.useRouteMutations();
      await deleteRoute.mutateAsync("route-1");

      expect(routesControllerMock.deleteRoute.mock.calls.length).toBe(1);
      expect(sonnerMock.toast.success.mock.calls.length).toBe(1);
    });
  });
});
