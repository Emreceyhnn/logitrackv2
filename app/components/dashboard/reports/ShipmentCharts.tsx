"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, Stack, Typography, Box, useTheme } from "@mui/material";

interface ShipmentChartData {
  statusCounts: { status: string; count: number }[];
  routeCounts: { route: string; count: number }[];
}

interface ShipmentChartsProps {
  data?: ShipmentChartData;
}

export default function ShipmentCharts({ data }: ShipmentChartsProps) {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const statusMap: Record<string, number> = {};
  if (data?.statusCounts) {
    data.statusCounts.forEach((item) => {
      statusMap[item.status] = item.count;
    });
  } else {
    // Fallback defaults or empty
  }

  const pieData = Object.keys(statusMap).map((status, index) => ({
    id: index,
    value: statusMap[status],
    label: status.replace("_", " "),
    color:
      status === "DELIVERED"
        ? theme.palette.success.main
        : status === "IN_TRANSIT"
          ? theme.palette.info.main
          : theme.palette.warning.main,
  }));

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
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Volume by Route
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total shipments per route code
            </Typography>
          </Stack>

          <Box sx={{ flex: 1, minHeight: 300, width: "100%" }}>
            <BarChart
              dataset={routeShipmentCounts}
              xAxis={[{ scaleType: "band", dataKey: "route" }]}
              series={[
                {
                  dataKey: "count",
                  label: "Shipments",
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
