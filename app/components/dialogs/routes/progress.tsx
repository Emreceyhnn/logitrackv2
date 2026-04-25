import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Stack,
} from "@mui/material";
import { RouteWithRelations } from "@/app/lib/type/routes";
import CircleIcon from "@mui/icons-material/Circle";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useUser } from "@/app/hooks/useUser";
import { formatDisplayTime } from "@/app/lib/utils/date";

export default function RouteProgress({
  route,
}: {
  route: RouteWithRelations;
}) {
  const dict = useDictionary();
  const { user } = useUser();

  const dateSettings = {
    timezone: user?.timezone || "UTC",
    dateFormat: user?.dateFormat || "DD/MM/YYYY",
    timeFormat: user?.timeFormat || "24h",
  };

  const stops = [
    {
      locationName: route.startAddress || dict.routes.details.origin,
      status: "COMPLETED",
      time: formatDisplayTime(route.startTime, dateSettings),
    },
    ...(route.shipments?.map((s) => ({
      locationName: `${dict.routes.details.delivery}: ${s.destination}`,
      status: s.status === "DELIVERED" ? "COMPLETED" : "PENDING",
      time: "-",
    })) || []),
    {
      locationName: route.endAddress || dict.routes.details.destination,
      status: route.status === "COMPLETED" ? "COMPLETED" : "PENDING",
      time: formatDisplayTime(route.endTime, dateSettings),
    },
  ];

  const activeStep = stops.findIndex((s) => s.status === "PENDING");
  const currentStep = activeStep === -1 ? stops.length : activeStep;

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} mb={2} color="white">
        {dict.routes.details.liveProgress}
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
                  color={index <= currentStep ? "white" : "text.secondary"}
                >
                  {step.locationName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {step.time}
                </Typography>
              </Stack>
            </StepLabel>
            <StepContent>
              <Box sx={{ height: 10 }} />
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
