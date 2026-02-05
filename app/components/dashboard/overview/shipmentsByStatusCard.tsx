"use client";
import { Divider, Stack, Typography } from "@mui/material";
import CustomCard from "../../cards/card";
import { PieChart } from "@mui/x-charts";
import { getShipmentStatusData } from "@/app/lib/analyticsUtils";

const ShipmentOnStatusCard = () => {
  const values = getShipmentStatusData();

  const config: Record<string, { label: string; color: string }> = {
    IN_TRANSIT: { label: "In Transit", color: "#0088FE" },
    DELAYED: { label: "Delayed", color: "#FFBB28" },
    PLANNED: { label: "Planned", color: "#A020F0" },
    DELIVERED: { label: "Delivered", color: "#00C49F" },
    PROCESSING: { label: "Processing", color: "#FF8042" },
  };

  const data = Object.entries(
    values.reduce<Record<string, number>>((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {})
  ).map(([key, value]) => ({
    id: key,
    label: config[key]?.label || key,
    value,
    color: config[key]?.color || "#cccccc",
  }));

  return (
    <CustomCard sx={{ padding: "0 0 6px 0" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Shipment Status
      </Typography>
      <Divider />
      <Stack alignItems="center" sx={{ position: "relative" }} p={2}>
        <PieChart
          series={[
            {
              data,
              innerRadius: 40,
              outerRadius: 80,
              startAngle: -90,
              endAngle: 90,
            },
          ]}
          slotProps={{
            legend: {
              toggleVisibilityOnClick: true,
              direction: "horizontal",
              sx: {
                position: "absolute",
                bottom: 50,
                zIndex: 2,
              },
            },
          }}
          width={200}
          height={240}
        />
      </Stack>
    </CustomCard>
  );
};

export default ShipmentOnStatusCard;
