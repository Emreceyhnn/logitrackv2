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

import {
  LocalShipping,
  AccessTime,
  DirectionsBoat,
  Inventory,
} from "@mui/icons-material";
import KpiCards from "@/app/components/cards/KpiCards";

export default function ShipmentPage() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const { user } = useUser();
  const theme = useTheme();

  /* ---------------------------------- STATES --------------------------------- */
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

  /* --------------------------------- ACTIONS -------------------------------- */
  const fetchAllData = useCallback(async () => {
    if (!user || !user.companyId || !user.id) return;
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const [shipmentsData, statsData, statusDist, volumeHist] =
        await Promise.all([
          getShipments(),
          getShipmentStats(),
          getShipmentStatusDistribution(),
          getShipmentVolumeHistory(),
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
  }, [user]);
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

  /* -------------------------------- LIFECYCLE --------------------------------- */
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
    if (!actionShipment || !user) return;
    setDeleteLoading(true);
    try {
      await deleteShipment(actionShipment.id);
      setDeleteOpen(false);
      actions.refreshAll();
    } catch (error) {
      console.error("Failed to delete shipment:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  /* --------------------------------- RENDER --------------------------------- */

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
