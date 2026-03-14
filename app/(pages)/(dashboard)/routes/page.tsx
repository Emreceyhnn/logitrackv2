"use client";

import RoutesKpiCard from "@/app/components/dashboard/routes/routesKpiCard";
import RoutesMainMap from "@/app/components/dashboard/routes/routesMainMap";
import RouteEfficiency from "@/app/components/dashboard/routes/routeEfficiency";
import RouteTable from "@/app/components/dashboard/routes/routeTable";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  RoutesPageActions,
  RoutesPageState,
  RouteWithRelations,
} from "@/app/lib/type/routes";
import {
  getActiveRoutesLocations,
  getRouteEfficiencyStats,
  getRoutes,
  getRouteStats,
  deleteRoute,
} from "@/app/lib/controllers/routes";
import EditRouteDialog from "@/app/components/dialogs/routes/edit-route-dialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import { useUser } from "@/app/lib/hooks/useUser";
import AddRouteDialog from "@/app/components/dialogs/routes/addRouteDialog";

export default function RoutesPage() {
  /* -------------------------------- variables ------------------------------- */
  const { user } = useUser();

  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<RoutesPageState>({
    routes: [],
    stats: null,
    efficiency: null,
    mapData: [],
    filters: {},
    pagination: {
      page: 0,
      pageSize: 10,
      total: 0,
    },
    selectedRouteId: null,
    viewMode: "list",
    loading: true,
    error: null,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionRoute, setActionRoute] = useState<RouteWithRelations | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* --------------------------------- actions -------------------------------- */
  const fetchRoutesData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const [routesData, statsData, efficiencyData, mapDataLocations] =
        await Promise.all([
          getRoutes(
            state.pagination.page + 1,
            state.pagination.pageSize,
            state.filters.status
          ),
          getRouteStats(),
          getRouteEfficiencyStats(),
          getActiveRoutesLocations(),
        ]);

      setState((prev) => ({
        ...prev,
        routes: routesData.routes as RouteWithRelations[],
        stats: statsData,
        efficiency: efficiencyData as any,
        mapData: mapDataLocations as any,
        pagination: {
          ...prev.pagination,
          total: routesData.totalCount,
        },
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to fetch routes data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load routes data",
      }));
    }
  }, [state.pagination.page, state.pagination.pageSize, state.filters.status]);

  const actions: RoutesPageActions = {
    fetchRoutes: async (page, status) => {},
    fetchStats: async () => {},
    fetchEfficiency: async () => {},
    fetchMapData: async () => {},
    refreshAll: async () => {
      await fetchRoutesData();
    },
    updateFilters: (filters) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
        pagination: { ...prev.pagination, page: 0 },
      }));
    },
    selectRoute: (id) => {
      setState((prev) => ({ ...prev, selectedRouteId: id }));
    },
    setViewMode: (mode) => {
      setState((prev) => ({ ...prev, viewMode: mode }));
    },
    changePage: (newPage) => {
      setState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, page: newPage },
      }));
    },
  };

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    fetchRoutesData();
  }, [fetchRoutesData]);

  /* -------------------------------- handlers -------------------------------- */
  const handlePageChange = (newPage: number) => {
    actions.changePage(newPage);
  };
  const handleEdit = (id: string) => {
    const route = state.routes.find((r) => r.id === id);
    if (route) {
      setActionRoute(route);
      setEditOpen(true);
    }
  };
  const handleDelete = (id: string) => {
    const route = state.routes.find((r) => r.id === id);
    if (route) {
      setActionRoute(route);
      setDeleteOpen(true);
    }
  };
  const handleDeleteConfirm = async () => {
    if (!actionRoute || !user) return;
    setDeleteLoading(true);
    try {
      await deleteRoute(actionRoute.id, user.id);
      setDeleteOpen(false);
      actions.refreshAll();
    } catch (error) {
      console.error("Failed to delete route:", error);
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleCloseAdd = () => {
    setAddDialogOpen(false);
    actions.refreshAll();
  };

  return (
    <Box position={"relative"} p={{ xs: 2, md: 4 }} width={"100%"}>
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
            Routes Management
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Manage your routes, monitor performance and status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Route
        </Button>
      </Stack>
      <RoutesKpiCard stats={state.stats} loading={state.loading} />
      <Stack mt={2} direction={"row"} spacing={3}>
        <RoutesMainMap mapData={state.mapData} loading={state.loading} />
        <RouteEfficiency data={state.efficiency} loading={state.loading} />
      </Stack>
      <Stack mt={2}>
        <RouteTable
          routes={state.routes}
          loading={state.loading}
          pagination={state.pagination}
          onPageChange={handlePageChange}
          onSelect={actions.selectRoute}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={actions.refreshAll}
        />
      </Stack>

      <EditRouteDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        route={actionRoute}
        onSuccess={actions.refreshAll}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Route?"
        description={`Are you sure you want to delete route ${actionRoute?.name || actionRoute?.id}?`}
        loading={deleteLoading}
      />
      <AddRouteDialog open={addDialogOpen} onClose={handleCloseAdd} />
    </Box>
  );
}
