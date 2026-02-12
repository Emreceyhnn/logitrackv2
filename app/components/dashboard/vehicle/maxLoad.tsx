import CustomCard from "../../cards/card";
import { Divider, Stack, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

interface VehicleCapacityChartProps {
  data: {
    id: string;
    plate: string;
    maxLoadKg: number;
  }[];
}

const VehicleCapacityChart = ({ data }: VehicleCapacityChartProps) => {
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
              data: data?.map((v) => v.plate),
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
              data: data?.map((v) => v.maxLoadKg),
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
