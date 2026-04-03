"use client";

import { useCallback, useState } from "react";
import { Box, Button, Stack, Typography, Divider } from "@mui/material";
import CustomCard from "@/app/components/cards/card";
import WarehouseListTable from "@/app/components/dashboard/warehouse/warehouseList";
import CapacityUtilization from "@/app/components/dashboard/warehouse/capacityUtilization";
import RecentStockMovements from "@/app/components/dashboard/warehouse/recentStockMovements";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "sonner";
import {
  WarehousePageActions,
  WarehouseWithRelations,
} from "@/app/lib/type/warehouse";
import { 
  useWarehouses, 
  useWarehouseStats, 
  useRecentStockMovements, 
  useWarehouseMutations 
} from "@/app/hooks/useWarehouses";
import AddWarehouseDialog from "@/app/components/dialogs/warehouse/addWarehouseDialog";
import WarehouseDetailsDialog from "@/app/components/dialogs/warehouse/warehouseDetailsDialog";
import EditWarehouseDialog from "@/app/components/dialogs/warehouse/editWarehouseDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { useTheme } from "@mui/material";

import {
  Warehouse as WarehouseIcon,
  Inventory2,
  ListAlt,
  Storage,
  Category,
} from "@mui/icons-material";
import KpiCards from "@/app/components/cards/KpiCards";

export default function WarehousePage() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();

  /* --------------------------------- STATES --------------------------------- */
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [warehouseToEditId, setWarehouseToEditId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDeleteId, setWarehouseToDeleteId] = useState<string | null>(null);

  /* ---------------------------------- HOOKS --------------------------------- */
  const { data: warehouses = [], isLoading: isWarehousesLoading, refetch: refetchWarehouses } = useWarehouses();
  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } = useWarehouseStats();
  const { data: recentMovements = [], isLoading: isMovementsLoading, refetch: refetchMovements } = useRecentStockMovements();
  
  const { deleteWarehouse: deleteMutation } = useWarehouseMutations();

  const loading = isWarehousesLoading || isStatsLoading || isMovementsLoading;

  /* --------------------------------- ACTIONS -------------------------------- */
  const refreshAll = useCallback(async () => {
    await Promise.all([refetchWarehouses(), refetchStats(), refetchMovements()]);
  }, [refetchWarehouses, refetchStats, refetchMovements]);

  const actions: WarehousePageActions = {
    fetchWarehouses: async () => {},
    fetchStats: async () => {},
    fetchRecentMovements: async () => {},
    refreshAll,
    selectWarehouse: (id: string | null) => {
      setSelectedWarehouseId(id);
      if (id) {
        setDetailsDialogOpen(true);
      }
    },
    editWarehouse: (id: string) => {
      setWarehouseToEditId(id);
      setEditDialogOpen(true);
    },
    deleteWarehouse: async (id: string) => {
      setWarehouseToDeleteId(id);
      setDeleteDialogOpen(true);
    },
  };

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleDeleteConfirm = async () => {
    if (!warehouseToDeleteId) return;
    try {
      await deleteMutation.mutateAsync(warehouseToDeleteId);
      toast.success("Warehouse deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete warehouse");
      console.error(error);
    } finally {
      setWarehouseToDeleteId(null);
    }
  };

  const warehouseToDelete = warehouses.find(
    (w: WarehouseWithRelations) => w.id === warehouseToDeleteId
  );

  /* --------------------------------- KPI --------------------------------- */
  const kpiItems = [
    {
      label: "TOTAL WAREHOUSES",
      value: stats?.totalWarehouses || 0,
      icon: <WarehouseIcon sx={{ fontSize: 22 }} />,
      color: theme.palette.primary.main,
      trend: { value: 2, isUp: true },
    },
    {
      label: "INVENTORY SKUS",
      value: stats?.totalSkus.toLocaleString() || 0,
      icon: <Inventory2 sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.cyan,
      trend: { value: 12, isUp: true },
    },
    {
      label: "TOTAL ITEMS",
      value: stats?.totalItems.toLocaleString() || 0,
      icon: <ListAlt sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.violet,
      trend: { value: 8, isUp: true },
    },
    {
      label: "PALLET CAPACITY",
      value: stats?.totalCapacityPallets.toLocaleString() || 0,
      icon: <Category sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.amber,
      trend: { value: 5, isUp: true },
    },
    {
      label: "STOCKED VOLUME",
      value: `${stats?.totalCapacityVolume.toLocaleString() || 0} M³`,
      icon: <Storage sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.emerald,
      trend: { value: 15, isUp: true },
    },
  ];

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
            Warehouse Management
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Manage your warehouses, monitor performance and license status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Warehouse
        </Button>
      </Stack>

      <Box mb={2}>
        <KpiCards kpis={kpiItems} loading={loading} />
      </Box>

      <Stack mt={2}>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            Warehouse List
          </Typography>
          <Divider />
          <WarehouseListTable
            warehouses={warehouses}
            loading={loading}
            onSelect={actions.selectWarehouse}
            onEdit={actions.editWarehouse}
            onDelete={actions.deleteWarehouse}
            onDetails={actions.selectWarehouse}
          />
        </CustomCard>
      </Stack>

      <Stack direction={{ xs: "column", xl: "row" }} spacing={4} sx={{ mt: 2 }}>
        <CapacityUtilization
          warehouses={warehouses}
          loading={loading}
        />
        <RecentStockMovements
          movements={recentMovements}
          loading={loading}
        />
      </Stack>

      <GoogleMapsProvider>
        <AddWarehouseDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSuccess={refreshAll}
        />

        <WarehouseDetailsDialog
          open={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false);
            actions.selectWarehouse(null);
          }}
          onEditSuccess={refreshAll}
          warehouseData={
            warehouses.find((w: WarehouseWithRelations) => w.id === selectedWarehouseId) ||
            undefined
          }
        />

        <EditWarehouseDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setWarehouseToEditId(null);
          }}
          onSuccess={() => {
            setEditDialogOpen(false);
            setWarehouseToEditId(null);
            actions.refreshAll();
          }}
          warehouseData={
            warehouses.find((w: WarehouseWithRelations) => w.id === warehouseToEditId) ||
            undefined
          }
        />
      </GoogleMapsProvider>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Warehouse?"
        description={`Are you sure you want to delete ${warehouseToDelete?.name || "this warehouse"}? This action cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
