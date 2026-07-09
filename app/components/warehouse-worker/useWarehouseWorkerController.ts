"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWarehouseWorker } from "@/app/hooks/useWarehouseWorker";
import { warehouseWorkerKeys } from "@/app/lib/query-keys/warehouseWorker.keys";
import {
  logWarehouseMovement,
  advanceWarehouseTask,
  requestRestock,
  reportWarehouseIssue,
} from "@/app/lib/controllers/warehouseWorker";
import type { WWCatalogItem } from "@/app/lib/type/warehouseWorker";
import { useLanguage } from "@/app/lib/language/DictionaryContext";
import { useGuidedTour } from "@/app/lib/context/GuidedTourContext";
import { getTourStepsForPage } from "@/app/components/guidedTour/tourSteps";
import { View, Task, Zone, Movement, SkuInfo } from "@/app/lib/type/warehouseWorkerClient";
import {
  PICKS_TARGET,
  PACKS_TARGET,
  relativeTime,
  prioFromServer,
  I,
} from "@/app/lib/utils/warehouseWorkerUi";

type Toast = {
  msg: string;
  tone: "success" | "warning" | "error" | "info";
};

/**
 * Owns all data mapping, local UI state and floor-action handlers for the
 * warehouse-worker page. Kept separate from WarehouseWorkerClient so the client
 * component stays a thin layout shell that only wires views together.
 */
export function useWarehouseWorkerController() {
  const { dict } = useLanguage();
  const ww = dict.warehouseWorker;
  const { startTour } = useGuidedTour();

  const queryClient = useQueryClient();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<
    string | undefined
  >();
  const { data } = useWarehouseWorker(selectedWarehouseId);
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: warehouseWorkerKeys.all });

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
      ? dict.company?.roles?.[
          data.worker.role as keyof typeof dict.company.roles
        ] || data.worker.role
      : ww.warehouseWorker,
  };
  const warehouseOptions = data?.warehouses ?? [];
  const catalog: WWCatalogItem[] = useMemo(
    () => data?.catalog ?? [],
    [data?.catalog]
  );

  const picks = data?.kpis.picks ?? 0;
  const packs = data?.kpis.packs ?? 0;
  const rate = data?.kpis.rate ?? 0;
  const picksTarget = data?.kpis.picksTarget ?? PICKS_TARGET;
  const packsTarget = data?.kpis.packsTarget ?? PACKS_TARGET;

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
    who: m.self
      ? ww.dashboard.you
      : m.who === "System"
        ? ww.dashboard.system
        : m.who,
    self: m.self,
    t: relativeTime(m.at, ww),
  }));

  const [view, setView] = useState<View>("dashboard");
  const [currentZone, setCurrentZone] = useState("A");
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<SkuInfo | null>(null);
  const [scanQty, setScanQty] = useState(1);
  const [toast, setToast] = useState<Toast | null>(null);

  const zonesKey = zones.map((z) => z.name).join(",");
  const [prevZonesKey, setPrevZonesKey] = useState<string | null>(null);
  if (prevZonesKey !== zonesKey) {
    setPrevZonesKey(zonesKey);
    if (zones[0] && !zones.some((z) => z.name === currentZone))
      setCurrentZone(zones[0].name);
  }

  const showToast = (msg: string, tone: Toast["tone"] = "success") =>
    setToast({ msg, tone });

  const handleHelpClick = () => {
    const steps = getTourStepsForPage(
      `warehouse-worker-${view}`,
      dict as Record<string, unknown>
    );
    if (steps.length > 0) {
      setTimeout(() => startTour(`warehouse-worker-${view}`, steps), 200);
    }
  };

  const openTasks = tasks.filter((t) => t.done < t.total).length;
  const highCount = tasks.filter(
    (t) => t.priority === "high" && t.done < t.total
  ).length;
  const picksPct = picksTarget
    ? Math.min(100, Math.round((picks / picksTarget) * 100))
    : 0;
  const packsPct = packsTarget
    ? Math.min(100, Math.round((packs / packsTarget) * 100))
    : 0;
  const capUsed = data?.capacity.used ?? 0;
  const capTotal = data?.capacity.total ?? 0;
  const capacityPct = data?.capacity.pct ?? 0;
  const anyCritical = zones.some((z) => z.pct >= 85);

  const doScan = (raw: string) => {
    if (!raw.trim()) return;
    const q = raw.trim().toLocaleUpperCase("en-US");
    const hit = catalog.find(
      (s) =>
        s.sku.toLocaleUpperCase("en-US") === q ||
        s.name.toLocaleUpperCase("en-US").includes(q)
    );
    const info = hit ?? {
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
    const pick = catalog[Math.floor(Math.random() * catalog.length)];
    if (pick) doScan(pick.sku);
  };

  const log = async (kind: "PICK" | "PACK") => {
    if (!scanResult || !warehouseId) return;
    const qty = scanQty;
    const result = scanResult;
    setScanResult(null);
    setScanQty(1);
    try {
      await logWarehouseMovement(warehouseId, result.sku, qty, kind);
      showToast(
        `${ww.logged} ${kind.toLocaleLowerCase("en-US")} · ${qty} × ${result.sku}`,
        kind === "PICK" ? "warning" : "success"
      );
      await refresh();
    } catch {
      showToast(ww.couldNotLog, "error");
    }
  };

  const advanceTask = async (id: string) => {
    try {
      const res = await advanceWarehouseTask(id);
      if (res.complete) showToast(ww.taskComplete, "success");
      await refresh();
    } catch {
      showToast(ww.couldNotUpdateTask, "error");
    }
  };

  const onRestock = async () => {
    if (!warehouseId) return;
    try {
      await requestRestock(warehouseId, currentZone);
      showToast(`${ww.restockRequested} · Zone ${currentZone}`, "info");
      await refresh();
    } catch {
      showToast(ww.couldNotRequestRestock, "error");
    }
  };

  const onReport = async () => {
    if (!warehouseId) return;
    try {
      await reportWarehouseIssue(
        warehouseId,
        `Floor issue — Zone ${currentZone}`
      );
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
    view,
    setView,
    worker,
    warehouse,
    warehouseId,
    warehouseOptions,
    setSelectedWarehouseId,
    NAV,
    handleHelpClick,
    picks,
    packs,
    rate,
    picksTarget,
    packsTarget,
    picksPct,
    packsPct,
    openTasks,
    highCount,
    tasks,
    zones,
    feed,
    currentZone,
    setCurrentZone,
    capUsed,
    capTotal,
    capacityPct,
    anyCritical,
    scanResult,
    scanInput,
    setScanInput,
    scanQty,
    setScanQty,
    doScan,
    simScan,
    log,
    setScanResult,
    advanceTask,
    onRestock,
    onReport,
    toast,
    setToast,
  };
}
