"use client";

import { Box, Skeleton, Stack } from "@mui/material";
import AnalyticsHeader from "@/app/components/dashboard/analytics/AnalyticsHeader";
import PerformanceGauges from "@/app/components/dashboard/analytics/PerformanceGauges";
import CostAnalysisCharts from "@/app/components/dashboard/analytics/CostAnalysisCharts";
import ForecastingWidget from "@/app/components/dashboard/analytics/ForecastingWidget";
import { useAnalyticsData } from "@/app/[lang]/hooks/useAnalytics";

export default function AnalyticsPage() {
  const { data: state, isLoading } = useAnalyticsData();

  if (isLoading) {
    return (
      <Box position={"relative"} p={{ xs: 2, md: 4 }} width={"100%"}>
        <AnalyticsHeader />
        <Stack spacing={3} mt={3}>
          <Skeleton variant="rounded" height={200} />
          <Skeleton variant="rounded" height={400} />
          <Skeleton variant="rounded" height={300} />
        </Stack>
      </Box>
    );
  }

  return (
    <Box position={"relative"} p={{ xs: 2, md: 4 }} width={"100%"}>
      <AnalyticsHeader />

      <Box sx={{ mb: 3 }}>
        <PerformanceGauges data={state?.performance} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <CostAnalysisCharts data={state?.costs} />
      </Box>

      <Box>
        <ForecastingWidget data={state?.forecast} />
      </Box>
    </Box>
  );
}
