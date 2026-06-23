"use client";

import { Box, Skeleton, Stack } from "@mui/material";
import AnalyticsHeader from "@/app/components/dashboard/analytics/AnalyticsHeader";
import PerformanceGauges from "@/app/components/dashboard/analytics/PerformanceGauges";
import CostAnalysisCharts from "@/app/components/dashboard/analytics/CostAnalysisCharts";
import ForecastingWidget from "@/app/components/dashboard/analytics/ForecastingWidget";
import { useAnalyticsData } from "@/app/hooks/useAnalytics";

export default function AnalyticsContent() {
  const { state } = useAnalyticsData();

  if (state.loading && !state.data) {
    return (
      <Box position={"relative"} p={{ xs: 2, md: 4 }} width={"100%"}>
        <AnalyticsHeader />
        <Stack spacing={3} mt={3}>
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: "16px" }} />
          <Skeleton variant="rounded" height={400} sx={{ borderRadius: "16px" }} />
          <Skeleton variant="rounded" height={300} sx={{ borderRadius: "16px" }} />
        </Stack>
      </Box>
    );
  }

  return (
    <Box position={"relative"} p={{ xs: 2, md: 4 }} width={"100%"}>
      <AnalyticsHeader />

      <Box sx={{ mb: 4 }}>
        <PerformanceGauges state={state.data?.performance} />
      </Box>

      <Box sx={{ mb: 4 }}>
        <ForecastingWidget state={state.data?.forecast} />
      </Box>

      <Box>
        <CostAnalysisCharts state={state.data?.costs} />
      </Box>
    </Box>
  );
}
