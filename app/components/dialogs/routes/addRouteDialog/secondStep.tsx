"use client";

import { alpha, Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useFormikContext } from "formik";
import { RouteFormValues } from "@/app/lib/type/routes";
import ExploreIcon from "@mui/icons-material/Explore";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { useMemo } from "react";
import { DirectionsMap } from "@/app/components/googleMaps/DirectionsMap";

const SecondRouteDialogStep = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const { values, setFieldValue, touched, errors } = useFormikContext<RouteFormValues>();

  /* ------------------------------- constant ------------------------------- */
  const origin = useMemo(
    () => (values.startLat && values.startLng ? { lat: values.startLat, lng: values.startLng } : values.startAddress),
    [values.startLat, values.startLng, values.startAddress]
  );
  const destination = useMemo(
    () => (values.endLat && values.endLng ? { lat: values.endLat, lng: values.endLng } : values.endAddress),
    [values.endLat, values.endLng, values.endAddress]
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
                    value={values.startAddress}
                    onAddressSelect={({
                      lat,
                      lng,
                      formattedAddress,
                    }: {
                      lat: number;
                      lng: number;
                      formattedAddress: string;
                    }) => {
                      setFieldValue("startLat", lat);
                      setFieldValue("startLng", lng);
                      setFieldValue("startAddress", formattedAddress);
                    }}
                    error={touched.startAddress && Boolean(errors.startAddress)}
                    helperText={touched.startAddress ? (errors.startAddress as string) : undefined}
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
                    value={values.endAddress}
                    onAddressSelect={({
                      lat,
                      lng,
                      formattedAddress,
                    }: {
                      lat: number;
                      lng: number;
                      formattedAddress: string;
                    }) => {
                      setFieldValue("endLat", lat);
                      setFieldValue("endLng", lng);
                      setFieldValue("endAddress", formattedAddress);
                    }}
                    error={touched.endAddress && Boolean(errors.endAddress)}
                    helperText={touched.endAddress ? (errors.endAddress as string) : undefined}
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
                      {values.distanceKm > 0 ? values.distanceKm.toFixed(1) : "--"}
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
                      {values.durationMin > 0 ? values.durationMin : "--"}
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
                  onRouteInfoUpdate={(data: { distanceKm?: number; durationMin?: number }) => {
                    if (data.distanceKm !== undefined) setFieldValue("distanceKm", data.distanceKm);
                    if (data.durationMin !== undefined) setFieldValue("durationMin", data.durationMin);
                  }}
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
