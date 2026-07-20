"use client";

import { Box, Stack, Snackbar, Alert, useTheme } from "@mui/material";
import { useState } from "react";
import WWSidebar from "@/app/components/warehouse-worker/WWSidebar";
import WWHeader from "@/app/components/warehouse-worker/WWHeader";
import GuidedTourOverlay from "@/app/components/guidedTour/GuidedTourOverlay";
import { useDemoWarehouseWorkerState } from "@/app/hooks/demo/useDemoWarehouseWorkerState";

import WWDashboardTab from "@/app/components/warehouse-worker/tabs/WWDashboardTab";
import WWScanTab from "@/app/components/warehouse-worker/tabs/WWScanTab";
import WWTasksTab from "@/app/components/warehouse-worker/tabs/WWTasksTab";
import WWCapacityTab from "@/app/components/warehouse-worker/tabs/WWCapacityTab";
import WWActivityTab from "@/app/components/warehouse-worker/tabs/WWActivityTab";
import type { WWState } from "@/app/hooks/useWarehouseWorkerState";

interface ExtendedPalette {
  kpi?: {
    emerald?: string;
    amber?: string;
    cyan?: string;
  };
}

/**
 * Demo-only fork of WarehouseWorkerClient. Identical layout/tabs, but backed by
 * useDemoWarehouseWorkerState (public mock data, every mutation → "disabled in
 * demo" toast). `locked` is always false so the full panel is shown, and the
 * first-run auto-tour is dropped to keep the demo predictable.
 */
export default function DemoWarehouseWorkerClient({
  lang = "en",
}: {
  lang?: string;
}) {
  const theme = useTheme();
  const paletteTheme = theme.palette as unknown as ExtendedPalette;
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<
    string | undefined
  >();
  // The demo state hook mirrors useWarehouseWorkerState's return shape exactly,
  // so the shared tabs (typed against WWState) render unchanged.
  const state = useDemoWarehouseWorkerState(
    selectedWarehouseId
  ) as unknown as WWState;

  const {
    ww,
    dict,
    view,
    setView,
    worker,
    NAV,
    handleHelpClick,
    warehouseId,
    warehouse,
    warehouseOptions,
    toast,
    setToast,
  } = state;

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
        locked={false}
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
          locked={false}
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
          {view === "dashboard" && <WWDashboardTab state={state} />}
          {view === "scan" && <WWScanTab state={state} />}
          {view === "tasks" && <WWTasksTab state={state} />}
          {view === "capacity" && <WWCapacityTab state={state} />}
          {view === "activity" && <WWActivityTab state={state} />}
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
                    ? paletteTheme.kpi?.emerald
                    : toast.tone === "warning"
                      ? paletteTheme.kpi?.amber
                      : toast.tone === "error"
                        ? theme.palette.error.main
                        : paletteTheme.kpi?.cyan,
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
