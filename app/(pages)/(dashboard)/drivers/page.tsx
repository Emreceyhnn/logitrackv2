"use client";

import DriverKpiCard from "@/app/components/dashboard/driver/driverKpiCard";
import DriverTable from "@/app/components/dashboard/driver/driverTable";
import DriverPerformanceCharts from "@/app/components/dashboard/driver/driverPerformanceCharts";
import { Box, Divider, Stack, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import {
  DriverPageState,
  DriverPageActions,
  DriverWithRelations,
  DriverFilters,
} from "@/app/lib/type/driver";
import {
  getDriverDashboardData,
  getDrivers,
} from "@/app/lib/controllers/driver";
import AddDriverDialog from "@/app/components/dialogs/driver/addDriverDialog";
import DriverDialog from "@/app/components/dialogs/driver";

export default function DriverPage() {
  /* ---------------------------------- State --------------------------------- */
  const [state, setState] = useState<DriverPageState>({
    drivers: [],
    dashboardData: null,
    filters: {
      search: "",
      status: [],
      hasVehicle: undefined,
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
    selectedDriverId: null,
    selectedDriver: null,
    loading: true,
    error: null,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  /* --------------------------------- Actions -------------------------------- */
  const actions: DriverPageActions = {
    fetchDrivers: useCallback(async (page = 1, limit = 10) => {
      try {
        const result = await getDrivers(page, limit);
        setState((prev) => ({
          ...prev,
          drivers: result.data as unknown as DriverWithRelations[], // Retaining cast for safety if types drift, but strictly typed now
          pagination: {
            page: result.meta.page,
            limit: result.meta.limit,
            total: result.meta.total,
          },
          loading: false,
        }));
      } catch (error: any) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }));
        setSnackbar({
          open: true,
          message: error.message || "Failed to fetch drivers",
        });
      }
    }, []),

    fetchDashboardData: useCallback(async () => {
      try {
        const data = await getDriverDashboardData();
        setState((prev) => ({ ...prev, dashboardData: data }));
      } catch (error: any) {
        console.error("Failed dashboard data", error);
      }
    }, []),

    selectDriver: useCallback((id) => {
      setState((prev) => {
        const driver = prev.drivers.find((d) => d.id === id) || null;
        return { ...prev, selectedDriverId: id, selectedDriver: driver };
      });
      if (id) setIsDetailsOpen(true);
    }, []),

    updateFilters: useCallback((newFilters) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...newFilters },
      }));
    }, []),

    changePage: useCallback(
      async (newPage: number) => {
        setState((prev) => ({ ...prev, loading: true }));
        await actions.fetchDrivers(newPage, state.pagination.limit);
      },
      [state.pagination.limit]
    ), // Added dependency

    refreshAll: useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true }));
      await Promise.all([
        actions.fetchDrivers(state.pagination.page, state.pagination.limit),
        actions.fetchDashboardData(),
      ]);
    }, [state.pagination.page, state.pagination.limit]),
  };

  /* -------------------------------- Effects --------------------------------- */
  useEffect(() => {
    // Initial fetch
    actions.refreshAll();
  }, []);

  return (
    <Box position={"relative"} p={4} width={"100%"}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography
            sx={{ fontSize: 24, fontWeight: 700, color: "text.primary" }}
          >
            Driver Management
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Manage your fleet drivers, monitor performance and license status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Driver
        </Button>
      </Stack>

      {/* Error Feedback */}
      {state.error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {state.error}
        </Typography>
      )}

      <DriverKpiCard
        data={state.dashboardData?.driversKpis || null}
        loading={state.loading && !state.dashboardData}
      />

      <Stack gap={2} mt={2}>
        <DriverTable
          drivers={state.drivers}
          loading={state.loading}
          meta={{
            total: state.pagination.total,
            page: state.pagination.page,
            limit: state.pagination.limit,
            totalPages: Math.ceil(
              state.pagination.total / state.pagination.limit
            ),
          }}
          onDriverSelect={actions.selectDriver}
          onRefresh={actions.refreshAll}
          onPageChange={actions.changePage}
        />
      </Stack>

      <DriverPerformanceCharts
        data={state.dashboardData?.performanceCharts}
        loading={state.loading && !state.dashboardData}
      />

      <AddDriverDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={actions.refreshAll}
      />

      {/* Driver Details Dialog */}
      <DriverDialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        driverData={state.selectedDriver}
      />
    </Box>
  );
}
