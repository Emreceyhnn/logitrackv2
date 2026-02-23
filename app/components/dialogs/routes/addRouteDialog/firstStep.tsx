"use client";

import {
  alpha,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
  Alert,
} from "@mui/material";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { AddRoutePageActions, AddRouteStep1 } from "@/app/lib/type/add-route";
import RouteIcon from "@mui/icons-material/Route";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface FirstRouteDialogStepProps {
  state: AddRouteStep1;
  actions: AddRoutePageActions;
}

const FirstRouteDialogStep = ({
  state,
  actions,
}: FirstRouteDialogStepProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  return (
    <Box>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RouteIcon color="primary" />
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={700} color="white">
              Step 1: Basic Details & Schedule
            </Typography>
            <Typography variant="caption" color="text.secondary">
              These details help define the framework and priority of the route.
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={3}>
          <Stack spacing={1.5}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Route Name
            </Typography>
            <CustomTextArea
              name="name"
              placeholder="e.g. Morning Delivery - North"
              value={state.name}
              onChange={(e) => actions.updateStep1({ name: e.target.value })}
            />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Route Date
            </Typography>
            <CustomTextArea
              name="date"
              type="date"
              placeholder="mm/dd/yyyy"
              value={state.date ? state.date.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                actions.updateStep1({
                  date: e.target.value ? new Date(e.target.value) : null,
                })
              }
            >
              <CalendarTodayIcon fontSize="small" />
            </CustomTextArea>
          </Stack>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Expected Start Time
                </Typography>
                <CustomTextArea
                  name="startTime"
                  type="time"
                  value={
                    state.startTime
                      ? state.startTime.toTimeString().slice(0, 5)
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value && state.date) {
                      const [hours, minutes] = e.target.value.split(":");
                      const newTime = new Date(state.date);
                      newTime.setHours(parseInt(hours), parseInt(minutes));
                      actions.updateStep1({ startTime: newTime });
                    }
                  }}
                >
                  <AccessTimeIcon fontSize="small" />
                </CustomTextArea>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  Expected End Time
                </Typography>
                <CustomTextArea
                  name="endTime"
                  type="time"
                  value={
                    state.endTime
                      ? state.endTime.toTimeString().slice(0, 5)
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value && state.date) {
                      const [hours, minutes] = e.target.value.split(":");
                      const newTime = new Date(state.date);
                      newTime.setHours(parseInt(hours), parseInt(minutes));
                      actions.updateStep1({ endTime: newTime });
                    }
                  }}
                >
                  <AccessTimeIcon fontSize="small" />
                </CustomTextArea>
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            display: "flex",
            gap: 2,
          }}
        >
          <InfoOutlinedIcon
            fontSize="small"
            sx={{ color: theme.palette.primary.main, mt: 0.3 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            Setting accurate start and end times helps the system calculate
            delivery windows and optimize fuel efficiency during the route
            planning phase.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default FirstRouteDialogStep;
