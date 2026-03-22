"use client";
import { Box, Stack, useTheme } from "@mui/material";
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import InventoryIcon from "@mui/icons-material/Inventory";
import { ShipmentKpiCardProps } from "@/app/lib/type/shipment";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";

const ShipmentKpiCard = ({ state }: ShipmentKpiCardProps) => {
  const { stats, loading } = state;
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  if (loading) {
    return <KpiSkeleton count={4} />;
  }

  const values = stats || { total: 0, active: 0, delayed: 0, inTransit: 0 };

  const kpiItems = [
    {
      label: "Total Shipments",
      value: values.total,
      icon: <InventoryIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "Active Shipments",
      value: values.active,
      icon: <LocalShippingIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Delayed Shipments",
      value: values.delayed,
      icon: <AccessTimeIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "In Transit",
      value: values.inTransit,
      icon: <DirectionsBoatIcon />,
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
      {kpiItems.map((item, index) => (
        <Box
          key={index}
          sx={{ width: { xs: "100%", sm: "calc(50% - 8px)", md: "calc(25% - 12px)" } }}
        >
          <StatCard
            title={item.label}
            value={item.value}
            icon={item.icon}
            color={item.color}
            sx={{ height: "100%" }}
          />
        </Box>
      ))}
    </Stack>
  );
};

export default ShipmentKpiCard;
