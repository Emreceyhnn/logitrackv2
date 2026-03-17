"use client";

import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { AddRouteStep1 } from "@/app/lib/type/add-route";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import RouteIcon from "@mui/icons-material/Route";
import BoltIcon from "@mui/icons-material/Bolt";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";

interface FirstRouteDialogStepProps {
  state: AddRouteStep1;
  updateStep1: (data: Partial<AddRouteStep1>) => void;
  shipments?: ShipmentWithRelations[];
  onShipmentSelect?: (id: string) => void;
}

const FirstRouteDialogStep = (props: FirstRouteDialogStepProps) => {
  const { state, updateStep1, shipments = [], onShipmentSelect } = props;
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
          {shipments.length > 0 && onShipmentSelect && (
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BoltIcon
                  sx={{ color: theme.palette.warning.main, fontSize: 18 }}
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="warning.main"
                >
                  Quick Start: Select Shipment
                </Typography>
              </Stack>
              <CustomTextArea
                name="shipmentSelect"
                select
                placeholder="Choose a shipment to pre-fill locations..."
                value=""
                onChange={(e) => onShipmentSelect(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select an unassigned shipment
                </MenuItem>
                {shipments.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.trackingId} - {s.customer?.name} ({s.destination})
                  </MenuItem>
                ))}
              </CustomTextArea>
              <Typography variant="caption" color="text.secondary">
                Selecting a shipment will automatically fill the Route Name and
                Destination.
              </Typography>
            </Stack>
          )}

          <Stack spacing={1.5}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Route Name
            </Typography>
            <CustomTextArea
              name="name"
              placeholder="e.g. Morning Delivery - North"
              value={state.name}
              onChange={(e) => updateStep1({ name: e.target.value })}
            />
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
                <MobileDateTimePicker
                  value={state.startTime ? dayjs(state.startTime) : null}
                  onChange={(val) =>
                    updateStep1({ startTime: val ? val.toDate() : null })
                  }
                  minDateTime={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: "Select Date & Time",
                    },
                  }}
                />
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
                <MobileDateTimePicker
                  value={state.endTime ? dayjs(state.endTime) : null}
                  onChange={(val) =>
                    updateStep1({ endTime: val ? val.toDate() : null })
                  }
                  minDateTime={state.startTime ? dayjs(state.startTime) : dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: "Select Date & Time",
                    },
                  }}
                />
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
