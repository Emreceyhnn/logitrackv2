"use client";

import ShipmentTable from "@/app/components/dashboard/shipments/shipmentTable";
import ShipmentAnalytics from "@/app/components/dashboard/shipments/ShipmentAnalytics";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShipmentPageState,
  ShipmentPageActions,
  ShipmentWithRelations,
} from "@/app/lib/type/shipment";
import {
  useShipmentsWithDashboard,
  useShipmentMutations,
} from "@/app/hooks/useShipments";
import EditShipmentDialog from "@/app/components/dialogs/shipment/edit-shipment-dialog";
import ShipmentDetailDialog from "@/app/components/dialogs/shipment/shipmentDetailDialog";
import AddShipmentDialog from "@/app/components/dialogs/shipment/addShipmentDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import AddIcon from "@mui/icons-material/Add";

import {
  LocalShipping,
  AccessTime,
  DirectionsBoat,
  Inventory,
} from "@mui/icons-material";
import KpiCards from "@/app/components/cards/KpiCards";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

export default function ShipmentContent() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();
  const dict = useDictionary();
  const searchParams = useSearchParams();
  const shipmentIdFromUrl = searchParams.get("id");

  /* ---------------------------------- STATES --------------------------------- */
  const [filters, setFilters] = useState<ShipmentPageState["filters"]>({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(
    null
  );

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionShipment, setActionShipment] =
    useState<ShipmentWithRelations | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  /* ---------------------------------- HOOKS --------------------------------- */
  const {
    data: dashboardData,
    isLoading,
    refetch,
  } = useShipmentsWithDashboard(
    pagination.page,
    pagination.pageSize,
    filters.status,
    filters.search
  );


  const { deleteShipment: deleteMutation } = useShipmentMutations();

  const loading = isLoading;


  /* --------------------------------- ACTIONS -------------------------------- */
  const refreshAll = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const actions: ShipmentPageActions = useMemo(
    () => ({
      fetchShipments: async () => {},
      fetchStats: async () => {},
      fetchCharts: async () => {},
      refreshAll,
      selectShipment: (id: string | null) => setSelectedShipmentId(id),
      updateFilters: (newFilters: Partial<ShipmentPageState["filters"]>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPagination((prev) => ({ ...prev, page: 1 }));
      },
    }),
    [refreshAll]
  );

  /* -------------------------- COMPATIBILITY LAYER --------------------------- */
  const state: ShipmentPageState = {
    shipments: dashboardData?.shipments || [],
    stats: dashboardData?.stats || null,
    totalCount: dashboardData?.totalCount || 0,
    volumeHistory: dashboardData?.volumeData || [],
    statusDistribution: dashboardData?.statusData || [],
    selectedShipmentId,
    filters,
    loading,
    error: null,
  };

  /* -------------------------------- LIFECYCLE --------------------------------- */
  useEffect(() => {
    if (shipmentIdFromUrl) {
      actions.selectShipment(shipmentIdFromUrl);
    }
  }, [shipmentIdFromUrl, actions]);

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleEdit = (id: string) => {
    const shipment = state.shipments.find((s) => s.id === id);
    if (shipment) {
      setActionShipment(shipment);
      setEditOpen(true);
    }
  };
  const handleDelete = (id: string) => {
    const shipment = state.shipments.find((s) => s.id === id);
    if (shipment) {
      setActionShipment(shipment);
      setDeleteOpen(true);
    }
  };
  const handleDeleteConfirm = async () => {
    if (!actionShipment) return;
    try {
      await deleteMutation.mutateAsync(actionShipment.id);
      setDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete shipment:", error);
    }
  };

  /* --------------------------------- RENDER --------------------------------- */

  const selectedShipment = state.shipments.find(
    (s) => s.id === state.selectedShipmentId
  );

  const kpiItems = [
    {
      label: dict.shipments.dashboard.totalShipments,
      value: state.stats?.total || 0,
      icon: <Inventory sx={{ fontSize: 22 }} />,
      color: theme.palette.primary.main,
    },
    {
      label: dict.shipments.dashboard.activeShipments,
      value: state.stats?.active || 0,
      icon: <LocalShipping sx={{ fontSize: 22 }} />,
      color: "#0ea5e9", // Sky
    },
    {
      label: dict.shipments.dashboard.delayedShipments,
      value: state.stats?.delayed || 0,
      icon: <AccessTime sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.error,
    },
    {
      label: dict.shipments.dashboard.inTransit,
      value: state.stats?.inTransit || 0,
      icon: <DirectionsBoat sx={{ fontSize: 22 }} />,
      color: "#10b981", // Emerald
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
            {dict.shipments.title}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            {dict.shipments.subtitle}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {dict.shipments.addShipment}
        </Button>
      </Stack>

      <KpiCards kpis={kpiItems} loading={state.loading} />

      <Stack mt={2}>
        <ShipmentTable
          state={state}
          actions={{
            ...actions,
            onEdit: handleEdit,
            onDelete: handleDelete,
          }}
          pagination={{
            page: pagination.page,
            pageSize: pagination.pageSize,
            total: state.totalCount,
          }}
          onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
          onLimitChange={(pageSize) =>
            setPagination({ page: 1, pageSize: pageSize })
          }
        />
      </Stack>

      <ShipmentAnalytics state={state} actions={actions} />

      <ShipmentDetailDialog
        open={!!selectedShipment}
        onClose={() => actions.selectShipment(null)}
        shipment={selectedShipment || null}
      />

      <EditShipmentDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        shipment={actionShipment}
        onSuccess={refreshAll}
      />

      <AddShipmentDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={refreshAll}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={dict.shipments.deleteTitle}
        description={dict.shipments.deleteDesc.replace(
          "{id}",
          actionShipment?.trackingId || ""
        )}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
