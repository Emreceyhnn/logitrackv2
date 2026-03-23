"use client";

import { Box } from "@mui/material";
import AnalyticsHeader from "@/app/components/dashboard/analytics/AnalyticsHeader";
import PerformanceGauges from "@/app/components/dashboard/analytics/PerformanceGauges";
import CostAnalysisCharts from "@/app/components/dashboard/analytics/CostAnalysisCharts";
import ForecastingWidget from "@/app/components/dashboard/analytics/ForecastingWidget";
import { useEffect, useState, useCallback, useMemo } from "react";
import { AnalyticsPageState, AnalyticsPageActions } from "@/app/lib/type/analytics.d";

export default function AnalyticsPage() {
  const [state, setState] = useState<AnalyticsPageState | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await import("@/app/lib/controllers/analytics").then(
        (mod) => mod.getAnalyticsDashboardData()
      );
      setState(result);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    }
  }, []);

  const actions: AnalyticsPageActions = useMemo(() => ({
    fetchData
  }), [fetchData]);

  useEffect(() => {
    actions.fetchData();
  }, [actions]);

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
