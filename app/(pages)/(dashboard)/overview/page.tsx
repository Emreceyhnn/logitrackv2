"use client";

import ActionRequiredCard from "@/app/components/dashboard/overview/actionRequiredCard";
import { Box, Divider, Stack, Typography, CircularProgress } from "@mui/material";
import DailyOperationsCard from "../../../components/dashboard/overview/dailyOperations";
import FuelByVehicleCard from "@/app/components/dashboard/overview/fuelByVehicleCard";
import WarehouseCapacityCard from "@/app/components/dashboard/overview/warehouseCapacityCard";
import AlertInventoryCard from "@/app/components/dashboard/overview/inventoryCard";
import ShipmentOnStatusCard from "@/app/components/dashboard/overview/shipmentsByStatusCard";
import PicksPacksDailyCard from "@/app/components/dashboard/overview/picsPacksDailyCard";
import OnTimeTrendsCard from "@/app/components/dashboard/overview/onTimeTrends";
import OverviewKpiCard from "@/app/components/dashboard/overview/overviewKpiCard";
import OverviewMapCard from "@/app/components/dashboard/overview/overViewMapCard";
import { useEffect, useState } from "react";
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
  getMapData
} from "@/app/lib/controllers/analytics";

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [dailyOps, setDailyOps] = useState<any>(null);
  const [fuelStats, setFuelStats] = useState<any[]>([]);
  const [warehouseCapacity, setWarehouseCapacity] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [shipmentStatus, setShipmentStatus] = useState<any[]>([]);
  const [picksPacks, setPicksPacks] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [mapData, setMapData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
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
            mapDataRes
          ] = await Promise.all([
            getOverviewStats(token),
            getActionRequired(token),
            getDailyOperations(token),
            getFuelStats(token),
            getWarehouseCapacity(token),
            getLowStockItems(token),
            getShipmentStatusStats(token),
            getPicksAndPacks(token),
            getOnTimeTrends(token),
            getMapData(token)
          ]);

          setStats(statsData);
          setAlerts(alertsData || []);
          setDailyOps(dailyOpsData);
          setFuelStats(fuelData || []);
          setWarehouseCapacity(capacityData || []);
          setLowStock(lowStockData || []);
          setShipmentStatus(statusData || []);
          setPicksPacks(picksData);
          setTrends(trendsData || []);
          setMapData(mapDataRes || []);

        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={40} sx={{ color: "#38bdf8" }} />
      </Box>
    );
  }

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

      {stats && <OverviewKpiCard values={stats} />}

      <Stack direction={"row"} spacing={2} mt={2}>
        <ActionRequiredCard alerts={alerts} />
        <DailyOperationsCard values={dailyOps} />
        <FuelByVehicleCard values={fuelStats} />
        <Stack justifyContent={"space-between"} sx={{ flexGrow: 1 }}>
          <WarehouseCapacityCard values={warehouseCapacity} />
          <AlertInventoryCard inventory={lowStock} />
        </Stack>
      </Stack>
      <Stack mt={2} direction={"row"} spacing={2}>
        <Stack spacing={2} flexGrow={1}>
          <ShipmentOnStatusCard values={shipmentStatus} />
          <PicksPacksDailyCard values={picksPacks} />
        </Stack>
        <OverviewMapCard values={mapData} />
      </Stack>
      <Stack mt={2}>
        <OnTimeTrendsCard values={trends} />
      </Stack>
    </Box>
  );
}
