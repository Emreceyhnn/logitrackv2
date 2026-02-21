"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { Card, Stack, Typography, useTheme, Box } from "@mui/material";
import { InventoryCategoryStats } from "@/app/lib/type/reports";

interface InventoryChartsProps {
  data: InventoryCategoryStats;
}

export default function InventoryCharts({ data }: InventoryChartsProps) {
  const theme = useTheme();

  if (!data) return null;

  // Convert Record to Array for charts
  const categories = Object.keys(data);
  const chartData = categories.map((cat) => ({
    category: cat,
    value: data[cat].value,
    count: data[cat].count,
  }));

  const valuePieData = chartData.map((item, index) => ({
    id: index,
    value: item.value,
    label: item.category,
    color: theme.palette.augmentColor({
      color: { main: theme.palette.secondary.main },
    }).main,
  }));

  const countPieData = chartData.map((item, index) => ({
    id: index,
    value: item.count,
    label: item.category,
    color: theme.palette.augmentColor({
      color: { main: theme.palette.primary.main },
    }).main,
  }));

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Card
          sx={{
            flex: 1,
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
              Inventory Value
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Value distribution by category
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
                    valuePieData.length > 0
                      ? valuePieData
                      : [{ id: 0, value: 1, label: "No Data", color: "#ccc" }],
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  innerRadius: 40,
                  paddingAngle: 2,
                  cornerRadius: 4,
                },
              ]}
              height={300}
            />
          </Box>
        </Card>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Card
          sx={{
            flex: 1,
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
              SKU Count
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Items count by category
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
                    countPieData.length > 0
                      ? countPieData
                      : [{ id: 0, value: 1, label: "No Data", color: "#ccc" }],
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  innerRadius: 40,
                  paddingAngle: 2,
                  cornerRadius: 4,
                },
              ]}
              height={300}
              colors={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]}
            />
          </Box>
        </Card>
      </Box>
    </Stack>
  );
}
