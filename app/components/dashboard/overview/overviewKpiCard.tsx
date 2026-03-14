"use client";

import { Stack, useTheme, Box } from "@mui/material";
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
  /* -------------------------------- variables ------------------------------- */
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
      color: theme.palette.primary.main,
    },
    {
      label: "Delayed Shipments",
      value: values.delayedShipments,
      icon: <AccessTimeIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "Vehicles On Trip",
      value: values.vehiclesOnTrip,
      icon: <DirectionsCarIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Vehicles In Service",
      value: values.vehiclesInService,
      icon: <BuildIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: "Available Vehicles",
      value: values.availableVehicles,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Active Drivers",
      value: values.activeDrivers,
      icon: <PersonIcon />,
      color: theme.palette.secondary.main,
    },
    {
      label: "Warehouses",
      value: values.warehouses,
      icon: <WarehouseIcon />,
      color: theme.palette.grey[700],
    },
    {
      label: "Inventory Skus",
      value: values.inventorySkus,
      icon: <InventoryIcon />,
      color: theme.palette.info.dark,
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

export default OverviewKpiCard;
