import { Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { Route } from "@/app/lib/type/RoutesType";

interface Params {
  routeData: Route;
}

const RouteProgress = ({ routeData }: Params) => {
  return (
    <Stack>
      <Typography>Route Progress</Typography>
      <Stepper orientation="vertical">
        {routeData.stops.map((i, index) => (
          <Step key={index} active>
            <StepLabel>
              <Typography>{i.locationName}</Typography>
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary" }}
              >
                ETA: {i.eta}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
};

export default RouteProgress;
