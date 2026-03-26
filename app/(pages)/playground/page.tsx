"use client";

import CreateCompanyDialog from "@/app/components/dialogs/company/CreateCompanyDialog";
import TestKpiCards from "@/app/components/playground/KpiCards";
import { Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BadgeIcon from "@mui/icons-material/Badge";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { CompanyPageActions, CompanyPageState } from "@/app/lib/type/company";
import { useMemo, useState } from "react";

export default function Playground() {
  const [state, setState] = useState<CompanyPageState>({
    data: {
      stats: {
        users: 0,
        vehicles: 0,
        drivers: 0,
        warehouses: 0,
        customers: 0,
        shipments: 0,
      },
      profile: {
        id: "",
        name: "",
        avatarUrl: "",
        createdAt: "",
        updatedAt: "",
      },
      members: [],
    },
    loading: true,
    error: null,
  });

  const kpis = [
    {
      label: "Total Users",
      value: state.data?.stats?.users ?? 0,
      icon: <PeopleIcon sx={{ fontSize: 22 }} />,
      color: "#6366f1",
    },
    {
      label: "Vehicles",
      value: state.data?.stats?.vehicles ?? 0,
      icon: <DirectionsCarIcon sx={{ fontSize: 22 }} />,
      color: "#0ea5e9", // Sky
    },
    {
      label: "Drivers",
      value: state.data?.stats?.drivers ?? 0,
      icon: <BadgeIcon sx={{ fontSize: 22 }} />,
      color: "#10b981", // Emerald
    },
    {
      label: "Warehouses",
      value: state.data?.stats?.warehouses ?? 0,
      icon: <WarehouseIcon sx={{ fontSize: 22 }} />,
      color: "#f59e0b", // Amber
    },
    {
      label: "Customers",
      value: state.data?.stats?.customers ?? 0,
      icon: <GroupsIcon sx={{ fontSize: 22 }} />,
      color: "#ec4899", // Pink
    },
    {
      label: "Shipments",
      value: state.data?.stats?.shipments ?? 0,
      icon: <LocalShippingIcon sx={{ fontSize: 22 }} />,
      color: "#8b5cf6", // Violet
    },
    {
      label: "Shipments",
      value: state.data?.stats?.shipments ?? 0,
      icon: <LocalShippingIcon sx={{ fontSize: 22 }} />,
      color: "#8b5cf6", // Violet
    },
  ];

  return (
    <Box>
      <TestKpiCards kpis={kpis} loading={state.loading} />
    </Box>
  );
}
