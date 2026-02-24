"use client";

import { Box, Button, Stack, Typography, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import { FuelPageState, FuelPageActions } from "@/app/lib/type/fuel";
import { getFuelLogs, getFuelStats } from "@/app/lib/controllers/fuel";
import { useUser } from "@/app/lib/hooks/useUser";
import FuelKpiCard from "@/app/components/dashboard/fuel/FuelKpiCard";
import FuelTable from "@/app/components/dashboard/fuel/FuelTable";
import AddFuelLogDialog from "@/app/components/dialogs/fuel/AddFuelLogDialog";

export default function FuelManagementPage() {
  const { user } = useUser();
  const [state, setState] = useState<FuelPageState>({
    logs: [],
    stats: null,
    filters: {},
    loading: true,
    error: null,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const actions: FuelPageActions = {
    fetchLogs: useCallback(async () => {
      if (!user) return;
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const logs = await getFuelLogs(user.companyId, state.filters);
        setState((prev) => ({ ...prev, logs, loading: false }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch fuel logs",
        }));
      }
    }, [user, state.filters]),

    fetchStats: useCallback(async () => {
      if (!user) return;
      try {
        const stats = await getFuelStats(user.companyId);
        setState((prev) => ({ ...prev, stats }));
      } catch (err) {
        console.error("Failed to fetch fuel stats", err);
      }
    }, [user]),

    createLog: async (data: any) => {
      // Logic handled in dialog success
    },

    updateFilters: useCallback((newFilters) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...newFilters },
      }));
    }, []),

    refreshAll: useCallback(async () => {
      if (!user) return;
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const [logs, stats] = await Promise.all([
          getFuelLogs(user.companyId, state.filters),
          getFuelStats(user.companyId),
        ]);
        setState((prev) => ({ ...prev, logs, stats, loading: false }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to refresh data",
        }));
      }
    }, [user, state.filters]),
  };

  useEffect(() => {
    actions.refreshAll();
  }, [actions.refreshAll]);

  return (
    <Box position="relative" p={4} width="100%">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
            Fuel Management
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Monitor fuel consumption, costs, and efficiency across your fleet.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Logging Fuel
        </Button>
      </Stack>

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      <FuelKpiCard state={state} actions={actions} />

      <Stack mt={2}>
        <FuelTable state={state} actions={actions} />
      </Stack>

      <AddFuelLogDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={actions.refreshAll}
      />
    </Box>
  );
}
