"use client";
import { Stack, useTheme } from "@mui/material";
import mockData from "@/app/lib/mockData.json";
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import InventoryIcon from "@mui/icons-material/Inventory";

const ShipmentKpiCard = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const totalShipments = mockData.shipments.length;
  const activeShipments = mockData.shipments.filter((s) =>
    ["PROCESSING", "IN_TRANSIT"].includes(s.status)
  ).length;
  const delayedShipments = mockData.shipments.filter(
    (s) => s.status === "DELAYED"
  ).length;
  const inTransit = mockData.shipments.filter(
    (s) => s.status === "IN_TRANSIT"
  ).length;

  const kpiItems = [
    {
      label: "Total Shipments",
      value: totalShipments,
      icon: <InventoryIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "Active Shipments",
      value: activeShipments,
      icon: <LocalShippingIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Delayed Shipments",
      value: delayedShipments,
      icon: <AccessTimeIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "In Transit",
      value: inTransit,
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
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        </Stack>
      ))}
    </Stack>
  );
};

export default ShipmentKpiCard;
