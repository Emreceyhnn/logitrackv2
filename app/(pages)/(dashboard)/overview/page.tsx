"use client";

import ActionRequiredCard from "@/app/components/dashboard/overview/actionRequiredCard";
import { Box, Divider, Stack, Typography, IconButton, Tooltip, Skeleton } from "@mui/material";
import CustomCard from "../../../components/cards/card";
import DailyOperationsCard from "../../../components/dashboard/overview/dailyOperations";
import FuelByVehicleCard from "@/app/components/dashboard/overview/fuelByVehicleCard";
import WarehouseCapacityCard from "@/app/components/dashboard/overview/warehouseCapacityCard";
import AlertInventoryCard from "@/app/components/dashboard/overview/inventoryCard";
import ShipmentOnStatusCard from "@/app/components/dashboard/overview/shipmentsByStatusCard";
import PicksPacksDailyCard from "@/app/components/dashboard/overview/picsPacksDailyCard";
import ShipmentVolumeCard from "@/app/components/dashboard/overview/onTimeTrends"; // Renamed inside the component file, import kept for now
import OverviewKpiCard from "@/app/components/dashboard/overview/overviewKpiCard";
import OverviewMapCard from "@/app/components/dashboard/overview/overViewMapCard";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  getOverviewStats,
  getActionRequired,
  getDailyOperations,
  getFuelStats,
  getWarehouseCapacity,
  getLowStockItems,
  getShipmentStatusStats,
  getPicksAndPacks,
  getShipmentVolumeHistory,
  getMapData,
} from "@/app/lib/controllers/analytics";
import { OverviewPageState, MapData } from "@/app/lib/type/overview";

export default function OverviewPage() {
  const router = useRouter();
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [state, setState] = useState<OverviewPageState>({
    data: {
      stats: null,
      dailyOps: null,
      fuelStats: [],
      warehouseCapacity: [],
      lowStockItems: [],
      shipmentStatus: [],
      picksAndPacks: null,
      shipmentVolume: [],
      trends: [], // Backward compatibility
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
        volumeData,
        mapDataRes,
      ] = await Promise.all([
        Promise.resolve(session),
        getActionRequired(),
        getDailyOperations(),
        getFuelStats(),
        getWarehouseCapacity(),
        getLowStockItems(),
        getShipmentStatusStats(),
        getPicksAndPacks(),
        getShipmentVolumeHistory(),
        getMapData(),
      ]);

      const validMapData: MapData[] = (mapDataRes || []).map((item: MapData) => ({
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
          shipmentVolume: volumeData || [],
          trends: [],
          mapData: validMapData,
        },
        alerts: alertsData || [],
        loading: false,
        error: null,
      });
      setLastRefreshed(new Date());
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <Box position={"relative"} p={4} width={"100%"}>
      
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-2%",
          }}
        >
          Overview
        </Typography>
        
        <Stack direction="row" alignItems="center" spacing={1}>
          {lastRefreshed && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          )}
          <Tooltip title="Refresh Dashboard">
            <IconButton 
              size="small" 
              onClick={fetchDashboardData} 
              disabled={state.loading}
              sx={{ 
                animation: state.loading ? "spin 1s linear infinite" : "none",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" }
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 3 }} />

      {/* KPI Cards (4 per row) */}
      <OverviewKpiCard stats={state.data.stats || null} loading={state.loading} />

      {/* Bento Grid Layout */}
      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)", lg: "repeat(12, 1fr)" }, 
        gap: 3, 
        mt: 3 
      }}>
        {state.loading ? (
          <>
            {/* Top row skeletons (3 items) */}
            {Array.from(new Array(3)).map((_, i) => (
              <Box key={`skel-1-${i}`} sx={{ gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
                <CustomCard sx={{ height: 320, p: 2 }}>
                  <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
                  <Skeleton variant="rounded" height={180} sx={{ borderRadius: 2 }} />
                </CustomCard>
              </Box>
            ))}
            {/* Second row skeletons (3 items) */}
            {Array.from(new Array(3)).map((_, i) => (
              <Box key={`skel-2-${i}`} sx={{ gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
                <CustomCard sx={{ height: 320, p: 2 }}>
                  <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
                  <Skeleton variant="rounded" height="100%" sx={{ borderRadius: 2 }} />
                </CustomCard>
              </Box>
            ))}
            {/* Third row skeletons (Charts & Table) */}
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 3", lg: "span 8" }, display: "flex", flexDirection: "column" }}>
              <CustomCard sx={{ height: 380, p: 2 }}>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: 2 }} />
              </CustomCard>
            </Box>
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 3", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
              <CustomCard sx={{ height: 380, p: 2 }}>
                <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: 2 }} />
              </CustomCard>
            </Box>
            {/* Map skeleton */}
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 3", lg: "span 12" }, display: "flex", flexDirection: "column" }}>
              <CustomCard sx={{ height: 400, p: 2 }}>
                <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }} />
              </CustomCard>
            </Box>
          </>
        ) : (
          <>
            {/* Row 1 */}
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
              <DailyOperationsCard values={state.data.dailyOps} />
            </Box>
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
              <FuelByVehicleCard values={state.data.fuelStats} />
            </Box>
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
              <ShipmentOnStatusCard values={state.data.shipmentStatus} />
            </Box>

            {/* Row 2 */}
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
              <ActionRequiredCard alerts={state.alerts} />
            </Box>
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
              <WarehouseCapacityCard values={state.data.warehouseCapacity} />
            </Box>
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
              <PicksPacksDailyCard values={state.data.picksAndPacks} />
            </Box>

            {/* Row 3 - Charts & Map */}
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 3", lg: "span 8" }, display: "flex", flexDirection: "column" }}>
              <ShipmentVolumeCard values={state.data.shipmentVolume} />
            </Box>
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 3", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
              <AlertInventoryCard inventory={state.data.lowStockItems} />
            </Box>

            {/* Row 4 - Map Full Width Native Form */}
            <Box sx={{ gridColumn: { xs: "span 1", md: "span 3", lg: "span 12" }, display: "flex", flexDirection: "column" }}>
              <OverviewMapCard stats={state.data.mapData} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
