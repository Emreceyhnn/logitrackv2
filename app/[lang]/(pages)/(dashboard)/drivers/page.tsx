"use client";

import {
  Box,
  Stack,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState, useMemo, Suspense, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getDictionary } from "@/app/lib/language/language";
import {
  DriverPageActions,
  DriverWithRelations,
  DriverFilters,
} from "@/app/lib/type/driver";
import { useDrivers, useDriverDashboardData, useDriverMutations } from "@/app/hooks/useDrivers";
import {
  Shield,
  Groups,
  Work,
  Home,
  ReportProblem,
  RocketLaunch,
} from "@mui/icons-material";
import DriverTable from "@/app/components/dashboard/driver/driverTable";
import DriverPerformanceCharts from "@/app/components/dashboard/driver/driverPerformanceCharts";

import DriverDialog from "@/app/components/dialogs/driver";
import AddDriverDialog from "@/app/components/dialogs/driver/addDriverDialog";
import EditDriverDialog from "@/app/components/dialogs/driver/editDriverDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import KpiCards from "@/app/components/cards/KpiCards";

export default function DriverPage() {
  return (
    <Suspense fallback={<Box p={4}>Loading...</Box>}>
      <DriverContent />
    </Suspense>
  );
}

function DriverContent() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const dict = useMemo(() => getDictionary(lang), [lang]);
  const searchParams = useSearchParams();
  const driverIdFromUrl = searchParams.get("id");
  const tabFromUrl = searchParams.get("tab");

  /* ---------------------------------- STATES --------------------------------- */
  const [state, setState] = useState<{
    filters: DriverFilters;
    pagination: { page: number; limit: number };
    sort: { field: string; order: "asc" | "desc" };
    selectedDriverId: string | null;
  }>({
    filters: {
      search: "",
      status: [],
      hasVehicle: undefined,
    },
    pagination: {
      page: 1,
      limit: 10,
    },
    sort: {
      field: "createdAt",
      order: "desc",
    },
    selectedDriverId: null,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState<DriverWithRelations | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);

  /* ---------------------------------- HOOKS --------------------------------- */
  const { 
    data: driversData, 
    isLoading: isDriversLoading,
    refetch: refetchDrivers 
  } = useDrivers(
    state.pagination.page,
    state.pagination.limit,
    state.filters.search,
    state.filters.status,
    state.filters.hasVehicle,
    state.sort.field,
    state.sort.order
  );

  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading,
    refetch: refetchDashboard 
  } = useDriverDashboardData();

  const { deleteDriver: deleteMutation } = useDriverMutations();

  const drivers = driversData?.data || [];
  const totalCount = driversData?.meta.total || 0;
  const loading = isDriversLoading || isDashboardLoading;

  /* --------------------------------- ACTIONS -------------------------------- */
  const refreshAll = useCallback(async () => {
    await Promise.all([refetchDrivers(), refetchDashboard()]);
  }, [refetchDrivers, refetchDashboard]);

  const actions: DriverPageActions = useMemo(
    () => ({
      fetchDrivers: async () => {}, // Handled by React Query
      fetchDashboardData: async () => {}, // Handled by React Query
      selectDriver: (id: string | null) => {
        setState((prev) => ({ ...prev, selectedDriverId: id }));
        if (id) setIsDetailsOpen(true);
      },
      updateFilters: (newFilters: Partial<DriverFilters>) => {
        setState((prev) => ({
          ...prev,
          filters: { ...prev.filters, ...newFilters },
          pagination: { ...prev.pagination, page: 1 },
        }));
      },
      changePage: async () => {}, // Handled by state
      refreshAll,
    }),
    [refreshAll]
  );

  /* -------------------------------- LIFECYCLE --------------------------------- */
  useEffect(() => {
    if (driverIdFromUrl) {
      actions.selectDriver(driverIdFromUrl);
    }
  }, [driverIdFromUrl, actions]);

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleEdit = (driver: DriverWithRelations) => {
    setDriverToEdit(driver);
    setIsEditOpen(true);
  };
  const handleDelete = (id: string) => {
    setDriverToDelete(id);
    setIsDeleteOpen(true);
  };
  const confirmDelete = async () => {
    if (!driverToDelete) return;

    try {
      await deleteMutation.mutateAsync(driverToDelete);
      setIsDeleteOpen(false);
      setDriverToDelete(null);
    } catch (error) {
      console.error("Failed to delete driver:", error);
    }
  };

  const handleFilterChange = (newFilters: Partial<DriverFilters>) => {
    actions.updateFilters(newFilters);
  };
  const handlePageChange = (newPage: number) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page: newPage },
    }));
  };
  const handleLimitChange = (newLimit: number) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, limit: newLimit, page: 1 },
    }));
  };
  const handleSort = (property: string) => {
    setState((prev) => ({
      ...prev,
      sort: {
        field: property,
        order:
          prev.sort.field === property && prev.sort.order === "asc"
            ? "desc"
            : "asc",
      },
    }));
  };

  /* ----------------------------------- KPI ---------------------------------- */
  const kpis = useMemo(() => [
    {
      label: dict.drivers.totalDrivers,
      value: dashboardData?.driversKpis?.totalDrivers ?? 0,
      icon: <Groups sx={{ fontSize: 22 }} />,
      color: theme.palette.primary.main,
    },
    {
      label: dict.drivers.onDuty,
      value: dashboardData?.driversKpis?.onDuty ?? 0,
      icon: <Work sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.emerald,
    },
    {
      label: dict.drivers.offDuty,
      value: dashboardData?.driversKpis?.offDuty ?? 0,
      icon: <Home sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.amber,
    },
    {
      label: dict.drivers.complianceIssues,
      value: dashboardData?.driversKpis?.complianceIssues ?? 0,
      icon: <ReportProblem sx={{ fontSize: 22 }} />,
      color: theme.palette.error.main,
    },
    {
      label: dict.drivers.safetyRating,
      value: dashboardData?.driversKpis?.avgSafetyScore ?? 0,
      icon: <Shield sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.indigo,
    },
    {
      label: dict.drivers.efficiencyRating,
      value: dashboardData?.driversKpis?.avgEfficiencyScore ?? 0,
      icon: <RocketLaunch sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.violet,
    },
  ], [dashboardData, theme, dict]);

  const selectedDriver = drivers.find(
    (d) => d.id === state.selectedDriverId
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
            {dict.drivers.title}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            {dict.drivers.subtitle}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {dict.drivers.addDriver}
        </Button>
      </Stack>

      <KpiCards kpis={kpis} loading={loading} />

      <Stack gap={2} mt={2}>
        <DriverTable
          filters={state.filters}
          onFilterChange={handleFilterChange}
          drivers={drivers}
          loading={loading}
          meta={{
            total: totalCount,
            page: state.pagination.page,
            limit: state.pagination.limit,
            totalPages: Math.ceil(totalCount / state.pagination.limit),
          }}
          onDriverSelect={actions.selectDriver}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={refreshAll}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          sortField={state.sort.field}
          sortOrder={state.sort.order}
          onRequestSort={handleSort}
        />
      </Stack>

      <DriverPerformanceCharts
        data={dashboardData?.performanceCharts}
        loading={loading}
      />

      <AddDriverDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={refreshAll}
      />

      <EditDriverDialog
        key={driverToEdit?.id}
        open={isEditOpen}
        driver={driverToEdit}
        onClose={() => setIsEditOpen(false)}
        onSuccess={refreshAll}
      />

      <DeleteConfirmationDialog
        open={isDeleteOpen}
        title="Delete Driver"
        description="Are you sure you want to delete this driver? This action cannot be undone."
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />

      <DriverDialog
        key={selectedDriver?.id}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        driverData={selectedDriver ?? null}
        onEdit={(driver) => {
          setDriverToEdit(driver);
          setIsEditOpen(true);
        }}
        onDelete={(id) => {
          setDriverToDelete(id);
          setIsDeleteOpen(true);
        }}
        initialTab={tabFromUrl ? parseInt(tabFromUrl) : 0}
      />
    </Box>
  );
}
