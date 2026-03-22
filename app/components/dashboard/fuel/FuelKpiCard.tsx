"use client";

import { useTheme, Box } from "@mui/material";
import StatCard from "../../cards/StatCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import { FuelKpiCardProps } from "@/app/lib/type/fuel";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";
import { motion } from "framer-motion";

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
      color: "#06b6d4", // Cyan
    },
    {
      label: "Total Efficiency",
      value: stats.efficiencyKml
        ? `${stats.efficiencyKml.toFixed(2)} km/L`
        : "0.00 km/L",
      icon: <SpeedIcon />,
      color: "#8b5cf6", // Violet
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Box
      component={motion.div}
      variants={container}
      initial="hidden"
      animate="show"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "stretch", // Ensure equal height in rows
        gap: 3,
        mt: 3,
        width: "100%",
        "& > *": {
          flex: {
            xs: "1 1 calc(100% - 24px)",
            sm: "1 1 calc(50% - 24px)",
            md: "1 1 calc(25% - 24px)",
          },
          display: "flex", // Support StatCard stretching
        }
      }}
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
