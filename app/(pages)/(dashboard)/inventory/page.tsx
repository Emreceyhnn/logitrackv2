"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Box } from "@mui/material";
import InventoryHeader from "@/app/components/dashboard/inventory/InventoryHeader";
import InventoryKPI from "@/app/components/dashboard/inventory/InventoryKPI";
import InventoryTable from "@/app/components/dashboard/inventory/InventoryTable";
import {
  InventoryPageState,
  InventoryPageActions,
} from "@/app/lib/type/inventory";
import {
  deleteInventoryItem,
  getInventory,
} from "@/app/lib/controllers/inventory";
import EditInventoryDialog from "@/app/components/dialogs/inventory/edit-inventory-dialog";
import AddInventoryDialog from "@/app/components/dialogs/inventory/add-inventory-dialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import { useUser } from "@/app/lib/hooks/useUser";
import { InventoryWithRelations } from "@/app/lib/type/inventory";

export default function InventoryPage() {
  const { user } = useUser();

  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<InventoryPageState>({
    inventory: [],
    lowStockItems: [],
    selectedItemId: null,
    filters: {},
    loading: true,
    error: null,
  });

  // Action states
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [actionItem, setActionItem] = useState<InventoryWithRelations | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ... (existing fetchInventory and actions)

  /* --------------------------------- actions -------------------------------- */
  const fetchInventory = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const COMPANY_ID = "cmlgt985b0003x0cuhtyxoihd";
      const USER_ID = "usr_001";

      const data = await getInventory(COMPANY_ID, USER_ID);

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

  const actions: InventoryPageActions = {
    fetchInventory,
    fetchLowStock: async () => {},
    refreshAll: fetchInventory,
    selectItem: (id) => setState((prev) => ({ ...prev, selectedItemId: id })),
    updateFilters: (filters) =>
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      })),
  };

  /* --------------------------------- effects -------------------------------- */
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  /* -------------------------------- handlers -------------------------------- */
  const handleEdit = (item: InventoryWithRelations) => {
    setActionItem(item);
    setEditOpen(true);
  };

  const handleDelete = (id: string) => {
    const item = state.inventory.find((i) => i.id === id);
    if (item) {
      setActionItem(item);
      setDeleteOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!actionItem || !user) return;
    setDeleteLoading(true);
    try {
      await deleteInventoryItem(actionItem.id, user.id);
      setDeleteOpen(false);
      actions.refreshAll();
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  /* --------------------------------- filter --------------------------------- */
  const filteredData = React.useMemo(() => {
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
        onFilterClick={() => console.log("Filter clicked")}
        onAddClick={() => setAddOpen(true)}
      />

      <InventoryKPI items={filteredData} loading={state.loading} />

      <InventoryTable
        items={filteredData}
        loading={state.loading}
        onSelect={actions.selectItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditInventoryDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        item={actionItem}
        onSuccess={actions.refreshAll}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Inventory Item?"
        description={`Are you sure you want to delete ${actionItem?.name || "this item"}?`}
        loading={deleteLoading}
      />

      <AddInventoryDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={actions.refreshAll}
      />
    </Box>
  );
}
