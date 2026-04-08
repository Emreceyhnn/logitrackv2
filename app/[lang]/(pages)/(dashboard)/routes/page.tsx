"use client";

import RoutesMainMap from "@/app/components/dashboard/routes/routesMainMap";
import RouteEfficiency from "@/app/components/dashboard/routes/routeEfficiency";
import RouteTable from "@/app/components/dashboard/routes/routeTable";
import {
  Box,
  Button,
  Stack,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import CustomCard from "@/app/components/cards/card";
import { useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  RoutesPageActions,
  RouteWithRelations,
  RouteEfficiencyStats,
  MapRouteData,
  RoutesPageState,
} from "@/app/lib/type/routes";
import { 
  useRoutes, 
  useRouteStats, 
  useRouteEfficiency, 
  useRouteLocations, 
  useRouteMutations 
} from "@/app/hooks/useRoutes";
import EditRouteDialog from "@/app/components/dialogs/routes/edit-route-dialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import { useUser } from "@/app/lib/hooks/useUser";
import AddRouteDialog from "@/app/components/dialogs/routes/addRouteDialog";
import { AltRoute, Loop, CheckCircle, Warning } from "@mui/icons-material";
import KpiCards from "@/app/components/cards/KpiCards";

export default function RoutesPage() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const { user } = useUser();
  const theme = useTheme();

  /* --------------------------------- STATE --------------------------------- */
  const [filters, setFilters] = useState<RoutesPageState["filters"]>({});
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionRoute, setActionRoute] = useState<RouteWithRelations | null>(null);

  /* ---------------------------------- HOOKS --------------------------------- */
  const { 
    data: routesData, 
    isLoading: isRoutesLoading, 
    refetch: refetchRoutes 
  } = useRoutes(pagination.page, pagination.pageSize, filters.status);
  
  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } = useRouteStats();
  const { data: efficiency, isLoading: isEfficiencyLoading, refetch: refetchEfficiency } = useRouteEfficiency();
  const { data: mapData = [], isLoading: isLocationsLoading, refetch: refetchLocations } = useRouteLocations();
  
  const { deleteRoute: deleteMutation } = useRouteMutations();

  const loading = isRoutesLoading || isStatsLoading || isEfficiencyLoading || isLocationsLoading;

  /* --------------------------------- ACTIONS -------------------------------- */
  const refreshAll = useCallback(async () => {
    await Promise.all([refetchRoutes(), refetchStats(), refetchEfficiency(), refetchLocations()]);
  }, [refetchRoutes, refetchStats, refetchEfficiency, refetchLocations]);

  const actions: RoutesPageActions = {
    fetchRoutes: async () => {},
    fetchStats: async () => {},
    fetchEfficiency: async () => {},
    fetchMapData: async () => {},
    refreshAll,
    updateFilters: (newFilters: Partial<RoutesPageState["filters"]>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPagination((prev) => ({ ...prev, page: 0 }));
    },
    changePage: (newPage: number) => setPagination((prev) => ({ ...prev, page: newPage })),
  };

  /* -------------------------------- HANDLERS -------------------------------- */
  const handlePageChange = (newPage: number) => {
    actions.changePage(newPage);
  };
  
  const handleEdit = (id: string) => {
    const route = (routesData?.routes as RouteWithRelations[] || []).find((r) => r.id === id);
    if (route) {
      setActionRoute(route);
      setEditOpen(true);
    }
  };
  
  const handleDelete = (id: string) => {
    const route = (routesData?.routes as RouteWithRelations[] || []).find((r) => r.id === id);
    if (route) {
      setActionRoute(route);
      setDeleteOpen(true);
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!actionRoute || !user) return;
    try {
      await deleteMutation.mutateAsync(actionRoute.id);
      setDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete route:", error);
    }
  };
  
  const handleCloseAdd = () => {
    setAddDialogOpen(false);
    refreshAll();
  };

  /* --------------------------------- KPI --------------------------------- */
  const kpiItems = [
    {
      label: "Active Routes",
      value: stats?.active || 0,
      icon: <AltRoute sx={{ fontSize: 22 }} />,
      color: theme.palette.primary.main,
    },
    {
      label: "In Progress",
      value: stats?.inProgress || 0,
      icon: <Loop sx={{ fontSize: 22 }} />,
      color: "#0ea5e9", // Sky
    },
    {
      label: "Completed Today",
      value: stats?.completedToday || 0,
      icon: <CheckCircle sx={{ fontSize: 22 }} />,
      color: "#10b981", // Emerald
    },
    {
      label: "Delayed Routes",
      value: stats?.delayed || 0,
      icon: <Warning sx={{ fontSize: 22 }} />,
      color: theme.palette.error.main,
    },
  ];

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
      <KpiCards kpis={kpiItems} loading={loading} />

      <Stack mt={2} direction={"row"} spacing={3}>
        <RoutesMainMap mapData={mapData as MapRouteData[]} loading={loading} />
        <RouteEfficiency data={efficiency as RouteEfficiencyStats} loading={loading} />
      </Stack>
      <Stack mt={2}>
        <RouteTable
          routes={routesData?.routes || []}
          loading={loading}
          pagination={{
            page: pagination.page,
            pageSize: pagination.pageSize,
            total: routesData?.totalCount || 0,
          }}
          onPageChange={handlePageChange}
          onSelect={() => {}}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={refreshAll}
        />
      </Stack>

      <EditRouteDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        route={actionRoute}
        onSuccess={refreshAll}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Route?"
        description={`Are you sure you want to delete route ${actionRoute?.name || actionRoute?.id}?`}
        loading={deleteMutation.isPending}
      />
      <AddRouteDialog open={addDialogOpen} onClose={handleCloseAdd} />
    </Box>
  );
}
