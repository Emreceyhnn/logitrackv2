"use client";

import DocumentCalenderCard from "@/app/components/dashboard/vehicle/documentCalenderCard";
import VehicleCapacityChart from "@/app/components/dashboard/vehicle/maxLoad";
import VehicleTable from "@/app/components/dashboard/vehicle/vehicleTable";
import AddVehicleDialog from "@/app/components/dialogs/vehicle/addVehicleDialog";
import VehicleDialog from "@/app/components/dialogs/vehicle/vehicleDetailsDialog";
import { useVehicles, useVehiclesDashboardData, useVehicleMutations } from "@/app/hooks/useVehicles";
import {
  VehiclePageActions,
  VehiclePageState,
  VehicleWithRelations,
} from "@/app/lib/type/vehicle";
import { Box, Stack, Typography, Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EditVehicleDialog from "@/app/components/dialogs/vehicle/editVehicleDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import CustomCard from "@/app/components/cards/card";
import {
  Build,
  CheckCircle,
  Description,
  DirectionsCar,
  LocalShipping,
  ReportProblem,
} from "@mui/icons-material";
import KpiCards from "@/app/components/cards/KpiCards";

export default function VehiclePage() {
  return (
    <Suspense fallback={<Box p={4}>Loading...</Box>}>
      <VehicleContent />
    </Suspense>
  );
}

function VehicleContent() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();
  const searchParams = useSearchParams();
  const vehicleIdFromUrl = searchParams.get("id");
  const tabFromUrl = searchParams.get("tab");

  /* --------------------------------- STATES --------------------------------- */
  const [state, setState] = useState<{
    filters: VehiclePageState["filters"];
    selectedVehicleId: string | null;
  }>({
    filters: {},
    selectedVehicleId: null,
  });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionVehicle, setActionVehicle] = useState<VehicleWithRelations | null>(null);

  /* ---------------------------------- HOOKS --------------------------------- */
  const { 
    data: vehicles = [], 
    isLoading: isVehiclesLoading,
    refetch: refetchVehicles 
  } = useVehicles(state.filters);

  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading,
    refetch: refetchDashboard 
  } = useVehiclesDashboardData();

  const { deleteVehicle: deleteMutation } = useVehicleMutations();

  const loading = isVehiclesLoading || isDashboardLoading;

  /* ---------------------------------- ACTIONS ------------------------------- */
  const refreshAll = useCallback(async () => {
    await Promise.all([refetchVehicles(), refetchDashboard()]);
  }, [refetchVehicles, refetchDashboard]);

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
      fetchVehicles: async () => {}, // Handled by React Query
      fetchDashboardData: async () => {}, // Handled by React Query
      refreshAll,
      selectVehicle,
      updateFilters,
    }),
    [refreshAll, selectVehicle, updateFilters]
  );

  /* -------------------------------- LIFECYCLE ------------------------------- */
  useEffect(() => {
    if (vehicleIdFromUrl) {
      actions.selectVehicle(vehicleIdFromUrl);
    }
  }, [vehicleIdFromUrl, actions]);

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleAddSuccess = () => {
    actions.refreshAll();
  };

  const handleEdit = useCallback(
    (id: string) => {
      const v = vehicles.find((v) => v.id === id);
      if (v) {
        setActionVehicle(v);
        setEditDialogOpen(true);
      }
    },
    [vehicles]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const v = vehicles.find((v) => v.id === id);
      if (v) {
        setActionVehicle(v);
        setDeleteDialogOpen(true);
      }
    },
    [vehicles]
  );

  const handleEditFormSuccess = () => {
    setEditDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!actionVehicle) return;

    try {
      await deleteMutation.mutateAsync(actionVehicle.id);
      setDeleteDialogOpen(false);

      if (state.selectedVehicleId === actionVehicle.id) {
        actions.selectVehicle(null);
      }
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  };

  const handleDialogDeleteSuccess = () => {
    actions.selectVehicle(null);
  };

  const selectedVehicle = vehicles.find(
    (v) => v.id === state.selectedVehicleId
  );

  /* ----------------------------------- KPI ---------------------------------- */
  const kpiItems = [
    {
      label: "Total Vehicle",
      value: dashboardData?.vehiclesKpis?.totalVehicles ?? 0,
      icon: <LocalShipping sx={{ fontSize: 22 }} />,
      color: theme.palette.primary.main,
    },
    {
      label: "Available Vehicle",
      value: dashboardData?.vehiclesKpis?.available ?? 0,
      icon: <CheckCircle sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.emerald,
    },
    {
      label: "Vehicle in Service",
      value: dashboardData?.vehiclesKpis?.inService ?? 0,
      icon: <Build sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.amber,
    },
    {
      label: "Vehicles On Trip",
      value: dashboardData?.vehiclesKpis?.onTrip ?? 0,
      icon: <DirectionsCar sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.sky,
    },
    {
      label: "Open Issues",
      value: dashboardData?.vehiclesKpis?.openIssues ?? 0,
      icon: <ReportProblem sx={{ fontSize: 22 }} />,
      color: theme.palette.error.main,
    },
    {
      label: "Document Expiring",
      value: dashboardData?.vehiclesKpis?.docsDueSoon ?? 0,
      icon: <Description sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.amber,
    },
  ];

  /* --------------------------------- RENDER --------------------------------- */
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
            Monitor and manage your fleet vehicles, maintenance, and compliance.
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

      <KpiCards kpis={kpiItems} loading={loading} />

      <Stack mt={2}>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            Vehicle List
          </Typography>

          <VehicleTable
            state={{
              ...state,
              vehicles,
              loading,
              error: null,
            } as any}
            actions={{
              ...actions,
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />
        </CustomCard>
      </Stack>

      <Stack mt={2} direction={{ xs: "column", md: "row" }} spacing={2}>
        <DocumentCalenderCard data={dashboardData?.expiringDocs || []} />

        <VehicleCapacityChart
          data={dashboardData?.vehiclesCapacity || []}
          loading={loading}
        />
      </Stack>

      <AddVehicleDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedVehicle && (
        <VehicleDialog
          key={state.selectedVehicleId}
          open={!!state.selectedVehicleId}
          onClose={() => actions.selectVehicle(null)}
          vehicleData={vehicles.find((v) => v.id === state.selectedVehicleId)}
          onUpdateSuccess={refreshAll}
          onDeleteSuccess={handleDialogDeleteSuccess}
          initialTab={tabFromUrl ? parseInt(tabFromUrl) : 0}
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
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
