"use client";

import ShipmentKpiCard from "@/app/components/dashboard/shipments/shipmentKpiCard";
import ShipmentTable from "@/app/components/dashboard/shipments/shipmentTable";
import ShipmentAnalytics from "@/app/components/dashboard/shipments/ShipmentAnalytics";
import { Box, Divider, Stack, Typography } from "@mui/material";
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
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import { useUser } from "@/app/lib/hooks/useUser";

export default function ShipmentPage() {
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

  // Action states
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionShipment, setActionShipment] =
    useState<ShipmentWithRelations | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* --------------------------------- actions -------------------------------- */
  const fetchAllData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const token = localStorage.getItem("token"); // Auth check if needed

    // Hardcoded for now per controller, fetching dynamic later
    const COMPANY_ID = "cmlgt985b0003x0cuhtyxoihd";
    const USER_ID = "usr_001";

    try {
      const [shipmentsData, statsData, statusDist, volumeHist] =
        await Promise.all([
          getShipments(COMPANY_ID, USER_ID),
          getShipmentStats(COMPANY_ID, USER_ID),
          getShipmentStatusDistribution(COMPANY_ID, USER_ID),
          getShipmentVolumeHistory(COMPANY_ID, USER_ID),
        ]);

      setState((prev) => ({
        ...prev,
        shipments: shipmentsData, // Prisma result matches ShipmentWithRelations structure mostly
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

  // Actions object (extensible)
  const actions: ShipmentPageActions = {
    fetchShipments: async () => {}, // merged into fetchAllData for initial load
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
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-2%",
        }}
      >
        Shipments
      </Typography>
      <Divider />

      <ShipmentKpiCard stats={state.stats} loading={state.loading} />

      <ShipmentAnalytics
        volumeHistory={state.volumeHistory}
        statusDistribution={state.statusDistribution}
        loading={state.loading}
      />

      <Stack mt={2}>
        <ShipmentTable
          shipments={state.shipments}
          loading={state.loading}
          onSelect={selectShipment}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Stack>

      <EditShipmentDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        shipment={actionShipment}
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
