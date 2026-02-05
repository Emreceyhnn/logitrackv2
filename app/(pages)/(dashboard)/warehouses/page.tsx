"use client";

import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import WarehouseKpiCard from "@/app/components/dashboard/warehouse/warehouseKpiCard";
import WarehouseListTable from "@/app/components/dashboard/warehouse/warehouseList";
import CapacityUtilization from "@/app/components/dashboard/warehouse/capacityUtilization";
import RecentStockMovements from "@/app/components/dashboard/warehouse/recentStockMovements";

export default function WarehousePage() {
  return (
    <Box position={"relative"} p={4} width={"100%"}>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-2%",
        }}
      >
        Warehouses
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box mb={4}>
        <WarehouseKpiCard />
      </Box>

      <Box mb={4}>
        <WarehouseListTable />
      </Box>

      <Stack direction={"row"} spacing={4}>
        <CapacityUtilization />
        <RecentStockMovements />
      </Stack>
    </Box>
  );
}
