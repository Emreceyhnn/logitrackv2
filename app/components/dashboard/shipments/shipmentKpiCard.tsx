"use client";
import { Stack, useTheme, Skeleton } from "@mui/material";
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import InventoryIcon from "@mui/icons-material/Inventory";
import { ShipmentKpiCardProps } from "@/app/lib/type/shipment";

const ShipmentKpiCard = ({ stats, loading = false }: ShipmentKpiCardProps) => {
  const theme = useTheme();

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
    <Stack
      direction={"row"}
      flexWrap="wrap"
      gap={2}
      mt={2}
      justifyContent={"center"}
    >
      {kpiItems.map((item, index) => (
        <Stack
          key={index}
          flexBasis={{ xs: "100%", sm: "48%", md: "23%" }}
          flexGrow={1}
        >
          <StatCard
            title={item.label}
            value={loading ? 0 : item.value}
            icon={item.icon}
            color={item.color}
          />
        </Stack>
      ))}
    </Stack>
  );
};

export default ShipmentKpiCard;
