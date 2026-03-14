"use client";

import { Stack, useTheme, Box } from "@mui/material";
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import DescriptionIcon from "@mui/icons-material/Description";

import { VehicleKpiCardProps } from "@/app/lib/type/vehicle";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";

const VehicleKpiCard = ({ state }: VehicleKpiCardProps) => {
  const stats = state.dashboardData?.vehiclesKpis || null;
  const { loading } = state;
  const theme = useTheme();

  if (loading) {
    return <KpiSkeleton count={6} />;
  }

  const values = stats || {
    totalVehicles: 0,
    available: 0,
    inService: 0,
    onTrip: 0,
    openIssues: 0,
    docsDueSoon: 0,
  };

  const kpiItems = [
    {
      label: "Total Vehicle",
      value: values.totalVehicles ?? 0,
      icon: <LocalShippingIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "Available Vehicle",
      value: values.available ?? 0,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Vehicle in Service",
      value: values.inService ?? 0,
      icon: <BuildIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: "Vehicles On Trip",
      value: values.onTrip ?? 0,
      icon: <DirectionsCarIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Open Issues",
      value: values.openIssues ?? 0,
      icon: <ReportProblemIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "Docs Due Soon",
      value: values.docsDueSoon ?? 0,
      icon: <DescriptionIcon />,
      color: theme.palette.secondary.main,
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

export default VehicleKpiCard;
