"use client";

import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { Stack, Typography, Grid, Paper, useTheme, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SpeedIcon from "@mui/icons-material/Speed";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

export default function PerformanceGauges() {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ alignSelf: "flex-start", mb: 2 }}
          >
            <CheckCircleIcon color="success" />
            <Typography variant="h6" fontWeight={600}>
              On-Time Delivery
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 200 }}>
            <Gauge
              value={94.5}
              startAngle={-110}
              endAngle={110}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                  transform: "translate(0px, 0px)",
                  fontWeight: "bold",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: theme.palette.success.main,
                },
              }}
              text={({ value, valueMax }) => `${value}%`}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            Target: 95%{" "}
            <Typography component="span" color="error.main" fontWeight="bold">
              (-0.5%)
            </Typography>
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ alignSelf: "flex-start", mb: 2 }}
          >
            <SpeedIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Fleet Utilization
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 200 }}>
            <Gauge
              value={78}
              startAngle={-110}
              endAngle={110}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                  fontWeight: "bold",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: theme.palette.primary.main,
                },
              }}
              text={({ value, valueMax }) => `${value}%`}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            4 Vehicles Idle (Maintenance)
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ alignSelf: "flex-start", mb: 2 }}
          >
            <SentimentSatisfiedAltIcon color="secondary" />
            <Typography variant="h6" fontWeight={600}>
              Customer Satisfaction
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 200 }}>
            <Gauge
              value={4.8}
              valueMax={5}
              startAngle={-110}
              endAngle={110}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                  fontWeight: "bold",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: theme.palette.secondary.main,
                },
              }}
              text={({ value }) => `${value}`}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            Based on 128 Reviews
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
