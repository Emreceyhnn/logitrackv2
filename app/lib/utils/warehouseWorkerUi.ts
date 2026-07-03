import type { Theme } from "@mui/material/styles";
import type { Priority } from "../type/warehouseWorkerClient";

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

export function zoneColor(pct: number, theme: Theme) {
  return pct >= 85
    ? theme.palette.error.main
    : pct >= 70
      ? theme.palette.kpi.amber
      : theme.palette.kpi.emerald;
}
