/** Shared types for the Warehouse Worker dashboard. */

export type WarehouseTaskKind = "PICK" | "PACK" | "PUT";
export type WarehouseTaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type WorkerShiftStatus = "ACTIVE" | "BREAK" | "ENDED";

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

export interface WWShift {
  id: string | null;
  status: WorkerShiftStatus;
  startedAt: string | null;
  elapsedSeconds: number;
}

export interface WWKpis {
  picks: number;
  picksTarget: number;
  packs: number;
  packsTarget: number;
  rate: number;
  shiftAvgRate: number;
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
  shift: WWShift;
  kpis: WWKpis;
  tasks: WWTask[];
  zones: WWZone[];
  feed: WWMovement[];
  catalog: WWCatalogItem[];
  capacity: { used: number; total: number; pct: number; free: number };
}
