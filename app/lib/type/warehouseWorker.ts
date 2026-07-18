/** Shared types for the Warehouse Worker dashboard. */

export type WarehouseTaskKind = "PICK" | "PACK" | "PUT";
export type WarehouseTaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface WWWorker {
  name: string;
  initials: string;
  role: string;
}

export interface WWWarehouse {
  id: string;
  name: string;
  code: string;
  city: string;
}

export interface WWKpis {
  picks: number;
  picksTarget: number;
  packs: number;
  packsTarget: number;
  rate: number;
}

export interface WWTask {
  id: string;
  kind: WarehouseTaskKind;
  name: string;
  orderRef: string;
  zone: string;
  done: number;
  total: number;
  priority: WarehouseTaskPriority;
  complete: boolean;
}

export interface WWZone {
  code: string;
  capacityPallets: number;
  usedPallets: number;
  pct: number;
}

export interface WWMovement {
  id: string;
  type: string;
  name: string;
  sku: string;
  qty: number;
  zone: string;
  who: string;
  self: boolean;
  at: string;
}

export interface WWCatalogItem {
  sku: string;
  name: string;
  zone: string;
  quantity: number;
  /** On-hand minus allocated — what's actually pickable right now. */
  available: number;
  /** Reorder threshold (0 = untracked). Low when available <= minStock. */
  minStock: number;
  lowStock: boolean;
}

/** A SKU whose available stock has fallen to/below its reorder point. */
export interface WWLowStockItem {
  sku: string;
  name: string;
  zone: string;
  available: number;
  minStock: number;
  /** Units to bring available back up to the threshold (>= 1). */
  suggestedQty: number;
}

export interface WWWarehouseOption {
  id: string;
  name: string;
  code: string;
}

export interface WarehouseWorkerDashboard {
  warehouse: WWWarehouse | null;
  warehouses: WWWarehouseOption[];
  worker: WWWorker;
  kpis: WWKpis;
  tasks: WWTask[];
  zones: WWZone[];
  feed: WWMovement[];
  catalog: WWCatalogItem[];
  /** SKUs at/below their reorder point, worst first — the proactive shortage
   *  signal the worker sees without having to scan each item. */
  lowStock: WWLowStockItem[];
  capacity: { used: number; total: number; pct: number; free: number };
}
