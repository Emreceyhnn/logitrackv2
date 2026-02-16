"use client";

import DocumentCalenderCard from "@/app/components/dashboard/vehicle/documentCalenderCard";
import VehicleCapacityChart from "@/app/components/dashboard/vehicle/maxLoad";
import VehicleKpiCard from "@/app/components/dashboard/vehicle/vehicleKpiCard";
import VehicleTable from "@/app/components/dashboard/vehicle/vehicleTable";
import AddVehicleDialog from "@/app/components/dialogs/vehicle/addVehicleDialog";
import VehicleDialog from "@/app/components/dialogs/vehicle/vehicleDetailsDialog";
import {
  getVehicles,
  getVehiclesDashboardData,
} from "@/app/lib/controllers/vehicle";
import {
  VehicleDashboardResponseType,
  VehiclePageActions,
  VehiclePageState,
  VehicleWithRelations,
} from "@/app/lib/type/vehicle";
import { Box, Divider, Stack, Typography, Button, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import EditVehicleDialog from "@/app/components/dialogs/vehicle/editVehicleDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import { deleteVehicle } from "@/app/lib/controllers/vehicle";
import VehicleToolbar from "@/app/components/dashboard/vehicle/toolbar";

export default function VehiclePage() {
  // Page State
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

  // Data Fetching Actions
  const actions: VehiclePageActions = {
    fetchVehicles: useCallback(async () => {
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
    }, [state.filters]),

    fetchDashboardData: useCallback(async () => {
      try {
        const dashboardData = await getVehiclesDashboardData();
        setState((prev) => ({ ...prev, dashboardData }));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Don't set global error for dashboard data failure, just log it
      }
    }, []),

    refreshAll: useCallback(async () => {
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
    }, [state.filters]),

    selectVehicle: useCallback((id: string | null) => {
      setState((prev) => ({ ...prev, selectedVehicleId: id }));
    }, []),

    updateFilters: useCallback((newFilters) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...newFilters },
      }));
    }, []),
  };

  // Initial Load & Filter Change
  useEffect(() => {
    actions.fetchVehicles();
  }, [state.filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial Dashboard Load
  useEffect(() => {
    actions.fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handlers
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
      // If we deleted the currently selected vehicle, deselect it
      if (state.selectedVehicleId === actionVehicle.id) {
        actions.selectVehicle(null);
      }
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      // Could show error toast here
    } finally {
      setActionLoading(false);
    }
  };

  const handleDialogEditSuccess = () => {
    // Called when Edit is successful from VehicleDialog
    actions.refreshAll();
  };

  const handleDialogDeleteSuccess = () => {
    // Called when Delete is successful from VehicleDialog
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
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-2%",
          }}
        >
          Vehicles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ textTransform: "none" }}
        >
          Add Vehicle
        </Button>
      </Stack>
      <Divider />

      {state.error && (
        <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
          {state.error}
        </Alert>
      )}

      <VehicleKpiCard {...(state.dashboardData?.vehiclesKpis || {})} />

      <Stack mt={3}>
        <VehicleToolbar
          filters={state.filters}
          onFilterChange={actions.updateFilters}
        />
      </Stack>

      <Stack mt={2}>
        <VehicleTable
          vehicles={state.vehicles}
          onVehicleSelect={actions.selectVehicle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={state.loading}
        />
      </Stack>

      <Stack mt={2} direction={{ xs: "column", md: "row" }} spacing={2}>
        <DocumentCalenderCard data={state.dashboardData?.expiringDocs || []} />

        <VehicleCapacityChart
          data={state.dashboardData?.vehiclesCapacity || []}
        />
      </Stack>

      {/* Dialogs */}
      <AddVehicleDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <VehicleDialog
        open={!!selectedVehicle}
        onClose={() => actions.selectVehicle(null)}
        vehicleData={selectedVehicle}
        onEditSuccess={handleDialogEditSuccess}
        onDeleteSuccess={handleDialogDeleteSuccess}
      />

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
