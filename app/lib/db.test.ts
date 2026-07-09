 
import { describe, it, before, beforeEach, mock } from "node:test";
import { expect } from "expect";

// Capture the $extends config instead of connecting to a real database so the
// tenant-guard logic can be exercised in isolation.
const extendsCapture: { config?: unknown } = {};

class FakePrismaClient {
  $extends(config: Record<string, unknown>) {
    extendsCapture.config = config;
    return { __extension: config };
  }
}

mock.module("@prisma/client", {
  namedExports: { PrismaClient: FakePrismaClient },
});

type GuardHandler = (params: {
  model: string;
  operation: string;
  args: unknown;
  query: (args: Record<string, unknown>) => unknown;
}) => unknown;

describe("db.ts tenant-guard extension", () => {
  let handler: GuardHandler;
  let runWithTenant: <T>(companyId: string | null, fn: () => T) => T;
  let queryMock: unknown;

  before(async () => {
    await import("./db");
    ({ runWithTenant } = await import("./tenant-context"));
    handler = extendsCapture.config?.query?.$allModels?.$allOperations;
    expect(typeof handler).toBe("function");
    expect(extendsCapture.config.name).toBe("tenant-guard");
  });

  beforeEach(() => {
    queryMock = mock.fn(async (args: Record<string, unknown>) => args);
  });

  const invoke = (
    companyId: string | null,
    model: string,
    operation: string,
    args: unknown
  ) =>
    runWithTenant(companyId, () =>
      handler({ model, operation, args, query: queryMock })
    );

  const passedArgs = () => queryMock.mock.calls[0].arguments[0];

  describe("tenant scoping on reads", () => {
    it("should_InjectCompanyIdIntoWhere_WhenTenantModelQueriedInTenantContext", async () => {
      await invoke("comp-A", "Shipment", "findMany", {});
      expect(passedArgs().where).toEqual({ companyId: "comp-A" });
    });

    it("should_PreserveExistingWhereFilters_WhenInjectingCompanyId", async () => {
      await invoke("comp-A", "Shipment", "findMany", {
        where: { status: "PENDING" },
      });
      expect(passedArgs().where).toEqual({
        status: "PENDING",
        companyId: "comp-A",
      });
    });

    it("should_NotOverrideExplicitCompanyIdFilter", async () => {
      await invoke("comp-A", "Shipment", "findMany", {
        where: { companyId: "comp-B" },
      });
      // Manual filters are the caller's responsibility; the guard must not
      // silently rewrite them.
      expect(passedArgs().where.companyId).toBe("comp-B");
    });

    it("should_LeaveArgsUntouched_WhenNoTenantContextIsActive", async () => {
      const args = { where: { id: "s1" } };
      await runWithTenant(null, () =>
        handler({ model: "Shipment", operation: "findMany", args, query: queryMock })
      );
      expect(passedArgs()).toEqual({ where: { id: "s1" } });
    });

    it("should_LeaveNonTenantModelsUntouched", async () => {
      await invoke("comp-A", "Company", "findMany", {});
      expect(passedArgs()?.where?.companyId).toBeUndefined();
      await invoke("comp-A", "ExchangeRate", "findFirst", {});
      expect(queryMock.mock.calls[1].arguments[0]?.where?.companyId).toBeUndefined();
    });
  });

  describe("tenant scoping on writes", () => {
    it("should_ScopeUpdateAndDeleteMany_ToTenantCompany", async () => {
      await invoke("comp-A", "Shipment", "deleteMany", {
        where: { status: "CANCELLED" },
      });
      expect(passedArgs().where).toEqual({
        status: "CANCELLED",
        companyId: "comp-A",
      });
    });

    it("should_ThrowTenantGuardError_WhenCreateTargetsAnotherCompany", () => {
      expect(() =>
        invoke("comp-A", "Shipment", "create", {
          data: { companyId: "comp-B", origin: "Istanbul" },
        })
      ).toThrow(/Tenant guard: attempted to create Shipment for another company/);
      expect(queryMock.mock.calls.length).toBe(0);
    });

    it("should_ThrowTenantGuardError_WhenUpsertCreatesForAnotherCompany", () => {
      expect(() =>
        invoke("comp-A", "Vehicle", "upsert", {
          where: { id: "v1" },
          create: { companyId: "comp-B" },
          update: {},
        })
      ).toThrow(/Tenant guard/);
    });

    it("should_AllowCreate_WhenCompanyIdMatchesTenant", async () => {
      await invoke("comp-A", "Shipment", "create", {
        data: { companyId: "comp-A", origin: "Istanbul" },
      });
      expect(queryMock.mock.calls.length).toBe(1);
      expect(passedArgs().data.companyId).toBe("comp-A");
    });

    it("should_AllowCreate_WhenNoTenantContextIsActive", async () => {
      // Auth flows (e.g. company bootstrap) run before a tenant is assigned.
      await invoke(null, "Driver", "create", {
        data: { companyId: "comp-X" },
      });
      expect(queryMock.mock.calls.length).toBe(1);
    });
  });

  describe("soft delete filtering", () => {
    it("should_HideSoftDeletedRows_OnReads", async () => {
      await invoke("comp-A", "Vehicle", "findMany", {});
      expect(passedArgs().where).toEqual({
        companyId: "comp-A",
        deletedAt: null,
      });
    });

    it("should_RespectExplicitDeletedAtFilter", async () => {
      await invoke("comp-A", "Vehicle", "findMany", {
        where: { deletedAt: { not: null } },
      });
      expect(passedArgs().where.deletedAt).toEqual({ not: null });
    });

    it("should_NotInjectDeletedAt_OnWriteOperations", async () => {
      await invoke("comp-A", "Trailer", "update", {
        where: { id: "t1" },
        data: { status: "AVAILABLE" },
      });
      expect(passedArgs().where.deletedAt).toBeUndefined();
      expect(passedArgs().where.companyId).toBe("comp-A");
    });
  });

  it("should_ReturnQueryResult_FromHandler", async () => {
    queryMock = mock.fn(async () => [{ id: "s1" }]);
    const result = await invoke("comp-A", "Shipment", "findMany", {});
    expect(result).toEqual([{ id: "s1" }]);
  });
});
