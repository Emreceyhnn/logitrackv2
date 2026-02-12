"use client";

import { Stack, useTheme } from "@mui/material";
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import DescriptionIcon from "@mui/icons-material/Description";

interface Props {
  totalVehicles?: number;
  available?: number;
  inService?: number;
  onTrip?: number;
  openIssues?: number;
  docsDueSoon?: number;
}

const VehicleKpiCard = ({
  totalVehicles,
  available,
  inService,
  onTrip,
  openIssues,
  docsDueSoon,
}: Props) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const kpiItems = [
    {
      label: "Total Vehicle",
      value: totalVehicles ?? 0,
      icon: <LocalShippingIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "Available Vehicle",
      value: available ?? 0,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Vehicle in Service",
      value: inService ?? 0,
      icon: <BuildIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: "Vehicles On Trip",
      value: onTrip ?? 0,
      icon: <DirectionsCarIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Open Issues",
      value: openIssues ?? 0,
      icon: <ReportProblemIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "Docs Due Soon",
      value: docsDueSoon ?? 0,
      icon: <DescriptionIcon />,
      color: theme.palette.secondary.main,
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
          flexBasis={{ xs: "100%", sm: "48%", md: "30%" }}
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

export default VehicleKpiCard;
