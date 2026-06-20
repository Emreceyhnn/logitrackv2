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
import CustomCard from "@/app/components/cards/card";
import DailyOperationsCard from "@/app/components/dashboard/overview/dailyOperations";
import dynamic from "next/dynamic";

const FuelByVehicleCard = dynamic(
  () => import("@/app/components/dashboard/overview/fuelByVehicleCard"),
  {
    ssr: false,
    loading: () => <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
  }
);
const WarehouseCapacityCard = dynamic(
  () => import("@/app/components/dashboard/overview/warehouseCapacityCard"),
  { ssr: false }
);
const AlertInventoryCard = dynamic(
  () => import("@/app/components/dashboard/overview/inventoryCard"),
  { ssr: false }
);
const ShipmentOnStatusCard = dynamic(
  () => import("@/app/components/dashboard/overview/shipmentsByStatusCard"),
  {
    ssr: false,
    loading: () => <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
  }
);
const PicksPacksDailyCard = dynamic(
  () => import("@/app/components/dashboard/overview/picsPacksDailyCard"),
  { ssr: false }
);
const ShipmentVolumeCard = dynamic(
  () => import("@/app/components/dashboard/overview/onTimeTrends"),
  {
    ssr: false,
    loading: () => <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 2 }} />
  }
);
const OverviewMapCard = dynamic(
  () => import("@/app/components/dashboard/overview/overViewMapCard"),
  {
    ssr: false,
    loading: () => <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
  }
);
import { useState, useMemo, useEffect } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useOverviewData } from "@/app/hooks/useOverview";
import { useDateSettings } from "@/app/hooks/useDateSettings";
import { MapData } from "@/app/lib/type/overview";
import LocalShipping from "@mui/icons-material/LocalShipping";
import AccessTime from "@mui/icons-material/AccessTime";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import Build from "@mui/icons-material/Build";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Person from "@mui/icons-material/Person";
import Warehouse from "@mui/icons-material/Warehouse";
import Inventory from "@mui/icons-material/Inventory";
import KpiCards from "@/app/components/cards/KpiCards";
import { formatDisplayTime } from "@/app/lib/utils/date";

export default function OverviewContent() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const theme = useTheme();
  const dict = useDictionary();

  /* ---------------------------------- HOOKS --------------------------------- */
  const { data, isLoading, refetch } = useOverviewData();
  const dateSettings = useDateSettings();
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLastRefreshed(new Date());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    await refetch();
    setLastRefreshed(new Date());
  };

  /* ----------------------------------- KPI ---------------------------------- */
  const kpiItems = useMemo(
    () => [
      {
        label: dict.overview.activeShipments,
        value: data.stats?.activeShipments || 0,
        icon: <LocalShipping />,
        color: theme.palette.primary.main,
        trend: data.statsTrends?.activeShipments,
      },
      {
        label: dict.overview.delayedShipments,
        value: data.stats?.delayedShipments || 0,
        icon: <AccessTime />,
        color:
          (data.stats?.delayedShipments || 0) > 0
            ? theme.palette.error.main
            : theme.palette.success.main,
        trend: data.statsTrends?.delayedShipments,
      },
      {
        label: dict.overview.vehiclesOnTrip,
        value: data.stats?.vehiclesOnTrip || 0,
        icon: <DirectionsCar />,
        color: theme.palette.info.main,
        trend: data.statsTrends?.vehiclesOnTrip,
      },
      {
        label: dict.overview.vehiclesInService,
        value: data.stats?.vehiclesInService || 0,
        color: theme.palette.warning.main,
        icon: <Build />,
        trend: data.statsTrends?.vehiclesInService,
      },
      {
        label: dict.overview.availableVehicles,
        value: data.stats?.availableVehicles || 0,
        icon: <CheckCircle />,
        color: theme.palette.success.main,
        trend: data.statsTrends?.availableVehicles,
      },
      {
        label: dict.overview.activeDrivers,
        value: data.stats?.activeDrivers || 0,
        icon: <Person />,
        color: theme.palette.kpi.violet,
        trend: data.statsTrends?.activeDrivers,
      },
      {
        label: dict.overview.warehouses,
        value: data.stats?.warehouses || 0,
        icon: <Warehouse />,
        color: theme.palette.kpi.indigo,
        trend: data.statsTrends?.warehouses,
      },
      {
        label: dict.overview.inventorySkus,
        value: data.stats?.inventorySkus || 0,
        icon: <Inventory />,
        color: theme.palette.kpi.sky,
        trend: data.statsTrends?.inventorySkus,
      },
    ],
    [data.stats, data.statsTrends, theme, dict]
  );

  const mapData: MapData[] = useMemo(
    () =>
      (data.mapData || []).map((item: MapData) => ({
        ...item,
        type: (["W", "V", "C"].includes(item.type) ? item.type : "W") as
          | "W"
          | "V"
          | "C",
      })),
    [data.mapData]
  );

  return (
    <Box p={4} width={"100%"}>
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
          {dict.overview.title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          {lastRefreshed && (
            <Typography variant="caption" color="text.secondary">
              {dict.common.lastUpdated}:{" "}
              {formatDisplayTime(lastRefreshed, dateSettings)}
            </Typography>
          )}
          <Tooltip title={dict.common.refreshDashboard}>
            <IconButton
              size="small"
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{
                animation: isLoading ? "spin 1s linear infinite" : "none",
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

      <KpiCards kpis={kpiItems} loading={isLoading} />

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
        {isLoading ? (
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
              <DailyOperationsCard values={data.dailyOps} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FuelByVehicleCard logs={data.fuelLogs} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ShipmentOnStatusCard values={data.shipmentStatus} />
            </Box>

            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ActionRequiredCard alerts={data.alerts} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <WarehouseCapacityCard values={data.warehouseCapacity} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 1", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <PicksPacksDailyCard values={data.picksAndPacks} />
            </Box>

            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 3", lg: "span 8" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ShipmentVolumeCard values={data.shipmentVolume} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 3", lg: "span 4" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <AlertInventoryCard inventory={data.lowStockItems} />
            </Box>

            <Box
              sx={{
                gridColumn: { xs: "span 1", md: "span 3", lg: "span 12" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <OverviewMapCard stats={mapData} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
