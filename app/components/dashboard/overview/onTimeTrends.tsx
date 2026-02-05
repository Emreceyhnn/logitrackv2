"use client";

import { getOnTimeTrendsData } from "@/app/lib/analyticsUtils";
import CustomCard from "../../cards/card";
import { Divider, Stack, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";

const OnTimeTrendsCard = () => {
  const values = getOnTimeTrendsData();

  return (
    <CustomCard sx={{ padding: "0 0 6px 0", minWidth: 400 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Time Trends
      </Typography>
      <Divider />
      <Stack p={2}>
        <LineChart
          xAxis={[{ scaleType: "band", data: values.map((i) => i.date) }]}
          series={[
            {
              data: values.map((i) => i.value),
              area: false,
            },
          ]}
          height={300}
        />
      </Stack>
    </CustomCard>
  );
};

export default OnTimeTrendsCard;
