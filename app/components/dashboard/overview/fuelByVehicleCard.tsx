"use client";
import { Divider, Stack, Typography } from "@mui/material";
import CustomCard from "../../cards/card";
import { BarChart } from "@mui/x-charts";
import { getFuelByVehicleData } from "@/app/lib/analyticsUtils";

const FuelByVehicleCard = () => {
  const values = getFuelByVehicleData();

  return (
    <CustomCard sx={{ padding: "0 0 6px 0", minWidth: 400 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Fuel By Vehicle
      </Typography>
      <Divider />
      <Stack p={2}>
        <BarChart
          xAxis={[{ data: values.map((i) => i.plate) }]}
          series={[{ data: values.map((i) => i.value) }]}
          height={250}
        />
      </Stack>
    </CustomCard>
  );
};

export default FuelByVehicleCard;
