import { LineChart } from "@mui/x-charts/LineChart";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { Stack, Typography, Paper, Chip, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useState, useMemo } from "react";
import TimeRangeSelector, { TimeRange } from "../../charts/TimeRangeSelector";

interface ForecastData {
  weeks: string[];
  actuals: (number | null)[];
  predicted: (number | null)[];
}

interface ForecastingWidgetProps {
  data?: ForecastData;
}

export default function ForecastingWidget({ data }: ForecastingWidgetProps) {
  /* -------------------------------- variables ------------------------------- */

  const dict = useDictionary();
  const [range, setRange] = useState<TimeRange>("6m");

  const weekPrefix = dict.analytics.forecasting.weekPrefix;
  const weeks = useMemo(() => {
    const generateWeeks = () =>
      Array.from({ length: 13 }, (_, i) => `${weekPrefix}${i + 1}`);
    return data?.weeks?.map((w) => w.replace("W", weekPrefix)) || generateWeeks();
  }, [data?.weeks, weekPrefix]);

  const actualsSeries = useMemo(() => 
    data?.actuals || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [data?.actuals]);

  const predictedSeries = useMemo(() => 
    data?.predicted || Array(12).fill(null),
  [data?.predicted]);

  const displayCount = useMemo(() => {
    if (range === "1w") return 4;
    if (range === "2w") return 8;
    return weeks.length;
  }, [range, weeks]);

  const filteredWeeks = useMemo(() => weeks.slice(-displayCount), [weeks, displayCount]);
  const filteredActuals = useMemo(() => actualsSeries.slice(-displayCount), [actualsSeries, displayCount]);
  const filteredPredicted = useMemo(() => predictedSeries.slice(-displayCount), [predictedSeries, displayCount]);

  return (
    <Paper sx={{ p: 3, borderRadius: 3, mt: 3, bgcolor: "background.paper" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontWeight={600}>
              {dict.analytics.forecasting.title}
            </Typography>
            <Chip
              label={dict.analytics.forecasting.aiPowered}
              size="small"
              color="secondary"
              icon={<TrendingUpIcon />}
              sx={{ height: 20 }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {dict.analytics.forecasting.subtitle}
          </Typography>
        </Box>
        <TimeRangeSelector value={range} onChange={setRange} dict={dict} />
      </Stack>

      <LineChart
        xAxis={[{ data: filteredWeeks, scaleType: "point" }]}
        series={[
          {
            data: filteredActuals,
            label: dict.analytics.forecasting.actualVolume,
            color: "#8b5cf6",
            showMark: true,
          },
          {
            data: filteredPredicted,
            label: dict.analytics.forecasting.predicted,
            color: "#10b981",
            showMark: true,
          },
        ]}
        height={350}
        grid={{ vertical: true, horizontal: true }}
        sx={{
          ".MuiLineElement-root": {
            strokeWidth: 3,
          },
        }}
      />
    </Paper>
  );
}
