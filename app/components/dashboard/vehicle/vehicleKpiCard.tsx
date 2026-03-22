"use client";

import { useTheme, Box } from "@mui/material";
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import DescriptionIcon from "@mui/icons-material/Description";

import { VehicleKpiCardProps } from "@/app/lib/type/vehicle";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";
import { motion } from "framer-motion";

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
      color: "#10b981", // Emerald
    },
    {
      label: "Vehicle in Service",
      value: values.inService ?? 0,
      icon: <BuildIcon />,
      color: "#f59e0b", // Amber
    },
    {
      label: "Vehicles On Trip",
      value: values.onTrip ?? 0,
      icon: <DirectionsCarIcon />,
      color: "#0ea5e9", // Sky
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
<<<<<<< HEAD
    <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
=======
    <Box
      component={motion.div}
      variants={container}
      initial="hidden"
      animate="show"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "stretch",
        gap: 3,
        mt: 3,
        width: "100%",
        "& > *": {
          flex: {
            xs: "1 1 100%",
            sm: "1 1 calc(50% - 24px)",
            md: "1 1 calc(33.33% - 24px)",
          },
          display: "flex",
        }
      }}
    >
>>>>>>> b8bcc53a60daca28aadf2363b575744ba82b75bc
      {kpiItems.map((item, index) => (
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

export default VehicleKpiCard;
