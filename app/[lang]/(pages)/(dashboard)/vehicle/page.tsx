"use client";

import DocumentCalenderCard from "@/app/components/dashboard/vehicle/documentCalenderCard";
import VehicleCapacityChart from "@/app/components/dashboard/vehicle/maxLoad";
import VehicleTable from "@/app/components/dashboard/vehicle/vehicleTable";
import AddVehicleDialog from "@/app/components/dialogs/vehicle/addVehicleDialog";
import VehicleDialog from "@/app/components/dialogs/vehicle/vehicleDetailsDialog";
import {
  useVehicleMutations,
  useVehicleWithDashboard,
} from "@/app/hooks/useVehicles";
import {
  VehiclePageActions,
  VehiclePageState,
  VehicleWithRelations,
} from "@/app/lib/type/vehicle";
import { Box, Stack, Typography, Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import EditVehicleDialog from "@/app/components/dialogs/vehicle/editVehicleDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
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
  const dict = useDictionary();
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
  const [actionVehicle, setActionVehicle] =
    useState<VehicleWithRelations | null>(null);

  /* ---------------------------------- HOOKS --------------------------------- */
  const {
    data: dashboardData,
    isLoading: isVehiclesLoading,
    refetch: refetchVehicleWithDashboard,
  } = useVehicleWithDashboard(state.filters);

  const vehicles = dashboardData?.vehicles;
  const loading = isVehiclesLoading;

  const { deleteVehicle: deleteMutation } = useVehicleMutations();

  /* ---------------------------------- ACTIONS ------------------------------- */
  const refreshAll = useCallback(async () => {
    await Promise.all([refetchVehicleWithDashboard()]);
  }, [refetchVehicleWithDashboard]);

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
      fetchVehicles: async () => {},
      fetchDashboardData: async () => {},
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
      const v = vehicles?.find((v) => v.id === id);
      if (v) {
        setActionVehicle(v);
        setEditDialogOpen(true);
      }
    },
    [vehicles]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const v = vehicles?.find((v) => v.id === id);
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

  const selectedVehicle = vehicles?.find(
    (v) => v.id === state.selectedVehicleId
  );

  /* ----------------------------------- KPI ---------------------------------- */
  const kpiItems = useMemo(
    () => [
      {
        label: dict.vehicles.kpis.totalVehicles,
        value: dashboardData?.vehiclesKpis?.totalVehicles ?? 0,
        icon: <LocalShipping sx={{ fontSize: 22 }} />,
        color: theme.palette.primary.main,
      },
      {
        label: dict.vehicles.kpis.available,
        value: dashboardData?.vehiclesKpis?.available ?? 0,
        icon: <CheckCircle sx={{ fontSize: 22 }} />,
        color: theme.palette.kpi.emerald,
      },
      {
        label: dict.vehicles.kpis.inService,
        value: dashboardData?.vehiclesKpis?.inService ?? 0,
        icon: <Build sx={{ fontSize: 22 }} />,
        color: theme.palette.kpi.amber,
      },
      {
        label: dict.vehicles.kpis.onTrip,
        value: dashboardData?.vehiclesKpis?.onTrip ?? 0,
        icon: <DirectionsCar sx={{ fontSize: 22 }} />,
        color: theme.palette.kpi.sky,
      },
      {
        label: dict.vehicles.kpis.openIssues,
        value: dashboardData?.vehiclesKpis?.openIssues ?? 0,
        icon: <ReportProblem sx={{ fontSize: 22 }} />,
        color: theme.palette.kpi.error,
      },
      {
        label: dict.vehicles.kpis.docsExpiring,
        value: dashboardData?.vehiclesKpis?.docsDueSoon ?? 0,
        icon: <Description sx={{ fontSize: 22 }} />,
        color: theme.palette.kpi.amber,
      },
    ],
    [dashboardData, theme, dict]
  );

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
            {dict.vehicles.title}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            {dict.vehicles.subtitle}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {dict.vehicles.addVehicle}
        </Button>
      </Stack>

      <KpiCards kpis={kpiItems} loading={loading} />

      <Stack mt={2}>
        <VehicleTable
          state={
            {
              ...state,
              vehicles,
              dashboardData: dashboardData ?? null,
              loading,
              error: null,
            } as VehiclePageState
          }
          actions={{
            ...actions,
            onEdit: handleEdit,
            onDelete: handleDelete,
          }}
        />
      </Stack>

      <Stack mt={2} direction={{ xs: "column", md: "row" }} spacing={2}>
        <DocumentCalenderCard 
          data={dashboardData?.expiringDocs || []} 
          maintenanceData={dashboardData?.plannedServices || []}
        />

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
          vehicleData={vehicles?.find((v) => v.id === state.selectedVehicleId)}
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
        title={dict.common.confirmDelete}
        description={`${dict.common.deleteDocumentDesc || "Are you sure you want to delete this item?"} (${actionVehicle?.plate})`}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
