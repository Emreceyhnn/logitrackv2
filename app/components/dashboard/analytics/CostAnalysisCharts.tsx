import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { Stack, Typography, Grid, Paper, Box } from "@mui/material";
import { useState, useMemo } from "react";
import TimeRangeSelector, { TimeRange } from "../../charts/TimeRangeSelector";

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
  const dict = useDictionary();
  const [range, setRange] = useState<TimeRange>("6m");

  // Logic to get the last N months based on range
  // Note: Cost data is usually monthly, so 1w/2w might show just the current month
  // We'll map: 1w -> 1m, 2w -> 1m, 1m -> 1m, 6m -> 6m
  const displayCount = range === "6m" ? 6 : 1;

  const currentMonthIndex = new Date().getMonth();
  const months = useMemo(() => {
    const monthsArray = [
      dict.common.months.jan,
      dict.common.months.feb,
      dict.common.months.mar,
      dict.common.months.apr,
      dict.common.months.may,
      dict.common.months.jun,
      dict.common.months.jul,
      dict.common.months.aug,
      dict.common.months.sep,
      dict.common.months.oct,
      dict.common.months.nov,
      dict.common.months.dec,
    ];
    const result = [];
    for (let i = displayCount - 1; i >= 0; i--) {
      const idx = (currentMonthIndex - i + 12) % 12;
      result.push(monthsArray[idx]);
    }
    return result;
  }, [displayCount, currentMonthIndex, dict.common.months]);

  const fuelCosts = useMemo(
    () => (data?.fuel || [0, 0, 0, 0, 0, 0]).slice(-displayCount),
    [data, displayCount]
  );
  const maintenanceCosts = useMemo(
    () => (data?.maintenance || [0, 0, 0, 0, 0, 0]).slice(-displayCount),
    [data, displayCount]
  );
  const overheadCosts = useMemo(
    () => (data?.overhead || [0, 0, 0, 0, 0, 0]).slice(-displayCount),
    [data, displayCount]
  );

  const defaultCostDistribution = [
    {
      id: 0,
      value: 35,
      label: dict.analytics.costs.categories.fuel,
      color: "#fca5a5",
    },
    {
      id: 1,
      value: 25,
      label: dict.analytics.costs.categories.maintenance,
      color: "#fcd34d",
    },
    {
      id: 2,
      value: 30,
      label: dict.analytics.costs.categories.salaries,
      color: "#94a3b8",
    },
    {
      id: 3,
      value: 10,
      label: dict.analytics.costs.categories.insuranceOps,
      color: "#10b981",
    },
  ];

  const translateLabel = (label: string) => {
    const key = label.toLowerCase();
    if (key === "fuel") return dict.analytics.costs.categories.fuel;
    if (key === "maintenance")
      return dict.analytics.costs.categories.maintenance;
    if (key === "driver salaries")
      return dict.analytics.costs.categories.salaries;
    if (key === "insurance/ops")
      return dict.analytics.costs.categories.insuranceOps;
    return label;
  };

  const costDistribution =
    data?.distribution.map((d, i) => ({
      ...d,
      color:
        d.color ||
        (defaultCostDistribution[i % 4]?.color ?? "primary.main"),
      label: translateLabel(d.label),
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
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {dict.analytics.costs.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {dict.analytics.costs.subtitle}
              </Typography>
            </Box>
            <TimeRangeSelector value={range} onChange={setRange} dict={dict} />
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
                color: "#fca5a5",
              },
              {
                data: maintenanceCosts,
                label: dict.analytics.costs.categories.maintenance,
                area: true,
                stack: "total",
                showMark: false,
                color: "#fcd34d",
              },
              {
                data: overheadCosts,
                label: dict.analytics.costs.categories.overhead,
                area: true,
                stack: "total",
                showMark: false,
                color: "#94a3b8",
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
