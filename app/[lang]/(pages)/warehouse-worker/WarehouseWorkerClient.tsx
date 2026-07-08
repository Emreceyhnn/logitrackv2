"use client";

import { Box, Stack, Snackbar, Alert, useTheme } from "@mui/material";

import WWSidebar from "@/app/components/warehouse-worker/WWSidebar";
import WWHeader from "@/app/components/warehouse-worker/WWHeader";
import GuidedTourOverlay from "@/app/components/guidedTour/GuidedTourOverlay";
import WWDashboardView from "@/app/components/warehouse-worker/views/WWDashboardView";
import WWScanView from "@/app/components/warehouse-worker/views/WWScanView";
import WWTasksView from "@/app/components/warehouse-worker/views/WWTasksView";
import WWCapacityView from "@/app/components/warehouse-worker/views/WWCapacityView";
import WWActivityView from "@/app/components/warehouse-worker/views/WWActivityView";
import { useWarehouseWorkerController } from "@/app/components/warehouse-worker/useWarehouseWorkerController";

export default function WarehouseWorkerClient({
  locked = false,
  lang = "en",
}: {
  locked?: boolean;
  lang?: string;
}) {
  const theme = useTheme();
  const c = useWarehouseWorkerController();
  const { ww, view, toast } = c;

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
        setView={c.setView}
        worker={c.worker}
        NAV={c.NAV}
        onHelpClick={c.handleHelpClick}
        dict={c.dict}
      />

      <Stack sx={{ flex: 1, overflow: "hidden" }}>
        <WWHeader
          ww={ww}
          lang={lang}
          locked={locked}
          warehouseId={c.warehouseId}
          setSelectedWarehouseId={c.setSelectedWarehouseId}
          warehouse={c.warehouse}
          warehouseOptions={c.warehouseOptions}
          worker={c.worker}
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
            <WWDashboardView
              ww={ww}
              picks={c.picks}
              packs={c.packs}
              rate={c.rate}
              picksTarget={c.picksTarget}
              packsTarget={c.packsTarget}
              picksPct={c.picksPct}
              packsPct={c.packsPct}
              openTasks={c.openTasks}
              highCount={c.highCount}
              tasks={c.tasks}
              zones={c.zones}
              feed={c.feed}
              currentZone={c.currentZone}
              setCurrentZone={c.setCurrentZone}
              capUsed={c.capUsed}
              capTotal={c.capTotal}
              capacityPct={c.capacityPct}
              anyCritical={c.anyCritical}
              scanResult={c.scanResult}
              scanInput={c.scanInput}
              setScanInput={c.setScanInput}
              scanQty={c.scanQty}
              setScanQty={c.setScanQty}
              doScan={c.doScan}
              simScan={c.simScan}
              log={c.log}
              setScanResult={c.setScanResult}
              advanceTask={c.advanceTask}
              onRestock={c.onRestock}
              onReport={c.onReport}
            />
          )}

          {view === "scan" && (
            <WWScanView
              ww={ww}
              feed={c.feed}
              scanResult={c.scanResult}
              scanInput={c.scanInput}
              setScanInput={c.setScanInput}
              scanQty={c.scanQty}
              setScanQty={c.setScanQty}
              doScan={c.doScan}
              simScan={c.simScan}
              log={c.log}
              setScanResult={c.setScanResult}
            />
          )}

          {view === "tasks" && (
            <WWTasksView
              ww={ww}
              tasks={c.tasks}
              openTasks={c.openTasks}
              highCount={c.highCount}
              advanceTask={c.advanceTask}
            />
          )}

          {view === "capacity" && (
            <WWCapacityView
              ww={ww}
              zones={c.zones}
              capUsed={c.capUsed}
              capTotal={c.capTotal}
              capacityPct={c.capacityPct}
            />
          )}

          {view === "activity" && <WWActivityView ww={ww} feed={c.feed} />}
        </Box>
      </Stack>

      <Snackbar
        open={!!toast}
        autoHideDuration={2600}
        onClose={() => c.setToast(null)}
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
