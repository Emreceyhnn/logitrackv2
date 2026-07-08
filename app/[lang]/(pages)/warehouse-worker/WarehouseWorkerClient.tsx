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

import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  Snackbar,
  Alert,
  LinearProgress,
  Avatar,
  CircularProgress,
  useTheme,
} from "@mui/material";

import {
  View,
  Task,
  Zone,
  Movement,
  SkuInfo,
} from "@/app/lib/type/warehouseWorkerClient";
import {
  zoneColor,
  PICKS_TARGET,
  PACKS_TARGET,
  relativeTime,
  prioFromServer,
  I,
} from "@/app/lib/utils/warehouseWorkerUi";

import WWSidebar from "@/app/components/warehouse-worker/WWSidebar";
import WWHeader from "@/app/components/warehouse-worker/WWHeader";
import WWLiveFeed from "@/app/components/warehouse-worker/WWLiveFeed";
import WWScanSection from "@/app/components/warehouse-worker/WWScanSection";
import WWTaskRow from "@/app/components/warehouse-worker/WWTaskRow";
import { Ico } from "@/app/components/warehouse-worker/Ico";
import GuidedTourOverlay from "@/app/components/guidedTour/GuidedTourOverlay";

export default function WarehouseWorkerClient({
  locked = false,
  lang = "en",
}: {
  locked?: boolean;
  lang?: string;
}) {
  const theme = useTheme();
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
  const [toast, setToast] = useState<{
    msg: string;
    tone: "success" | "warning" | "error" | "info";
  } | null>(null);

  const zonesKey = zones.map((z) => z.name).join(",");
  const [prevZonesKey, setPrevZonesKey] = useState<string | null>(null);
  if (prevZonesKey !== zonesKey) {
    setPrevZonesKey(zonesKey);
    if (zones.length && !zones.some((z) => z.name === currentZone)) {
      const firstZone = zones[0];
      if (firstZone) setCurrentZone(firstZone.name);
    }
  }

  const showToast = (
    msg: string,
    tone: "success" | "warning" | "error" | "info" = "success"
  ) => setToast({ msg, tone });

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
    const item = catalog[Math.floor(Math.random() * catalog.length)];
    if (item) doScan(item.sku);
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

  const renderKpi = (
    label: string,
    color: string,
    icon: string,
    val: React.ReactNode,
    sub: React.ReactNode,
    pct?: number
  ) => (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        flex: 1,
        p: 2.5,
        borderRadius: 3,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg,${color},transparent)`,
        }}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Typography
          variant="overline"
          sx={{ color: theme.palette.text.secondary, fontWeight: 800 }}
        >
          {label}
        </Typography>
        <Avatar
          sx={{
            bgcolor: `${color}1f`,
            color,
            width: 38,
            height: 38,
            borderRadius: 2,
          }}
        >
          <Ico d={icon} size={19} />
        </Avatar>
      </Stack>
      <Box sx={{ mt: 1 }}>{val}</Box>
      {pct != null && (
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            mt: 2,
            height: 5,
            borderRadius: 5,
            bgcolor: "rgba(255,255,255,0.07)",
            "& .MuiLinearProgress-bar": { bgcolor: color },
          }}
        />
      )}
      {sub && (
        <Typography
          sx={{
            mt: 2,
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {sub}
        </Typography>
      )}
    </Card>
  );

  return (
    <Stack
      direction="row"
      sx={{
        height: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        overflow: "hidden",
        fontFamily: "inherit",
      }}
    >
      <WWSidebar
        locked={locked}
        lang={lang}
        view={view}
        setView={setView}
        worker={worker}
        NAV={NAV}
        onHelpClick={handleHelpClick}
        dict={dict}
      />

      <Stack sx={{ flex: 1, overflow: "hidden" }}>
        <WWHeader
          ww={ww}
          lang={lang}
          locked={locked}
          warehouseId={warehouseId}
          setSelectedWarehouseId={setSelectedWarehouseId}
          warehouse={warehouse}
          warehouseOptions={warehouseOptions}
          worker={worker}
        />

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            "&::-webkit-scrollbar": { width: 9, height: 9 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "rgba(255,255,255,0.12)",
              borderRadius: 9,
              border: `2px solid ${theme.palette.background.default}`,
            },
          }}
        >
          {view === "dashboard" && (
            <Stack spacing={2.5}>
              <Stack
                data-tour="ww-kpi-picks"
                direction="row"
                spacing={2.25}
                sx={{ "& > *": { flex: 1 } }}
              >
                {renderKpi(
                  dict.warehouseWorker.dashboard.picksToday,
                  theme.palette.kpi.amber,
                  "M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2",
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography sx={{ fontSize: 34, fontWeight: 900 }}>
                      {picks}
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      / {picksTarget}
                    </Typography>
                  </Stack>,
                  null,
                  picksPct
                )}
                {renderKpi(
                  dict.warehouseWorker.dashboard.packsToday,
                  theme.palette.kpi.emerald,
                  "M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8",
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography sx={{ fontSize: 34, fontWeight: 900 }}>
                      {packs}
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      / {packsTarget}
                    </Typography>
                  </Stack>,
                  null,
                  packsPct
                )}
                {renderKpi(
                  dict.warehouseWorker.ui.myTaskQueue,
                  theme.palette.primary.main,
                  I.tasks,
                  <Typography sx={{ fontSize: 34, fontWeight: 900 }}>
                    {openTasks}
                  </Typography>,
                  <Box component="span">
                    <Box
                      component="span"
                      sx={{ color: theme.palette.error.main }}
                    >
                      ●
                    </Box>{" "}
                    {highCount} {dict.warehouseWorker.ui.highPriority}
                  </Box>
                )}
                {renderKpi(
                  dict.warehouseWorker.dashboard.throughput,
                  theme.palette.kpi.purple,
                  "M3 17l6-6 4 4 8-8M15 7h6v6",
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography sx={{ fontSize: 34, fontWeight: 900 }}>
                      {rate}
                    </Typography>
                    <Typography
                      sx={{ color: theme.palette.text.secondary, fontSize: 12 }}
                    >
                      {dict.warehouseWorker.dashboard.unitsHr}
                    </Typography>
                  </Stack>,
                  null
                )}
              </Stack>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <Stack spacing={2.5} sx={{ flex: 1.55, minWidth: 0 }}>
                  <Card
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      borderRadius: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ p: 2.5 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            bgcolor: `${theme.palette.primary.main}1f`,
                            color: theme.palette.primary.main,
                            borderRadius: 2,
                          }}
                        >
                          <Ico d={I.scan} size={19} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                          {ww.ui.scanLog}
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          color: theme.palette.primary.main,
                          bgcolor: "rgba(56,189,248,0.1)",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {ww.ui.pickZone} {currentZone}
                      </Box>
                    </Stack>
                    <Box
                      sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
                    >
                      <WWScanSection
                        scanResult={scanResult}
                        scanInput={scanInput}
                        setScanInput={setScanInput}
                        doScan={doScan}
                        simScan={simScan}
                        scanQty={scanQty}
                        setScanQty={setScanQty}
                        log={log}
                        setScanResult={setScanResult}
                        ww={ww}
                      />
                    </Box>
                  </Card>
                  <Card
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      borderRadius: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ p: 2.5 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            bgcolor: `${theme.palette.primary.main}1f`,
                            color: theme.palette.primary.main,
                            borderRadius: 2,
                          }}
                        >
                          <Ico d={I.tasks} size={19} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                          {ww.ui.myTaskQueue}
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          color: "rgba(255,255,255,0.55)",
                          bgcolor: "rgba(255,255,255,0.06)",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {openTasks} {ww.ui.openTasksCount}
                      </Box>
                    </Stack>
                    <Box
                      sx={{
                        borderTop: `1px solid ${theme.palette.divider}`,
                        maxHeight: 405,
                        overflowY: "auto",
                      }}
                    >
                      {tasks.map((t) => (
                        <WWTaskRow
                          key={t.id}
                          t={t}
                          advanceTask={advanceTask}
                          ww={ww}
                        />
                      ))}
                    </Box>
                  </Card>
                </Stack>
                <Stack spacing={2.5} sx={{ flex: 1, minWidth: 0 }}>
                  <Card
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      borderRadius: 3,
                      p: 2.5,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 2 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            bgcolor: `${theme.palette.primary.main}1f`,
                            color: theme.palette.primary.main,
                            borderRadius: 2,
                          }}
                        >
                          <Ico d={I.capacity} size={19} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                          {ww.ui.siteCapacity}
                        </Typography>
                      </Stack>
                      {anyCritical && (
                        <Box
                          sx={{
                            color: theme.palette.error.main,
                            bgcolor: "rgba(244,67,54,0.12)",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1.5,
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          {ww.ui.zoneNearFull}
                        </Box>
                      )}
                    </Stack>
                    <Stack direction="row" spacing={2.5} alignItems="center">
                      <Box
                        sx={{ position: "relative", display: "inline-flex" }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={100}
                          sx={{ color: "rgba(255,255,255,0.08)" }}
                        />
                        <CircularProgress
                          variant="determinate"
                          value={capacityPct}
                          size={100}
                          sx={{
                            color: zoneColor(capacityPct, theme),
                            position: "absolute",
                            left: 0,
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <Typography sx={{ fontSize: 22, fontWeight: 900 }}>
                            {capacityPct}%
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {ww.ui.palletPositions}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 22, fontWeight: 800, mt: 1 }}
                        >
                          {capUsed.toLocaleString()}{" "}
                          <Box
                            component="span"
                            sx={{
                              fontSize: 14,
                              color: "rgba(255,255,255,0.35)",
                            }}
                          >
                            / {capTotal.toLocaleString()}
                          </Box>
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack
                      spacing={1.5}
                      sx={{
                        mt: 2.5,
                        pt: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      {zones.map((z) => (
                        <Box key={z.name}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 0.5 }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                              sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color:
                                  z.name === currentZone
                                    ? "#fff"
                                    : theme.palette.text.secondary,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: "50%",
                                  bgcolor: zoneColor(z.pct, theme),
                                }}
                              />
                              <Box>
                                {ww.ui.zone} {z.name}
                              </Box>
                              {z.name === currentZone && (
                                <Box
                                  sx={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    color: theme.palette.primary.main,
                                    bgcolor: "rgba(56,189,248,0.12)",
                                    px: 0.5,
                                    py: 0.25,
                                    borderRadius: 1,
                                  }}
                                >
                                  {ww.ui.activeLabel}
                                </Box>
                              )}
                            </Stack>
                            <Typography
                              sx={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: zoneColor(z.pct, theme),
                                fontFamily: "monospace",
                              }}
                            >
                              {z.pct}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={z.pct}
                            sx={{
                              height: 6,
                              borderRadius: 6,
                              bgcolor: "rgba(255,255,255,0.07)",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: zoneColor(z.pct, theme),
                              },
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Card>
                  <Card
                    data-tour="ww-control-panel"
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      borderRadius: 3,
                      p: 2.5,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ mb: 2 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: `${theme.palette.kpi.purple}1f`,
                          color: theme.palette.kpi.purple,
                          borderRadius: 2,
                        }}
                      >
                        <Ico
                          d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h12M20 18h0"
                          size={19}
                        />
                      </Avatar>
                      <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                        {ww.ui.controlPanel}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="overline"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {ww.ui.activePickZone}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      {zones
                        .map((z) => z.name)
                        .map((z) => {
                          const on = z === currentZone;
                          return (
                            <Button
                              key={z}
                              onClick={() => setCurrentZone(z)}
                              sx={{
                                flex: 1,
                                borderRadius: 3,
                                fontWeight: 700,
                                border: `1px solid ${on ? "rgba(56,189,248,0.4)" : "rgba(255,255,255,0.1)"}`,
                                bgcolor: on
                                  ? "rgba(56,189,248,0.16)"
                                  : "rgba(255,255,255,0.03)",
                                color: on
                                  ? theme.palette.primary.main
                                  : theme.palette.text.secondary,
                              }}
                            >
                              {z}
                            </Button>
                          );
                        })}
                    </Stack>
                    <Typography
                      variant="overline"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {ww.ui.quickActions}
                    </Typography>
                    <Stack data-tour="ww-quick-actions" spacing={1}>
                      <Button
                        onClick={onRestock}
                        startIcon={
                          <Ico d="M12 3v11M8 10l4 4 4-4M4 21h16" size={17} />
                        }
                        sx={{
                          justifyContent: "flex-start",
                          py: 1.5,
                          borderRadius: 3,
                          bgcolor: "rgba(34,211,238,0.08)",
                          border: "1px solid rgba(34,211,238,0.22)",
                          color: theme.palette.kpi.cyan,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        {ww.ui.requestRestockZone} {currentZone}
                      </Button>
                      <Button
                        onClick={onReport}
                        startIcon={
                          <Ico
                            d="M12 3 2 20h20L12 3zM12 10v4M12 17h.01"
                            size={17}
                          />
                        }
                        sx={{
                          justifyContent: "flex-start",
                          py: 1.5,
                          borderRadius: 3,
                          bgcolor: "rgba(244,67,54,0.08)",
                          border: "1px solid rgba(244,67,54,0.22)",
                          color: theme.palette.error.main,
                          fontWeight: 700,
                          textTransform: "none",
                        }}
                      >
                        {ww.ui.reportIssue}
                      </Button>
                    </Stack>
                  </Card>
                </Stack>
              </Stack>
              <WWLiveFeed fd={feed} ww={dict.warehouseWorker} />
            </Stack>
          )}

          {view === "scan" && (
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
                  {ww.ui.scanLogMovements}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: theme.palette.text.secondary,
                    mt: 1,
                  }}
                >
                  {ww.ui.scanSubtitle}
                </Typography>
              </Box>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <Card
                  data-tour="ww-scan-section"
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: 3,
                    flex: 1.4,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ p: 2.5 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${theme.palette.primary.main}1f`,
                        color: theme.palette.primary.main,
                        borderRadius: 2,
                      }}
                    >
                      <Ico d={I.scan} size={19} />
                    </Avatar>
                    <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                      {ww.ui.scanAnItem}
                    </Typography>
                  </Stack>
                  <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                    <WWScanSection
                      scanResult={scanResult}
                      scanInput={scanInput}
                      setScanInput={setScanInput}
                      doScan={doScan}
                      simScan={simScan}
                      scanQty={scanQty}
                      setScanQty={setScanQty}
                      log={log}
                      setScanResult={setScanResult}
                      ww={ww}
                    />
                  </Box>
                </Card>
                <Box sx={{ flex: 1 }}>
                  <WWLiveFeed fd={feed} ww={dict.warehouseWorker} />
                </Box>
              </Stack>
            </Stack>
          )}

          {view === "tasks" && (
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
                  {ww.ui.myTaskQueue}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: theme.palette.text.secondary,
                    mt: 1,
                  }}
                >
                  {openTasks} {ww.ui.openTasksCount} · {highCount}{" "}
                  {ww.ui.highPriority}
                </Typography>
              </Box>
              <Card
                data-tour="ww-task-list"
                sx={{
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderRadius: 3,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ p: 2.5 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: `${theme.palette.primary.main}1f`,
                      color: theme.palette.primary.main,
                      borderRadius: 2,
                    }}
                  >
                    <Ico d={I.tasks} size={19} />
                  </Avatar>
                  <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                    {ww.ui.allAssignedTasks}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    maxHeight: 400,
                    overflowY: "auto",
                  }}
                >
                  {tasks.map((t) => (
                    <WWTaskRow
                      key={t.id}
                      t={t}
                      advanceTask={advanceTask}
                      ww={ww}
                    />
                  ))}
                </Box>
              </Card>
            </Stack>
          )}

          {view === "capacity" && (
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
                  {ww.ui.siteCapacity}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: theme.palette.text.secondary,
                    mt: 1,
                  }}
                >
                  {capUsed.toLocaleString()} / {capTotal.toLocaleString()}{" "}
                  {ww.ui.palletPositionsUsed}
                </Typography>
              </Box>
              <Stack direction="row" spacing={2.5} alignItems="flex-start">
                <Card
                  data-tour="ww-capacity-chart"
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: 3,
                    p: 3,
                    flexShrink: 0,
                    width: 320,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{ position: "relative", display: "inline-flex", mb: 3 }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={168}
                      sx={{ color: "rgba(255,255,255,0.08)" }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={capacityPct}
                      size={168}
                      sx={{
                        color: zoneColor(capacityPct, theme),
                        position: "absolute",
                        left: 0,
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Typography sx={{ fontSize: 38, fontWeight: 900 }}>
                        {capacityPct}%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
                    {(capTotal - capUsed).toLocaleString()}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: theme.palette.text.secondary }}
                  >
                    {ww.ui.positionsFree}
                  </Typography>
                </Card>
                <Card
                  data-tour="ww-zone-list"
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: 3,
                    p: 3,
                    flex: 1,
                  }}
                >
                  <Stack spacing={2.5}>
                    {zones.map((z) => (
                      <Box key={z.name}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: theme.palette.text.secondary,
                            }}
                          >
                            <Box
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                bgcolor: zoneColor(z.pct, theme),
                              }}
                            />
                            <Box>
                              {ww.ui.zone} {z.name}
                            </Box>
                          </Stack>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: zoneColor(z.pct, theme),
                              fontFamily: "monospace",
                            }}
                          >
                            {z.pct}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={z.pct}
                          sx={{
                            height: 6,
                            borderRadius: 6,
                            bgcolor: "rgba(255,255,255,0.07)",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: zoneColor(z.pct, theme),
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Stack>
            </Stack>
          )}

          {view === "activity" && (
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
                  {ww.ui.liveActivity}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: theme.palette.text.secondary,
                    mt: 1,
                  }}
                >
                  {ww.ui.liveActivitySubtitle}
                </Typography>
              </Box>
              <Box data-tour="ww-activity-feed">
                <WWLiveFeed fd={feed} ww={dict.warehouseWorker} />
              </Box>
            </Stack>
          )}
        </Box>
      </Stack>

      <Snackbar
        open={!!toast}
        autoHideDuration={2600}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? (
          <Alert
            severity={toast.tone}
            sx={{
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              fontWeight: 600,
              "& .MuiAlert-icon": {
                color:
                  toast.tone === "success"
                    ? theme.palette.kpi.emerald
                    : toast.tone === "warning"
                      ? theme.palette.kpi.amber
                      : toast.tone === "error"
                        ? theme.palette.error.main
                        : theme.palette.kpi.cyan,
              },
            }}
          >
            {toast.msg}
          </Alert>
        ) : (
          <div />
        )}
      </Snackbar>

      <GuidedTourOverlay />
    </Stack>
  );
}
