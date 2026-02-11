"use client";

import { getVehicleCapacityStats } from "@/app/lib/controllers/vehicle";
import CustomCard from "../../cards/card";
import { Divider, Stack, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";

const VehicleCapacityChart = () => {

  const [xAxisData, setxAxisData] = useState<any[]>([]);
  const [yAxisData, setyAxisData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVehicleCapacityStats();
        setxAxisData(data.map((v) => `${v.plate}`))
        setyAxisData(data.map((v) => v.maxLoadKg))
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch vehicle kpi data:", error);
      }
    };
    fetchData()
  }, []);

  return (
    <CustomCard sx={{ padding: "0 0 6px 0", flexGrow: 1 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Vehicle Max Load Capacity
      </Typography>
      <Divider />
      <Stack>
        <BarChart
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
              max: 25000,
            },
          ]}
          series={[
            {
              yAxisId: "secondary",
              label: "Max Weight (kg)",
              data: yAxisData,
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
