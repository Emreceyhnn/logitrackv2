"use client";

import { Stack, useTheme, Box } from "@mui/material";
import StatCard from "../../cards/StatCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import { FuelKpiCardProps } from "@/app/lib/type/fuel";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";

const FuelKpiCard = ({ state }: FuelKpiCardProps) => {
  const theme = useTheme();
  const { stats, loading } = state;

  if (loading || !stats) {
    return <KpiSkeleton count={4} />;
  }

  const kpiItems = [
    {
      label: "Total Fuel Cost",
      value: stats.totalCost ? `$${stats.totalCost.toLocaleString()}` : "$0",
      icon: <LocalAtmIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Total Volume",
      value: stats.totalVolume
        ? `${stats.totalVolume.toLocaleString()} L`
        : "0 L",
      icon: <LocalGasStationIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "Avg Fuel Price",
      value: stats.avgFuelPrice
        ? `$${stats.avgFuelPrice.toFixed(2)}/L`
        : "$0.00/L",
      icon: <TrendingUpIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Total Efficiency",
      value: stats.efficiencyKml
        ? `${stats.efficiencyKml.toFixed(2)} km/L`
        : "0.00 km/L",
      icon: <SpeedIcon />,
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      gap={2}
      mt={2}
    >
      {kpiItems.map((item, index) => (
        <StatCard
          key={index}
          title={item.label}
          value={item.value}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </Box>
  );
};

export default FuelKpiCard;
