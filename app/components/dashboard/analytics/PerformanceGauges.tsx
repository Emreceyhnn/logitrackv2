import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { Stack, Typography, Grid, Paper, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SpeedIcon from "@mui/icons-material/Speed";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

interface PerformanceData {
  onTimeRate: number;
  fleetUtilization: number;
  satisfaction: number;
  satisfactionCount: number;
}

interface PerformanceGaugesProps {
  data?: PerformanceData;
}

export default function PerformanceGauges({ data }: PerformanceGaugesProps) {
  /* -------------------------------- variables ------------------------------- */

  const dict = useDictionary();

  const onTimeRate = data?.onTimeRate ?? 0;
  const fleetUtilization = data?.fleetUtilization ?? 0;
  const satisfaction = data?.satisfaction ?? 0;
  const satisfactionCount = data?.satisfactionCount ?? 0;

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
              {dict.analytics.performance.onTimeDelivery}
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 200 }}>
            <Gauge
              value={onTimeRate}
              startAngle={-110}
              endAngle={110}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                  transform: "translate(0px, 0px)",
                  fontWeight: "bold",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#10b981",
                },
              }}
              text={({ value }) => `${value}%`}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            {dict.analytics.performance.target.replace("{value}", "95")}{" "}
            {onTimeRate < 95 && (
              <Typography component="span" color="error.main" fontWeight="bold">
                ({(onTimeRate - 95).toFixed(1)}%)
              </Typography>
            )}
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
              {dict.analytics.performance.fleetUtilization}
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 200 }}>
            <Gauge
              value={fleetUtilization}
              startAngle={-110}
              endAngle={110}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                  fontWeight: "bold",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#8b5cf6",
                },
              }}
              text={({ value }) => `${value}%`}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            {dict.analytics.performance.realTime}
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
              {dict.analytics.performance.customerSatisfaction}
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 200 }}>
            <Gauge
              value={satisfaction}
              valueMax={5}
              startAngle={-110}
              endAngle={110}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                  fontWeight: "bold",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: "#fcd34d",
                },
              }}
              text={({ value }) => `${value}`}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            {dict.analytics.performance.reviews.replace(
              "{count}",
              satisfactionCount.toString()
            )}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
