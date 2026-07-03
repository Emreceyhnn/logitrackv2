import type { Dictionary } from "../language/language";

export type View = "dashboard" | "scan" | "tasks" | "capacity" | "activity";
export type TaskKind = "PICK" | "PACK" | "PUT";
export type Priority = "high" | "med" | "low";

/** The `warehouseWorker` translation subtree passed around as `ww`. */
export type WarehouseWorkerDict = Dictionary["warehouseWorker"];

/** Entry of the warehouse switcher in the panel header. */
export interface WarehouseOption {
  id: string;
  name: string;
  code: string;
}

export interface Task {
  id: string;
  kind: TaskKind;
  name: string;
  order: string;
  zone: string;
  done: number;
  total: number;
  priority: Priority;
}
export interface Zone {
  name: string;
  pct: number;
}
export interface Movement {
  id: string;
  type: string;
  name: string;
  sku: string;
  qty: number;
  zone: string;
  who: string;
  self?: boolean;
  t: string;
}
export interface SkuInfo {
  sku: string;
  name: string;
  zone: string;
}
