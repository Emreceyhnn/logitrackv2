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
      color: theme.palette.success.main,
    },
    {
      label: "Off Duty",
      value: data.offDuty ?? 0,
      icon: <HomeIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "On Leave",
      value: data.onLeave ?? 0,
      icon: <HomeIcon />,
      color: theme.palette.warning.main,
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
      color: theme.palette.warning.main,
    },
    {
      label: "Efficiency Rating",
      value: data.avgEfficiencyScore?.toFixed(1) ?? 0,
      icon: <RocketLaunchIcon />,
      color: theme.palette.success.main,
    },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))"
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

export default DriverKpiCard;
