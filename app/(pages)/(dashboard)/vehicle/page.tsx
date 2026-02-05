import DocumentCalenderCard from "@/app/components/dashboard/vehicle/documentCalenderCard";
import VehicleCapacityChart from "@/app/components/dashboard/vehicle/fuelUsageChartCard";
import VehicleKpiCard from "@/app/components/dashboard/vehicle/vehicleKpiCard";
import VehicleTable from "@/app/components/dashboard/vehicle/vehicleTable";
import { Box, Divider, Stack, Typography } from "@mui/material";

export default function VehiclePage() {
  return (
    <Box position={"relative"} p={4} width={"100%"}>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-2%",
        }}
      >
        Vehicles
      </Typography>
      <Divider />
      <VehicleKpiCard />
      <Stack mt={2}>
        <VehicleTable />
      </Stack>
      <Stack mt={2} direction={"row"} spacing={2}>
        <DocumentCalenderCard />
        <VehicleCapacityChart />
      </Stack>
    </Box>
  );
}
