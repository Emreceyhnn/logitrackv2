"use client";



import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useWarehouseWorker } from "@/app/hooks/useWarehouseWorker";
import { warehouseWorkerKeys } from "@/app/lib/query-keys/warehouseWorker.keys";
import {
  logWarehouseMovement,
  advanceWarehouseTask,
  setWorkerShiftStatus,
  requestRestock,
  reportWarehouseIssue,
} from "@/app/lib/controllers/warehouseWorker";
import type { WWCatalogItem } from "@/app/lib/type/warehouseWorker";
import { useLanguage } from "@/app/lib/language/DictionaryContext";

/* ------------------------------- tokens ------------------------------- */

const C = {
  bg: "#0B0F19",
  rail: "#0F141F",
  card: "#161B26",
  border: "rgba(255,255,255,0.08)",
  borderSoft: "rgba(255,255,255,0.06)",
  text: "#fff",
  amber: "#f59e0b",
  green: "#34d399",
  blue: "#38bdf8",
  purple: "#a855f7",
  red: "#f44336",
  cyan: "#22d3ee",
};

type View = "dashboard" | "scan" | "tasks" | "capacity" | "activity";

type TaskKind = "PICK" | "PACK" | "PUT";
type Priority = "high" | "med" | "low";

interface Task {
  id: string;
  kind: TaskKind;
  name: string;
  order: string;
  zone: string;
  done: number;
  total: number;
  priority: Priority;
}

interface Zone {
  name: string;
  pct: number;
}

interface Movement {
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

interface SkuInfo {
  sku: string;
  name: string;
  zone: string;
}

/* ------------------------------- helpers ------------------------------- */

const PICKS_TARGET = 240;
const PACKS_TARGET = 180;

const prioFromServer = (p: "LOW" | "MEDIUM" | "HIGH"): Priority =>
  p === "HIGH" ? "high" : p === "LOW" ? "low" : "med";

function relativeTime(iso: string, ww: { justNow: string; ago: string }): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 45) return ww.justNow;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${ww.ago}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${ww.ago}`;
  return `${Math.floor(h / 24)}d ${ww.ago}`;
}

const kindMeta: Record<TaskKind, { color: string; bg: string }> = {
  PICK: { color: C.amber, bg: "rgba(245,158,11,0.14)" },
  PACK: { color: C.green, bg: "rgba(52,211,153,0.14)" },
  PUT: { color: C.blue, bg: "rgba(56,189,248,0.14)" },
};

const moveMeta: Record<string, { color: string; bg: string; label?: string }> = {
  PICK: { color: C.amber, bg: "rgba(245,158,11,0.14)" },
  PACK: { color: C.green, bg: "rgba(52,211,153,0.14)" },
  PUT: { color: C.blue, bg: "rgba(56,189,248,0.14)" },
  PUTAWAY: { color: C.blue, bg: "rgba(56,189,248,0.14)", label: "PUT" },
  RESTOCK: { color: C.cyan, bg: "rgba(34,211,238,0.14)" },
  RESTOCK_REQUEST: { color: C.cyan, bg: "rgba(34,211,238,0.14)", label: "RESTOCK" },
  STOCK_IN: { color: C.green, bg: "rgba(52,211,153,0.14)", label: "IN" },
  ADJUSTMENT: { color: C.purple, bg: "rgba(139,92,246,0.14)", label: "ADJ" },
};

const MOVE_FALLBACK = { color: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.08)" };

/** Safe lookup for an arbitrary DB movement type, with colour + short label. */
function moveMetaFor(type: string): { color: string; bg: string; label: string } {
  const m = moveMeta[type] ?? MOVE_FALLBACK;
  return { color: m.color, bg: m.bg, label: (moveMeta[type]?.label ?? type).slice(0, 8) };
}

function zoneColor(pct: number) {
  if (pct >= 85) return C.red;
  if (pct >= 70) return C.amber;
  return C.green;
}

function fmtClock(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(d: Date) {
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}
function fmtShift(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ------------------------------- icons ------------------------------- */

const I = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  scan: "M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2",
};

function Ico({ d, size = 21, sw = 2 }: { d: string; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/* ============================== component ============================== */

export default function WarehouseWorkerClient({
  locked = false,
  lang = "en",
}: {
  locked?: boolean;
  lang?: string;
}) {
  const { dict } = useLanguage();
  const ww = dict.warehouseWorker;


  const backHref = `/${lang}/overview`;
  const backLabel = ww.backToPanel;

  const queryClient = useQueryClient();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>(undefined);
  const { data } = useWarehouseWorker(selectedWarehouseId);
  const refresh = () => queryClient.invalidateQueries({ queryKey: warehouseWorkerKeys.all });

  /* -------- server-derived data (mapped to presentational shapes) -------- */
  const warehouseId = data?.warehouse?.id ?? "";
  const warehouse = data?.warehouse
    ? { name: data.warehouse.name, code: data.warehouse.code, city: data.warehouse.city }
    : { name: ww.noWarehouseAssigned, code: "—", city: "—" };
  const worker = data?.worker ?? { name: "—", initials: "WW", role: ww.warehouseWorker };
  const warehouseOptions = data?.warehouses ?? [];
  const catalog: WWCatalogItem[] = useMemo(() => data?.catalog ?? [], [data?.catalog]);

  const picks = data?.kpis.picks ?? 0;
  const packs = data?.kpis.packs ?? 0;
  const rate = data?.kpis.rate ?? 0;
  const picksTarget = data?.kpis.picksTarget ?? PICKS_TARGET;
  const packsTarget = data?.kpis.packsTarget ?? PACKS_TARGET;
  const shiftAvgRate = data?.kpis.shiftAvgRate ?? 0;

  const tasks: Task[] = (data?.tasks ?? []).map((t) => ({
    id: t.id,
    kind: t.kind,
    name: t.name,
    order: t.orderRef,
    zone: t.zone,
    done: t.done,
    total: t.total,
    priority: prioFromServer(t.priority),
  }));

  const zones: Zone[] = (data?.zones ?? []).map((z) => ({ name: z.code, pct: z.pct }));

  const feed: Movement[] = (data?.feed ?? []).map((m) => ({
    id: m.id,
    type: m.type,
    name: m.name,
    sku: m.sku,
    qty: m.qty,
    zone: m.zone,
    who: m.self ? ww.dashboard.you : (m.who === "System" ? ww.dashboard.system : m.who),
    self: m.self,
    t: relativeTime(m.at, ww),
  }));

  const onBreak = data?.shift.status === "BREAK";

  /* ------------------------------- ui state ------------------------------- */
  const [view, setView] = useState<View>("dashboard");
  const [currentZone, setCurrentZone] = useState("A");

  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<SkuInfo | null>(null);
  const [scanQty, setScanQty] = useState(1);

  const [toast, setToast] = useState<{ msg: string; tone: string } | null>(null);

  const [now, setNow] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Reconcile UI state with freshly fetched data during render (the codebase's
   * "adjust state during render" pattern — see sidebar/listItem.tsx), avoiding
   * the set-state-in-effect anti-pattern. Pure: only setState, no refs/Date.
   */
  const zonesKey = zones.map((z) => z.name).join(",");
  const [prevZonesKey, setPrevZonesKey] = useState<string | null>(null);
  if (prevZonesKey !== zonesKey) {
    setPrevZonesKey(zonesKey);
    if (zones.length && !zones.some((z) => z.name === currentZone)) {
      setCurrentZone(zones[0].name);
    }
  }

  // Reset the local seconds counter whenever the server re-reports the shift.
  const shiftElapsed = data?.shift.elapsedSeconds ?? 0;
  const shiftKey = `${data?.shift.startedAt ?? ""}|${data?.shift.status ?? ""}|${shiftElapsed}`;
  const [prevShiftKey, setPrevShiftKey] = useState<string | null>(null);
  if (prevShiftKey !== shiftKey) {
    setPrevShiftKey(shiftKey);
    setTick(0);
  }
  const shiftSec = shiftElapsed + tick;

  /* clock + shift timer */
  useEffect(() => {
    queueMicrotask(() => setNow(new Date()));
    const t = setInterval(() => {
      setNow(new Date());
      if (!onBreak) setTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [onBreak]);

  const showToast = (msg: string, tone = C.green) => {
    setToast({ msg, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  /* ----------------------------- derived ----------------------------- */
  const openTasks = tasks.filter((t) => t.done < t.total).length;
  const highCount = tasks.filter((t) => t.priority === "high" && t.done < t.total).length;
  const picksPct = picksTarget ? Math.min(100, Math.round((picks / picksTarget) * 100)) : 0;
  const packsPct = packsTarget ? Math.min(100, Math.round((packs / packsTarget) * 100)) : 0;

  const capUsed = data?.capacity.used ?? 0;
  const capTotal = data?.capacity.total ?? 0;
  const capacityPct = data?.capacity.pct ?? 0;
  const anyCritical = zones.some((z) => z.pct >= 85);

  const status = onBreak
    ? { label: ww.status.onBreak, color: C.amber, bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", dot: C.amber, action: ww.status.resumeShift }
    : { label: ww.status.activeOnShift, color: C.green, bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)", dot: C.green, action: ww.status.takeABreak };

  /* ----------------------------- handlers ----------------------------- */
  const lookupSku = (raw: string): SkuInfo => {
    const q = raw.trim().toUpperCase();
    const hit = catalog.find((s) => s.sku.toUpperCase() === q || s.name.toUpperCase().includes(q));
    return hit ?? { sku: q.startsWith("SKU") ? q : `SKU-${q || "00000"}`, name: ww.unrecognizedItem, zone: currentZone };
  };

  const doScan = (raw: string) => {
    if (onBreak) {
      showToast(ww.resumeShiftToLog, C.amber);
      return;
    }
    if (!raw.trim()) return;
    const info = lookupSku(raw);
    setScanResult(info);
    setScanQty(1);
    setScanInput("");
    setCurrentZone(info.zone);
  };

  const simScan = () => {
    if (!catalog.length) {
      showToast(ww.noInventoryToScan, C.amber);
      return;
    }
    const pick = catalog[Math.floor(Math.random() * catalog.length)];
    doScan(pick.sku);
  };

  const log = async (kind: "PICK" | "PACK") => {
    if (!scanResult || !warehouseId) return;
    const qty = scanQty;
    const result = scanResult;
    setScanResult(null);
    setScanQty(1);
    try {
      await logWarehouseMovement(warehouseId, result.sku, qty, kind);
      showToast(`ww.logged ${kind.toLowerCase()} · ${qty} × ${result.sku}`, kind === "PICK" ? C.amber : C.green);
      await refresh();
    } catch {
      showToast(ww.couldNotLog, C.red);
    }
  };

  const advanceTask = async (id: string) => {
    try {
      const res = await advanceWarehouseTask(id);
      if (res.complete) showToast(ww.taskComplete, C.green);
      await refresh();
    } catch {
      showToast(ww.couldNotUpdateTask, C.red);
    }
  };

  const toggleShift = async () => {
    try {
      await setWorkerShiftStatus(onBreak ? "ACTIVE" : "BREAK");
      await refresh();
    } catch {
      showToast(ww.couldNotUpdateShift, C.red);
    }
  };

  const onRestock = async () => {
    if (!warehouseId) return;
    try {
      await requestRestock(warehouseId, currentZone);
      showToast(`ww.restockRequested · Zone ${currentZone}`, C.cyan);
      await refresh();
    } catch {
      showToast(ww.couldNotRequestRestock, C.red);
    }
  };

  const onReport = async () => {
    if (!warehouseId) return;
    try {
      await reportWarehouseIssue(warehouseId, `Floor issue — Zone ${currentZone}`);
      showToast(ww.issueReported, C.red);
      await refresh();
    } catch {
      showToast(ww.couldNotReportIssue, C.red);
    }
  };

  const onEndShift = async () => {
    try {
      await setWorkerShiftStatus("ENDED");
      showToast(ww.shiftSummarySaved, C.green);
      await refresh();
    } catch {
      showToast(ww.couldNotEndShift, C.red);
    }
  };

  /* ------------------------------- nav ------------------------------- */
  const NAV: { key: View; title: string; d: string; sw?: number }[] = [
    { key: "dashboard", title: ww.nav.overview, d: I.grid },
    { key: "scan", title: ww.nav.scan, d: I.scan },
    { key: "tasks", title: ww.nav.tasks, d: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" },
    { key: "capacity", title: ww.nav.capacity, d: "M4 13h4v7H4zM10 8h4v12h-4zM16 4h4v16h-4z" },
    { key: "activity", title: ww.nav.activity, d: "M3 12h4l3-8 4 16 3-8h4" },
  ];

  /* ------------------------------- styles ------------------------------- */
  const card: CSSProperties = {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  };
  const sectionTitle: CSSProperties = { font: "700 16px/1 'Poppins',sans-serif", letterSpacing: "-0.01em", color: C.text };
  const eyebrow: CSSProperties = {
    font: "700 10px/1 'Poppins',sans-serif",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.38)",
    marginBottom: 10,
  };

  const iconBadge = (color: string): CSSProperties => ({
    width: 36,
    height: 36,
    borderRadius: 11,
    background: `${color}1f`,
    color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  /* =============================== render =============================== */
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: C.bg,
        color: C.text,
        fontFamily: "'Poppins',system-ui,sans-serif",
      }}
    >
      <style>{`
        @keyframes ww-feedin{0%{opacity:0;transform:translateY(-10px)}100%{opacity:1;transform:none}}
        @keyframes ww-livedot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}
        @keyframes ww-toastin{0%{opacity:0;transform:translate(-50%,12px)}100%{opacity:1;transform:translate(-50%,0)}}
        .ww-scroll::-webkit-scrollbar{width:9px;height:9px}
        .ww-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:9px;border:2px solid ${C.bg}}
      `}</style>

      {/* ============ SIDEBAR RAIL ============ */}
      <div
        style={{
          width: 86,
          flexShrink: 0,
          background: C.rail,
          borderRight: `1px solid ${C.borderSoft}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "18px 0",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "linear-gradient(135deg,#38bdf8 0%,#6366f1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 16px rgba(56,189,248,0.3)",
            marginBottom: 14,
            color: "#fff",
          }}
        >
          <Ico d="M3 21h18M4 21V9l8-4 8 4v12M9 21v-6h6v6" size={22} sw={2.2} />
        </div>

        {NAV.map((n) => {
          const active = view === n.key;
          return (
            <button
              key={n.key}
              title={n.title}
              onClick={() => setView(n.key)}
              style={{
                width: 48,
                height: 48,
                border: "none",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                color: active ? "#fff" : "rgba(255,255,255,0.5)",
                background: active ? "rgba(56,189,248,0.16)" : "transparent",
                boxShadow: active ? "0 6px 16px rgba(56,189,248,0.18)" : "none",
              }}
            >
              {active && (
                <div style={{ position: "absolute", left: -18, width: 4, height: 24, borderRadius: 4, background: C.blue }} />
              )}
              <Ico d={n.d} />
            </button>
          );
        })}

        {!locked && (
          <Link
            href={backHref}
            title={backLabel}
            aria-label={backLabel}
            style={{
              marginTop: "auto",
              width: 48,
              height: 48,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              textDecoration: "none",
            }}
          >
            <Ico d="M19 12H5M12 19l-7-7 7-7" size={20} sw={2.2} />
          </Link>
        )}

        <div style={{ marginTop: locked ? "auto" : 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#1e293b,#0f172a)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "800 14px 'Poppins'",
              color: "#cbd5f5",
            }}
          >
            {worker.initials}
            <span
              style={{
                position: "absolute",
                bottom: -1,
                right: -1,
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: status.dot,
                border: `2.5px solid ${C.rail}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ============ MAIN COLUMN ============ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* HEADER */}
        <div
          style={{
            height: 78,
            flexShrink: 0,
            background: C.rail,
            borderBottom: `1px solid ${C.borderSoft}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0, flex: "1 1 auto", overflow: "hidden" }}>
            {!locked && (
              <Link
                href={backHref}
                title={backLabel}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  flexShrink: 0,
                  font: "700 12px/1 'Poppins'",
                  color: "rgba(255,255,255,0.6)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "9px 13px",
                  borderRadius: 11,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                <Ico d="M19 12H5M12 19l-7-7 7-7" size={15} sw={2.4} />
                {backLabel}
              </Link>
            )}
            <div style={{ ...iconBadge(C.blue), width: 46, height: 46, borderRadius: 14, flexShrink: 0 }}>
              <Ico d="M3 21h18M4 21V9l8-4 8 4v12M9 21v-6h6v6" size={24} />
            </div>
            <div style={{ minWidth: 0, flex: "1 1 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <span
                  style={{
                    font: "700 19px/1 'Poppins'",
                    letterSpacing: "-0.02em",
                    color: "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                  }}
                >
                  {warehouse.name}
                </span>
                <span
                  style={{
                    font: "600 11px/1 'JetBrains Mono',monospace",
                    color: C.blue,
                    background: "rgba(56,189,248,0.12)",
                    padding: "4px 8px",
                    borderRadius: 7,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {warehouse.code}
                </span>
                {warehouseOptions.length > 1 ? (
                  <select
                    value={data?.warehouse?.id ?? ""}
                    onChange={(e) => setSelectedWarehouseId(e.target.value || undefined)}
                    title={lang === "tr" ? "Depo değiştir" : "Switch warehouse"}
                    style={{
                      flexShrink: 0,
                      maxWidth: 220,
                      font: "700 10px/1 'Poppins'",
                      letterSpacing: "0.04em",
                      color: "rgba(255,255,255,0.75)",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      padding: "6px 8px",
                      borderRadius: 7,
                      cursor: "pointer",
                      outline: "none",
                      appearance: "none",
                    }}
                  >
                    {warehouseOptions.map((w) => (
                      <option key={w.id} value={w.id} style={{ background: C.rail, color: "#fff" }}>
                        {w.code} — {w.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      font: "700 10px/1 'Poppins'",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.55)",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      padding: "4px 8px 4px 6px",
                      borderRadius: 7,
                    }}
                  >
                    <Ico d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" size={11} sw={2.2} />
                    Your site
                  </span>
                )}
              </div>
              <div style={{ font: "500 12px/1 'Poppins'", color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
                {warehouse.city} · Aisles 1–48
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <button
              onClick={toggleShift}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                font: "700 12px/1 'Poppins'",
                letterSpacing: "0.03em",
                color: status.color,
                background: status.bg,
                border: `1px solid ${status.border}`,
                padding: "9px 14px",
                borderRadius: 11,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: status.dot }} />
              {status.label}
            </button>
            <div style={{ textAlign: "right", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 18 }}>
              <div style={{ font: "600 10px/1 'Poppins'", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: 6 }}>
                On shift
              </div>
              <div style={{ font: "600 18px/1 'JetBrains Mono',monospace", color: "#fff" }}>{fmtShift(shiftSec)}</div>
              <div style={{ font: "500 11px/1 'Poppins'", color: "rgba(255,255,255,0.4)", marginTop: 6, whiteSpace: "nowrap" }}>
                {now ? `${fmtClock(now)} · ${fmtDate(now)}` : "—"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 18 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#1e293b,#0f172a)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  font: "800 13px 'Poppins'",
                  color: "#cbd5f5",
                }}
              >
                {worker.initials}
              </div>
              <div>
                <div style={{ font: "700 13px/1 'Poppins'", color: "#fff" }}>{worker.name}</div>
                <div style={{ font: "500 11px/1 'Poppins'", color: "rgba(255,255,255,0.42)", marginTop: 4 }}>{worker.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLL CONTENT */}
        <div className="ww-scroll" style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {view === "dashboard" && (
            <DashboardView
              card={card}
              sectionTitle={sectionTitle}
              eyebrow={eyebrow}
              iconBadge={iconBadge}
              picks={picks}
              packs={packs}
              picksTarget={picksTarget}
              packsTarget={packsTarget}
              picksPct={picksPct}
              packsPct={packsPct}
              rate={rate}
              shiftAvgRate={shiftAvgRate}
              openTasks={openTasks}
              highCount={highCount}
              currentZone={currentZone}
              onBreak={onBreak}
              scanInput={scanInput}
              setScanInput={setScanInput}
              scanResult={scanResult}
              scanQty={scanQty}
              setScanQty={setScanQty}
              onScanSubmit={() => doScan(scanInput)}
              onSimScan={simScan}
              onClearScan={() => setScanResult(null)}
              onLog={log}
              tasks={tasks}
              onAdvance={advanceTask}
              capacityPct={capacityPct}
              capUsed={capUsed}
              capTotal={capTotal}
              anyCritical={anyCritical}
              zones={zones}
              status={status}
              onToggleStatus={toggleShift}
              zoneNames={zones.map((z) => z.name)}
              setCurrentZone={setCurrentZone}
              onRestock={onRestock}
              onReport={onReport}
              onEndShift={onEndShift}
              feed={feed}
            />
          )}

          {view === "scan" && (
            <ScanView
              card={card}
              iconBadge={iconBadge}
              onBreak={onBreak}
              currentZone={currentZone}
              scanInput={scanInput}
              setScanInput={setScanInput}
              scanResult={scanResult}
              scanQty={scanQty}
              setScanQty={setScanQty}
              onScanSubmit={() => doScan(scanInput)}
              onSimScan={simScan}
              onClearScan={() => setScanResult(null)}
              onLog={log}
              feed={feed.filter((m) => m.self)}
            />
          )}

          {view === "tasks" && (
            <TasksView card={card} iconBadge={iconBadge} tasks={tasks} onAdvance={advanceTask} openTasks={openTasks} highCount={highCount} />
          )}

          {view === "capacity" && (
            <CapacityView card={card} zones={zones} capacityPct={capacityPct} capUsed={capUsed} capTotal={capTotal} anyCritical={anyCritical} />
          )}

          {view === "activity" && <ActivityView card={card} iconBadge={iconBadge} feed={feed} />}
        </div>
      </div>

      {/* ============ TOAST ============ */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 11,
            background: "#1f2633",
            border: `1px solid ${toast.tone}55`,
            borderLeft: `4px solid ${toast.tone}`,
            color: "#fff",
            font: "600 13px 'Poppins'",
            padding: "13px 18px",
            borderRadius: 12,
            boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
            animation: "ww-toastin .3s ease",
            zIndex: 50,
          }}
        >
          <span style={{ color: toast.tone }}>
            <Ico d="M20 6 9 17l-5-5" size={16} sw={2.6} />
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* =============================== sub-views =============================== */

const cardHeader = (
  iconBadge: (c: string) => CSSProperties,
  color: string,
  d: string,
  title: string,
  right?: React.ReactNode
) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px 16px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={iconBadge(color)}>
        <Ico d={d} size={19} />
      </div>
      <span style={{ font: "700 16px/1 'Poppins'", letterSpacing: "-0.01em", color: "#fff" }}>{title}</span>
    </div>
    {right}
  </div>
);

function KpiCard({
  label,
  accent,
  d,
  value,
  sub,
  pct,
}: {
  label: string;
  accent: string;
  d: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  pct?: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: "20px 22px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${accent},${accent}4d)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ font: "800 11px/1 'Poppins'", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>{label}</span>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: `${accent}1f`, color: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ico d={d} size={19} />
        </div>
      </div>
      <div style={{ marginTop: 14 }}>{value}</div>
      {pct != null && (
        <div style={{ height: 5, borderRadius: 5, background: "rgba(255,255,255,0.07)", marginTop: 14, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 5, background: accent, width: `${pct}%`, transition: "width .5s cubic-bezier(.4,0,.2,1)" }} />
        </div>
      )}
      {sub && <div style={{ font: "600 12px/1 'Poppins'", color: "rgba(255,255,255,0.4)", marginTop: 16 }}>{sub}</div>}
    </div>
  );
}

interface DashProps {
  card: CSSProperties;
  sectionTitle: CSSProperties;
  eyebrow: CSSProperties;
  iconBadge: (c: string) => CSSProperties;
  picks: number;
  packs: number;
  picksTarget: number;
  packsTarget: number;
  picksPct: number;
  packsPct: number;
  rate: number;
  shiftAvgRate: number;
  openTasks: number;
  highCount: number;
  currentZone: string;
  onBreak: boolean;
  scanInput: string;
  setScanInput: (v: string) => void;
  scanResult: SkuInfo | null;
  scanQty: number;
  setScanQty: (fn: (q: number) => number) => void;
  onScanSubmit: () => void;
  onSimScan: () => void;
  onClearScan: () => void;
  onLog: (k: "PICK" | "PACK") => void;
  tasks: Task[];
  onAdvance: (id: string) => void;
  capacityPct: number;
  capUsed: number;
  capTotal: number;
  anyCritical: boolean;
  zones: Zone[];
  status: { label: string; color: string; bg: string; border: string; dot: string; action: string };
  onToggleStatus: () => void;
  zoneNames: string[];
  setCurrentZone: (z: string) => void;
  onRestock: () => void;
  onReport: () => void;
  onEndShift: () => void;
  feed: Movement[];
}

function DashboardView(p: DashProps) {
  const { dict } = useLanguage();
  const ww = dict.warehouseWorker;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPI STRIP */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
        <KpiCard
          label="Picks today"
          accent={C.amber}
          d="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2"
          pct={p.picksPct}
          value={
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{ font: "900 34px/1 'Poppins'", letterSpacing: "-0.04em", color: "#fff" }}>{p.picks}</div>
              <div style={{ font: "600 13px/1 'Poppins'", color: "rgba(255,255,255,0.35)" }}>/ {p.picksTarget}</div>
            </div>
          }
        />
        <KpiCard
          label="Packs today"
          accent={C.green}
          d="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8"
          pct={p.packsPct}
          value={
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{ font: "900 34px/1 'Poppins'", letterSpacing: "-0.04em", color: "#fff" }}>{p.packs}</div>
              <div style={{ font: "600 13px/1 'Poppins'", color: "rgba(255,255,255,0.35)" }}>/ {p.packsTarget}</div>
            </div>
          }
        />
        <KpiCard
          label="Open lines"
          accent={C.blue}
          d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"
          value={<div style={{ font: "900 34px/1 'Poppins'", letterSpacing: "-0.04em", color: "#fff" }}>{p.openTasks}</div>}
          sub={
            <span>
              <span style={{ color: C.red }}>●</span> {p.highCount} high priority
            </span>
          }
        />
        <KpiCard
          label="Throughput"
          accent={C.purple}
          d="M3 17l6-6 4 4 8-8M15 7h6v6"
          value={
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <div style={{ font: "900 34px/1 'Poppins'", letterSpacing: "-0.04em", color: "#fff" }}>{p.rate}</div>
              <div style={{ font: "600 12px/1 'Poppins'", color: "rgba(255,255,255,0.35)" }}>units/hr</div>
            </div>
          }
          sub={`Shift avg ${p.shiftAvgRate}/hr`}
        />
      </div>

      {/* MAIN TWO COLUMN */}
      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 20, alignItems: "start" }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          {/* SCAN & LOG */}
          <div style={{ ...p.card, overflow: "hidden" }}>
            {cardHeader(
              p.iconBadge,
              C.blue,
              I.scan,
              "Scan & log",
              <span style={{ font: "700 11px/1 'Poppins'", letterSpacing: "0.04em", color: C.blue, background: "rgba(56,189,248,0.1)", padding: "6px 11px", borderRadius: 9 }}>
                Pick zone {p.currentZone}
              </span>
            )}
            <div style={{ borderTop: `1px solid ${C.borderSoft}`, padding: "20px 22px" }}>
              <ScanInner
                onBreak={p.onBreak}
                scanInput={p.scanInput}
                setScanInput={p.setScanInput}
                scanResult={p.scanResult}
                scanQty={p.scanQty}
                setScanQty={p.setScanQty}
                onScanSubmit={p.onScanSubmit}
                onSimScan={p.onSimScan}
                onClearScan={p.onClearScan}
                onLog={p.onLog}
              />
            </div>
          </div>

          {/* TASK QUEUE */}
          <div style={{ ...p.card, overflow: "hidden" }}>
            {cardHeader(
              p.iconBadge,
              C.blue,
              "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
              "My task queue",
              <span style={{ font: "700 11px/1 'Poppins'", color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.06)", padding: "6px 11px", borderRadius: 9 }}>
                {p.openTasks} open
              </span>
            )}
            <div style={{ borderTop: `1px solid ${C.borderSoft}` }}>
              {p.tasks.map((t) => (
                <TaskRow key={t.id} t={t} onAdvance={p.onAdvance} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          {/* CAPACITY */}
          <div style={{ ...p.card, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={p.iconBadge(C.blue)}>
                  <Ico d="M4 13h4v7H4zM10 8h4v12h-4zM16 4h4v16h-4z" size={19} />
                </div>
                <span style={p.sectionTitle}>Site capacity</span>
              </div>
              {p.anyCritical && (
                <span style={{ font: "700 10px/1 'Poppins'", letterSpacing: "0.05em", textTransform: "uppercase", color: C.red, background: "rgba(244,67,54,0.12)", padding: "5px 9px", borderRadius: 7 }}>
                  Zone near full
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: `conic-gradient(${zoneColor(p.capacityPct)} ${p.capacityPct * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background .5s ease",
                }}
              >
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: C.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ font: "900 28px/1 'Poppins'", letterSpacing: "-0.03em", color: "#fff" }}>{p.capacityPct}%</div>
                  <div style={{ font: "700 9px/1 'Poppins'", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginTop: 5 }}>{ww.capacityView.used}</div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "600 12px/1 'Poppins'", color: "rgba(255,255,255,0.4)" }}>Pallet positions</div>
                <div style={{ font: "800 22px/1 'Poppins'", color: "#fff", marginTop: 8, letterSpacing: "-0.02em" }}>
                  {p.capUsed.toLocaleString()} <span style={{ font: "600 14px 'Poppins'", color: "rgba(255,255,255,0.35)" }}>/ {p.capTotal.toLocaleString()}</span>
                </div>
                <div style={{ font: "500 12px/1.4 'Poppins'", color: "rgba(255,255,255,0.42)", marginTop: 10 }}>
                  {(p.capTotal - p.capUsed).toLocaleString()} positions free across {p.zones.length} zones
                </div>
              </div>
            </div>
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${C.borderSoft}`, display: "flex", flexDirection: "column", gap: 13 }}>
              {p.zones.map((z) => (
                <ZoneBar key={z.name} z={z} active={z.name === p.currentZone} />
              ))}
            </div>
          </div>

          {/* CONTROL PANEL */}
          <div style={{ ...p.card, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={p.iconBadge(C.purple)}>
                <Ico d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h12M20 18h0" size={19} />
              </div>
              <span style={p.sectionTitle}>Control panel</span>
            </div>

            <div style={p.eyebrow}>{ww.dashboard.shiftStatus}</div>
            <button
              onClick={p.onToggleStatus}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 16px",
                borderRadius: 13,
                cursor: "pointer",
                background: p.status.bg,
                border: `1px solid ${p.status.border}`,
                color: p.status.color,
                marginBottom: 18,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 9, font: "700 13px 'Poppins'" }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: p.status.dot }} />
                {p.status.label}
              </span>
              <span style={{ font: "600 11px 'Poppins'", opacity: 0.8 }}>{p.status.action}</span>
            </button>

            <div style={p.eyebrow}>Active pick zone</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
              {p.zoneNames.map((z) => {
                const on = z === p.currentZone;
                return (
                  <button
                    key={z}
                    onClick={() => p.setCurrentZone(z)}
                    style={{
                      padding: "11px 0",
                      borderRadius: 11,
                      cursor: "pointer",
                      font: "700 13px 'Poppins'",
                      border: `1px solid ${on ? "rgba(56,189,248,0.4)" : "rgba(255,255,255,0.1)"}`,
                      background: on ? "rgba(56,189,248,0.16)" : "rgba(255,255,255,0.03)",
                      color: on ? C.blue : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {z}
                  </button>
                );
              })}
            </div>

            <div style={p.eyebrow}>Quick actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <QuickAction color={C.cyan} d="M12 3v11M8 10l4 4 4-4M4 21h16" label={`Request restock — Zone ${p.currentZone}`} onClick={p.onRestock} />
              <QuickAction color="#f87171" d="M12 3 2 20h20L12 3zM12 10v4M12 17h.01" label="Report an issue" onClick={p.onReport} bg="rgba(244,67,54,0.08)" border="rgba(244,67,54,0.22)" />
              <QuickAction color="rgba(255,255,255,0.65)" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" label={ww.dashboard.endShiftSave} onClick={p.onEndShift} bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.1)" />
            </div>
          </div>
        </div>
      </div>

      {/* LIVE FEED */}
      <LiveFeed card={p.card} iconBadge={p.iconBadge} feed={p.feed} />
    </div>
  );
}

function QuickAction({ color, d, label, onClick, bg, border }: { color: string; d: string; label: string; onClick: () => void; bg?: string; border?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "12px 15px",
        borderRadius: 12,
        cursor: "pointer",
        background: bg ?? "rgba(34,211,238,0.08)",
        border: `1px solid ${border ?? "rgba(34,211,238,0.22)"}`,
        color,
        font: "700 13px 'Poppins'",
        textAlign: "left",
      }}
    >
      <Ico d={d} size={17} sw={2.2} />
      {label}
    </button>
  );
}

function ScanInner({
  onBreak,
  scanInput,
  setScanInput,
  scanResult,
  scanQty,
  setScanQty,
  onScanSubmit,
  onSimScan,
  onClearScan,
  onLog,
}: {
  onBreak: boolean;
  scanInput: string;
  setScanInput: (v: string) => void;
  scanResult: SkuInfo | null;
  scanQty: number;
  setScanQty: (fn: (q: number) => number) => void;
  onScanSubmit: () => void;
  onSimScan: () => void;
  onClearScan: () => void;
  onLog: (k: "PICK" | "PACK") => void;
}) {
  return (
    <>
      {!scanResult && (
        <>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 13, padding: "0 16px", height: 56 }}>
              <span style={{ color: "rgba(255,255,255,0.45)" }}>
                <Ico d="M4 7V6a1 1 0 0 1 1-1h1M18 5h1a1 1 0 0 1 1 1v1M20 17v1a1 1 0 0 1-1 1h-1M6 19H5a1 1 0 0 1-1-1v-1M7 8v8M10.5 8v8M14 8v8M17 8v8" size={22} />
              </span>
              <input
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onScanSubmit()}
                placeholder="Scan barcode or type a SKU…"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", font: "600 16px 'Poppins'", letterSpacing: "0.01em" }}
              />
            </div>
            <button onClick={onScanSubmit} style={{ height: 56, padding: "0 26px", border: "none", borderRadius: 13, background: "#0284c7", color: "#fff", font: "800 13px 'Poppins'", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer" }}>
              Scan
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
            <span style={{ font: "500 12px/1.4 'Poppins'", color: "rgba(255,255,255,0.38)" }}>Press Enter to confirm, or use the handheld scanner.</span>
            <button onClick={onSimScan} style={{ font: "600 12px 'Poppins'", color: C.blue, background: "transparent", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 9, padding: "7px 13px", cursor: "pointer" }}>
              Simulate scan
            </button>
          </div>
        </>
      )}

      {scanResult && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ font: "600 12px/1 'JetBrains Mono',monospace", color: C.blue }}>{scanResult.sku}</span>
                <span style={{ font: "700 10px/1 'Poppins'", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", padding: "4px 8px", borderRadius: 6 }}>
                  Zone {scanResult.zone}
                </span>
              </div>
              <div style={{ font: "600 18px/1.2 'Poppins'", color: "#fff", marginTop: 8 }}>{scanResult.name}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: 5, flexShrink: 0 }}>
              <button onClick={() => setScanQty((q) => Math.max(1, q - 1))} style={qtyBtn}>−</button>
              <div style={{ width: 54, textAlign: "center", font: "800 22px 'Poppins'", color: "#fff" }}>{scanQty}</div>
              <button onClick={() => setScanQty((q) => q + 1)} style={qtyBtn}>+</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <button onClick={() => onLog("PICK")} style={{ ...logBtn, background: C.amber, color: "#1a1205" }}>
              <Ico d="M12 5v14M5 12l7 7 7-7" size={19} sw={2.4} />
              Log pick
            </button>
            <button onClick={() => onLog("PACK")} style={{ ...logBtn, background: C.green, color: "#052e22" }}>
              <Ico d="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5" size={19} sw={2.4} />
              Log pack
            </button>
            <button onClick={onClearScan} title="Cancel" style={{ width: 54, height: 54, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 13, background: "transparent", color: "rgba(255,255,255,0.5)", font: "400 22px 'Poppins'", cursor: "pointer" }}>
              ×
            </button>
          </div>
        </>
      )}

      {onBreak && (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 9, font: "600 12px 'Poppins'", color: C.amber, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 11, padding: "11px 14px" }}>
          <Ico d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M10 9v6M14 9v6" size={16} sw={2.2} />
          You&apos;re on break — resume your shift to log movements.
        </div>
      )}
    </>
  );
}

const qtyBtn: CSSProperties = {
  width: 38,
  height: 38,
  border: "none",
  borderRadius: 9,
  background: "rgba(255,255,255,0.07)",
  color: "#fff",
  font: "700 20px 'Poppins'",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const logBtn: CSSProperties = {
  flex: 1,
  height: 54,
  border: "none",
  borderRadius: 13,
  font: "800 14px 'Poppins'",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
};

function TaskRow({ t, onAdvance }: { t: Task; onAdvance: (id: string) => void }) {
  const { dict } = useLanguage();
  const ww = dict.warehouseWorker;
  const km = kindMeta[t.kind];
  const prioMeta: Record<Priority, { color: string; bg: string; label: string }> = {
    high: { color: "#fca5a5", bg: "rgba(244,67,54,0.14)", label: ww.high },
    med: { color: "#fcd34d", bg: "rgba(245,158,11,0.12)", label: ww.med },
    low: { color: "rgba(255,255,255,0.55)", bg: "rgba(255,255,255,0.06)", label: ww.low },
  };
  const pm = prioMeta[t.priority];
  const pct = Math.round((t.done / t.total) * 100);
  const complete = t.done >= t.total;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 150px 168px",
        gap: 16,
        alignItems: "center",
        padding: "15px 22px",
        borderBottom: `1px solid rgba(255,255,255,0.04)`,
        opacity: complete ? 0.55 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <span style={{ font: "800 10px/1 'Poppins'", letterSpacing: "0.05em", color: km.color, background: km.bg, padding: "6px 9px", borderRadius: 8, flexShrink: 0 }}>{t.kind}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ font: "600 14px/1.2 'Poppins'", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
          <div style={{ font: "500 11px/1 'Poppins'", color: "rgba(255,255,255,0.4)", marginTop: 5 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{t.order}</span> · Zone {t.zone}
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", font: "600 11px/1 'Poppins'", color: "rgba(255,255,255,0.5)", marginBottom: 7 }}>
          <span>
            {t.done}/{t.total}
          </span>
          <span style={{ color: km.color }}>{pct}%</span>
        </div>
        <div style={{ height: 5, borderRadius: 5, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 5, background: km.color, width: `${pct}%`, transition: "width .4s ease" }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
        <span style={{ font: "700 9px/1 'Poppins'", letterSpacing: "0.06em", textTransform: "uppercase", color: pm.color, background: pm.bg, padding: "5px 8px", borderRadius: 6 }}>{pm.label}</span>
        <button
          onClick={() => onAdvance(t.id)}
          disabled={complete}
          style={{
            font: "700 12px 'Poppins'",
            padding: "9px 16px",
            borderRadius: 10,
            cursor: complete ? "default" : "pointer",
            border: `1px solid ${complete ? "rgba(52,211,153,0.3)" : km.color + "55"}`,
            background: complete ? "rgba(52,211,153,0.12)" : km.bg,
            color: complete ? C.green : km.color,
            whiteSpace: "nowrap",
          }}
        >
          {complete ? "Done" : "Advance"}
        </button>
      </div>
    </div>
  );
}

function ZoneBar({ z, active }: { z: Zone; active: boolean }) {
  const color = zoneColor(z.pct);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ font: "600 12px/1 'Poppins'", color: active ? "#fff" : "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
          Zone {z.name}
          {active && <span style={{ font: "700 9px 'Poppins'", color: C.blue, background: "rgba(56,189,248,0.12)", padding: "2px 6px", borderRadius: 5 }}>ACTIVE</span>}
        </span>
        <span style={{ font: "700 12px/1 'JetBrains Mono',monospace", color }}>{z.pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 6, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 6, background: color, width: `${z.pct}%`, transition: "width .4s ease" }} />
      </div>
    </div>
  );
}

function LiveFeed({ card, iconBadge, feed }: { card: CSSProperties; iconBadge: (c: string) => CSSProperties; feed: Movement[] }) {
  return (
    <div style={{ ...card, overflow: "hidden" }}>
      {cardHeader(
        iconBadge,
        C.purple,
        "M3 12h4l3-8 4 16 3-8h4",
        "Live stock movements",
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, font: "700 11px/1 'Poppins'", letterSpacing: "0.06em", textTransform: "uppercase", color: C.green }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "ww-livedot 1.6s ease-in-out infinite" }} />
          Live
        </span>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "96px 1fr 90px 90px 130px 96px",
          gap: 14,
          padding: "11px 22px",
          borderTop: `1px solid ${C.borderSoft}`,
          borderBottom: `1px solid ${C.borderSoft}`,
          font: "800 10px/1 'Poppins'",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.38)",
        }}
      >
        <span>Type</span>
        <span>Item</span>
        <span style={{ textAlign: "right" }}>Qty</span>
        <span>Zone</span>
        <span>By</span>
        <span style={{ textAlign: "right" }}>Time</span>
      </div>
      <div className="ww-scroll" style={{ maxHeight: 320, overflowY: "auto" }}>
        {feed.map((mv) => {
          const mm = moveMetaFor(mv.type);
          return (
            <div
              key={mv.id}
              style={{ display: "grid", gridTemplateColumns: "96px 1fr 90px 90px 130px 96px", gap: 14, alignItems: "center", padding: "13px 22px", borderBottom: `1px solid rgba(255,255,255,0.04)`, animation: "ww-feedin .35s ease" }}
            >
              <span style={{ font: "800 10px/1 'Poppins'", letterSpacing: "0.04em", color: mm.color, background: mm.bg, padding: "6px 0", borderRadius: 7, textAlign: "center" }}>{mm.label}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "600 13px/1.2 'Poppins'", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mv.name}</div>
                <div style={{ font: "500 11px/1 'JetBrains Mono',monospace", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{mv.sku}</div>
              </div>
              <span style={{ textAlign: "right", font: "800 14px/1 'JetBrains Mono',monospace", color: mm.color }}>{mv.qty > 0 ? `+${mv.qty}` : mv.qty}</span>
              <span style={{ font: "600 12px/1 'Poppins'", color: "rgba(255,255,255,0.6)" }}>{mv.zone}</span>
              <span style={{ font: "600 12px/1 'Poppins'", color: mv.self ? C.blue : "rgba(255,255,255,0.6)" }}>{mv.who}</span>
              <span style={{ textAlign: "right", font: "500 12px/1 'JetBrains Mono',monospace", color: "rgba(255,255,255,0.45)" }}>{mv.t}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------- secondary views ----------------------------- */

function PageHeading({ title, sub, right }: { title: string; sub: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
      <div>
        <div style={{ font: "800 22px/1 'Poppins'", letterSpacing: "-0.02em", color: "#fff" }}>{title}</div>
        <div style={{ font: "500 13px/1 'Poppins'", color: "rgba(255,255,255,0.42)", marginTop: 8 }}>{sub}</div>
      </div>
      {right}
    </div>
  );
}

function ScanView(p: {
  card: CSSProperties;
  iconBadge: (c: string) => CSSProperties;
  onBreak: boolean;
  currentZone: string;
  scanInput: string;
  setScanInput: (v: string) => void;
  scanResult: SkuInfo | null;
  scanQty: number;
  setScanQty: (fn: (q: number) => number) => void;
  onScanSubmit: () => void;
  onSimScan: () => void;
  onClearScan: () => void;
  onLog: (k: "PICK" | "PACK") => void;
  feed: Movement[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeading
        title="Scan & log movements"
        sub="Scan an item, confirm the quantity, and log it as a pick or pack."
        right={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, font: "700 12px 'Poppins'", color: C.blue, background: "rgba(56,189,248,0.1)", padding: "9px 14px", borderRadius: 11 }}>
            Active pick zone {p.currentZone}
          </span>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ ...p.card, overflow: "hidden" }}>
          {cardHeader(p.iconBadge, C.blue, I.scan, "Scan an item")}
          <div style={{ borderTop: `1px solid ${C.borderSoft}`, padding: 24 }}>
            <ScanInner
              onBreak={p.onBreak}
              scanInput={p.scanInput}
              setScanInput={p.setScanInput}
              scanResult={p.scanResult}
              scanQty={p.scanQty}
              setScanQty={p.setScanQty}
              onScanSubmit={p.onScanSubmit}
              onSimScan={p.onSimScan}
              onClearScan={p.onClearScan}
              onLog={p.onLog}
            />
          </div>
        </div>
        <LiveFeed card={p.card} iconBadge={p.iconBadge} feed={p.feed} />
      </div>
    </div>
  );
}

function TasksView({ card, iconBadge, tasks, onAdvance, openTasks, highCount }: { card: CSSProperties; iconBadge: (c: string) => CSSProperties; tasks: Task[]; onAdvance: (id: string) => void; openTasks: number; highCount: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeading title="My task queue" sub={`${openTasks} open · ${highCount} high priority`} />
      <div style={{ ...card, overflow: "hidden" }}>
        {cardHeader(iconBadge, C.blue, "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2", "All assigned tasks")}
        <div style={{ borderTop: `1px solid ${C.borderSoft}` }}>
          {tasks.map((t) => (
            <TaskRow key={t.id} t={t} onAdvance={onAdvance} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CapacityView({ card, zones, capacityPct, capUsed, capTotal, anyCritical }: { card: CSSProperties; zones: Zone[]; capacityPct: number; capUsed: number; capTotal: number; anyCritical: boolean }) {
  const { dict } = useLanguage();
  const ww = dict.warehouseWorker;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeading
        title="Site capacity"
        sub={`${capUsed.toLocaleString()} of ${capTotal.toLocaleString()} pallet positions used`}
        right={
          anyCritical ? (
            <span style={{ font: "700 10px/1 'Poppins'", letterSpacing: "0.05em", textTransform: "uppercase", color: C.red, background: "rgba(244,67,54,0.12)", padding: "8px 12px", borderRadius: 9 }}>Zone near full</span>
          ) : undefined
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ ...card, padding: "26px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 168,
              height: 168,
              borderRadius: "50%",
              background: `conic-gradient(${zoneColor(capacityPct)} ${capacityPct * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 128, height: 128, borderRadius: "50%", background: C.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ font: "900 38px/1 'Poppins'", letterSpacing: "-0.03em", color: "#fff" }}>{capacityPct}%</div>
              <div style={{ font: "700 9px/1 'Poppins'", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginTop: 6 }}>{ww.capacityView.used}</div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ font: "800 20px/1 'Poppins'", color: "#fff" }}>{(capTotal - capUsed).toLocaleString()}</div>
            <div style={{ font: "500 12px/1 'Poppins'", color: "rgba(255,255,255,0.42)", marginTop: 6 }}>positions free</div>
          </div>
        </div>
        <div style={{ ...card, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
          {zones.map((z) => (
            <ZoneBar key={z.name} z={z} active={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityView({ card, iconBadge, feed }: { card: CSSProperties; iconBadge: (c: string) => CSSProperties; feed: Movement[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeading title="Live activity" sub="Every stock movement across the site, newest first." />
      <LiveFeed card={card} iconBadge={iconBadge} feed={feed} />
    </div>
  );
}
