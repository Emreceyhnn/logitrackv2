"use client";

import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useFormikContext } from "formik";
import { RouteFormValues } from "@/app/lib/type/routes";
import ExploreIcon from "@mui/icons-material/Explore";
import { useEffect, useMemo, useState } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { polylineHelper, PolylineHelperResult } from "../../../valhalla/polylineHelper";
import { logger } from "@/app/lib/logger";

import RouteAddressForm from "./sections/RouteAddressForm";
import RouteMapPanel from "./sections/RouteMapPanel";

interface ExtendedPalette {
  primary?: {
    _alpha?: Record<string, string>;
  };
  divider_alpha?: Record<string, string>;
}

const SecondRouteDialogStep = () => {
  const theme = useTheme();
  const dict = useDictionary();
  const { values, setFieldValue, touched, errors } = useFormikContext<RouteFormValues>();
  const paletteTheme = theme.palette as unknown as ExtendedPalette;

  const [data, setData] = useState<PolylineHelperResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const waypointsStr = useMemo(() => {
    const stops = values?.stops || [];
    const points = stops.filter((i) => i.lat && i.lng).map((i) => ({ name: i.address || "Durak", lat: Number(i.lat), lon: Number(i.lng) }));
    return JSON.stringify(points);
  }, [values.stops]);

  useEffect(() => {
    const waypoints = JSON.parse(waypointsStr);
    if (waypoints.length < 2) {
      setData(null);
      setIsLoading(false);
      return;
    }

    // Shown from the same commit that starts the request, so editing a stop
    // never leaves the map bare while a fetch is in flight.
    setIsLoading(true);

    // Stops change fast while the user edits them; without this an earlier,
    // slower response could overwrite the distance/shape of a later one.
    let cancelled = false;

    (async () => {
      try {
        const response = await polylineHelper({ locations: waypoints, costing: "truck" });
        if (cancelled) return;

        setData(response ?? null);
        if (response?.summary) {
          setFieldValue("distanceKm", response.summary.length || 0);
          setFieldValue("durationMin", Math.round((response.summary.time || 0) / 60));
          setFieldValue("shape", response.shape || "");
        }
      } catch (error) {
        if (!cancelled) logger.error("Valhalla API Error:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [waypointsStr, setFieldValue]);

  return (
    <Box>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: paletteTheme.primary?._alpha?.main_10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ExploreIcon color="primary" />
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={700} color="white">{dict.routes.dialogs.locationDetails}</Typography>
            <Typography variant="caption" color="text.secondary">{dict.routes.dialogs.locationDetailsDesc}</Typography>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ maxHeight: { xs: "auto", md: "500px" }, overflowY: "auto", pr: { xs: 0, md: 1 }, "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-track": { bgcolor: "transparent" }, "&::-webkit-scrollbar-thumb": { bgcolor: paletteTheme.divider_alpha?.main_20, borderRadius: "4px" } }}>
              <RouteAddressForm values={values} setFieldValue={setFieldValue} touched={touched} errors={errors} dict={dict} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <RouteMapPanel
              values={values}
              data={data}
              dict={dict}
              isLoading={isLoading}
              setFieldValue={setFieldValue}
              bufferError={touched.bufferMeters ? (errors.bufferMeters as string | undefined) : undefined}
            />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default SecondRouteDialogStep;
