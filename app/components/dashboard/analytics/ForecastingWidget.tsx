import { LineChart } from "@mui/x-charts/LineChart";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { Stack, Typography, Paper, Chip, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

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

  const weekPrefix = dict.analytics.forecasting.weekPrefix;
  const generateWeeks = () =>
    Array.from({ length: 13 }, (_, i) => `${weekPrefix}${i + 1}`);

  const weeks =
    data?.weeks?.map((w) => w.replace("W", weekPrefix)) || generateWeeks();
  const actualsSeries = data?.actuals || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const predictedSeries = data?.predicted || [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];

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
      </Stack>

      <LineChart
        xAxis={[{ data: weeks, scaleType: "point" }]}
        series={[
          {
            data: actualsSeries,
            label: dict.analytics.forecasting.actualVolume,
            color: "#8b5cf6",
            showMark: true,
          },
          {
            data: predictedSeries,
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
