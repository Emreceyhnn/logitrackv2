"use client";

import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import { useFormikContext } from "formik";
import { RouteFormValues } from "@/app/lib/type/routes";
import ExploreIcon from "@mui/icons-material/Explore";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import CloseIcon from "@mui/icons-material/Close";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { useMemo } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { RouteMap } from "@/app/components/googleMaps/RouteMap";

const SecondRouteDialogStep = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const dict = useDictionary();
  const { values, setFieldValue, touched, errors } =
    useFormikContext<RouteFormValues>();

  /* ------------------------------- constant ------------------------------- */

  const stops = useMemo(() => {
    return values.waypoints?.map((waypoint, index) => {
      return {
        address: waypoint.address,
        lat: waypoint.lat,
        lng: waypoint.lng,
        stopOrder: index + 1,
      };
    });
  }, [values.waypoints]);

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
                bgcolor: theme.palette.primary._alpha.main_10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ExploreIcon color="primary" />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" fontWeight={700} color="white">
                {dict.routes.dialogs.locationDetails}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dict.routes.dialogs.locationDetailsDesc}
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
                    {dict.routes.dialogs.startAddress}
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
                    helperText={
                      touched.startAddress
                        ? (errors.startAddress as string)
                        : undefined
                    }
                  />
                </Stack>

                {/* Waypoints Array */}
                <Stack spacing={2}>
                  {values.waypoints?.map((waypoint, index) => (
                    <Stack spacing={1} key={index}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
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
                              bgcolor: "warning.main",
                            }}
                          />
                          Stop {index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            const newWaypoints = [...(values.waypoints || [])];
                            newWaypoints.splice(index, 1);
                            setFieldValue("waypoints", newWaypoints);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <AddressAutocomplete
                        value={waypoint.address}
                        onAddressSelect={({
                          lat,
                          lng,
                          formattedAddress,
                        }: {
                          lat: number;
                          lng: number;
                          formattedAddress: string;
                        }) => {
                          setFieldValue(`waypoints[${index}]`, {
                            address: formattedAddress,
                            lat,
                            lng,
                          });
                        }}
                      />
                    </Stack>
                  ))}

                  <Button
                    variant="outlined"
                    size="small"
                    color="inherit"
                    onClick={() => {
                      setFieldValue("waypoints", [
                        ...(values.waypoints || []),
                        { address: "", lat: 0, lng: 0 },
                      ]);
                    }}
                    sx={{
                      alignSelf: "flex-start",
                      mt: values.waypoints?.length ? 0 : 1,
                    }}
                  >
                    + Add Stop
                  </Button>
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
                    {dict.routes.dialogs.endAddress}
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
                    helperText={
                      touched.endAddress
                        ? (errors.endAddress as string)
                        : undefined
                    }
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: theme.palette.divider_alpha.main_05,
                      border: `1px solid ${theme.palette.divider_alpha.main_10}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {dict.routes.dialogs.distanceKmLabel}
                    </Typography>
                    <Typography
                      component="div"
                      variant="h6"
                      fontWeight={700}
                      color="white"
                    >
                      {values.distanceKm > 0
                        ? values.distanceKm.toFixed(1)
                        : "--"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: theme.palette.divider_alpha.main_05,
                      border: `1px solid ${theme.palette.divider_alpha.main_10}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {dict.routes.dialogs.durationMinLabel}
                    </Typography>
                    <Typography
                      component="div"
                      variant="h6"
                      fontWeight={700}
                      color="white"
                    >
                      {values.durationMin > 0 ? values.durationMin : "--"}
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.info._alpha.main_05,
                    border: `1px solid ${theme.palette.info._alpha.main_10}`,
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
                      {dict.routes.dialogs.optimizationTip}
                    </Typography>{" "}
                    {dict.routes.dialogs.optimizationDesc}
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
                  border: `1px solid ${theme.palette.divider_alpha.main_10}`,
                }}
              >
                <RouteMap
                  origin={{
                    lat: stops?.[0]?.lat ?? 0,
                    lng: stops?.[0]?.lng ?? 0,
                  }}
                  destination={{
                    lat: stops?.[stops.length - 1]?.lat ?? 0,
                    lng: stops?.[stops.length - 1]?.lng ?? 0,
                  }}
                  stops={stops?.map(s => ({lat: s.lat ?? 0, lng: s.lng ?? 0}))}
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
