"use client";
import { Card, Stack, Typography, useTheme, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useMemo } from "react";
import { ShipmentAnalyticsProps } from "@/app/lib/type/shipment";
import AnalyticsSkeleton from "@/app/components/skeletons/AnalyticsSkeleton";

export default function ShipmentAnalytics({
  state,
}: ShipmentAnalyticsProps) {
  const { volumeHistory, statusDistribution, loading } = state;
  const theme = useTheme();

  const pieData = useMemo(() => {
    return statusDistribution.map((item, index) => ({
      id: index,
      value: item.count,
      label: item.status.replace("_", " "),
      color:
        item.status === "DELIVERED"
          ? theme.palette.success.main
          : item.status === "IN_TRANSIT"
            ? theme.palette.info.main
            : item.status === "DELAYED"
              ? theme.palette.error.main
              : theme.palette.warning.main,
    }));
  }, [statusDistribution, theme]);

  const barData = useMemo(() => {
    return volumeHistory.map((item) => ({
      day: item.day,
      volume: item.volume,
    }));
  }, [volumeHistory]);

  if (loading) {
    return (
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} mt={2}>
        <Box sx={{ flex: 1 }}>
          <AnalyticsSkeleton title="Status Overview" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <AnalyticsSkeleton title="Volume Trend" />
        </Box>
      </Stack>
    );
  }

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={3}
      mt={2}
      sx={{ alignItems: "stretch" }}
    >
      <Box sx={{ flex: 1, display: "flex" }}>
        <Card
          sx={{
            width: "100%",
            p: 2.5,
            borderRadius: "16px",
            boxShadow: theme.shadows[2],
            display: "flex",
            flexDirection: "column",
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
              Status Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Live breakdown of shipment statuses
            </Typography>
          </Stack>

          <Box
            sx={{
              flex: 1,
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PieChart
              series={[
                {
                  data:
                    pieData.length > 0
                      ? pieData
                      : [{ id: 0, value: 1, label: "No Data", color: "#ccc" }],
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 8,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              height={300}
              margin={{ right: 150 }}
              hideLegend
            />
          </Box>
        </Card>
      </Box>

      <Box sx={{ flex: 1, display: "flex" }}>
        <Card
          sx={{
            width: "100%",
            p: 2.5,
            borderRadius: "16px",
            boxShadow: theme.shadows[2],
            display: "flex",
            flexDirection: "column",
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
              Volume Trend
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Daily shipment creation volume (Last 7 Days)
            </Typography>
          </Stack>

          <Box
            sx={{
              flex: 1,
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BarChart
              dataset={barData}
              xAxis={[{ scaleType: "band", dataKey: "day" }]}
              series={[
                {
                  dataKey: "volume",
                  label: "Shipments",
                  color: theme.palette.primary.main,
                  valueFormatter: (v) => `${v} units`,
                },
              ]}
              height={300}
              borderRadius={8}
            />
          </Box>
        </Card>
      </Box>
    </Stack>
  );
}
