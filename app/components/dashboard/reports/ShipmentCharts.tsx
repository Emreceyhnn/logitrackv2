"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import { Card, Stack, Typography, Box, useTheme } from "@mui/material";
import AnalyticsSkeleton from "@/app/components/skeletons/AnalyticsSkeleton";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface ShipmentChartData {
  statusCounts: { status: string; count: number }[];
  routeCounts: { route: string; count: number }[];
}

interface ShipmentChartsProps {
  data?: ShipmentChartData;
  loading?: boolean;
}

export default function ShipmentCharts({ data, loading = false }: ShipmentChartsProps) {
  /* -------------------------------- variables ------------------------------- */
  const dict = useDictionary();
  const theme = useTheme();

  if (loading || !data) {
    return <AnalyticsSkeleton title={dict.reports.charts.shipment.analyticsTitle} />;
  }

  const statusMap: Record<string, number> = {};
  if (data?.statusCounts) {
    data.statusCounts.forEach((item) => {
      statusMap[item.status] = item.count;
    });
  }

  const routeShipmentCounts = data?.routeCounts || [];

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Card
          sx={{
            flex: 1,
            p: 2.5,
            flexDirection: "column",
            borderRadius: "16px",
            boxShadow: theme.shadows[2],
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: `${theme.palette.background.paper}`,
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <Stack spacing={0.5} sx={{ mb: 3, width: "100%" }}>
            <Typography variant="h6" fontWeight={700}>
              {dict.reports.charts.shipment.volumeByRoute}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dict.reports.charts.shipment.volumeByRouteSubtitle}
            </Typography>
          </Stack>

          <Box sx={{ flex: 1, minHeight: 300, width: "100%" }}>
            <BarChart
              dataset={routeShipmentCounts}
              xAxis={[{ scaleType: "band", dataKey: "route" }]}
              series={[
                {
                  dataKey: "count",
                  label: dict.shipments.dashboard.totalShipments,
                  color: theme.palette.primary.main,
                },
              ]}
              height={300}
              borderRadius={5}
              grid={{ horizontal: true }}
            />
          </Box>
        </Card>
      </Box>
    </Stack>
  );
}
