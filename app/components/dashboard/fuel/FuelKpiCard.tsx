"use client";

import { Stack, useTheme, Typography } from "@mui/material";
import StatCard from "../../cards/StatCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import { FuelKpiCardProps } from "@/app/lib/type/fuel";

const FuelKpiCard = ({ state, actions }: FuelKpiCardProps) => {
  const theme = useTheme();
  const { stats } = state;

  const kpiItems = [
    {
      label: "Total Fuel Cost",
      value: stats?.totalCost ? `$${stats.totalCost.toLocaleString()}` : "$0",
      icon: <LocalAtmIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Total Volume",
      value: stats?.totalVolume
        ? `${stats.totalVolume.toLocaleString()} L`
        : "0 L",
      icon: <LocalGasStationIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "Avg Fuel Price",
      value: stats?.avgFuelPrice
        ? `$${stats.avgFuelPrice.toFixed(2)}/L`
        : "$0.00/L",
      icon: <TrendingUpIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Total Efficiency",
      value: stats?.efficiencyKml
        ? `${stats.efficiencyKml.toFixed(2)} km/L`
        : "0.00 km/L",
      icon: <SpeedIcon />,
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
      {kpiItems.map((item, index) => (
        <Stack
          key={index}
          flexGrow={1}
          flexBasis={{ xs: "100%", sm: "48%", md: "23%" }}
        >
          <StatCard
            title={item.label}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        </Stack>
      ))}
    </Stack>
  );
};

export default FuelKpiCard;
