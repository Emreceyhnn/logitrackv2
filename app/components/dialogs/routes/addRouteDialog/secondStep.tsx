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

import { useEffect, useMemo, useState } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

import { polylineHelper } from "../../../valhalla/polylineHelper";
import dynamic from "next/dynamic";
const MapWithPolyline = dynamic(
  () => import("../../../valhalla/mapWithPolyline"),
  {
    ssr: false,
  }
);

const SecondRouteDialogStep = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const dict = useDictionary();
  const { values, setFieldValue, touched, errors } =
    useFormikContext<RouteFormValues>();

  /* -------------------------------------------------------------------------- */
  const [data, setData] = useState<any>(null);

  const waypointsStr = useMemo(() => {
    const stops = values?.stops || [];
    const points = stops
      .filter((i) => i.lat && i.lng)
      .map((i) => ({
        name: i.address || "Durak",
        lat: Number(i.lat),
        lon: Number(i.lng),
      }));
    return JSON.stringify(points);
  }, [values?.stops]);

  useEffect(() => {
    const fetchData = async () => {
      const waypoints = JSON.parse(waypointsStr);
      if (waypoints.length < 2) {
        setData(null);
        return;
      }

      try {
        const response = await polylineHelper({
          locations: waypoints,
          costing: "truck",
        });
        setData(response);
        if (response?.summary) {
          setFieldValue("distanceKm", response.summary.length || 0);
          setFieldValue(
            "durationMin",
            Math.round((response.summary.time || 0) / 60)
          );
        }
      } catch (error) {
        console.error("Valhalla API Error:", error);
      }
    };

    fetchData();
  }, [waypointsStr]);

  return (
    <>
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
              <Box
                sx={{
                  maxHeight: { xs: "auto", md: "500px" },
                  overflowY: "auto",
                  pr: { xs: 0, md: 1 },
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    bgcolor: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: theme.palette.divider_alpha.main_20,
                    borderRadius: "4px",
                  },
                }}
              >
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
                      value={values.stops?.[0]?.address}
                      onAddressSelect={({
                        lat,
                        lng,
                        formattedAddress,
                      }: {
                        lat: number;
                        lng: number;
                        formattedAddress: string;
                      }) => {
                        setFieldValue("startAddress", formattedAddress);
                        setFieldValue("startLat", lat);
                        setFieldValue("startLng", lng);

                        const newStops = [...(values.stops || [])];
                        if (newStops.length > 0) {
                          newStops[0] = { address: formattedAddress, lat, lng };
                        } else {
                          newStops.push({
                            address: formattedAddress,
                            lat,
                            lng,
                          });
                        }
                        setFieldValue("stops", newStops);
                      }}
                      error={
                        touched.startAddress && Boolean(errors.startAddress)
                      }
                      helperText={
                        touched.startAddress
                          ? (errors.startAddress as string)
                          : undefined
                      }
                    />
                  </Stack>

                  {/* Stops Array */}
                  <Stack spacing={2}>
                    {values.stops &&
                      values.stops.length > 2 &&
                      values.stops
                        .slice(1, values.stops.length - 1)
                        .map((stop, index) => {
                          const actualIndex = index + 1;
                          return (
                            <Stack spacing={1} key={actualIndex}>
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
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: "50%",
                                      bgcolor: "warning.main",
                                    }}
                                  />
                                  Stop {actualIndex}
                                </Typography>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    const newStops = [...(values.stops || [])];
                                    newStops.splice(actualIndex, 1);
                                    setFieldValue("stops", newStops);
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                              <AddressAutocomplete
                                value={stop.address}
                                onAddressSelect={({
                                  lat,
                                  lng,
                                  formattedAddress,
                                }: {
                                  lat: number;
                                  lng: number;
                                  formattedAddress: string;
                                }) => {
                                  setFieldValue(`stops[${actualIndex}]`, {
                                    address: formattedAddress,
                                    lat,
                                    lng,
                                  });
                                }}
                              />
                            </Stack>
                          );
                        })}

                    <Button
                      variant="outlined"
                      size="small"
                      color="inherit"
                      onClick={() => {
                        const newStops = [...(values.stops || [])];
                        if (newStops.length >= 2) {
                          newStops.splice(newStops.length - 1, 0, {
                            address: "",
                            lat: 0,
                            lng: 0,
                          });
                        } else {
                          while (newStops.length < 2) {
                            newStops.push({ address: "", lat: 0, lng: 0 });
                          }
                          newStops.splice(1, 0, {
                            address: "",
                            lat: 0,
                            lng: 0,
                          });
                        }
                        setFieldValue("stops", newStops);
                      }}
                      sx={{
                        alignSelf: "flex-start",
                        mt: values.stops?.length ? 0 : 1,
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
                        setFieldValue("endAddress", formattedAddress);
                        setFieldValue("endLat", lat);
                        setFieldValue("endLng", lng);

                        const newStops = [...(values.stops || [])];
                        if (newStops.length > 1) {
                          newStops[newStops.length - 1] = {
                            address: formattedAddress,
                            lat,
                            lng,
                          };
                        } else if (newStops.length === 1) {
                          newStops.push({
                            address: formattedAddress,
                            lat,
                            lng,
                          });
                        } else {
                          newStops.push({ address: "", lat: 0, lng: 0 });
                          newStops.push({
                            address: formattedAddress,
                            lat,
                            lng,
                          });
                        }
                        setFieldValue("stops", newStops);
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
              </Box>
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
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    minHeight: 350,
                  }}
                >
                  <MapWithPolyline
                    Polylines={data?.mapPoints || []}
                    routePolyline={data?.polyline}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
};

export default SecondRouteDialogStep;
