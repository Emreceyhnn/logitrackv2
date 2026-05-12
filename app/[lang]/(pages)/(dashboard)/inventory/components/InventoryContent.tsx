"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { Box, Divider, Stack, Typography } from "@mui/material";
import CustomCard from "@/app/components/cards/card";
import InventoryHeader from "@/app/components/dashboard/inventory/InventoryHeader";
import InventoryTable from "@/app/components/dashboard/inventory/InventoryTable";
import { InventoryPageActions } from "@/app/lib/type/inventory";
import {
  useInventoryWithDashboard,
  useInventoryMutations,
} from "@/app/hooks/useInventory";
import { InventoryWithRelations } from "@/app/lib/type/inventory";
import InventoryDetailsDialog from "@/app/components/dialogs/inventory/InventoryDetailsDialog";
import InventoryEditDialog from "@/app/components/dialogs/inventory/InventoryEditDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import AddInventoryDialog from "@/app/components/dialogs/inventory/addInventoryDialog";
import {
  Inventory as InventoryIcon,
  Warning,
  Error as ErrorIcon,
  AttachMoney,
  CheckCircle,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import KpiCards from "@/app/components/cards/KpiCards";
import { useCurrency } from "@/app/hooks/useCurrency";

export default function InventoryContent() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();
  const dict = useDictionary();
  const { format, isLoading: currencyLoading } = useCurrency();

  /* ---------------------------------- STATE --------------------------------- */
  const [filters, setFilters] = useState({
    search: "",
    warehouseId: undefined as string | undefined,
    status: [] as string[],
  });
  const [sort, setSort] = useState<{ field?: string; order: "asc" | "desc" }>({
    field: "name",
    order: "asc",
  });
  const [displaySearch, setDisplaySearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* ---------------------------------- HOOKS --------------------------------- */
  const {
    data: dashboardData,
    isLoading,
    refetch,
  } = useInventoryWithDashboard(
    pagination.page,
    pagination.pageSize,
    filters.warehouseId,
    filters.search,
    sort.field,
    sort.order,
    filters.status
  );

  // Debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: displaySearch }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [displaySearch]);

  const { deleteItem: deleteMutation, updateItem: updateMutation } =
    useInventoryMutations();

  const loading = isLoading;

  /* --------------------------------- ACTIONS -------------------------------- */
  const refreshAll = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const actions: InventoryPageActions = useMemo(() => ({
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

    updateFilters: (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
  }), [refreshAll, updateMutation]);

  const items = dashboardData?.items || [];
  const stats = dashboardData?.stats;

  const selectedItem =
    (items as InventoryWithRelations[]).find(
      (i: InventoryWithRelations) => i.id === selectedItemId
    ) || null;

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleDeleteRequest = (id: string) => {
    setSelectedItemId(id);
    setIsDeleteOpen(true);
  };

  const handleSortRequest = (field: string) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItemId) return;
    try {
      await deleteMutation.mutateAsync(selectedItemId);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  /* ----------------------------------- KPI ---------------------------------- */
  const kpiItems = useMemo(
    () => [
      {
        label: dict.inventory.totalItems,
        value: stats?.totalItems ?? 0,
        icon: <InventoryIcon />,
        color: theme.palette.primary.main,
        trend: dashboardData?.statsTrends?.totalItems,
      },
      {
        label: dict.inventory.lowStock,
        value: stats?.lowStockCount ?? 0,
        icon: (stats?.lowStockCount ?? 0) > 0 ? <Warning /> : <CheckCircle />,
        color:
          (stats?.lowStockCount ?? 0) > 0
            ? theme.palette.warning.main
            : theme.palette.success.main,
      },
      {
        label: dict.inventory.outOfStock,
        value: stats?.outOfStockCount ?? 0,
        icon: (stats?.outOfStockCount ?? 0) > 0 ? <ErrorIcon /> : <CheckCircle />,
        color:
          (stats?.outOfStockCount ?? 0) > 0
            ? theme.palette.error.main
            : theme.palette.success.main,
      },
      {
        label: dict.inventory.totalValue,
        value: currencyLoading ? "..." : format(stats?.totalValue || 0),
        icon: <AttachMoney />,
        color: theme.palette.success.main,
      },
    ],
    [stats, dashboardData?.statsTrends, theme, dict, format, currencyLoading]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <InventoryHeader
        value={displaySearch}
        onSearch={(val) => setDisplaySearch(val)}
        onAddClick={() => setIsAddOpen(true)}
        warehouseId={filters.warehouseId}
        status={filters.status}
        onWarehouseChange={(id) =>
          actions.updateFilters({ warehouseId: id || undefined })
        }
        onStatusChange={(status) => actions.updateFilters({ status })}
      />
      <KpiCards kpis={kpiItems} loading={loading} />

      <Stack mt={2}>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            {dict.inventory.header}
          </Typography>
          <Divider />
          <InventoryTable
            items={items}
            loading={loading}
            onSelect={actions.openDetails}
            onEdit={(item) => actions.openEdit(item.id)}
            onDelete={handleDeleteRequest}
            meta={{
              page: pagination.page,
              limit: pagination.pageSize,
              total: dashboardData?.totalCount || 0,
            }}
            onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
            onLimitChange={(pageSize) =>
              setPagination({ page: 1, pageSize: pageSize })
            }
            sortField={sort.field}
            sortOrder={sort.order}
            onRequestSort={handleSortRequest}
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
        title={dict.inventory.deleteTitle}
        description={dict.inventory.deleteDesc.replace(
          "{name}",
          selectedItem?.name || ""
        )}
        loading={deleteMutation.isPending}
      />

    </Box>
  );
}
