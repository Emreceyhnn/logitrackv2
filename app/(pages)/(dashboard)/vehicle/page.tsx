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
  VehiclePageActions,
  VehiclePageState,
  VehicleWithRelations,
} from "@/app/lib/type/vehicle";
import { Box, Stack, Typography, Button, Alert, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState } from "react";
import EditVehicleDialog from "@/app/components/dialogs/vehicle/editVehicleDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import { deleteVehicle } from "@/app/lib/controllers/vehicle";
import VehicleToolbar from "@/app/components/dashboard/vehicle/toolbar";
import CustomCard from "@/app/components/cards/card";

export default function VehiclePage() {
  /* --------------------------------- states --------------------------------- */
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

  /* --------------------------------- actions -------------------------------- */
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
        console.log(dashboardData);
        setState((prev) => ({ ...prev, dashboardData }));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
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

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    actions.fetchVehicles();
  }, [state.filters]);

  useEffect(() => {
    actions.fetchDashboardData();
  }, []);

  /* -------------------------------- handlers -------------------------------- */
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

      <VehicleKpiCard state={state} actions={actions} />

      <Stack mt={2}>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            Vehicle List
          </Typography>

          <VehicleToolbar state={state} actions={actions} />
          <Divider />
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

      <Stack mt={2} direction={{ xs: "column", md: "row" }} spacing={2}>
        <DocumentCalenderCard data={state.dashboardData?.expiringDocs || []} />

        <VehicleCapacityChart
          data={state.dashboardData?.vehiclesCapacity || []}
          loading={state.loading}
        />
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
          vehicleData={selectedVehicle as any}
          onEditSuccess={handleDialogEditSuccess}
          onDeleteSuccess={handleDialogDeleteSuccess}
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
