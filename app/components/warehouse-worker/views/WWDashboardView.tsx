"use client";

import React from "react";
import {
  Box,
  Stack,
  Typography,
  Card,
  Avatar,
  useTheme,
} from "@mui/material";
import type {
  Task,
  Zone,
  Movement,
  SkuInfo,
  WarehouseWorkerDict,
} from "@/app/lib/type/warehouseWorkerClient";
import { I } from "@/app/lib/utils/warehouseWorkerUi";
import { Ico } from "../Ico";
import WWScanSection from "../WWScanSection";
import WWTaskRow from "../WWTaskRow";
import WWLiveFeed from "../WWLiveFeed";
import WWKpiCard from "../WWKpiCard";
import WWCapacityCard from "../WWCapacityCard";
import WWControlPanel from "../WWControlPanel";

interface WWDashboardViewProps {
  ww: WarehouseWorkerDict;
  picks: number;
  packs: number;
  rate: number;
  picksTarget: number;
  packsTarget: number;
  picksPct: number;
  packsPct: number;
  openTasks: number;
  highCount: number;
  tasks: Task[];
  zones: Zone[];
  feed: Movement[];
  currentZone: string;
  setCurrentZone: (zone: string) => void;
  capUsed: number;
  capTotal: number;
  capacityPct: number;
  anyCritical: boolean;
  scanResult: SkuInfo | null;
  scanInput: string;
  setScanInput: (v: string) => void;
  scanQty: number;
  setScanQty: React.Dispatch<React.SetStateAction<number>>;
  doScan: (raw: string) => void;
  simScan: () => void;
  log: (kind: "PICK" | "PACK" | "STOCK_IN" | "PUTAWAY") => void;
  adjust: (counted: number, reason: string) => void;
  setScanResult: (v: SkuInfo | null) => void;
  advanceTask: (id: string) => void;
  onRestock: () => void;
  onReport: () => void;
}

export default function WWDashboardView({
  ww,
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
  adjust,
  setScanResult,
  advanceTask,
  onRestock,
  onReport,
}: WWDashboardViewProps) {
  const theme = useTheme();
  return (
    <Stack spacing={2.5}>
      <Stack
        data-tour="ww-kpi-picks"
        direction="row"
        spacing={2.25}
        sx={{ "& > *": { flex: 1 } }}
      >
        <WWKpiCard
          label={ww.dashboard.picksToday}
          color={theme.palette.kpi.amber}
          icon="M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2"
          pct={picksPct}
        >
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography sx={{ fontSize: 34, fontWeight: 900 }}>
              {picks}
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              / {picksTarget}
            </Typography>
          </Stack>
        </WWKpiCard>
        <WWKpiCard
          label={ww.dashboard.packsToday}
          color={theme.palette.kpi.emerald}
          icon="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8"
          pct={packsPct}
        >
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography sx={{ fontSize: 34, fontWeight: 900 }}>
              {packs}
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              / {packsTarget}
            </Typography>
          </Stack>
        </WWKpiCard>
        <WWKpiCard
          label={ww.ui.myTaskQueue}
          color={theme.palette.primary.main}
          icon={I.tasks}
          sub={
            <Box component="span">
              <Box component="span" sx={{ color: theme.palette.error.main }}>
                ●
              </Box>{" "}
              {highCount} {ww.ui.highPriority}
            </Box>
          }
        >
          <Typography sx={{ fontSize: 34, fontWeight: 900 }}>
            {openTasks}
          </Typography>
        </WWKpiCard>
        <WWKpiCard
          label={ww.dashboard.throughput}
          color={theme.palette.kpi.purple}
          icon="M3 17l6-6 4 4 8-8M15 7h6v6"
        >
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography sx={{ fontSize: 34, fontWeight: 900 }}>{rate}</Typography>
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: 12 }}
            >
              {ww.dashboard.unitsHr}
            </Typography>
          </Stack>
        </WWKpiCard>
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
                adjust={adjust}
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
              {tasks.length === 0 ? (
                <Stack alignItems="center" spacing={1.5} sx={{ py: 6, px: 2.5 }}>
                  <Avatar sx={{ bgcolor: `${theme.palette.kpi.emerald}1f`, color: theme.palette.kpi.emerald, width: 44, height: 44 }}>
                    <Ico d="M20 6 9 17l-5-5" size={20} />
                  </Avatar>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{ww.ui.nextTaskAllClear}</Typography>
                  <Typography sx={{ fontSize: 13, color: theme.palette.text.secondary, textAlign: "center" }}>
                    {ww.ui.taskQueueEmpty}
                  </Typography>
                </Stack>
              ) : (
                tasks.map((t) => (
                  <WWTaskRow key={t.id} t={t} advanceTask={advanceTask} ww={ww} />
                ))
              )}
            </Box>
          </Card>
        </Stack>
        <Stack spacing={2.5} sx={{ flex: 1, minWidth: 0 }}>
          <WWCapacityCard
            ww={ww}
            zones={zones}
            currentZone={currentZone}
            capUsed={capUsed}
            capTotal={capTotal}
            capacityPct={capacityPct}
            anyCritical={anyCritical}
          />
          <WWControlPanel
            ww={ww}
            zones={zones}
            currentZone={currentZone}
            setCurrentZone={setCurrentZone}
            onRestock={onRestock}
            onReport={onReport}
          />
        </Stack>
      </Stack>
      <WWLiveFeed fd={feed} ww={ww} />
    </Stack>
  );
}
