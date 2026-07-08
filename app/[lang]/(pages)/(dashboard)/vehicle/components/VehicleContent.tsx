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
import QueryErrorState from "@/app/components/ui/QueryErrorState";
import { toast } from "sonner";
import VehicleTable from "@/app/components/dashboard/vehicle/vehicleTable";
import DocumentCalenderCard from "@/app/components/dashboard/vehicle/documentCalenderCard";
import dynamic from "next/dynamic";
import ChartSkeleton from "@/app/components/skeletons/ChartSkeleton";

// @mui/x-charts is ~283 kB per route when imported statically. Loading the
// chart component lazily keeps it out of this route's First Load JS.
const VehicleCapacityChart = dynamic(
  () => import("@/app/components/dashboard/vehicle/maxLoad"),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
import TrailerTable from "@/app/components/dashboard/vehicle/trailerTable";

// Dialogs
import AddVehicleDialog from "@/app/components/dialogs/vehicle/addVehicleDialog";
import EditVehicleDialog from "@/app/components/dialogs/vehicle/editVehicleDialog";
import VehicleDialog from "@/app/components/dialogs/vehicle/vehicleDetailsDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import AddTrailerDialog from "@/app/components/dialogs/vehicle/addTrailerDialog";
import EditTrailerDialog from "@/app/components/dialogs/vehicle/editTrailerDialog";
import TrailerAssignmentDialog from "@/app/components/dialogs/vehicle/trailerAssignmentDialog";

// Hooks & Types
import { useVehicleWithDashboard, useVehicleMutations } from "@/app/hooks/useVehicles";
import { useTrailers, useTrailerMutations } from "@/app/hooks/useTrailers";
import {
  VehiclePageState,
  VehiclePageActions,
  VehicleWithRelations,
} from "@/app/lib/type/vehicle";
import { TrailerWithRelations, TrailerFilters } from "@/app/lib/type/trailer";
import { logger } from "@/app/lib/logger";


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

  const [trailerFilters, setTrailerFilters] = useState<TrailerFilters>({
    page: 1,
    limit: 10,
    search: "",
  });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionVehicle, setActionVehicle] =
    useState<VehicleWithRelations | null>(null);

  // Trailer states
  const [addTrailerOpen, setAddTrailerOpen] = useState(false);
  const [editTrailerOpen, setEditTrailerOpen] = useState(false);
  const [assignTrailerOpen, setAssignTrailerOpen] = useState(false);
  const [actionTrailer, setActionTrailer] = useState<TrailerWithRelations | null>(null);

  /* ─── Data Fetching ───────────────────────────────────────────────────── */
  const {
    data: dashboardData,
    isLoading: isVehiclesLoading,
    isFetching: isVehiclesFetching,
    isError: isVehiclesError,
    refetch: refetchVehicleWithDashboard,
  } = useVehicleWithDashboard(state.filters);

  const {
    data: trailerData,
    isLoading: isTrailersLoading,
    isFetching: isTrailersFetching,
    isError: isTrailersError,
    refetch: refetchTrailers,
  } = useTrailers(trailerFilters);

  const trailers = trailerData?.trailers || [];
  const trailerMeta = trailerData?.meta;

  const vehicles = dashboardData?.vehicles;
  // kpiLoading: only skeleton on initial load (not on pagination/filter refetch)
  const kpiLoading = activeTab === 0 ? isVehiclesLoading : isTrailersLoading;

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

  const updateTrailerFilters = useCallback(
    (newFilters: Partial<TrailerFilters>) => {
      setTrailerFilters((prev) => ({
        ...prev,
        ...newFilters,
        // Reset to page 1 on filter change
        ...(newFilters.page === undefined ? { page: 1 } : {}),
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
    actions.refreshAll();
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
        logger.error("Failed to delete vehicle:", error);
        toast.error(dict.common.actionFailed);
      }
    } else if (activeTab === 1 && actionTrailer) {
      try {
        await deleteTrailerMut.mutateAsync(actionTrailer.id);
        setDeleteDialogOpen(false);
      } catch (error) {
        logger.error("Failed to delete trailer:", error);
        toast.error(dict.common.actionFailed);
      }
    }
  };

  const handleDialogDeleteSuccess = () => {
    actions.selectVehicle(null);
  };

  // Trailer handlers
  const handleTrailerEdit = (trailer: TrailerWithRelations) => {
    setActionTrailer(trailer);
    setEditTrailerOpen(true);
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
      logger.error("Failed to detach trailer:", error);
      toast.error(dict.common.actionFailed);
    }
  };

  const selectedVehicle = vehicles?.find(
    (v) => v.id === state.selectedVehicleId
  );

  /* ─── KPI cards ───────────────────────────────────────────────────────── */
  const kpiItems = useMemo(
    () => {
      if (activeTab === 1) {
        return [
          {
            label: dict.trailers.kpis?.totalTrailers || "Total Trailers",
            value: trailerData?.kpis?.total ?? 0,
            icon: <LocalShipping />,
            color: theme.palette.primary.main,
          },
          {
            label: dict.trailers.kpis?.available || "Available",
            value: trailerData?.kpis?.available ?? 0,
            icon: <CheckCircle />,
            color: theme.palette.success.main,
          },
          {
            label: dict.trailers.kpis?.inUse || "In Use",
            value: trailerData?.kpis?.inUse ?? 0,
            icon: <DirectionsCar />,
            color: theme.palette.info.main,
          },
          {
            label: dict.trailers.kpis?.maintenance || "In Maintenance",
            value: trailerData?.kpis?.maintenance ?? 0,
            icon: <Build />,
            color: theme.palette.warning.main,
          },
          {
            label: dict.trailers.kpis?.openIssues || "Open Issues",
            value: trailerData?.kpis?.issues ?? 0,
            icon: <ReportProblem />,
            color:
              (trailerData?.kpis?.issues ?? 0) > 0
                ? theme.palette.error.main
                : theme.palette.success.main,
          },
        ];
      }

      return [
        {
          label: dict.vehicles.kpis.totalVehicles,
          value: dashboardData?.vehiclesKpis?.totalVehicles ?? 0,
          icon: <LocalShipping />,
          color: theme.palette.primary.main,
          trend: dashboardData?.kpiTrends?.totalVehicles,
        },
        {
          label: dict.vehicles.kpis.available,
          value: dashboardData?.vehiclesKpis?.available ?? 0,
          icon: <CheckCircle />,
          color: theme.palette.success.main,
        },
        {
          label: dict.vehicles.kpis.inService,
          value: dashboardData?.vehiclesKpis?.inService ?? 0,
          icon: <Build />,
          color: theme.palette.warning.main,
        },
        {
          label: dict.vehicles.kpis.onTrip,
          value: dashboardData?.vehiclesKpis?.onTrip ?? 0,
          icon: <DirectionsCar />,
          color: theme.palette.info.main,
        },
        {
          label: dict.vehicles.kpis.openIssues,
          value: dashboardData?.vehiclesKpis?.openIssues ?? 0,
          icon: <ReportProblem />,
          color:
            (dashboardData?.vehiclesKpis?.openIssues ?? 0) > 0
              ? theme.palette.error.main
              : theme.palette.success.main,
        },
        {
          label: dict.vehicles.kpis.docsExpiring,
          value: dashboardData?.vehiclesKpis?.docsDueSoon ?? 0,
          icon: <Description />,
          color:
            (dashboardData?.vehiclesKpis?.docsDueSoon ?? 0) > 0
              ? theme.palette.warning.main
              : theme.palette.success.main,
        },
      ];
    },
    [activeTab, dashboardData, trailerData, theme, dict]
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
            variant="h4" component="h1"
            sx={{ fontWeight: 800, color: "text.primary", letterSpacing: -0.5 }}
          >
            {activeTab === 0 ? dict.vehicles.title : dict.trailers.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {activeTab === 0 ? dict.vehicles.subtitle : dict.trailers.subtitle}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {/* Tab Switcher */}
          <Box
            data-tour="vehicle-tabs"
            sx={{
              display: "inline-flex",
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
                bgcolor: activeTab === 0 ? theme.palette.primary._alpha.main_15 : "transparent",
                color: activeTab === 0 ? "primary.main" : "text.secondary",
                fontWeight: activeTab === 0 ? 700 : 500,
                fontSize: 15,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: activeTab === 0 ? theme.palette.primary._alpha.main_20 : theme.palette.action.hover,
                },
                ...(activeTab === 0 && {
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  border: `1px solid ${theme.palette.primary._alpha.main_20}`,
                }),
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
                bgcolor: activeTab === 1 ? theme.palette.primary._alpha.main_15 : "transparent",
                color: activeTab === 1 ? "primary.main" : "text.secondary",
                fontWeight: activeTab === 1 ? 700 : 500,
                fontSize: 15,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: activeTab === 1 ? theme.palette.primary._alpha.main_20 : theme.palette.action.hover,
                },
                ...(activeTab === 1 && {
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  border: `1px solid ${theme.palette.primary._alpha.main_20}`,
                }),
              }}
            >
              {dict.vehicles.tabs.trailers}
            </Button>
          </Box>
          
          <Button
            data-tour="vehicle-add"
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
      <KpiCards kpis={kpiItems} loading={kpiLoading} />

      {/* Content based on Tab */}
      <Stack mt={2} data-tour="vehicle-table">
        {activeTab === 0 && isVehiclesError ? (
          <QueryErrorState onRetry={() => refetchVehicleWithDashboard()} />
        ) : activeTab === 1 && isTrailersError ? (
          <QueryErrorState onRetry={() => refetchTrailers()} />
        ) : activeTab === 0 ? (
          <VehicleTable
            state={
              {
                ...state,
                vehicles,
                dashboardData: dashboardData ?? null,
                loading: isVehiclesFetching,
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
            loading={isTrailersFetching}
            onEdit={handleTrailerEdit}
            onDelete={handleTrailerDelete}
            onAssign={handleTrailerAssign}
            onDetach={handleTrailerDetach}
            filters={trailerFilters}
            meta={trailerMeta}
            actions={{
              updateFilters: updateTrailerFilters,
              setPage: (page: number) => updateTrailerFilters({ page }),
              setLimit: (limit: number) => updateTrailerFilters({ limit }),
            }}
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
            loading={isVehiclesLoading}
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

      <EditTrailerDialog
        key={`edit-trailer-${actionTrailer?.id}`}
        open={editTrailerOpen}
        onClose={() => {
          setEditTrailerOpen(false);
          setActionTrailer(null);
        }}
        onSuccess={refreshAll}
        trailer={actionTrailer}
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
          key={`edit-vehicle-${actionVehicle.id}`}
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setActionVehicle(null);
          }}
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
