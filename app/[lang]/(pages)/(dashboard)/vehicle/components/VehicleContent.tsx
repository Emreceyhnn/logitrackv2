"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  useTheme,
} from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useSearchParams } from "next/navigation";
import {
  LocalShipping,
  CheckCircle,
  Build,
  DirectionsCar,
  ReportProblem,
  Description,
  Add as AddIcon,
} from "@mui/icons-material";

// Components
import KpiCards from "@/app/components/cards/KpiCards";
import VehicleTable from "@/app/components/dashboard/vehicle/vehicleTable";
import DocumentCalenderCard from "@/app/components/dashboard/vehicle/documentCalenderCard";
import VehicleCapacityChart from "@/app/components/dashboard/vehicle/maxLoad";
import TrailerTable from "@/app/components/dashboard/vehicle/trailerTable";

// Dialogs
import AddVehicleDialog from "@/app/components/dialogs/vehicle/addVehicleDialog";
import EditVehicleDialog from "@/app/components/dialogs/vehicle/editVehicleDialog";
import VehicleDialog from "@/app/components/dialogs/vehicle/vehicleDetailsDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import AddTrailerDialog from "@/app/components/dialogs/vehicle/addTrailerDialog";
import TrailerAssignmentDialog from "@/app/components/dialogs/vehicle/trailerAssignmentDialog";

// Hooks & Types
import { useVehicleWithDashboard, useVehicleMutations } from "@/app/hooks/useVehicles";
import { useTrailers, useTrailerMutations } from "@/app/hooks/useTrailers";
import {
  VehiclePageState,
  VehiclePageActions,
  VehicleWithRelations,
} from "@/app/lib/type/vehicle";
import { TrailerWithRelations } from "@/app/lib/type/trailer.types";

export default function VehicleContent() {
  /* ─── Context ─────────────────────────────────────────────────────────── */
  const theme = useTheme();
  const dict = useDictionary();
  const searchParams = useSearchParams();
  const vehicleIdFromUrl = searchParams.get("id");
  const tabFromUrl = searchParams.get("tab");

  /* ─── Page State ──────────────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState(0); // 0: Vehicles, 1: Trailers
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

  // Trailer states
  const [addTrailerOpen, setAddTrailerOpen] = useState(false);
  const [assignTrailerOpen, setAssignTrailerOpen] = useState(false);
  const [actionTrailer, setActionTrailer] = useState<TrailerWithRelations | null>(null);

  /* ─── Data Fetching ───────────────────────────────────────────────────── */
  const {
    data: dashboardData,
    isLoading: isVehiclesLoading,
    isFetching: isVehiclesFetching,
    refetch: refetchVehicleWithDashboard,
  } = useVehicleWithDashboard(state.filters);

  const {
    data: trailers,
    isLoading: isTrailersLoading,
    isFetching: isTrailersFetching,
  } = useTrailers();

  const vehicles = dashboardData?.vehicles;
  const loading = isVehiclesLoading || (activeTab === 1 && isTrailersLoading);
  const isFetching = isVehiclesFetching || (activeTab === 1 && isTrailersFetching);

  const { deleteVehicle: deleteMutation } = useVehicleMutations();
  const { deleteTrailer: deleteTrailerMut, assignTrailer: detachTrailerMut } = useTrailerMutations();

  /* ─── Page Actions ────────────────────────────────────────────────────── */
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

  /* ─── Lifecycle ───────────────────────────────────────────────────────── */
  useEffect(() => {
    if (vehicleIdFromUrl) {
      actions.selectVehicle(vehicleIdFromUrl);
    }
  }, [vehicleIdFromUrl, actions]);

  /* ─── Handlers ────────────────────────────────────────────────────────── */
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
    if (activeTab === 0 && actionVehicle) {
      try {
        await deleteMutation.mutateAsync(actionVehicle.id);
        setDeleteDialogOpen(false);
        if (state.selectedVehicleId === actionVehicle.id) {
          actions.selectVehicle(null);
        }
      } catch (error) {
        console.error("Failed to delete vehicle:", error);
      }
    } else if (activeTab === 1 && actionTrailer) {
      try {
        await deleteTrailerMut.mutateAsync(actionTrailer.id);
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error("Failed to delete trailer:", error);
      }
    }
  };

  const handleDialogDeleteSuccess = () => {
    actions.selectVehicle(null);
  };

  // Trailer handlers
  const handleTrailerEdit = (trailer: TrailerWithRelations) => {
    // Implement trailer edit if needed, or just open a generic edit dialog
  };

  const handleTrailerDelete = (trailer: TrailerWithRelations) => {
    setActionTrailer(trailer);
    setDeleteDialogOpen(true);
  };

  const handleTrailerAssign = (trailer: TrailerWithRelations) => {
    setActionTrailer(trailer);
    setAssignTrailerOpen(true);
  };

  const handleTrailerDetach = async (trailer: TrailerWithRelations) => {
    try {
      await detachTrailerMut.mutateAsync({ trailerId: trailer.id, vehicleId: null });
    } catch (error) {
      console.error("Failed to detach trailer:", error);
    }
  };

  const selectedVehicle = vehicles?.find(
    (v) => v.id === state.selectedVehicleId
  );

  /* ─── KPI cards ───────────────────────────────────────────────────────── */
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

  /* ─── Render ──────────────────────────────────────────────────────────── */
  return (
    <Box position={"relative"} p={4} width={"100%"}>
      {/* Header */}
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
            {activeTab === 0 ? dict.vehicles.title : dict.trailers.title}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            {activeTab === 0 ? dict.vehicles.subtitle : dict.trailers.subtitle}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {/* Tab Switcher */}
          <Box
            sx={{
              display: "flex",
              p: 0.5,
              bgcolor: "background.paper",
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              onClick={() => setActiveTab(0)}
              sx={{
                px: 3,
                textTransform: "none",
                borderRadius: 1.5,
                bgcolor: activeTab === 0 ? theme.palette.primary._alpha.main_10 : "transparent",
                color: activeTab === 0 ? "primary.main" : "text.secondary",
                fontWeight: activeTab === 0 ? 700 : 500,
                "&:hover": {
                  bgcolor: activeTab === 0 ? theme.palette.primary._alpha.main_15 : theme.palette.action.hover,
                },
              }}
            >
              {dict.vehicles.tabs.vehicles}
            </Button>
            <Button
              onClick={() => setActiveTab(1)}
              sx={{
                px: 3,
                textTransform: "none",
                borderRadius: 1.5,
                bgcolor: activeTab === 1 ? theme.palette.primary._alpha.main_10 : "transparent",
                color: activeTab === 1 ? "primary.main" : "text.secondary",
                fontWeight: activeTab === 1 ? 700 : 500,
                "&:hover": {
                  bgcolor: activeTab === 1 ? theme.palette.primary._alpha.main_15 : theme.palette.action.hover,
                },
              }}
            >
              {dict.vehicles.tabs.trailers}
            </Button>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => activeTab === 0 ? setAddDialogOpen(true) : setAddTrailerOpen(true)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {activeTab === 0 ? dict.vehicles.addVehicle : dict.trailers.addTrailer}
          </Button>
        </Stack>
      </Stack>

      {/* KPI Cards — rendered with SSR data on first paint */}
      <KpiCards kpis={kpiItems} loading={loading} />

      {/* Content based on Tab */}
      <Stack mt={2}>
        {activeTab === 0 ? (
          <VehicleTable
            state={
              {
                ...state,
                vehicles,
                dashboardData: dashboardData ?? null,
                loading: isFetching,
                error: null,
              } as VehiclePageState
            }
            actions={{
              ...actions,
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />
        ) : (
          <TrailerTable
            trailers={trailers || []}
            loading={isFetching}
            onEdit={handleTrailerEdit}
            onDelete={handleTrailerDelete}
            onAssign={handleTrailerAssign}
            onDetach={handleTrailerDetach}
          />
        )}
      </Stack>

      {/* Charts (Only show on Vehicles tab or shared if relevant) */}
      {activeTab === 0 && (
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
      )}

      {/* Dialogs */}
      <AddVehicleDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <AddTrailerDialog
        open={addTrailerOpen}
        onClose={() => setAddTrailerOpen(false)}
        onSuccess={refreshAll}
      />

      <TrailerAssignmentDialog
        open={assignTrailerOpen}
        onClose={() => setAssignTrailerOpen(false)}
        trailer={actionTrailer}
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
        description={`${dict.common.deleteDocumentDesc || "Are you sure you want to delete this item?"} (${activeTab === 0 ? actionVehicle?.plate : actionTrailer?.plate})`}
        loading={activeTab === 0 ? deleteMutation.isPending : deleteTrailerMut.isPending}
      />
    </Box>
  );
}
