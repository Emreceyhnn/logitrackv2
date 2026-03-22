"use client";

import { useTheme, Box } from "@mui/material";
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import InventoryIcon from "@mui/icons-material/Inventory";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";
import { motion } from "framer-motion";

interface OverviewKpiCardProps {
  stats: {
    activeShipments: number;
    delayedShipments: number;
    vehiclesOnTrip: number;
    vehiclesInService: number;
    availableVehicles: number;
    activeDrivers: number;
    warehouses: number;
    inventorySkus: number;
  } | null;
  loading?: boolean;
}

const OverviewKpiCard = ({ stats, loading = false }: OverviewKpiCardProps) => {
  const theme = useTheme();

  if (loading || !stats) {
    return <KpiSkeleton count={8} />;
  }

  const values = stats;

  const kpiItems = [
    {
      label: "Active Shipments",
      value: values.activeShipments,
      icon: <LocalShippingIcon />,
      color: theme.palette.primary.main, // Blue
      trend: { value: 4, isUp: true }
    },
    {
      label: "Delayed Shipments",
      value: values.delayedShipments,
      icon: <AccessTimeIcon />,
      color: theme.palette.error.main, // Red
      trend: { value: 1, isUp: false }
    },
    {
      label: "Vehicles On Trip",
      value: values.vehiclesOnTrip,
      icon: <DirectionsCarIcon />,
      color: "#0ea5e9", // Sky
      trend: { value: 6, isUp: true }
    },
    {
      label: "Vehicles In Service",
      value: values.vehiclesInService,
      icon: <BuildIcon />,
      color: "#f59e0b", // Amber
    },
    {
      label: "Available Vehicles",
      value: values.availableVehicles,
      icon: <CheckCircleIcon />,
      color: "#10b981", // Emerald
      trend: { value: 2, isUp: true }
    },
    {
      label: "Active Drivers",
      value: values.activeDrivers,
      icon: <PersonIcon />,
      color: "#8b5cf6", // Violet
    },
    {
      label: "Warehouses",
      value: values.warehouses,
      icon: <WarehouseIcon />,
      color: "#6366f1", // Indigo
    },
    {
      label: "Inventory Skus",
      value: values.inventorySkus,
      icon: <InventoryIcon />,
      color: "#06b6d4", // Cyan
      trend: { value: 8, isUp: true }
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
        alignItems: "stretch", // Ensure equal height in rows
        gap: 3,
        mt: 3,
        width: "100%",
        "& > *": {
          flex: {
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 24px)",
            md: "1 1 calc(25% - 24px)",
          },
          display: "flex", // Support StatCard stretching
        }
      }}
    >
      {kpiItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(25% - 12px)",
            },
          }}
        >
          <StatCard
            title={item.label}
            value={item.value}
            icon={item.icon}
            color={item.color}
            trend={item.trend}
          />
        </Box>
      ))}
    </Box>
  );
};

export default OverviewKpiCard;
