"use client";

import VehicleTable from "@/app/components/playgrounds/customTable";
import AddVehicleDialog from "@/app/components/dialogs/vehicle/addVehicleDialog";
import VehicleDialog from "@/app/components/dialogs/vehicle/vehicleDetailsDialog";
import {
  getVehicles,
  getVehiclesDashboardData,
} from "@/app/lib/controllers/vehicle";
import {
  VehiclePageActions,
  VehiclePageState,
  VehicleWithRelations,
} from "@/app/lib/type/vehicle";
import { Box, Stack, Typography, Button, Alert, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState, useMemo } from "react";
import EditVehicleDialog from "@/app/components/dialogs/vehicle/editVehicleDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import { deleteVehicle } from "@/app/lib/controllers/vehicle";
import CustomCard from "@/app/components/cards/card";

export default function Playground() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();

  /* --------------------------------- STATES --------------------------------- */
  const [state, setState] = useState<VehiclePageState>({
    vehicles: [],
    dashboardData: null,
    filters: {},
    selectedVehicleId: null,
    loading: true,
    error: null,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionVehicle, setActionVehicle] =
    useState<VehicleWithRelations | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  /* ---------------------------------- ACTIONS ------------------------------- */
  const fetchVehicles = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const vehicles = await getVehicles(state.filters);
      setState((prev) => ({ ...prev, vehicles, loading: false }));
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load vehicle list",
      }));
    }
  }, [state.filters]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const dashboardData = await getVehiclesDashboardData();

      setState((prev) => ({ ...prev, dashboardData }));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [vehicles, dashboardData] = await Promise.all([
        getVehicles(state.filters),
        getVehiclesDashboardData(),
      ]);
      setState((prev) => ({
        ...prev,
        vehicles,
        dashboardData,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to refresh data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to refresh data. Please try again.",
      }));
    }
  }, [state.filters]);

  const selectVehicle = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedVehicleId: id }));
  }, []);

  const updateFilters = useCallback(
    (newFilters: Partial<VehiclePageState["filters"]>) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...newFilters },
      }));
    },
    []
  );

  const actions: VehiclePageActions = useMemo(
    () => ({
      fetchVehicles,
      fetchDashboardData,
      refreshAll,
      selectVehicle,
      updateFilters,
    }),
    [
      fetchVehicles,
      fetchDashboardData,
      refreshAll,
      selectVehicle,
      updateFilters,
    ]
  );

  /* -------------------------------- LIFECYCLE ------------------------------- */
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleAddSuccess = () => {
    actions.refreshAll();
  };

  const handleEdit = useCallback(
    (id: string) => {
      const v = state.vehicles.find((v) => v.id === id);
      if (v) {
        setActionVehicle(v);
        setEditDialogOpen(true);
      }
    },
    [state.vehicles]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const v = state.vehicles.find((v) => v.id === id);
      if (v) {
        setActionVehicle(v);
        setDeleteDialogOpen(true);
      }
    },
    [state.vehicles]
  );

  const handleEditFormSuccess = () => {
    setEditDialogOpen(false);
    actions.refreshAll();
  };

  const handleDeleteConfirm = async () => {
    if (!actionVehicle) return;

    setActionLoading(true);
    try {
      await deleteVehicle(actionVehicle.id);
      setDeleteDialogOpen(false);
      actions.refreshAll();

      if (state.selectedVehicleId === actionVehicle.id) {
        actions.selectVehicle(null);
      }
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDialogEditSuccess = () => {
    actions.refreshAll();
  };

  const handleDialogDeleteSuccess = () => {
    actions.refreshAll();
    actions.selectVehicle(null);
  };

  const selectedVehicle = state.vehicles.find(
    (v) => v.id === state.selectedVehicleId
  );

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
            Vehicle Management
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Manage your fleet vehicles, monitor performance and license status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Vehicle
        </Button>
      </Stack>

      {state.error && (
        <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
          {state.error}
        </Alert>
      )}

      <Stack mt={2}>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            Vehicle List
          </Typography>

          <VehicleTable
            state={state}
            actions={{
              ...actions,
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />
        </CustomCard>
      </Stack>

      <AddVehicleDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedVehicle && (
        <VehicleDialog
          open={!!selectedVehicle}
          onClose={() => actions.selectVehicle(null)}
          vehicleData={selectedVehicle}
          onEditSuccess={handleDialogEditSuccess}
          onDeleteSuccess={handleDialogDeleteSuccess}
          onUpdateSuccess={actions.refreshAll}
        />
      )}

      {actionVehicle && (
        <EditVehicleDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSuccess={handleEditFormSuccess}
          vehicle={actionVehicle}
        />
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle?"
        description={`Are you sure you want to delete ${actionVehicle?.plate}? This will permanently remove the vehicle and all associated data from the system.`}
        loading={actionLoading}
      />
    </Box>
  );
}
