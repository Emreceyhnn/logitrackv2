"use client";

import { useState, useCallback, useMemo } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { LocalShipping, CheckCircle, Build, DirectionsCar, ReportProblem, Description } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { toast } from "sonner";
import { useDemoVehicleWithDashboard, useDemoTrailers } from "@/app/hooks/demo/useDemoVehicles";
import { VehiclePageState, VehiclePageActions } from "@/app/lib/type/vehicle";
import { TrailerFilters } from "@/app/lib/type/trailer";

/**
 * Demo-only fork of useVehicleContent (app/hooks/useVehicleContent.tsx).
 * Drops all real mutations (useVehicleMutations / useTrailerMutations) and
 * every add/edit/delete/assign/detach dialog-open state — every mutating
 * action instead fires a "disabled in demo" toast directly. Data comes from
 * the fixed demo dataset via useDemoVehicleWithDashboard / useDemoTrailers.
 */
export const useDemoVehicleContent = () => {
  const theme = useTheme();
  const dict = useDictionary();

  const [activeTab, setActiveTab] = useState(0);
  const [state, setState] = useState<{ filters: VehiclePageState["filters"]; selectedVehicleId: string | null; }>({ filters: {}, selectedVehicleId: null });
  const [trailerFilters] = useState<TrailerFilters>({ page: 1, limit: 10, search: "" });

  const { data: dashboardData, isLoading: isVehiclesLoading, isFetching: isVehiclesFetching, isError: isVehiclesError, refetch: refetchVehicleWithDashboard } = useDemoVehicleWithDashboard();
  const { data: trailerData, isFetching: isTrailersFetching, isError: isTrailersError, refetch: refetchTrailers } = useDemoTrailers();

  const trailers = trailerData?.trailers || [];
  const trailerMeta = trailerData?.meta;
  const vehicles = dashboardData?.vehicles;
  const kpiLoading = activeTab === 0 ? isVehiclesLoading : isVehiclesLoading;

  const notifyDisabled = useCallback(() => {
    toast.info(dict.toasts.demoActionDisabled);
  }, [dict]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refetchVehicleWithDashboard()]);
  }, [refetchVehicleWithDashboard]);

  const selectVehicle = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedVehicleId: id }));
  }, []);

  // Filters are inert in the demo — the dataset is fixed. Params are kept for
  // signature parity (callers pass { page }/{ limit }) but ignored; `void`
  // marks them consumed so eslint's no-unused-vars stays quiet.
  const updateFilters = useCallback(
    (newFilters: Partial<VehiclePageState["filters"]>) => {
      void newFilters;
      notifyDisabled();
    },
    [notifyDisabled]
  );

  const updateTrailerFilters = useCallback(
    (newFilters: Partial<TrailerFilters>) => {
      void newFilters;
      notifyDisabled();
    },
    [notifyDisabled]
  );

  const actions: VehiclePageActions = useMemo(() => ({ fetchVehicles: async () => {}, fetchDashboardData: async () => {}, refreshAll, selectVehicle, updateFilters }), [refreshAll, selectVehicle, updateFilters]);

  const handleEdit = useCallback(() => notifyDisabled(), [notifyDisabled]);
  const handleDelete = useCallback(() => notifyDisabled(), [notifyDisabled]);
  const handleTrailerEdit = useCallback(() => notifyDisabled(), [notifyDisabled]);
  const handleTrailerDelete = useCallback(() => notifyDisabled(), [notifyDisabled]);
  const handleTrailerAssign = useCallback(() => notifyDisabled(), [notifyDisabled]);
  const handleTrailerDetach = useCallback(async () => notifyDisabled(), [notifyDisabled]);

  const kpiItems = useMemo(() => {
    if (activeTab === 1) {
      return [
        { label: dict.trailers.kpis?.totalTrailers || "Total Trailers", value: trailerData?.kpis?.total ?? 0, icon: <LocalShipping />, color: theme.palette.primary.main },
        { label: dict.trailers.kpis?.available || "Available", value: trailerData?.kpis?.available ?? 0, icon: <CheckCircle />, color: theme.palette.success.main },
        { label: dict.trailers.kpis?.inUse || "In Use", value: trailerData?.kpis?.inUse ?? 0, icon: <DirectionsCar />, color: theme.palette.info.main },
        { label: dict.trailers.kpis?.maintenance || "In Maintenance", value: trailerData?.kpis?.maintenance ?? 0, icon: <Build />, color: theme.palette.warning.main },
        { label: dict.trailers.kpis?.openIssues || "Open Issues", value: trailerData?.kpis?.issues ?? 0, icon: <ReportProblem />, color: (trailerData?.kpis?.issues ?? 0) > 0 ? theme.palette.error.main : theme.palette.success.main },
      ];
    }
    return [
      { label: dict.vehicles.kpis.totalVehicles, value: dashboardData?.vehiclesKpis?.totalVehicles ?? 0, icon: <LocalShipping />, color: theme.palette.primary.main, trend: dashboardData?.kpiTrends?.totalVehicles },
      { label: dict.vehicles.kpis.available, value: dashboardData?.vehiclesKpis?.available ?? 0, icon: <CheckCircle />, color: theme.palette.success.main },
      { label: dict.vehicles.kpis.inService, value: dashboardData?.vehiclesKpis?.inService ?? 0, icon: <Build />, color: theme.palette.warning.main },
      { label: dict.vehicles.kpis.onTrip, value: dashboardData?.vehiclesKpis?.onTrip ?? 0, icon: <DirectionsCar />, color: theme.palette.info.main },
      { label: dict.vehicles.kpis.openIssues, value: dashboardData?.vehiclesKpis?.openIssues ?? 0, icon: <ReportProblem />, color: (dashboardData?.vehiclesKpis?.openIssues ?? 0) > 0 ? theme.palette.error.main : theme.palette.success.main },
      { label: dict.vehicles.kpis.docsExpiring, value: dashboardData?.vehiclesKpis?.docsDueSoon ?? 0, icon: <Description />, color: (dashboardData?.vehiclesKpis?.docsDueSoon ?? 0) > 0 ? theme.palette.warning.main : theme.palette.success.main },
    ];
  }, [activeTab, dashboardData, trailerData, theme, dict]);

  return {
    dict, activeTab, setActiveTab, state, trailerFilters,
    dashboardData, isVehiclesLoading, isVehiclesFetching, isVehiclesError, refetchVehicleWithDashboard,
    isTrailersFetching, isTrailersError, refetchTrailers,
    trailers, trailerMeta, vehicles, kpiLoading,
    actions, handleEdit, handleDelete,
    handleTrailerEdit, handleTrailerDelete, handleTrailerAssign, handleTrailerDetach, kpiItems,
    updateTrailerFilters, refreshAll, notifyDisabled,
  };
};
