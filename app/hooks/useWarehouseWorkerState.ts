import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWarehouseWorker } from "@/app/hooks/useWarehouseWorker";
import { warehouseWorkerKeys } from "@/app/lib/query-keys/warehouseWorker.keys";
import {
  logWarehouseMovement,
  adjustWarehouseStock,
  advanceWarehouseTask,
  requestRestock,
  reportWarehouseIssue,
} from "@/app/lib/controllers/warehouseWorker";
import type { WWCatalogItem } from "@/app/lib/type/warehouseWorker";
import { useLanguage } from "@/app/lib/language/DictionaryContext";
import { useGuidedTour } from "@/app/lib/context/GuidedTourContext";
import { getTourStepsForPage } from "@/app/components/guidedTour/tourSteps";
import { View, Task, Zone, Movement, SkuInfo, LowStockItem } from "@/app/lib/type/warehouseWorkerClient";
import { PICKS_TARGET, PACKS_TARGET, relativeTime, prioFromServer, sortTasksByPriority, pickNextTask, I } from "@/app/lib/utils/warehouseWorkerUi";

export function useWarehouseWorkerState(selectedWarehouseId: string | undefined) {
  const { dict } = useLanguage();
  const ww = dict.warehouseWorker;
  const { startTour } = useGuidedTour();
  const queryClient = useQueryClient();

  const { data } = useWarehouseWorker(selectedWarehouseId);
  const refresh = () => queryClient.invalidateQueries({ queryKey: warehouseWorkerKeys.all });

  const warehouseId = data?.warehouse?.id ?? "";
  const warehouse = data?.warehouse
    ? {
        name: data.warehouse.name,
        code: data.warehouse.code,
        city: data.warehouse.city,
      }
    : { name: ww.noWarehouseAssigned, code: "—", city: "—" };

  const worker = {
    name: data?.worker?.name ?? "—",
    initials: data?.worker?.initials ?? "WW",
    role: data?.worker?.role
      ? dict.company?.roles?.[data.worker.role as keyof typeof dict.company.roles] || data.worker.role
      : ww.warehouseWorker,
  };

  const warehouseOptions = data?.warehouses ?? [];
  const catalog: WWCatalogItem[] = useMemo(() => data?.catalog ?? [], [data?.catalog]);

  const picks = data?.kpis.picks ?? 0;
  const packs = data?.kpis.packs ?? 0;
  const rate = data?.kpis.rate ?? 0;
  const picksTarget = data?.kpis.picksTarget ?? PICKS_TARGET;
  const packsTarget = data?.kpis.packsTarget ?? PACKS_TARGET;

  // Order the queue so the worker never has to hunt for what's next: open tasks
  // before completed ones, then high → med → low (see sortTasksByPriority).
  const tasks: Task[] = sortTasksByPriority(
    (data?.tasks ?? []).map((t) => ({
      id: t.id,
      kind: t.kind,
      name: t.name,
      order: t.orderRef,
      zone: t.zone,
      done: t.done,
      total: t.total,
      priority: prioFromServer(t.priority),
    }))
  );

  // The "do this next" recommendation surfaced in the dashboard's Next-task card.
  const nextTask: Task | null = pickNextTask(tasks);

  const zones: Zone[] = (data?.zones ?? []).map((z) => ({
    name: z.code,
    pct: z.pct,
  }));

  const feed: Movement[] = (data?.feed ?? []).map((m) => ({
    id: m.id,
    type: m.type,
    name: m.name,
    sku: m.sku,
    qty: m.qty,
    zone: m.zone,
    who: m.self ? ww.dashboard.you : m.who === "System" ? ww.dashboard.system : m.who,
    self: m.self,
    t: relativeTime(m.at, ww),
  }));

  // Proactive shortage signal: SKUs already at/below reorder point, worst first.
  const lowStock: LowStockItem[] = data?.lowStock ?? [];

  const [view, setView] = useState<View>("dashboard");
  const [currentZone, setCurrentZone] = useState("A");
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<SkuInfo | null>(null);
  const [scanQty, setScanQty] = useState(1);
  const [toast, setToast] = useState<{ msg: string; tone: "success" | "warning" | "error" | "info" } | null>(null);

  const zonesKey = zones.map((z) => z.name).join(",");
  const [prevZonesKey, setPrevZonesKey] = useState<string | null>(null);
  if (prevZonesKey !== zonesKey) {
    setPrevZonesKey(zonesKey);
    if (zones.length && !zones.some((z) => z.name === currentZone)) {
      const firstZone = zones[0];
      if (firstZone) setCurrentZone(firstZone.name);
    }
  }

  const showToast = (msg: string, tone: "success" | "warning" | "error" | "info" = "success") => setToast({ msg, tone });

  const handleHelpClick = () => {
    const steps = getTourStepsForPage(`warehouse-worker-${view}`, dict as Record<string, unknown>);
    if (steps.length > 0) {
      setTimeout(() => startTour(`warehouse-worker-${view}`, steps), 200);
    }
  };

  const openTasks = tasks.filter((t) => t.done < t.total).length;
  const highCount = tasks.filter((t) => t.priority === "high" && t.done < t.total).length;
  const picksPct = picksTarget ? Math.min(100, Math.round((picks / picksTarget) * 100)) : 0;
  const packsPct = packsTarget ? Math.min(100, Math.round((packs / packsTarget) * 100)) : 0;
  const capUsed = data?.capacity.used ?? 0;
  const capTotal = data?.capacity.total ?? 0;
  const capacityPct = data?.capacity.pct ?? 0;
  const anyCritical = zones.some((z) => z.pct >= 85);

  const doScan = (raw: string) => {
    if (!raw.trim()) return;
    const q = raw.trim().toLocaleUpperCase("en-US");
    const hit = catalog.find((s) => s.sku.toLocaleUpperCase("en-US") === q || s.name.toLocaleUpperCase("en-US").includes(q));
    const info: SkuInfo = hit
      ? {
          sku: hit.sku,
          name: hit.name,
          zone: hit.zone,
          onHand: hit.quantity,
          available: hit.available,
          minStock: hit.minStock,
          lowStock: hit.lowStock,
        }
      : {
          sku: q.startsWith("SKU") ? q : `SKU-${q || "00000"}`,
          name: ww.unrecognizedItem,
          zone: currentZone,
        };
    setScanResult(info);
    setScanQty(1);
    setScanInput("");
    setCurrentZone(info.zone);
  };

  const simScan = () => {
    if (!catalog.length) return showToast(ww.noInventoryToScan, "warning");
    const item = catalog[Math.floor(Math.random() * catalog.length)];
    if (item) doScan(item.sku);
  };

  const log = async (kind: "PICK" | "PACK" | "STOCK_IN" | "PUTAWAY") => {
    if (!scanResult || !warehouseId) return;
    const qty = scanQty;
    const result = scanResult;
    setScanResult(null);
    setScanQty(1);
    try {
      await logWarehouseMovement(warehouseId, result.sku, qty, kind);
      const label = (ww.ui[kind] || kind).toLocaleLowerCase("en-US");
      // PICK removes stock (warning tone); everything else adds/settles (success).
      showToast(`${ww.logged} ${label} · ${qty} × ${result.sku}`, kind === "PICK" ? "warning" : "success");
      await refresh();
    } catch {
      showToast(ww.couldNotLog, "error");
    }
  };

  // Reconcile a physical count for the scanned SKU (eksik/fazla). `counted` is
  // the shelf count; the server computes the signed delta against live on-hand.
  const adjust = async (counted: number, reason: string) => {
    if (!scanResult || !warehouseId) return;
    const result = scanResult;
    const expected = result.onHand;
    setScanResult(null);
    setScanQty(1);
    try {
      const res = await adjustWarehouseStock(warehouseId, result.sku, counted, reason, expected);
      if (res.delta === 0) {
        showToast(`${ww.adjustNoChange} · ${result.sku}`, "info");
      } else {
        const sign = res.delta > 0 ? "+" : "";
        showToast(`${ww.adjusted} ${sign}${res.delta} · ${result.sku}`, res.delta < 0 ? "warning" : "success");
      }
      await refresh();
    } catch {
      showToast(ww.couldNotAdjust, "error");
    }
  };

  // delta lets the task row commit a counted unit total in one step (Start →
  // count → Complete); omitted, the backend falls back to its default step so
  // the Next-task card's single-tap "Start" still works.
  const advanceTask = async (id: string, delta?: number) => {
    try {
      const res = await advanceWarehouseTask(id, delta);
      if (res.complete) showToast(ww.taskComplete, "success");
      await refresh();
    } catch {
      showToast(ww.couldNotUpdateTask, "error");
    }
  };

  // With an item, files a SKU-specific request (this product ran low, N units);
  // without one, the legacy zone-wide request for the active zone.
  const onRestock = async (item?: {
    sku: string;
    zone: string;
    suggestedQty?: number;
  }) => {
    if (!warehouseId) return;
    try {
      if (item) {
        await requestRestock(warehouseId, item.zone, item.sku, item.suggestedQty);
        const qtyPart = item.suggestedQty ? ` × ${item.suggestedQty}` : "";
        showToast(`${ww.restockRequested} · ${item.sku}${qtyPart}`, "info");
      } else {
        await requestRestock(warehouseId, currentZone);
        showToast(`${ww.restockRequested} · Zone ${currentZone}`, "info");
      }
      await refresh();
    } catch {
      showToast(ww.couldNotRequestRestock, "error");
    }
  };

  const onReport = async () => {
    if (!warehouseId) return;
    try {
      await reportWarehouseIssue(warehouseId, `Floor issue — Zone ${currentZone}`);
      showToast(ww.issueReported, "error");
      await refresh();
    } catch {
      showToast(ww.couldNotReportIssue, "error");
    }
  };

  const NAV: { key: View; title: string; d: string }[] = [
    { key: "dashboard", title: ww.nav.overview, d: I.grid },
    { key: "scan", title: ww.nav.scan, d: I.scan },
    { key: "tasks", title: ww.nav.tasks, d: I.tasks },
    { key: "capacity", title: ww.nav.capacity, d: I.capacity },
    { key: "activity", title: ww.nav.activity, d: I.activity },
  ];

  return {
    dict,
    ww,
    warehouseId,
    warehouse,
    worker,
    warehouseOptions,
    picks,
    packs,
    rate,
    picksTarget,
    packsTarget,
    picksPct,
    packsPct,
    tasks,
    nextTask,
    zones,
    feed,
    lowStock,
    view,
    setView,
    currentZone,
    setCurrentZone,
    scanInput,
    setScanInput,
    scanResult,
    setScanResult,
    scanQty,
    setScanQty,
    toast,
    setToast,
    openTasks,
    highCount,
    capUsed,
    capTotal,
    capacityPct,
    anyCritical,
    doScan,
    simScan,
    log,
    adjust,
    advanceTask,
    onRestock,
    onReport,
    NAV,
    handleHelpClick,
  };
}

export type WWState = ReturnType<typeof useWarehouseWorkerState>;
