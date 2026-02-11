"use client";
import { Stack, useTheme } from "@mui/material";
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useEffect, useState } from "react";
import { getShipmentStats } from "@/app/lib/controllers/shipments";

const ShipmentKpiCard = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const [stats, setStats] = useState({ total: 0, active: 0, delayed: 0, inTransit: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      // TODO: Use actual auth context
      const COMPANY_ID = 'cmlgt985b0003x0cuhtyxoihd';
      const USER_ID = 'usr_001';
      try {
        const data = await getShipmentStats(COMPANY_ID, USER_ID);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  const kpiItems = [
    {
      label: "Total Shipments",
      value: stats.total,
      icon: <InventoryIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "Active Shipments",
      value: stats.active,
      icon: <LocalShippingIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Delayed Shipments",
      value: stats.delayed,
      icon: <AccessTimeIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "In Transit",
      value: stats.inTransit,
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
