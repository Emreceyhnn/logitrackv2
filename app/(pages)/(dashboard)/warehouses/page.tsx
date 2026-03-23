"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Button, Stack, Typography, Divider } from "@mui/material";
import CustomCard from "@/app/components/cards/card";
import WarehouseKpiCard from "@/app/components/dashboard/warehouse/warehouseKpiCard";
import WarehouseListTable from "@/app/components/dashboard/warehouse/warehouseList";
import CapacityUtilization from "@/app/components/dashboard/warehouse/capacityUtilization";
import RecentStockMovements from "@/app/components/dashboard/warehouse/recentStockMovements";
import AddIcon from "@mui/icons-material/Add";
import {
  getRecentStockMovements,
  getWarehouses,
  getWarehouseStats,
  deleteWarehouse,
} from "@/app/lib/controllers/warehouse";
import { toast } from "sonner";
import {
  WarehousePageActions,
  WarehousePageState,
  WarehouseWithRelations,
  InventoryMovementWithRelations,
} from "@/app/lib/type/warehouse";
import AddWarehouseDialog from "@/app/components/dialogs/warehouse/addWarehouseDialog";
import WarehouseDetailsDialog from "@/app/components/dialogs/warehouse/warehouseDetailsDialog";
import EditWarehouseDialog from "@/app/components/dialogs/warehouse/editWarehouseDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";

export default function WarehousePage() {
  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<WarehousePageState>({
    warehouses: [],
    stats: null,
    recentMovements: [],
    selectedWarehouseId: null,
    loading: true,
    error: null,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [warehouseToEditId, setWarehouseToEditId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [warehouseToDeleteId, setWarehouseToDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* --------------------------------- actions -------------------------------- */
  const fetchAllData = useCallback(async (isInitial = false) => {
    if (isInitial) setState((prev) => ({ ...prev, loading: true }));
    try {
      const [warehousesData, statsData, movementsData] = await Promise.all([
        getWarehouses(),
        getWarehouseStats(),
        getRecentStockMovements(),
      ]);

      setState((prev) => ({
        ...prev,
        warehouses: warehousesData as WarehouseWithRelations[],
        stats: statsData,
        recentMovements: movementsData as InventoryMovementWithRelations[],
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to fetch warehouse data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load warehouse data",
      }));
    }
  }, []);
  const actions: WarehousePageActions = {
    fetchWarehouses: async () => {
      await fetchAllData();
    },
    fetchStats: async () => {},
    fetchRecentMovements: async () => {},
    refreshAll: async () => {
      await fetchAllData(false);
    },
    selectWarehouse: (id: string | null) => {
      setState((prev) => ({ ...prev, selectedWarehouseId: id }));
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

  const handleDeleteConfirm = async () => {
    if (!warehouseToDeleteId) return;
    setDeleteLoading(true);
    try {
      await deleteWarehouse(warehouseToDeleteId);
      toast.success("Warehouse deleted successfully");
      setDeleteDialogOpen(false);
      actions.refreshAll();
    } catch (error) {
      toast.error("Failed to delete warehouse");
      console.error(error);
    } finally {
      setDeleteLoading(false);
      setWarehouseToDeleteId(null);
    }
  };

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    let mounted = true;
    const loadInit = async () => {
      if (mounted) await fetchAllData(true);
    };
    loadInit();
    return () => { mounted = false; };
  }, [fetchAllData]);

  const warehouseToDelete = state.warehouses.find(w => w.id === warehouseToDeleteId);

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
        <WarehouseKpiCard stats={state.stats} loading={state.loading} />
      </Box>

      <Stack mt={2}>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            Warehouse List
          </Typography>
          <Divider />
          <WarehouseListTable
            warehouses={state.warehouses}
            loading={state.loading}
            onSelect={actions.selectWarehouse}
            onEdit={actions.editWarehouse}
            onDelete={actions.deleteWarehouse}
            onDetails={actions.selectWarehouse}
          />
        </CustomCard>
      </Stack>

      <Stack 
        direction={{ xs: "column", xl: "row" }} 
        spacing={4}
        sx={{ mt: 2 }}
      >
        <CapacityUtilization
          warehouses={state.warehouses}
          loading={state.loading}
        />
        <RecentStockMovements
          movements={state.recentMovements}
          loading={state.loading}
        />
      </Stack>

      <GoogleMapsProvider>
        <AddWarehouseDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSuccess={actions.refreshAll}
        />

        <WarehouseDetailsDialog
          open={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false);
            actions.selectWarehouse(null);
          }}
          onEditSuccess={actions.refreshAll}
          warehouseData={
            state.warehouses.find(
              (w) => w.id === state.selectedWarehouseId
            ) || undefined
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
            state.warehouses.find(
              (w) => w.id === warehouseToEditId
            ) || undefined
          }
        />
      </GoogleMapsProvider>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Warehouse?"
        description={`Are you sure you want to delete ${warehouseToDelete?.name || "this warehouse"}? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </Box>
  );
}
