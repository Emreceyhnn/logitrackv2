"use client";

import DocumentCalenderCard from "@/app/components/dashboard/vehicle/documentCalenderCard";
import VehicleCapacityChart from "@/app/components/dashboard/vehicle/maxLoad";
import VehicleKpiCard from "@/app/components/dashboard/vehicle/vehicleKpiCard";
import VehicleTable from "@/app/components/dashboard/vehicle/vehicleTable";
import { getVehiclesDashboardData } from "@/app/lib/controllers/vehicle";
import { VehicleDashboardResponseType } from "@/app/lib/type/vehicle";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function VehiclePage() {
  const [vehicleData, setVehicleData] =
    useState<VehicleDashboardResponseType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVehiclesDashboardData();
      setVehicleData(data);
      console.log(data);
    };
    fetchData();
  }, []);

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
      <VehicleKpiCard {...(vehicleData?.vehiclesKpis || {})} />

      <Stack mt={2}>
        <VehicleTable />
      </Stack>
      <Stack mt={2} direction={{ xs: "column", md: "row" }} spacing={2}>
        <DocumentCalenderCard data={vehicleData?.expiringDocs || []} />

        <VehicleCapacityChart data={vehicleData?.vehiclesCapacity || []} />
      </Stack>
    </Box>
  );
}
