"use client";

import { Box } from "@mui/material";
import AnalyticsHeader from "@/app/components/dashboard/analytics/AnalyticsHeader";
import PerformanceGauges from "@/app/components/dashboard/analytics/PerformanceGauges";
import CostAnalysisCharts from "@/app/components/dashboard/analytics/CostAnalysisCharts";
import ForecastingWidget from "@/app/components/dashboard/analytics/ForecastingWidget";

export default function AnalyticsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <AnalyticsHeader />

      <Box sx={{ mb: 3 }}>
        <PerformanceGauges />
      </Box>

      <Box sx={{ mb: 3 }}>
        <CostAnalysisCharts />
      </Box>

      <Box>
        <ForecastingWidget />
      </Box>
    </Box>
  );
}
