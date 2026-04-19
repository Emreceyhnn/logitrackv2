"use client";

import { useCallback, useState, useMemo, Suspense } from "react";
import { useParams } from "next/navigation";
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
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import KpiCards from "@/app/components/cards/KpiCards";

export default function InventoryPage() {
  const dict = useDictionary();
  return (
    <Suspense fallback={<Box p={4}>{dict.common.loading}</Box>}>
      <InventoryContent />
    </Suspense>
  );
}

function InventoryContent() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();
  const dict = useDictionary();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  /* ---------------------------------- STATE --------------------------------- */
  const [filters, setFilters] = useState({
    search: "",
    warehouseId: undefined as string | undefined,
  });
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
    filters.search
  );

  const { deleteItem: deleteMutation, updateItem: updateMutation } =
    useInventoryMutations();

  const loading = isLoading;

  /* --------------------------------- ACTIONS -------------------------------- */
  const refreshAll = useCallback(async () => {
    await refetch();
  }, [refetch]);

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

    updateFilters: (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
  };

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

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await deleteMutation.mutateAsync(selectedItem.id);
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
        icon: <InventoryIcon sx={{ fontSize: 22 }} />,
        color: theme.palette.primary.main,
      },
      {
        label: dict.inventory.lowStock,
        value: stats?.lowStockCount ?? 0,
        icon: <Warning sx={{ fontSize: 22 }} />,
        color: theme.palette.kpi.amber,
        trend:
          (stats?.lowStockCount || 0) > 0
            ? { value: stats!.lowStockCount, isUp: true }
            : undefined,
      },
      {
        label: dict.inventory.outOfStock,
        value: stats?.outOfStockCount ?? 0,
        icon: <ErrorIcon sx={{ fontSize: 22 }} />,
        color: theme.palette.kpi.error,
        trend:
          (stats?.outOfStockCount || 0) > 0
            ? { value: stats!.outOfStockCount, isUp: true }
            : undefined,
      },
      {
        label: dict.inventory.totalValue,
        value: new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
          style: "currency",
          currency: lang === "tr" ? "TRY" : "USD",
          maximumFractionDigits: 0,
        }).format(stats?.totalValue || 0),
        icon: <AttachMoney sx={{ fontSize: 22 }} />,
        color: theme.palette.kpi.emerald,
      },
    ],
    [stats, theme, dict, lang]
  );

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
