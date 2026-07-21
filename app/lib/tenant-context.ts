import { AsyncLocalStorage } from "node:async_hooks";

export interface TenantContext {
  companyId: string | null;
  /**
   * When true, the tenant-guard fail-closed check in `db.ts` is bypassed and
   * queries may run across every tenant. Reserved for trusted system jobs
   * (e.g. cron) that legitimately operate on all companies at once. Never set
   * this from a user-facing request path.
   */
  system?: boolean;
}

/**
 * Ambient tenant context for the current request. Set by
 * `authenticatedAction` / `maybeAuthenticatedAction` so the Prisma client
 * extension in `db.ts` can enforce tenant scoping on every query without
 * relying on each call site remembering to add `where: { companyId }`.
 */
declare global {
  // eslint-disable-next-line no-var
  var __tenantContext: AsyncLocalStorage<TenantContext> | undefined;
}

// Fix Next.js double-instantiation bug by using globalThis
const globalContext = globalThis.__tenantContext || new AsyncLocalStorage<TenantContext>();
if (process.env.NODE_ENV !== "production") {
  globalThis.__tenantContext = globalContext;
}

export const tenantContext = globalContext;

export function getTenantCompanyId(): string | null {
  return tenantContext.getStore()?.companyId ?? null;
}

/** Whether the current context is a trusted system job allowed cross-tenant access. */
export function isSystemContext(): boolean {
  return tenantContext.getStore()?.system === true;
}

export function runWithTenant<T>(companyId: string | null, fn: () => T): T {
  return tenantContext.run({ companyId }, fn);
}

/**
 * Runs `fn` in a trusted system context that bypasses the tenant-guard
 * fail-closed check, permitting cross-tenant queries. Only for internal system
 * jobs (cron, maintenance scripts) — never a user-facing request path.
 */
export function runAsSystem<T>(fn: () => T): T {
  return tenantContext.run({ companyId: null, system: true }, fn);
}
