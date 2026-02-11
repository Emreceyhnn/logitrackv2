"use client";

import DocumentCalenderCard from "@/app/components/dashboard/vehicle/documentCalenderCard";
import VehicleCapacityChart from "@/app/components/dashboard/vehicle/maxLoad";
import VehicleKpiCard from "@/app/components/dashboard/vehicle/vehicleKpiCard";
import VehicleTable from "@/app/components/dashboard/vehicle/vehicleTable";
import VehicleIssuesCard from "@/app/components/dashboard/vehicle/VehicleIssuesCard";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getOpenIssuesForUser } from "@/app/lib/controllers/vehicle";

export default function VehiclePage() {
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await getOpenIssuesForUser(token);
          setIssues(data);
        } catch (error) {
          console.error("Failed to fetch issues:", error);
        }
      }
    };
    fetchIssues();
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
