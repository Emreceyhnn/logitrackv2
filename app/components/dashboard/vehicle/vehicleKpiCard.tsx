"use client";

import { Stack, useTheme } from "@mui/material";
import mockData from "@/app/lib/mockData.json";
import { getVehicleKpis } from "@/app/lib/analyticsUtils";
import StatCard from "../../cards/StatCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import DescriptionIcon from "@mui/icons-material/Description";

const VehicleKpiCard = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const fleet = mockData.fleet || [];
  const totalVehicles = fleet.length;
  const available = fleet.filter((v) => v.status === "AVAILABLE").length;
  const inService = fleet.filter((v) => v.status === "IN_SERVICE").length;
  const onTrip = fleet.filter((v) => v.status === "ON_TRIP").length;

  const openIssues = fleet.reduce(
    (acc, v) => acc + (v.maintenance?.openIssues?.length || 0),
    0
  );
  const docsDueSoon = fleet.reduce(
    (acc, v) =>
      acc +
      (v.documents?.filter(
        (d) =>
          new Date(d.expiresOn) <=
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length || 0),
    0
  );

  const kpiItems = [
    {
      label: "Total Vehicle",
      value: totalVehicles,
      icon: <LocalShippingIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "Available Vehicle",
      value: available,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Vehicle in Service",
      value: inService,
      icon: <BuildIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: "Vehicles On Trip",
      value: onTrip,
      icon: <DirectionsCarIcon />,
      color: theme.palette.info.main,
    },
    {
      label: "Open Issues",
      value: openIssues,
      icon: <ReportProblemIcon />,
      color: theme.palette.error.main,
    },
    {
      label: "Docs Due Soon",
      value: docsDueSoon,
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
