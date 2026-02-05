"use client";

import { getVehicleCapacityStats } from "@/app/lib/analyticsUtils";
import CustomCard from "../../cards/card";
import { Divider, Stack, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";

const VehicleCapacityChart = () => {
  const vehicles = getVehicleCapacityStats();
  const xAxisData = vehicles.map((v) => `${v.plate}`);

  return (
    <CustomCard sx={{ padding: "0 0 6px 0", flexGrow: 1 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Expiring Soon
      </Typography>
      <Divider />
      <Stack>
        <LineChart
          height={350}
          xAxis={[
            {
              scaleType: "band",
              data: xAxisData,
              label: "Vehicle Plate",

              labelStyle: { fill: "#6b7280" },
            },
          ]}
          yAxis={[
            {
              id: "primary",
              label: "Small Capacity Units (Pallets, m³)",
              min: 0,
              max: 100,
            },

            {
              id: "secondary",
              label: "Max Weight (kg)",
              position: "right",
              min: 0,
              max: 15000,
            },
          ]}
          series={[
            {
              yAxisId: "primary",
              label: "Pallets",
              data: vehicles.map((v) => v.capacity.pallets),
              area: false,
              showMark: true,
              color: "#3f51b5",
            },
            {
              yAxisId: "primary",
              label: "Max Volume (m³)",
              data: vehicles.map((v) => v.capacity.maxVolumeM3),
              area: false,
              showMark: false,
              color: "#00bcd4",
            },
            {
              yAxisId: "secondary",
              label: "Max Weight (kg)",
              data: vehicles.map((v) => v.capacity.maxWeightKg),
              area: false,
              showMark: true,
              color: "#ff9800",
            },
          ]}
          slotProps={{
            legend: {
              direction: "horizontal",
              position: { vertical: "bottom", horizontal: "center" },
            },
          }}
        />
      </Stack>
    </CustomCard>
  );
};

export default VehicleCapacityChart;
