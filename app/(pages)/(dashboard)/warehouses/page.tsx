"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import WarehouseKpiCard from "@/app/components/dashboard/warehouse/warehouseKpiCard";
import WarehouseListTable from "@/app/components/dashboard/warehouse/warehouseList";
import CapacityUtilization from "@/app/components/dashboard/warehouse/capacityUtilization";
import RecentStockMovements from "@/app/components/dashboard/warehouse/recentStockMovements";
import AddIcon from "@mui/icons-material/Add";
import {
  getRecentStockMovements,
  getWarehouses,
  getWarehouseStats,
} from "@/app/lib/controllers/warehouse";
import {
  WarehousePageActions,
  WarehousePageState,
} from "@/app/lib/type/warehouse";

export default function WarehousePage() {
  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<WarehousePageState>({
    warehouses: [],
    stats: null,
    recentMovements: [],
    selectedWarehouseId: null,
    loading: true,
    error: null,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  /* --------------------------------- actions -------------------------------- */
  const fetchAllData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const COMPANY_ID = "cmlgt985b0003x0cuhtyxoihd";
      const USER_ID = "usr_001";

      const [warehousesData, statsData, movementsData] = await Promise.all([
        getWarehouses(COMPANY_ID, USER_ID),
        getWarehouseStats(COMPANY_ID, USER_ID),
        getRecentStockMovements(COMPANY_ID, USER_ID),
      ]);

      setState((prev) => ({
        ...prev,
        warehouses: warehousesData as any,
        stats: statsData,
        recentMovements: movementsData as any,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to fetch warehouse data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load warehouse data",
      }));
    }
  }, []);
  const actions: WarehousePageActions = {
    fetchWarehouses: async () => {
      await fetchAllData();
    },
    fetchStats: async () => {},
    fetchRecentMovements: async () => {},
    refreshAll: async () => {
      await fetchAllData();
    },
    selectWarehouse: (id: string | null) => {
      setState((prev) => ({ ...prev, selectedWarehouseId: id }));
    },
  };

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
            Warehouse Management
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            Manage your warehouses, monitor performance and license status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Warehouse
        </Button>
      </Stack>

      <Box mb={2}>
        <WarehouseKpiCard stats={state.stats} loading={state.loading} />
      </Box>

      <Box mb={2}>
        <WarehouseListTable
          warehouses={state.warehouses}
          loading={state.loading}
          onSelect={actions.selectWarehouse}
        />
      </Box>

      <Stack direction={"row"} spacing={4}>
        <CapacityUtilization
          warehouses={state.warehouses}
          loading={state.loading}
        />
        <RecentStockMovements
          movements={state.recentMovements}
          loading={state.loading}
        />
      </Stack>
    </Box>
  );
}
