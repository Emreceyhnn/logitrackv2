"use client";

import { Stack, useTheme, Box } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import StatCard from "../../cards/StatCard";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { DriverKpiCardProps } from "@/app/lib/type/driver";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";
import { motion } from "framer-motion";

const DriverKpiCard = ({ data, loading = false }: DriverKpiCardProps & { loading?: boolean }) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  if (loading || !data) {
    return <KpiSkeleton count={7} />;
  }

  const kpiItems = [
    {
      label: "Total Drivers",
      value: data.totalDrivers ?? 0,
      icon: <GroupsIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "On Duty",
      value: data.onDuty ?? 0,
      icon: <WorkIcon />,
      color: "#10b981", // Emerald
    },
    {
      label: "Off Duty",
      value: data.offDuty ?? 0,
      icon: <HomeIcon />,
      color: "#0ea5e9", // Sky
    },
    {
      label: "On Leave",
      value: data.onLeave ?? 0,
      icon: <HomeIcon />,
      color: "#f59e0b", // Amber
    },
    {
      label: "Compliance Issues",
      value: data.complianceIssues ?? 0,
      icon: <ReportProblemIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "Avg Safety Rating",
      value: data.avgSafetyScore?.toFixed(1) ?? 0,
      icon: <ShieldIcon />,
      color: "#6366f1", // Indigo
    },
    {
      label: "Efficiency Rating",
      value: data.avgEfficiencyScore?.toFixed(1) ?? 0,
      icon: <RocketLaunchIcon />,
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
            md: "1 1 calc(33.33% - 24px)",
            lg: "1 1 calc(20% - 24px)", // This forces 5 on top for 7 total items, leaving 2 on bot
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
      ))}
    </Box>
  );
};

export default DriverKpiCard;
