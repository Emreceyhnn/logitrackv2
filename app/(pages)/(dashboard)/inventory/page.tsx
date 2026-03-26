"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import CustomCard from "@/app/components/cards/card";
import InventoryHeader from "@/app/components/dashboard/inventory/InventoryHeader";
import InventoryTable from "@/app/components/dashboard/inventory/InventoryTable";
import {
  InventoryPageState,
  InventoryPageActions,
  InventoryWithRelations,
} from "@/app/lib/type/inventory";
import {
  deleteInventoryItem,
  getInventory,
  updateInventoryItem,
} from "@/app/lib/controllers/inventory";
import { useUser } from "@/app/lib/hooks/useUser";
import InventoryDetailsDialog from "../../../components/dialogs/inventory/InventoryDetailsDialog";
import InventoryEditDialog from "../../../components/dialogs/inventory/InventoryEditDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import AddInventoryDialog from "@/app/components/dialogs/inventory/addInventoryDialog";
import {
  Inventory,
  Warning,
  Error as ErrorIcon,
  AttachMoney,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import KpiCards from "@/app/components/cards/KpiCards";

export default function InventoryPage() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();
  useUser();

  /* --------------------------------- STATE --------------------------------- */
  const [state, setState] = useState<InventoryPageState>({
    inventory: [],
    lowStockItems: [],
    selectedItemId: null,
    selectedItem: null,
    isDetailsOpen: false,
    isEditOpen: false,
    recentMovements: [],
    filters: {},
    loading: true,
    error: null,
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  /* --------------------------------- ACTIONS -------------------------------- */
  const fetchInventory = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = (await getInventory()) as InventoryWithRelations[];
      setState((prev) => ({
        ...prev,
        inventory: data,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to fetch inventory", error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  const actions: InventoryPageActions = {
    fetchInventory,
    fetchLowStock: async () => {},
    refreshAll: fetchInventory,

    openDetails: (id) => {
      const item = state.inventory.find((i) => i.id === id) || null;
      setState((prev) => ({
        ...prev,
        selectedItemId: id,
        selectedItem: item,
        isDetailsOpen: true,
      }));
    },

    closeDetails: () => {
      setState((prev) => ({ ...prev, isDetailsOpen: false }));
    },

    openEdit: (id) => {
      const item = state.inventory.find((i) => i.id === id) || null;
      setState((prev) => ({
        ...prev,
        selectedItemId: id,
        selectedItem: item,
        isEditOpen: true,
      }));
    },

    closeEdit: () => {
      setState((prev) => ({ ...prev, isEditOpen: false }));
    },

    updateItem: async (id, data) => {
      await updateInventoryItem(id, data);
      await fetchInventory();
    },

    updateFilters: (filters) =>
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      })),
  };

  /* -------------------------------- LIFECYCLE ------------------------------- */
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleDeleteRequest = (id: string) => {
    const item = state.inventory.find((i) => i.id === id);
    if (item) {
      setState((prev) => ({ ...prev, selectedItem: item }));
      setIsDeleteOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!state.selectedItem) return;
    setIsDeleteLoading(true);
    try {
      await deleteInventoryItem(state.selectedItem.id);
      setIsDeleteOpen(false);
      actions.refreshAll();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  /* --------------------------------- HELPER --------------------------------- */
  const filteredData = useMemo(() => {
    if (!state.filters.search) return state.inventory;
    const lowerTerm = state.filters.search.toLowerCase();
    return state.inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerTerm) ||
        item.sku.toLowerCase().includes(lowerTerm)
    );
  }, [state.inventory, state.filters.search]);

  const totalItems = filteredData.length;
  const lowStockItems = filteredData.filter(
    (item) => item.quantity > 0 && item.quantity <= item.minStock
  ).length;
  const outOfStockItems = filteredData.filter(
    (item) => item.quantity === 0
  ).length;

  const totalValue = 0;

  /* ----------------------------------- KPI ---------------------------------- */
  const kpiItems = [
    {
      label: "TOTAL ITEMS",
      value: totalItems ?? 0,
      icon: <Inventory sx={{ fontSize: 22 }} />,
      color: theme.palette.primary.main,
    },
    {
      label: "LOW STOCK",
      value: lowStockItems ?? 0,
      icon: <Warning sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.amber,
      trend:
        lowStockItems > 0 ? { value: lowStockItems, isUp: true } : undefined,
    },
    {
      label: "OUT OF STOCK",
      value: outOfStockItems ?? 0,
      icon: <ErrorIcon sx={{ fontSize: 22 }} />,
      color: theme.palette.error.main,
      trend:
        outOfStockItems > 0
          ? { value: outOfStockItems, isUp: true }
          : undefined,
    },
    {
      label: "TOTAL VALUE",
      value: new Intl.NumberFormat("en-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }).format(totalValue),
      icon: <AttachMoney sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.emerald,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <InventoryHeader
        onSearch={(val) => actions.updateFilters({ search: val })}
        onFilterClick={() => {}}
        onAddClick={() => setIsAddOpen(true)}
      />
      <KpiCards kpis={kpiItems} loading={state.loading} />

      <Stack mt={2}>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            Inventory List
          </Typography>
          <Divider />
          <InventoryTable
            items={filteredData}
            loading={state.loading}
            onSelect={actions.openDetails}
            onEdit={(item) => actions.openEdit(item.id)}
            onDelete={handleDeleteRequest}
          />
        </CustomCard>
      </Stack>

      <InventoryDetailsDialog
        isOpen={state.isDetailsOpen}
        onClose={actions.closeDetails}
        item={state.selectedItem}
        onEdit={actions.openEdit}
      />

      <InventoryEditDialog
        isOpen={state.isEditOpen}
        onClose={actions.closeEdit}
        item={state.selectedItem}
        onUpdate={actions.updateItem}
      />

      <AddInventoryDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={actions.refreshAll}
      />

      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        description={`Are you sure you want to delete ${state.selectedItem?.name}?`}
        loading={isDeleteLoading}
      />
    </Box>
  );
}
