"use client";

import { alpha, Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { AddRouteStep2 } from "@/app/lib/type/add-route";
import ExploreIcon from "@mui/icons-material/Explore";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { useMemo } from "react";
import { DirectionsMap } from "@/app/components/googleMaps/DirectionsMap";

interface SecondRouteDialogStepProps {
  state: AddRouteStep2;
  updateStep2: (data: Partial<AddRouteStep2>) => void;
}

const SecondRouteDialogStep = ({
  state,
  updateStep2,
}: SecondRouteDialogStepProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* ------------------------------- constant ------------------------------- */
  const origin = useMemo(
    () => (state.startLat && state.startLng ? { lat: state.startLat, lng: state.startLng } : state.startAddress),
    [state.startLat, state.startLng, state.startAddress]
  );
  const destination = useMemo(
    () => (state.endLat && state.endLng ? { lat: state.endLat, lng: state.endLng } : state.endAddress),
    [state.endLat, state.endLng, state.endAddress]
  );

  return (
    <GoogleMapsProvider>
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
              <ExploreIcon color="primary" />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" fontWeight={700} color="white">
                Step 2: Location Details
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Enter the starting point and destination to calculate the route
                metrics.
              </Typography>
            </Stack>
          </Stack>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography
                    variant="body2"
                    component="div"
                    fontWeight={600}
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                      }}
                    />
                    Start Address
                  </Typography>
                  <AddressAutocomplete
                    value={state.startAddress}
                    onAddressSelect={({
                      lat,
                      lng,
                      formattedAddress,
                    }: {
                      lat: number;
                      lng: number;
                      formattedAddress: string;
                    }) => {
                      updateStep2({
                        startLat: lat,
                        startLng: lng,
                        startAddress: formattedAddress,
                      });
                    }}
                  />
                </Stack>

                <Stack spacing={1}>
                  <Typography
                    variant="body2"
                    component="div"
                    fontWeight={600}
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "error.main",
                      }}
                    />
                    End Address
                  </Typography>
                  <AddressAutocomplete
                    value={state.endAddress}
                    onAddressSelect={({
                      lat,
                      lng,
                      formattedAddress,
                    }: {
                      lat: number;
                      lng: number;
                      formattedAddress: string;
                    }) => {
                      updateStep2({
                        endLat: lat,
                        endLng: lng,
                        endAddress: formattedAddress,
                      });
                    }}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.divider, 0.05),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Distance (km)
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="white">
                      {state.distanceKm > 0 ? state.distanceKm : "--"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.divider, 0.05),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Duration (min)
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="white">
                      {state.durationMin > 0 ? state.durationMin : "--"}
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  <ElectricBoltIcon
                    fontSize="small"
                    sx={{ color: theme.palette.info.main, mt: 0.2 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ lineHeight: 1.4 }}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      fontWeight={700}
                      color="info.main"
                    >
                      Optimization Tip:
                    </Typography>{" "}
                    This route currently avoids major highways. You can adjust
                    the path by dragging the line on the map to avoid traffic or
                    congested areas.
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  height: "100%",
                  minHeight: 350,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <DirectionsMap
                  origin={origin}
                  destination={destination}
                  onRouteInfoUpdate={(data: Partial<AddRouteStep2>) =>
                    updateStep2(data)
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </GoogleMapsProvider>
  );
};

export default SecondRouteDialogStep;
