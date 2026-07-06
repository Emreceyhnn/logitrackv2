import { PrismaClient } from "@prisma/client";
import { getTenantCompanyId } from "./tenant-context";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Models that carry a required `companyId` column. Every query against them
 * issued inside a tenant context (see `tenant-context.ts`) is automatically
 * constrained to that tenant. Manual `where: { companyId }` filters in the
 * controllers remain as a second line of defense.
 *
 * Deliberately excluded: Company (the tenant itself), User/Session/AuditLog
 * (auth flows must work before a company is assigned), Role (system roles
 * have companyId = null and are shared), ExchangeRate (global data).
 */
const TENANT_MODELS = new Set<string>([
  "Driver",
  "Vehicle",
  "MaintenanceRecord",
  "Warehouse",
  "WarehouseZone",
  "WarehouseTask",
  "Customer",
  "CustomerLocation",
  "Inventory",
  "InventoryMovement",
  "Shipment",
  "ShipmentHistory",
  "ShipmentStop",
  "ShipmentItem",
  "Route",
  "RouteStop",
  "Document",
  "FuelLog",
  "Issue",
  "Trailer",
  "TrailerAssignment",
]);

/** Models with a `deletedAt` column: reads hide soft-deleted rows by default. */
const SOFT_DELETE_MODELS = new Set<string>(["Vehicle", "Trailer"]);

const READ_OPS = new Set<string>([
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "findUnique",
  "findUniqueOrThrow",
  "count",
  "aggregate",
  "groupBy",
]);

const WHERE_OPS = new Set<string>([
  ...READ_OPS,
  "update",
  "updateMany",
  "delete",
  "deleteMany",
  "upsert",
]);

function createPrismaClient() {
  const adapter = new PrismaPg(getPool());
  return new PrismaClient({ adapter }).$extends({
    name: "tenant-guard",
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }) {
          const companyId = getTenantCompanyId();
          const isTenantModel = TENANT_MODELS.has(model);
          const isSoftDelete = SOFT_DELETE_MODELS.has(model);

          if ((isTenantModel || isSoftDelete) && WHERE_OPS.has(operation)) {
            const current = (args ?? {}) as {
              where?: Record<string, unknown>;
            };
            const extra: Record<string, unknown> = {};

            if (
              isTenantModel &&
              companyId &&
              current.where?.companyId === undefined
            ) {
              extra.companyId = companyId;
            }

            if (
              isSoftDelete &&
              READ_OPS.has(operation) &&
              current.where?.deletedAt === undefined
            ) {
              extra.deletedAt = null;
            }

            if (Object.keys(extra).length > 0) {
              args = {
                ...current,
                where: { ...current.where, ...extra },
              } as typeof args;
            }
          }

          // Block cross-tenant writes: a create inside tenant context must
          // target the caller's own company.
          if (
            isTenantModel &&
            companyId &&
            (operation === "create" || operation === "upsert")
          ) {
            const data =
              operation === "create"
                ? (args as { data?: { companyId?: unknown } }).data
                : (args as { create?: { companyId?: unknown } }).create;
            if (
              data &&
              typeof data.companyId === "string" &&
              data.companyId !== companyId
            ) {
              throw new Error(
                `Tenant guard: attempted to create ${model} for another company`
              );
            }
          }

          return query(args);
        },
      },
    },
  });
}

export type Db = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: Db;
  pgPool?: Pool;
};

/**
 * Single shared pg connection pool. Cached on `globalThis` so that Next.js
 * hot-reloads in development do not leak a new pool (and its sockets) on every
 * module re-evaluation.
 *
 * At runtime a missing DATABASE_URL is a hard error (fail fast with a clear
 * message rather than an opaque error on the first query). During `next build`
 * the module graph is evaluated for static analysis without a live database and
 * pg connects lazily, so we must NOT throw there or we would break SSG/build.
 */
function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (
    !connectionString &&
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    throw new Error(
      "DATABASE_URL is not set — cannot initialise the database pool"
    );
  }
  const pool = globalForPrisma.pgPool ?? new Pool({ connectionString });
  if (process.env.NODE_ENV !== "production") globalForPrisma.pgPool = pool;
  return pool;
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
