"use client";

import { useCallback, useState, useMemo, Suspense } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import CustomCard from "@/app/components/cards/card";
import InventoryHeader from "@/app/components/dashboard/inventory/InventoryHeader";
import InventoryTable from "@/app/components/dashboard/inventory/InventoryTable";
import {
  InventoryPageActions,
} from "@/app/lib/type/inventory";
import { useInventory, useInventoryMutations } from "@/app/hooks/useInventory";
import { InventoryWithRelations } from "@/app/lib/type/inventory";
import InventoryDetailsDialog from "../../../components/dialogs/inventory/InventoryDetailsDialog";
import InventoryEditDialog from "../../../components/dialogs/inventory/InventoryEditDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import AddInventoryDialog from "@/app/components/dialogs/inventory/addInventoryDialog";
import {
  Inventory as InventoryIcon,
  Warning,
  Error as ErrorIcon,
  AttachMoney,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import KpiCards from "@/app/components/cards/KpiCards";

export default function InventoryPage() {
  return (
    <Suspense fallback={<Box p={4}>Loading...</Box>}>
      <InventoryContent />
    </Suspense>
  );
}

function InventoryContent() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();

  /* ---------------------------------- STATE --------------------------------- */
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* ---------------------------------- HOOKS --------------------------------- */
  const { 
    data: inventory = [], 
    isLoading: isInventoryLoading, 
    refetch: refetchInventory 
  } = useInventory();
  
  
  const { deleteItem: deleteMutation, updateItem: updateMutation } = useInventoryMutations();

  const loading = isInventoryLoading;

  /* --------------------------------- ACTIONS -------------------------------- */
  const refreshAll = useCallback(async () => {
    await refetchInventory();
  }, [refetchInventory]);

  const actions: InventoryPageActions = {
    fetchInventory: async () => {},
    fetchLowStock: async () => {},
    refreshAll,

    openDetails: (id) => {
      setSelectedItemId(id);
      setIsDetailsOpen(true);
    },

    closeDetails: () => setIsDetailsOpen(false),

    openEdit: (id) => {
      setSelectedItemId(id);
      setIsEditOpen(true);
    },

    closeEdit: () => setIsEditOpen(false),

    updateItem: async (id, data) => {
      await updateMutation.mutateAsync({ id, data });
    },

    updateFilters: (newFilters) => setFilters((prev) => ({ ...prev, ...newFilters })),
  };

  const selectedItem = (inventory as InventoryWithRelations[]).find((i: InventoryWithRelations) => i.id === selectedItemId) || null;

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleDeleteRequest = (id: string) => {
    setSelectedItemId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await deleteMutation.mutateAsync(selectedItem.id);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  /* --------------------------------- HELPER --------------------------------- */
  const filteredData = useMemo(() => {
    if (!filters.search) return inventory;
    const lowerTerm = filters.search.toLowerCase();
    return (inventory as InventoryWithRelations[]).filter(
      (item: InventoryWithRelations) =>
        item.name.toLowerCase().includes(lowerTerm) ||
        item.sku.toLowerCase().includes(lowerTerm)
    );
  }, [inventory, filters.search]);

  const totalItems = filteredData.length;
  const lowStockItemsCount = (filteredData as InventoryWithRelations[]).filter(
    (item: InventoryWithRelations) => item.quantity > 0 && item.quantity <= item.minStock
  ).length;
  const outOfStockItemsCount = (filteredData as InventoryWithRelations[]).filter(
    (item: InventoryWithRelations) => item.quantity === 0
  ).length;

  const totalValue = (filteredData as InventoryWithRelations[]).reduce(
    (acc: number, item: InventoryWithRelations) => acc + item.quantity * (item.unitValue || 0),
    0
  );

  /* ----------------------------------- KPI ---------------------------------- */
  const kpiItems = [
    {
      label: "TOTAL ITEMS",
      value: totalItems ?? 0,
      icon: <InventoryIcon sx={{ fontSize: 22 }} />,
      color: theme.palette.primary.main,
    },
    {
      label: "LOW STOCK",
      value: lowStockItemsCount ?? 0,
      icon: <Warning sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.amber,
      trend:
        lowStockItemsCount > 0 ? { value: lowStockItemsCount, isUp: true } : undefined,
    },
    {
      label: "OUT OF STOCK",
      value: outOfStockItemsCount ?? 0,
      icon: <ErrorIcon sx={{ fontSize: 22 }} />,
      color: theme.palette.error.main,
      trend:
        outOfStockItemsCount > 0
          ? { value: outOfStockItemsCount, isUp: true }
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
      <KpiCards kpis={kpiItems} loading={loading} />

      <Stack mt={2}>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            Inventory List
          </Typography>
          <Divider />
          <InventoryTable
            items={filteredData}
            loading={loading}
            onSelect={actions.openDetails}
            onEdit={(item) => actions.openEdit(item.id)}
            onDelete={handleDeleteRequest}
          />
        </CustomCard>
      </Stack>

      <InventoryDetailsDialog
        isOpen={isDetailsOpen}
        onClose={actions.closeDetails}
        item={selectedItem}
        onEdit={actions.openEdit}
      />

      <InventoryEditDialog
        key={selectedItem?.id}
        isOpen={isEditOpen}
        onClose={actions.closeEdit}
        item={selectedItem}
        onUpdate={actions.updateItem}
      />

      <AddInventoryDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={refreshAll}
      />

      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        description={`Are you sure you want to delete ${selectedItem?.name}?`}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
