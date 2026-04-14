"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { Stack, Typography, Grid, Paper, useTheme, Box } from "@mui/material";

interface CostData {
  months: string[];
  fuel: number[];
  maintenance: number[];
  overhead: number[];
  distribution: { id: number; value: number; label: string; color?: string }[];
}

interface CostAnalysisChartsProps {
  data?: CostData;
}

export default function CostAnalysisCharts({ data }: CostAnalysisChartsProps) {
  /* ------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const dict = useDictionary();

  const monthsArray = [
    dict.common.months.jan,
    dict.common.months.feb,
    dict.common.months.mar,
    dict.common.months.apr,
    dict.common.months.may,
    dict.common.months.jun,
  ];

  // We ignore data.months if it's returning short English names to force localization
  const months = monthsArray; 
  const fuelCosts = data?.fuel || [0, 0, 0, 0, 0, 0];
  const maintenanceCosts = data?.maintenance || [0, 0, 0, 0, 0, 0];
  const overheadCosts = data?.overhead || [0, 0, 0, 0, 0, 0];

  const defaultCostDistribution = [
    { id: 0, value: 35, label: dict.analytics.costs.categories.fuel, color: theme.palette.error.main },
    { id: 1, value: 25, label: dict.analytics.costs.categories.maintenance, color: theme.palette.warning.main },
    { id: 2, value: 30, label: dict.analytics.costs.categories.salaries, color: theme.palette.info.main },
    { id: 3, value: 10, label: dict.analytics.costs.categories.insuranceOps, color: theme.palette.success.main },
  ];

  const translateLabel = (label: string) => {
    const key = label.toLowerCase();
    if (key === "fuel") return dict.analytics.costs.categories.fuel;
    if (key === "maintenance") return dict.analytics.costs.categories.maintenance;
    if (key === "driver salaries") return dict.analytics.costs.categories.salaries;
    if (key === "insurance/ops") return dict.analytics.costs.categories.insuranceOps;
    return label;
  };

  const costDistribution = data?.distribution.map((d, i) => ({
    ...d,
    color: d.color || (defaultCostDistribution[i % 4]?.color ?? theme.palette.primary.main),
    label: translateLabel(d.label)
  })) || defaultCostDistribution;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600}>
              {dict.analytics.costs.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {dict.analytics.costs.subtitle}
            </Typography>
          </Stack>

          <LineChart
            xAxis={[{ data: months, scaleType: "point" }]}
            series={[
              {
                data: fuelCosts,
                label: dict.analytics.costs.categories.fuel,
                area: true,
                stack: "total",
                showMark: false,
                color: theme.palette.error.light,
              },
              {
                data: maintenanceCosts,
                label: dict.analytics.costs.categories.maintenance,
                area: true,
                stack: "total",
                showMark: false,
                color: theme.palette.warning.light,
              },
              {
                data: overheadCosts,
                label: dict.analytics.costs.categories.overhead,
                area: true,
                stack: "total",
                showMark: false,
                color: theme.palette.action.disabled,
              },
            ]}
            height={300}
            grid={{ vertical: true, horizontal: true }}
          />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {dict.analytics.costs.breakdown}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "100%",
              alignItems: "center",
            }}
          >
            <PieChart
              series={[
                {
                  data: costDistribution,
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              height={260}
              width={300}
              slotProps={{
                legend: {
                  position: { vertical: "bottom", horizontal: "center" },
                },
              }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
