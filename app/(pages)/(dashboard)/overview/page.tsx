"use client";

import ActionRequiredCard from "@/app/components/dashboard/overview/actionRequiredCard";
import { Box, Divider, Stack, Typography } from "@mui/material";
import DailyOperationsCard from "../../../components/dashboard/overview/dailyOperations";
import FuelByVehicleCard from "@/app/components/dashboard/overview/fuelByVehicleCard";
import WarehouseCapacityCard from "@/app/components/dashboard/overview/warehouseCapacityCard";
import AlertInventoryCard from "@/app/components/dashboard/overview/inventoryCard";
import ShipmentOnStatusCard from "@/app/components/dashboard/overview/shipmentsByStatusCard";
import PicksPacksDailyCard from "@/app/components/dashboard/overview/picsPacksDailyCard";
import OnTimeTrendsCard from "@/app/components/dashboard/overview/onTimeTrends";
import OverviewKpiCard from "@/app/components/dashboard/overview/overviewKpiCard";
import OverviewMapCard from "@/app/components/dashboard/overview/overViewMapCard";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  getOverviewStats,
  getActionRequired,
  getDailyOperations,
  getFuelStats,
  getWarehouseCapacity,
  getLowStockItems,
  getShipmentStatusStats,
  getPicksAndPacks,
  getOnTimeTrends,
  getMapData,
} from "@/app/lib/controllers/analytics";
import { OverviewPageState } from "@/app/lib/type/overview";

export default function OverviewPage() {
  const router = useRouter();
  const [state, setState] = useState<OverviewPageState>({
    data: {
      stats: null,
      dailyOps: null,
      fuelStats: [],
      warehouseCapacity: [],
      lowStockItems: [],
      shipmentStatus: [],
      picksAndPacks: null,
      trends: [],
      mapData: [],
    },
    alerts: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // Check auth & company
      const session = await getOverviewStats();
      // Note: getOverviewStats returns null if !companyId (see analytics.ts)

      if (!session) {
        // Redirect to onboarding if no companyId exists
        router.push("/onboarding");
        return;
      }

      const [
        statsData,
        alertsData,
        dailyOpsData,
        fuelData,
        capacityData,
        lowStockData,
        statusData,
        picksData,
        trendsData,
        mapDataRes,
      ] = await Promise.all([
        Promise.resolve(session), // Already fetched
        getActionRequired(),
        getDailyOperations(),
        getFuelStats(),
        getWarehouseCapacity(),
        getLowStockItems(),
        getShipmentStatusStats(),
        getPicksAndPacks(),
        getOnTimeTrends(),
        getMapData(),
      ]);

      const validMapData = (mapDataRes || []).map((item: any) => ({
        ...item,
        type: (["W", "V", "C"].includes(item.type) ? item.type : "W") as
          | "W"
          | "V"
          | "C",
      }));

      setState({
        data: {
          stats: statsData,
          dailyOps: dailyOpsData,
          fuelStats: fuelData || [],
          warehouseCapacity: capacityData || [],
          lowStockItems: lowStockData || [],
          shipmentStatus: statusData || [],
          picksAndPacks: picksData,
          trends: trendsData || [],
          mapData: validMapData,
        },
        alerts: alertsData || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch data",
      }));
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle unused 'actions' warning by removing it if not used in JSX

  return (
    <Box position={"relative"} p={4} width={"100%"}>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-2%",
        }}
      >
        Overview
      </Typography>
      <Divider />

      <OverviewKpiCard stats={state.data.stats || null} />

      <Stack direction={"row"} spacing={2} mt={2}>
        <ActionRequiredCard alerts={state.alerts} />
        <DailyOperationsCard values={state.data.dailyOps} />
        <FuelByVehicleCard values={state.data.fuelStats} />
        <Stack justifyContent={"space-between"} sx={{ flexGrow: 1 }}>
          <WarehouseCapacityCard values={state.data.warehouseCapacity} />
          <AlertInventoryCard inventory={state.data.lowStockItems} />
        </Stack>
      </Stack>
      <Stack mt={2} direction={"row"} spacing={2}>
        <Stack spacing={2} flexGrow={1}>
          <ShipmentOnStatusCard values={state.data.shipmentStatus} />
          <PicksPacksDailyCard values={state.data.picksAndPacks} />
        </Stack>
        <OverviewMapCard values={state.data.mapData} />
      </Stack>
      <Stack mt={2}>
        <OnTimeTrendsCard values={state.data.trends} />
      </Stack>
    </Box>
  );
}
