"use client";

import DriverKpiCard from "@/app/components/dashboard/driver/driverKpiCard";
import DriverTable from "@/app/components/dashboard/driver/driverTable";
import DriverPerformanceCharts from "@/app/components/dashboard/driver/driverPerformanceCharts";
import { Box, Stack, Typography, Button, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
  DriverPageState,
  DriverPageActions,
  DriverWithRelations,
  DriverFilters,
} from "@/app/lib/type/driver";
import {
  getDriverDashboardData,
  getDrivers,
  deleteDriver,
} from "@/app/lib/controllers/driver";

import DriverDialog from "@/app/components/dialogs/driver";
import DriverTableToolbar from "@/app/components/dashboard/driver/driverTable/toolbar";
import EditDriverDialog from "@/app/components/dialogs/driver/editDriverDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import AddDriverDialog from "@/app/components/dialogs/driver/addDriverDialog";
import CustomCard from "@/app/components/cards/card";

export default function DriverPage() {
  /* ---------------------------------- State --------------------------------- */
  const [state, setState] = useState<
    DriverPageState & { sort: { field: string; order: "asc" | "desc" } }
  >({
    drivers: [],
    dashboardData: null,
    filters: {
      search: "",
      status: [],
      hasVehicle: undefined,
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
    sort: {
      field: "createdAt",
      order: "desc",
    },
    selectedDriverId: null,
    selectedDriver: null,
    loading: true,
    error: null,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState<DriverWithRelations | null>(
    null
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);




  /* --------------------------------- Actions -------------------------------- */
  const actions: DriverPageActions = useMemo(() => ({
    fetchDrivers: async (
      page = 1,
      limit = 10,
      currentFilters = state.filters,
      currentSort = state.sort
    ) => {
      try {
        const result = await getDrivers(
          page,
          limit,
          currentFilters.search,
          currentFilters.status,
          currentFilters.hasVehicle,
          currentSort.field,
          currentSort.order
        );
        setState((prev) => ({
          ...prev,
          drivers: result.data as unknown as DriverWithRelations[],
          pagination: {
            page: result.meta.page,
            limit: result.meta.limit,
            total: result.meta.total,
          },
          loading: false,
        }));
      } catch (error: unknown) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "An unknown error occurred",
          loading: false,
        }));
      }
    },

    fetchDashboardData: async () => {
      try {
        const data = await getDriverDashboardData();
        setState((prev) => ({
          ...prev,
          dashboardData: data
            ? {
                ...data,
                performanceCharts: data.performanceCharts.map((chart) => ({
                  ...chart,
                  days: chart.days.map((d) => Number(d)),
                })),
              }
            : null,
        }));
      } catch (error: unknown) {
        console.error("Failed dashboard data", error);
      }
    },

    selectDriver: (id: string | null) => {
      setState((prev) => {
        const driver = prev.drivers.find((d) => d.id === id) || null;
        return { ...prev, selectedDriverId: id, selectedDriver: driver };
      });
      if (id) setIsDetailsOpen(true);
    },

    updateFilters: (newFilters: Partial<DriverFilters>) => {
      setState((prev) => {
        const updatedFilters = { ...prev.filters, ...newFilters };
        return {
          ...prev,
          filters: updatedFilters,
          pagination: { ...prev.pagination, page: 1 },
          loading: true,
        };
      });
    },

    changePage: async (_newPage: number) => {
      setState((prev) => ({ ...prev, loading: true }));
    },

    refreshAll: async () => {
      setState((prev) => ({ ...prev, loading: true }));
      await actions.fetchDrivers(
        state.pagination.page,
        state.pagination.limit,
        state.filters,
        state.sort
      );
      await actions.fetchDashboardData();
    },
  }), [state.filters, state.sort, state.pagination.page, state.pagination.limit, state.drivers]);

  /* -------------------------------- Lifecycle --------------------------------- */
  useEffect(() => {
    actions.fetchDrivers(
      state.pagination.page,
      state.pagination.limit,
      state.filters,
      state.sort
    );

    if (!state.dashboardData) {
      actions.fetchDashboardData();
    }
  }, [
    actions, 
    state.dashboardData, 
    state.pagination.page, 
    state.pagination.limit, 
    state.filters, 
    state.sort
  ]);

  /* -------------------------------- Handlers -------------------------------- */
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
    setDeleteLoading(true);
    try {
      await deleteDriver(driverToDelete);
      setIsDeleteOpen(false);
      actions.fetchDrivers(

        state.pagination.page,
        state.pagination.limit,
        state.filters
      );
      actions.fetchDashboardData();
    } catch (error: unknown) {
      console.error("Delete failed", error);
    } finally {

      setDeleteLoading(false);
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
            Driver Management
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Manage your fleet drivers, monitor performance and license status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Driver
        </Button>
      </Stack>

      {state.error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {state.error}
        </Typography>
      )}

      <DriverKpiCard data={state.dashboardData?.driversKpis || null} loading={state.loading} />

      <Stack gap={2} mt={2}>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            Driver List
          </Typography>
          <DriverTableToolbar
            filters={state.filters}
            onFilterChange={handleFilterChange}
          />
          <Divider />
          <DriverTable
            drivers={state.drivers}
            loading={state.loading}
            meta={{
              total: state.pagination.total,
              page: state.pagination.page,
              limit: state.pagination.limit,
              totalPages: Math.ceil(
                state.pagination.total / state.pagination.limit
              ),
            }}
            onDriverSelect={actions.selectDriver}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={() =>
              actions.fetchDrivers(
                state.pagination.page,
                state.pagination.limit,
                state.filters
              )
            }
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            sortField={state.sort.field}
            sortOrder={state.sort.order}
            onRequestSort={handleSort}
          />
        </CustomCard>
      </Stack>

      <DriverPerformanceCharts data={state.dashboardData?.performanceCharts} loading={state.loading} />

      <AddDriverDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() =>
          actions.fetchDrivers(1, state.pagination.limit, state.filters)
        }
      />

      <EditDriverDialog
        key={driverToEdit?.id}
        open={isEditOpen}
        driver={driverToEdit}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() =>
          actions.fetchDrivers(
            state.pagination.page,
            state.pagination.limit,
            state.filters
          )
        }
      />

      <DeleteConfirmationDialog
        open={isDeleteOpen}
        title="Delete Driver"
        description="Are you sure you want to delete this driver? This action cannot be undone."
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

      <DriverDialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        driverData={state.selectedDriver}
      />
    </Box>
  );
}
