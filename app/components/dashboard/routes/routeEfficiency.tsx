import { Divider, LinearProgress, Stack, Typography } from "@mui/material";
import CustomCard from "../../cards/card";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import mockData from "@/app/lib/mockData.json";

const RouteEfficiency = () => {
  const avgFuelConsumption =
    mockData.fleet.reduce(
      (sum, v) => sum + (v.specs?.mpg || 0),

      0
    ) / mockData.fleet.length;
  const vehicleLength = mockData.fleet.length;
  const utilizationVal =
    (mockData.fleet.filter((i) => i.status === "ON_TRIP").length /
      vehicleLength) *
    100;
  const vehicleUtilization = utilizationVal.toFixed(1);

  return (
    <CustomCard
      sx={{ display: "flex", flexDirection: "column", gap: 3, flexGrow: 1 }}
    >
      <Typography
        sx={{ fontSize: 16, fontWeight: 600, color: "text.secondary" }}
      >
        ROUTE EFFICIENCY
      </Typography>
      <Stack spacing={1}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography sx={{ fontSize: 14 }}>
            Fuel Consumption (L/100km)
          </Typography>
          <Typography
            sx={{ fontSize: 14, fontWeight: 700, color: "info.main" }}
          >
            {avgFuelConsumption.toFixed(2)} avg
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={avgFuelConsumption * 4}
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
      <Stack spacing={1}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography sx={{ fontSize: 14 }}>On-Time Performance</Typography>
          <Typography
            sx={{ fontSize: 14, fontWeight: 700, color: "success.main" }}
          >
            89 %
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={89}
          sx={{
            bgcolor: "background.dashboardBg",
            borderRadius: "8px",
            "& .MuiLinearProgress-bar": {
              borderRadius: "8px",
              backgroundColor: `success.main`,
            },
          }}
        />
      </Stack>
      <Stack spacing={1}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography sx={{ fontSize: 14 }}>Vehicle Utilization</Typography>
          <Typography
            sx={{ fontSize: 14, fontWeight: 700, color: "warning.main" }}
          >
            {vehicleUtilization} %
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={utilizationVal}
          sx={{
            bgcolor: "background.dashboardBg",
            borderRadius: "8px",
            "& .MuiLinearProgress-bar": {
              borderRadius: "8px",
              backgroundColor: `warning.main`,
            },
          }}
        />
      </Stack>
      <Divider />
      <Stack spacing={2}>
        <Typography
          sx={{ fontSize: 16, fontWeight: 600, color: "text.secondary" }}
        >
          RECENT NOTIFICATION
        </Typography>
        <Stack spacing={1} maxHeight={104} overflow={"auto"}>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <WarningIcon sx={{ color: "error.main" }} />
            <Stack>
              <Typography sx={{ fontSize: 18, fontWeight: 400 }}>
                Route #RT-4021 Diverted
              </Typography>
              <Typography
                sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}
              >
                Arrived at London Depot
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <CheckCircleIcon sx={{ color: "success.main" }} />
            <Stack>
              <Typography sx={{ fontSize: 18, fontWeight: 400 }}>
                Route #RT-4021 Diverted
              </Typography>
              <Typography
                sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}
              >
                Arrived at London Depot
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <CheckCircleIcon sx={{ color: "success.main" }} />
            <Stack>
              <Typography sx={{ fontSize: 18, fontWeight: 400 }}>
                Route #RT-4021 Diverted
              </Typography>
              <Typography
                sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}
              >
                Arrived at London Depot
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <CheckCircleIcon sx={{ color: "success.main" }} />
            <Stack>
              <Typography sx={{ fontSize: 18, fontWeight: 400 }}>
                Route #RT-4021 Diverted
              </Typography>
              <Typography
                sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}
              >
                Arrived at London Depot
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <CheckCircleIcon sx={{ color: "success.main" }} />
            <Stack>
              <Typography sx={{ fontSize: 18, fontWeight: 400 }}>
                Route #RT-4021 Diverted
              </Typography>
              <Typography
                sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}
              >
                Arrived at London Depot
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </CustomCard>
  );
};

export default RouteEfficiency;
