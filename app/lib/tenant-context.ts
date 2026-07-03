import { AsyncLocalStorage } from "node:async_hooks";

export interface TenantContext {
  companyId: string | null;
}

/**
 * Ambient tenant context for the current request. Set by
 * `authenticatedAction` / `maybeAuthenticatedAction` so the Prisma client
 * extension in `db.ts` can enforce tenant scoping on every query without
 * relying on each call site remembering to add `where: { companyId }`.
 */
export const tenantContext = new AsyncLocalStorage<TenantContext>();

export function getTenantCompanyId(): string | null {
  return tenantContext.getStore()?.companyId ?? null;
}

export function runWithTenant<T>(companyId: string | null, fn: () => T): T {
  return tenantContext.run({ companyId }, fn);
}
