"use client";

import { Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BadgeIcon from "@mui/icons-material/Badge";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { CompanyPageProps } from "@/app/lib/type/company";
import StatCard from "../../cards/StatCard";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";
import { motion } from "framer-motion";

interface KpiItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface CompanyKpiCardProps {
  props: CompanyPageProps;
}

export default function CompanyKpiCard({ props }: CompanyKpiCardProps) {
  const { state } = props;
  const data = state.data?.stats ?? null;

  if (state.loading) {
    return <KpiSkeleton count={6} />;
  }

  const kpis: KpiItem[] = [
    {
      label: "Total Users",
      value: data?.users ?? 0,
      icon: <PeopleIcon sx={{ fontSize: 22 }} />,
      color: "#6366f1", // Indigo
    },
    {
      label: "Vehicles",
      value: data?.vehicles ?? 0,
      icon: <DirectionsCarIcon sx={{ fontSize: 22 }} />,
      color: "#0ea5e9", // Sky
    },
    {
      label: "Drivers",
      value: data?.drivers ?? 0,
      icon: <BadgeIcon sx={{ fontSize: 22 }} />,
      color: "#10b981", // Emerald
    },
    {
      label: "Warehouses",
      value: data?.warehouses ?? 0,
      icon: <WarehouseIcon sx={{ fontSize: 22 }} />,
      color: "#f59e0b", // Amber
    },
    {
      label: "Customers",
      value: data?.customers ?? 0,
      icon: <GroupsIcon sx={{ fontSize: 22 }} />,
      color: "#ec4899", // Pink
    },
    {
      label: "Shipments",
      value: data?.shipments ?? 0,
      icon: <LocalShippingIcon sx={{ fontSize: 22 }} />,
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
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        justifyContent: "center",
        alignItems: "stretch", // Ensure equal height in rows
        gap: 3,
        mt: 3,
        width: "100%",
        "& > *": {
          display: "flex", // Support StatCard stretching
        }
      }}
    >
      {kpis.map((kpi, index) => (
        <Box
          key={index}
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: index < 4 ? "calc(25% - 12px)" : "calc(50% - 8px)",
            },
          }}
        >
          <StatCard
            title={kpi.label}
            value={kpi.value.toLocaleString()}
            icon={kpi.icon}
            color={kpi.color}
            sx={{ height: "100%" }}
          />
        </Box>
      ))}
    </Box>
  );
}
