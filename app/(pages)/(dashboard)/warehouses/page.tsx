"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import WarehouseKpiCard from "@/app/components/dashboard/warehouse/warehouseKpiCard";
import WarehouseListTable from "@/app/components/dashboard/warehouse/warehouseList";
import CapacityUtilization from "@/app/components/dashboard/warehouse/capacityUtilization";
import RecentStockMovements from "@/app/components/dashboard/warehouse/recentStockMovements";
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
  const [state, setState] = useState<WarehousePageState>({
    warehouses: [],
    stats: null,
    recentMovements: [],
    selectedWarehouseId: null,
    loading: true,
    error: null,
  });

  const fetchAllData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      // Mock user/company IDs for now as per previous pattern.
      // In a real app this comes from context/session.
      const COMPANY_ID = "cmlgt985b0003x0cuhtyxoihd";
      const USER_ID = "usr_001";

      const [warehousesData, statsData, movementsData] = await Promise.all([
        getWarehouses(COMPANY_ID, USER_ID),
        getWarehouseStats(COMPANY_ID, USER_ID),
        getRecentStockMovements(COMPANY_ID, USER_ID),
      ]);

      setState((prev) => ({
        ...prev,
        warehouses: warehousesData as any, // Cast due to slight Prisma type mismatches if any
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
      // Re-fetch only warehouses if needed, or just reuse fetchAll for simplicity
      await fetchAllData();
    },
    fetchStats: async () => {
      // Implementation if granular fetch needed
    },
    fetchRecentMovements: async () => {
      // Implementation if granular fetch needed
    },
    refreshAll: async () => {
      await fetchAllData();
    },
    selectWarehouse: (id: string | null) => {
      setState((prev) => ({ ...prev, selectedWarehouseId: id }));
    },
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <Box position={"relative"} p={4} width={"100%"}>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-2%",
        }}
      >
        Warehouses
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box mb={4}>
        <WarehouseKpiCard stats={state.stats} loading={state.loading} />
      </Box>

      <Box mb={4}>
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
