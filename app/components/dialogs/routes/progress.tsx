import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Stack,
  LinearProgress,
  Chip,
} from "@mui/material";
import { RouteWithRelations } from "@/app/lib/type/routes";
import CircleIcon from "@mui/icons-material/Circle";

export default function RouteProgress({
  route,
}: {
  route: RouteWithRelations;
}) {
  // Derive stops from Route fields and Shipments
  const stops = [
    {
      locationName: route.startAddress || "Origin",
      status: "COMPLETED",
      time: route.startTime
        ? new Date(route.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    },
    ...(route.shipments?.map((s) => ({
      locationName: `Delivery: ${s.destination}`,
      status: s.status === "DELIVERED" ? "COMPLETED" : "PENDING",
      time: "-",
    })) || []),
    {
      locationName: route.endAddress || "Destination",
      status: route.status === "COMPLETED" ? "COMPLETED" : "PENDING",
      time: route.endTime
        ? new Date(route.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    },
  ];

  const activeStep = stops.findIndex((s) => s.status === "PENDING");
  const currentStep = activeStep === -1 ? stops.length : activeStep;

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} mb={2}>
        Live Progress
      </Typography>
      <Stepper activeStep={currentStep} orientation="vertical">
        {stops.map((step, index) => (
          <Step key={index} expanded={true}>
            <StepLabel
              StepIconComponent={() => (
                <CircleIcon
                  sx={{
                    fontSize: 12,
                    color:
                      index <= currentStep ? "primary.main" : "text.disabled",
                  }}
                />
              )}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={
                    index <= currentStep ? "text.primary" : "text.secondary"
                  }
                >
                  {step.locationName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {step.time}
                </Typography>
              </Stack>
            </StepLabel>
            <StepContent>
              {/* Connector line is handled by default, just adding spacing if needed */}
              <Box sx={{ height: 10 }} />
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
