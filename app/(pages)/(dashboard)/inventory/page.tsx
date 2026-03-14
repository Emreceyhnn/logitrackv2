"use client";

import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import InventoryHeader from "@/app/components/dashboard/inventory/InventoryHeader";
import InventoryKPI from "@/app/components/dashboard/inventory/InventoryKPI";
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
import InventoryDetailsDialog from "./components/InventoryDetailsDialog";
import InventoryEditDialog from "./components/InventoryEditDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import AddInventoryDialog from "@/app/components/dialogs/inventory/addInventoryDialog";

export default function InventoryPage() {
  const { user } = useUser();

  /* --------------------------------- single root state --------------------------------- */
  const [state, setState] = useState<InventoryPageState>({
    inventory: [],
    lowStockItems: [],
    selectedItemId: null,
    selectedItem: null,
    isDetailsOpen: false,
    isEditOpen: false,
    filters: {},
    loading: true,
    error: null,
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  /* --------------------------------- fetch logic -------------------------------- */
  const fetchInventory = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await getInventory() as InventoryWithRelations[];
      setState((prev) => ({
        ...prev,
        inventory: data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.error("Failed to fetch inventory", error);
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  }, []);

  /* --------------------------------- page actions -------------------------------- */
  const actions: InventoryPageActions = {
    fetchInventory,
    fetchLowStock: async () => {},
    refreshAll: fetchInventory,
    
    openDetails: (id) => {
      const item = state.inventory.find(i => i.id === id) || null;
      setState(prev => ({ ...prev, selectedItemId: id, selectedItem: item, isDetailsOpen: true }));
    },

    closeDetails: () => {
      setState(prev => ({ ...prev, isDetailsOpen: false }));
    },

    openEdit: (id) => {
      const item = state.inventory.find(i => i.id === id) || null;
      setState(prev => ({ ...prev, selectedItemId: id, selectedItem: item, isEditOpen: true }));
    },

    closeEdit: () => {
      setState(prev => ({ ...prev, isEditOpen: false }));
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

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleDeleteRequest = (id: string) => {
    const item = state.inventory.find(i => i.id === id);
    if (item) {
      setState(prev => ({ ...prev, selectedItem: item }));
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

  const filteredData = useMemo(() => {
    if (!state.filters.search) return state.inventory;
    const lowerTerm = state.filters.search.toLowerCase();
    return state.inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerTerm) ||
        item.sku.toLowerCase().includes(lowerTerm)
    );
  }, [state.inventory, state.filters.search]);

  return (
    <Box sx={{ p: 3 }}>
      <InventoryHeader
        onSearch={(val) => actions.updateFilters({ search: val })}
        onFilterClick={() => {}}
        onAddClick={() => setIsAddOpen(true)}
      />

      <InventoryKPI items={filteredData} loading={state.loading} />

      <InventoryTable
        items={filteredData}
        loading={state.loading}
        onSelect={actions.openDetails}
        onEdit={(item) => actions.openEdit(item.id)}
        onDelete={handleDeleteRequest}
      />

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
