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

const trailerControllerMock = {
  getTrailerById: mock.fn(),
  createTrailer: mock.fn(),
  updateTrailer: mock.fn(),
  deleteTrailer: mock.fn(),
  assignTrailerToVehicle: mock.fn(),
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
mock.module("../lib/language/DictionaryContext.tsx", { namedExports: dictContextMock });

mock.module("@tanstack/react-query", { namedExports: reactQueryMock });
mock.module("sonner", { namedExports: sonnerMock });
mock.module("../lib/controllers/trailer.ts", { namedExports: trailerControllerMock });

const globalFetchMock = mock.fn();
(globalThis as any).fetch = globalFetchMock;

// 2. TEST GRUPLARI
describe("useTrailers Hook", () => {
  let useTrailersMod: any;

  before(async () => {
    useTrailersMod = await import("./useTrailers");
  });

  beforeEach(() => {
    reactQueryMock.useQuery.mock.resetCalls();
    reactQueryMock.useMutation.mock.resetCalls();
    sonnerMock.toast.success.mock.resetCalls();
    trailerControllerMock.deleteTrailer.mock.resetCalls();
  });

  describe("useTrailers()", () => {
    it("should_CallUseQueryWithFilters", () => {
      useTrailersMod.useTrailers({ page: 1, limit: 10 });
      expect(reactQueryMock.useQuery.mock.calls.length).toBe(1);
    });
  });

  describe("useTrailerMutations()", () => {
    it("should_ProcessDeleteTrailerAndShowToast", async () => {
      trailerControllerMock.deleteTrailer.mock.mockImplementation(async () => true);
      
      const { deleteTrailer } = useTrailersMod.useTrailerMutations();
      await deleteTrailer.mutateAsync("t-1");

      expect(trailerControllerMock.deleteTrailer.mock.calls.length).toBe(1);
      expect(sonnerMock.toast.success.mock.calls.length).toBe(1);
    });
  });
});
