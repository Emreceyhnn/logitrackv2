"use client";
import { Box, Stack, Typography, useTheme, Divider } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import CustomCard from "../../cards/card";
import { useEffect, useState } from "react";
import { getDriverPerformanceStats } from "@/app/lib/controllers/driver";

const DriverPerformanceCharts = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const [chartData, setChartData] = useState<{ name: string, fullName: string, rating: number, workingHours: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDriverPerformanceStats();
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch driver performance stats:", error);
      }
    };
    fetchData();
  }, []);

  /* ---------------------------------- utils --------------------------------- */
  const driverNames = chartData.map((d) => d.name);
  const ratings = chartData.map((d) => d.rating);
  const workingHours = chartData.map((d) => d.workingHours);

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={2}>
      <Box flex={1}>
        <CustomCard sx={{ height: "100%", p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600} sx={{ p: 1 }}>
              Driver Ratings
            </Typography>
            <Divider />
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: driverNames,
                  label: "Driver",
                  tickLabelStyle: { fill: theme.palette.text.secondary },
                },
              ]}
              yAxis={[
                {
                  label: "Rating (0-5)",
                  labelStyle: { fill: theme.palette.text.secondary },
                },
              ]}
              series={[
                {
                  data: ratings,
                  color: theme.palette.primary.main,
                  label: "Rating (0-5)",
                  highlightScope: { highlight: "item", fade: "global" },
                },
              ]}
              height={300}
              margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              borderRadius={8}
              slotProps={{
                legend: {},
              }}
            />
          </Stack>
        </CustomCard>
      </Box>
      <Box flex={1}>
        <CustomCard sx={{ height: "100%", p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600} sx={{ p: 1 }}>
              Weekly Working Hours
            </Typography>
            <Divider />
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: driverNames,
                  label: "Driver",
                  tickLabelStyle: { fill: theme.palette.text.secondary },
                },
              ]}
              yAxis={[
                {
                  label: "Hours",
                  labelStyle: { fill: theme.palette.text.secondary },
                },
              ]}
              series={[
                {
                  data: workingHours,
                  color: theme.palette.secondary.main,
                  label: "Hours this week",
                  highlightScope: { highlight: "item", fade: "global" },
                },
              ]}
              height={300}
              margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              borderRadius={8}
              slotProps={{
                legend: {},
              }}
            />
          </Stack>
        </CustomCard>
      </Box>
    </Stack>
  );
};

export default DriverPerformanceCharts;
