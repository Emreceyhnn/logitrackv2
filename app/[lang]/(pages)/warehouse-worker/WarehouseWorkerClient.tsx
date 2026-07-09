"use client";

import { Box, Stack, Snackbar, Alert, useTheme } from "@mui/material";
import { useState } from "react";
import WWSidebar from "@/app/components/warehouse-worker/WWSidebar";
import WWHeader from "@/app/components/warehouse-worker/WWHeader";
import GuidedTourOverlay from "@/app/components/guidedTour/GuidedTourOverlay";
import { useWarehouseWorkerState } from "@/app/hooks/useWarehouseWorkerState";

import WWDashboardTab from "@/app/components/warehouse-worker/tabs/WWDashboardTab";
import WWScanTab from "@/app/components/warehouse-worker/tabs/WWScanTab";
import WWTasksTab from "@/app/components/warehouse-worker/tabs/WWTasksTab";
import WWCapacityTab from "@/app/components/warehouse-worker/tabs/WWCapacityTab";
import WWActivityTab from "@/app/components/warehouse-worker/tabs/WWActivityTab";

interface ExtendedPalette {
  kpi?: {
    emerald?: string;
    amber?: string;
    cyan?: string;
  };
}

export default function WarehouseWorkerClient({
  locked = false,
  lang = "en",
}: {
  locked?: boolean;
  lang?: string;
}) {
  const theme = useTheme();
  const paletteTheme = theme.palette as unknown as ExtendedPalette;
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>();
  const state = useWarehouseWorkerState(selectedWarehouseId);
  
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
