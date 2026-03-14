"use client";

import {
  Box,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BadgeIcon from "@mui/icons-material/Badge";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { CompanyPageProps } from "@/app/lib/type/company";
import StatCard from "../../cards/StatCard";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";

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
      color: "#6366f1",
    },
    {
      label: "Vehicles",
      value: data?.vehicles ?? 0,
      icon: <DirectionsCarIcon sx={{ fontSize: 22 }} />,
      color: "#0ea5e9",
    },
    {
      label: "Drivers",
      value: data?.drivers ?? 0,
      icon: <BadgeIcon sx={{ fontSize: 22 }} />,
      color: "#10b981",
    },
    {
      label: "Warehouses",
      value: data?.warehouses ?? 0,
      icon: <WarehouseIcon sx={{ fontSize: 22 }} />,
      color: "#f59e0b",
    },
    {
      label: "Customers",
      value: data?.customers ?? 0,
      icon: <GroupsIcon sx={{ fontSize: 22 }} />,
      color: "#ec4899",
    },
    {
      label: "Shipments",
      value: data?.shipments ?? 0,
      icon: <LocalShippingIcon sx={{ fontSize: 22 }} />,
      color: "#8b5cf6",
    },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      gap={2}
    >
      {kpis.map((kpi, index) => (
        <StatCard
          key={index}
          title={kpi.label}
          value={kpi.value.toLocaleString()}
          icon={kpi.icon}
          color={kpi.color}
        />
      ))}
    </Box>
  );
}
