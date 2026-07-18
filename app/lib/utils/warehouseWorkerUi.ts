import type { Theme } from "@mui/material/styles";
import type { Priority, Task, Zone } from "../type/warehouseWorkerClient";

export const PICKS_TARGET = 240;
export const PACKS_TARGET = 180;

/** Fill thresholds — keep in step with zoneColor(). */
export const ZONE_CRITICAL_PCT = 85;
export const ZONE_WARNING_PCT = 70;

export const prioFromServer = (p: "LOW" | "MEDIUM" | "HIGH"): Priority =>
  p === "HIGH" ? "high" : p === "LOW" ? "low" : "med";

/** Sort weight for task priority — lower sorts first (high is most urgent). */
export const PRIORITY_RANK: Record<Priority, number> = {
  high: 0,
  med: 1,
  low: 2,
};

const isOpen = (t: Task) => t.done < t.total;

/**
 * Orders a task queue for "what do I do next": open tasks before completed
 * ones, then high → med → low priority. Returns a new array; stable within a
 * tier, so `sortTasksByPriority(tasks)[0]` (when open) is the next task.
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const openDelta = (isOpen(a) ? 0 : 1) - (isOpen(b) ? 0 : 1);
    if (openDelta !== 0) return openDelta;
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  });
}

/** The single highest-priority open task, or null if the queue is clear. */
export function pickNextTask(sortedTasks: Task[]): Task | null {
  return sortedTasks.find(isOpen) ?? null;
}

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
  return pct >= ZONE_CRITICAL_PCT
    ? theme.palette.error.main
    : pct >= ZONE_WARNING_PCT
      ? theme.palette.kpi.amber
      : theme.palette.kpi.emerald;
}

/** Advice for one over-full zone: stop putaway here, divert to `alternative`. */
export interface ZoneAdvice {
  /** The critical zone (>= ZONE_CRITICAL_PCT). */
  zone: string;
  pct: number;
  /** Best zone to divert to (lowest fill, below warning), or null if none. */
  alternative: Zone | null;
}

/**
 * Turns a set of zones into actionable capacity advice: for every critical zone
 * (>= ZONE_CRITICAL_PCT) tell the worker to stop putaway there and, when one
 * exists, point at the emptiest healthy zone (< ZONE_WARNING_PCT) to divert to.
 * Returns [] when nothing is critical, so callers can render conditionally.
 */
export function zoneCapacityAdvice(zones: Zone[]): ZoneAdvice[] {
  const critical = zones.filter((z) => z.pct >= ZONE_CRITICAL_PCT);
  if (critical.length === 0) return [];

  // Emptiest first; only healthy zones (below warning) are safe divert targets.
  const healthyByEmptiest = zones
    .filter((z) => z.pct < ZONE_WARNING_PCT)
    .sort((a, b) => a.pct - b.pct);

  return critical
    .sort((a, b) => b.pct - a.pct)
    .map((z) => ({
      zone: z.name,
      pct: z.pct,
      // Don't suggest diverting a zone to itself.
      alternative: healthyByEmptiest.find((h) => h.name !== z.name) ?? null,
    }));
}
