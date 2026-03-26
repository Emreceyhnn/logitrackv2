"use client";

import ActionRequiredCard from "@/app/components/dashboard/overview/actionRequiredCard";
import {
  Box,
  Divider,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Skeleton,
  useTheme,
} from "@mui/material";
import CustomCard from "../../../components/cards/card";
import DailyOperationsCard from "../../../components/dashboard/overview/dailyOperations";
import FuelByVehicleCard from "@/app/components/dashboard/overview/fuelByVehicleCard";
import WarehouseCapacityCard from "@/app/components/dashboard/overview/warehouseCapacityCard";
import AlertInventoryCard from "@/app/components/dashboard/overview/inventoryCard";
import ShipmentOnStatusCard from "@/app/components/dashboard/overview/shipmentsByStatusCard";
import PicksPacksDailyCard from "@/app/components/dashboard/overview/picsPacksDailyCard";
import ShipmentVolumeCard from "@/app/components/dashboard/overview/onTimeTrends";
import OverviewMapCard from "@/app/components/dashboard/overview/overViewMapCard";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
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
import {
  LocalShipping,
  AccessTime,
  DirectionsCar,
  Build,
  CheckCircle,
  Person,
  Warehouse,
  Inventory,
} from "@mui/icons-material";
import KpiCards from "@/app/components/cards/KpiCards";

export default function OverviewPage() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const router = useRouter();
  const theme = useTheme();

  /* --------------------------------- STATES --------------------------------- */
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

  /* --------------------------------- ACTIONS -------------------------------- */
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

      const validMapData: MapData[] = (mapDataRes || []).map(
        (item: MapData) => ({
          ...item,
          type: (["W", "V", "C"].includes(item.type) ? item.type : "W") as
            | "W"
            | "V"
            | "C",
        })
      );

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

  /* -------------------------------- LIFECYCLE ------------------------------- */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  /* ----------------------------------- KPI ---------------------------------- */
  const kpiItems = [
    {
      label: "Active Shipments",
      value: state.data.stats?.activeShipments || 0,
      icon: <LocalShipping sx={{ fontSize: 22 }} />,
      color: theme.palette.primary.main,
      trend: { value: 4, isUp: true },
    },
    {
      label: "Delayed Shipments",
      value: state.data.stats?.delayedShipments || 0,
      icon: <AccessTime sx={{ fontSize: 22 }} />,
      color: theme.palette.error.main,
      trend: { value: 1, isUp: false },
    },
    {
      label: "Vehicles On Trip",
      value: state.data.stats?.vehiclesOnTrip || 0,
      icon: <DirectionsCar sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.sky,
      trend: { value: 6, isUp: true },
    },
    {
      label: "Vehicles In Service",
      value: state.data.stats?.vehiclesInService || 0,
      icon: <Build sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.amber,
    },
    {
      label: "Available Vehicles",
      value: state.data.stats?.availableVehicles || 0,
      icon: <CheckCircle sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.emerald,
      trend: { value: 2, isUp: true },
    },
    {
      label: "Active Drivers",
      value: state.data.stats?.activeDrivers || 0,
      icon: <Person sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.violet,
    },
    {
      label: "Warehouses",
      value: state.data.stats?.warehouses || 0,
      icon: <Warehouse sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.indigo,
    },
    {
      label: "Inventory Skus",
      value: state.data.stats?.inventorySkus || 0,
      icon: <Inventory sx={{ fontSize: 22 }} />,
      color: theme.palette.kpi.cyan,
      trend: { value: 8, isUp: true },
    },
  ];

  return (
    <Box position={"relative"} p={4} width={"100%"}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
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
              Last updated:{" "}
              {lastRefreshed.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
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
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 3 }} />

      <KpiCards kpis={kpiItems} loading={state.loading} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
            lg: "repeat(12, 1fr)",
          },
          gap: 3,
          mt: 3,
        }}
      >
        {state.loading ? (
          <>
            {Array.from(new Array(3)).map((_, i) => (
              <Box
                key={`skel-1-${i}`}
                sx={{
                  gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CustomCard sx={{ height: 320, p: 2 }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={32}
                    sx={{ mb: 2 }}
                  />
                  <Skeleton
                    variant="rounded"
                    height={180}
                    sx={{ borderRadius: 2 }}
                  />
                </CustomCard>
              </Box>
            ))}

            {Array.from(new Array(3)).map((_, i) => (
              <Box
                key={`skel-2-${i}`}
                sx={{
                  gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CustomCard sx={{ height: 320, p: 2 }}>
                  <Skeleton
                    variant="text"
                    width="50%"
                    height={32}
                    sx={{ mb: 2 }}
                  />
                  <Skeleton
                    variant="rounded"
                    height="100%"
                    sx={{ borderRadius: 2 }}
                  />
                </CustomCard>
              </Box>
            ))}

            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 3", lg: "span 8" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CustomCard sx={{ height: 380, p: 2 }}>
                <Skeleton
                  variant="text"
                  width="30%"
                  height={32}
                  sx={{ mb: 2 }}
                />
                <Skeleton
                  variant="rounded"
                  height={280}
                  sx={{ borderRadius: 2 }}
                />
              </CustomCard>
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 3", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CustomCard sx={{ height: 380, p: 2 }}>
                <Skeleton
                  variant="text"
                  width="40%"
                  height={32}
                  sx={{ mb: 2 }}
                />
                <Skeleton
                  variant="rounded"
                  height={280}
                  sx={{ borderRadius: 2 }}
                />
              </CustomCard>
            </Box>

            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 3", lg: "span 12" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CustomCard sx={{ height: 400, p: 2 }}>
                <Skeleton
                  variant="rectangular"
                  height="100%"
                  sx={{ borderRadius: 2 }}
                />
              </CustomCard>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <DailyOperationsCard values={state.data.dailyOps} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FuelByVehicleCard values={state.data.fuelStats} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ShipmentOnStatusCard values={state.data.shipmentStatus} />
            </Box>

            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ActionRequiredCard alerts={state.alerts} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <WarehouseCapacityCard values={state.data.warehouseCapacity} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <PicksPacksDailyCard values={state.data.picksAndPacks} />
            </Box>

            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 3", lg: "span 8" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ShipmentVolumeCard values={state.data.shipmentVolume} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 3", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <AlertInventoryCard inventory={state.data.lowStockItems} />
            </Box>

            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 3", lg: "span 12" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <OverviewMapCard stats={state.data.mapData} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
