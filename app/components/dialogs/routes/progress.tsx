import { Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { Route } from "@/app/lib/type/RoutesType";

interface Params {
  routeData: Route;
}

const RouteProgress = ({ routeData }: Params) => {
  // Adapt to Prisma schema or fallback
  const stops = (routeData as any).stops || [
    {
      locationName: (routeData as any).startAddress || "Origin",
      eta: "Started",
    },
    {
      locationName: (routeData as any).endAddress || "Destination",
      eta: "Pending",
    },
  ];

  return (
    <Stack>
      <Typography>Route Progress</Typography>
      <Stepper orientation="vertical">
        {stops.map((i: any, index: number) => (
          <Step key={index} active={true}>
            <StepLabel>
              <Typography>{i.locationName}</Typography>
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: "text.secondary" }}
              >
                {i.eta || "-"}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
};

export default RouteProgress;
