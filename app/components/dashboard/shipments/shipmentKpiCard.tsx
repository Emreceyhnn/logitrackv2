"use client";
<<<<<<< HEAD
import { Box, Stack, useTheme } from "@mui/material";
=======
import { useTheme, Box } from "@mui/material";
>>>>>>> b8bcc53a60daca28aadf2363b575744ba82b75bc
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import InventoryIcon from "@mui/icons-material/Inventory";
import { ShipmentKpiCardProps } from "@/app/lib/type/shipment";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";
import { motion } from "framer-motion";

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
      color: "#0ea5e9", // Sky
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
      color: "#10b981", // Emerald
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
<<<<<<< HEAD
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
=======
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
>>>>>>> b8bcc53a60daca28aadf2363b575744ba82b75bc
      ))}
    </Box>
  );
};

export default ShipmentKpiCard;
