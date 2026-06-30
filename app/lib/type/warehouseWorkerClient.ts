/* eslint-disable @typescript-eslint/no-explicit-any */
export type View = "dashboard" | "scan" | "tasks" | "capacity" | "activity";
export type TaskKind = "PICK" | "PACK" | "PUT";
export type Priority = "high" | "med" | "low";

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

export const PICKS_TARGET = 240;
export const PACKS_TARGET = 180;

export const prioFromServer = (p: "LOW" | "MEDIUM" | "HIGH"): Priority =>
  p === "HIGH" ? "high" : p === "LOW" ? "low" : "med";

export function relativeTime(
  iso: string,
  ww: { justNow: string; ago: string }
): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 45) return ww.justNow;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${ww.ago}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${ww.ago}`;
  return `${Math.floor(h / 24)}d ${ww.ago}`;
}

export const I = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  scan: "M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2",
  tasks: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
  capacity: "M4 13h4v7H4zM10 8h4v12h-4zM16 4h4v16h-4z",
  activity: "M3 12h4l3-8 4 16 3-8h4",
};

export function zoneColor(pct: number, theme: any) {
  return pct >= 85 ? theme.palette.error.main : pct >= 70 ? theme.palette.kpi.amber : theme.palette.kpi.emerald;
}
export function fmtShift(seconds: number) {
  return `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
