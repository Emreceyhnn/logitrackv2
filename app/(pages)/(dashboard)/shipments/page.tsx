"use client";

import ShipmentKpiCard from "@/app/components/dashboard/shipments/shipmentKpiCard";
import ShipmentTable from "@/app/components/dashboard/shipments/shipmentTable";
import ShipmentAnalytics from "@/app/components/dashboard/shipments/ShipmentAnalytics";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  ShipmentPageState,
  ShipmentPageActions,
  ShipmentWithRelations,
} from "@/app/lib/type/shipment";
import {
  getShipments,
  getShipmentStats,
  getShipmentStatusDistribution,
  getShipmentVolumeHistory,
  deleteShipment,
} from "@/app/lib/controllers/shipments";
import EditShipmentDialog from "@/app/components/dialogs/shipment/edit-shipment-dialog";
import AddShipmentDialog from "@/app/components/dialogs/shipment/addShipmentDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import { useUser } from "@/app/lib/hooks/useUser";
import AddIcon from "@mui/icons-material/Add";

export default function ShipmentPage() {
  /* -------------------------------- variables ------------------------------- */
  const { user } = useUser();

  /* ---------------------------------- state --------------------------------- */
  const [state, setState] = useState<ShipmentPageState>({
    shipments: [],
    stats: null,
    volumeHistory: [],
    statusDistribution: [],
    selectedShipmentId: null,
    filters: {},
    loading: true,
    error: null,
  });
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionShipment, setActionShipment] =
    useState<ShipmentWithRelations | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  /* --------------------------------- actions -------------------------------- */
  const fetchAllData = useCallback(async () => {
    if (!user) return;
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const [shipmentsData, statsData, statusDist, volumeHist] =
        await Promise.all([
          getShipments(user.companyId, user.id),
          getShipmentStats(user.companyId, user.id),
          getShipmentStatusDistribution(user.companyId, user.id),
          getShipmentVolumeHistory(user.companyId, user.id),
        ]);

      setState((prev) => ({
        ...prev,
        shipments: shipmentsData,
        stats: statsData,
        statusDistribution: statusDist,
        volumeHistory: volumeHist,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to fetch shipment data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load data",
      }));
    }
  }, []);
  const selectShipment = (id: string | null) => {
    setState((prev) => ({ ...prev, selectedShipmentId: id }));
  };
  const actions: ShipmentPageActions = {
    fetchShipments: async () => {},
    fetchStats: async () => {},
    fetchCharts: async () => {},
    refreshAll: fetchAllData,
    selectShipment,
    updateFilters: (filters) =>
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      })),
  };

  /* -------------------------------- effects --------------------------------- */
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  /* -------------------------------- handlers -------------------------------- */
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
    if (!actionShipment || !user) return;
    setDeleteLoading(true);
    try {
      await deleteShipment(actionShipment.id, user.id);
      setDeleteOpen(false);
      actions.refreshAll();
    } catch (error) {
      console.error("Failed to delete shipment:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

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

      <ShipmentKpiCard stats={state.stats} />

      <Stack mt={2}>
        <ShipmentTable
          shipments={state.shipments}
          loading={state.loading}
          onSelect={selectShipment}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Stack>

      <ShipmentAnalytics
        volumeHistory={state.volumeHistory}
        statusDistribution={state.statusDistribution}
      />

      <EditShipmentDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        shipment={actionShipment}
        onSuccess={actions.refreshAll}
      />

      <AddShipmentDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={actions.refreshAll}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Shipment?"
        description={`Are you sure you want to delete shipment ${
          actionShipment?.trackingId || ""
        }?`}
        loading={deleteLoading}
      />
    </Box>
  );
}
