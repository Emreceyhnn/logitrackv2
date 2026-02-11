"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { Stack, Typography, Paper, useTheme, Chip, Box } from "@mui/material";
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
  const theme = useTheme();

  const weeks = data?.weeks || ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];
  const actualsSeries = data?.actuals || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const predictedSeries = data?.predicted || [null, null, null, null, null, null, null, null, null, null, null, null];

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
              Demand Forecast
            </Typography>
            <Chip
              label="AI Powered"
              size="small"
              color="secondary"
              icon={<TrendingUpIcon />}
              sx={{ height: 20 }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Predicted shipment volume for next 3 weeks
          </Typography>
        </Box>
      </Stack>

      <LineChart
        xAxis={[{ data: weeks, scaleType: "point" }]}
        series={[
          {
            data: actualsSeries,
            label: "Actual Volume",
            color: theme.palette.primary.main,
            showMark: true,
          },
          {
            data: predictedSeries,
            label: "Predicted",
            color: theme.palette.secondary.main,
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
