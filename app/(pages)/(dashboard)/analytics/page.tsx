"use client";

import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import AnalyticsHeader from "@/app/components/dashboard/analytics/AnalyticsHeader";
import PerformanceGauges from "@/app/components/dashboard/analytics/PerformanceGauges";
import CostAnalysisCharts from "@/app/components/dashboard/analytics/CostAnalysisCharts";
import ForecastingWidget from "@/app/components/dashboard/analytics/ForecastingWidget";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const COMPANY_ID = 'cmlgt985b0003x0cuhtyxoihd';
        const USER_ID = 'usr_001';
        const result = await import("@/app/lib/controllers/analytics").then(mod => mod.getAnalyticsDashboardData(COMPANY_ID)); // Passing token/companyID
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <AnalyticsHeader />

      <Box sx={{ mb: 3 }}>
        <PerformanceGauges data={data?.performance} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <CostAnalysisCharts data={data?.costs} />
      </Box>

      <Box>
        <ForecastingWidget data={data?.forecast} />
      </Box>
    </Box>
  );
}
