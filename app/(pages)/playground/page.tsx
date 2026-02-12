"use client";

import { getVehiclesDashboardData } from "@/app/lib/controllers/vehicle";
import { Box, Stack } from "@mui/material";

export default function Playground() {
  const data = getVehiclesDashboardData();

  return (
    <Box>
      This is playground page
      <Stack></Stack>
    </Box>
  );
}
