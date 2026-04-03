"use client";

import ShipmentTable from "@/app/components/dashboard/shipments/shipmentTable";
import ShipmentAnalytics from "@/app/components/dashboard/shipments/ShipmentAnalytics";
import {
  Box,
  Button,
  Stack,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import CustomCard from "@/app/components/cards/card";
import { useCallback, useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShipmentPageState,
  ShipmentPageActions,
  ShipmentWithRelations,
} from "@/app/lib/type/shipment";
import { useShipments, useShipmentStats, useShipmentVolumeHistory, useShipmentStatusDistribution, useShipmentMutations } from "@/app/hooks/useShipments";
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

export default function ShipmentPage() {
  return (
    <Suspense fallback={<Box p={4}>Loading...</Box>}>
      <ShipmentContent />
    </Suspense>
  );
}

function ShipmentContent() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();
  const searchParams = useSearchParams();
  const shipmentIdFromUrl = searchParams.get("id");

  /* ---------------------------------- STATES --------------------------------- */
  const [filters, setFilters] = useState<ShipmentPageState["filters"]>({});
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionShipment, setActionShipment] = useState<ShipmentWithRelations | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  /* ---------------------------------- HOOKS --------------------------------- */
  const { data: shipments = [], isLoading: isShipmentsLoading, refetch: refetchShipments } = useShipments();
  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } = useShipmentStats();
  const { data: volumeHistory = [], isLoading: isHistoryLoading, refetch: refetchHistory } = useShipmentVolumeHistory();
  const { data: statusDistribution = [], isLoading: isDistLoading, refetch: refetchDist } = useShipmentStatusDistribution();
  
  const { deleteShipment: deleteMutation } = useShipmentMutations();

  const loading = isShipmentsLoading || isStatsLoading || isHistoryLoading || isDistLoading;

  /* --------------------------------- ACTIONS -------------------------------- */
  const refreshAll = useCallback(async () => {
    await Promise.all([refetchShipments(), refetchStats(), refetchHistory(), refetchDist()]);
  }, [refetchShipments, refetchStats, refetchHistory, refetchDist]);

  const actions: ShipmentPageActions = useMemo(
    () => ({
      fetchShipments: async () => {},
      fetchStats: async () => {},
      fetchCharts: async () => {},
      refreshAll,
      selectShipment: (id: string | null) => setSelectedShipmentId(id),
      updateFilters: (newFilters: Partial<ShipmentPageState["filters"]>) => 
        setFilters((prev) => ({ ...prev, ...newFilters })),
    }),
    [refreshAll]
  );

  /* -------------------------- COMPATIBILITY LAYER --------------------------- */
  const state: ShipmentPageState = {
    shipments: shipments,
    stats: stats || null,
    volumeHistory: volumeHistory,
    statusDistribution: statusDistribution,
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
      label: "Total Shipments",
      value: state.stats?.total || 0,
      icon: <Inventory sx={{ fontSize: 22 }} />,
      color: theme.palette.primary.main,
    },
    {
      label: "Active Shipments",
      value: state.stats?.active || 0,
      icon: <LocalShipping sx={{ fontSize: 22 }} />,
      color: "#0ea5e9", // Sky
    },
    {
      label: "Delayed Shipments",
      value: state.stats?.delayed || 0,
      icon: <AccessTime sx={{ fontSize: 22 }} />,
      color: theme.palette.error.main,
    },
    {
      label: "In Transit",
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
            Shipments Management
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Manage your shipments, monitor performance and status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Shipment
        </Button>
      </Stack>

      <KpiCards kpis={kpiItems} loading={state.loading} />

      <Stack mt={2}>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
            Shipment List
          </Typography>
          <Divider />
          <ShipmentTable
            state={state}
            actions={{
              ...actions,
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />
        </CustomCard>
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
        title="Delete Shipment?"
        description={`Are you sure you want to delete shipment ${
          actionShipment?.trackingId || ""
        }?`}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
