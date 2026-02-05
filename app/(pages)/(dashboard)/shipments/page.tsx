"use client";

import ShipmentKpiCard from "@/app/components/dashboard/shipments/shipmentKpiCard";
import ShipmentTable from "@/app/components/dashboard/shipments/shipmentTable";
import ShipmentAnalytics from "@/app/components/dashboard/shipments/ShipmentAnalytics";
import { Box, Divider, Stack, Typography } from "@mui/material";

export default function ShipmentPage() {
  return (
    <Box position={"relative"} p={4} width={"100%"}>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-2%",
        }}
      >
        Shipments
      </Typography>
      <Divider />
      <ShipmentKpiCard />
      <ShipmentAnalytics />
      <Stack mt={2}>
        <ShipmentTable />
      </Stack>
    </Box>
  );
}
