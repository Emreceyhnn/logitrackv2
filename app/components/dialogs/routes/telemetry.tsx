import {
  alpha,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import { RouteWithRelations } from "@/app/lib/type/routes";

interface Params {
  routeId: string;
  route?: RouteWithRelations;
}

const RoutesTelemetryCards = (params: Params) => {
  const theme = useTheme();
  const { route } = params;
  if (!route) return null;

  // Derive metrics safely
  // We can calculate "Completed" based on some logic or just show 0 for now as 'completedDistance' isn't in schema
  // Or maybe use duration?
  // Let's assume 0 for completed if not tracking live yet.
  const completedDistance = 0;
  const totalDistance = route.distanceKm || 0;
  const remainingDistance = Math.max(0, totalDistance - completedDistance);
  const fuelLevel = route.vehicle?.fuelLevel || 0;

  return (
    <Stack spacing={2} px={2}>
      <Typography variant="subtitle2" fontWeight={700} color="white">
        LIVE TELEMETRY
      </Typography>
      <Stack direction={"row"} spacing={2}>
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.divider, 0.05),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            flex: 1,
          }}
        >
          <Stack spacing={1}>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}
            >
              DIST. TRAVELLED
            </Typography>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Typography variant="h5" fontWeight={600} color="white">
                {completedDistance}
              </Typography>
              <Typography
                sx={{ fontSize: 12, fontWeight: 300, color: "text.secondary" }}
              >
                km
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.divider, 0.05),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            flex: 1,
          }}
        >
          <Stack spacing={1}>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}
            >
              Remaining
            </Typography>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Typography variant="h5" fontWeight={600} color="white">
                {remainingDistance.toFixed(1)}
              </Typography>
              <Typography
                sx={{ fontSize: 12, fontWeight: 300, color: "text.secondary" }}
              >
                km
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.divider, 0.05),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack spacing={1}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}
            >
              Fuel level
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: "info.main" }}
            >
              {fuelLevel}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={fuelLevel}
            sx={{
              bgcolor: "background.dashboardBg",
              borderRadius: "8px",
              "& .MuiLinearProgress-bar": {
                borderRadius: "8px",
                backgroundColor: `info.main`,
              },
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default RoutesTelemetryCards;
