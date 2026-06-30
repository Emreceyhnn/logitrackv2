import rolesConfig from "@/roles.json";

/**
 * Role names (lowercased) whose users are confined to the Warehouse Worker
 * panel and must never reach the main dashboard.
 *
 * Scope (confirmed): only genuine warehouse staff — Warehouse Manager and
 * Warehouse Operator. We deliberately do NOT lock "Operations Manager" /
 * "Fleet Manager", who share the `role_manager` id but are not warehouse staff.
 * We therefore take every alias of `role_warehouse`, plus only the
 * `role_manager` aliases that explicitly mention "warehouse".
 */
const WAREHOUSE_ONLY_ROLE_NAMES: ReadonlySet<string> = new Set(
  rolesConfig.flatMap((r) => {
    if (r.id === "role_warehouse") {
      return (r.names ?? [r.name]).map((n) => n.toLowerCase());
    }
    if (r.id === "role_manager") {
      return (r.names ?? [r.name])
        .filter((n) => n.toLowerCase().includes("warehouse"))
        .map((n) => n.toLowerCase());
    }
    return [];
  })
);

/**
 * True when the given role name belongs to warehouse-only staff who should be
 * locked to the `/warehouse-worker` panel.
 */
export function isWarehouseOnlyRole(roleName: string | null | undefined): boolean {
  if (!roleName) return false;
  return WAREHOUSE_ONLY_ROLE_NAMES.has(roleName.trim().toLowerCase());
}
