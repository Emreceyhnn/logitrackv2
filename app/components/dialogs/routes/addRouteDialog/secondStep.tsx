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

  const waypointsStr = useMemo(() => {
    const stops = values?.stops || [];
    const points = stops.filter((i) => i.lat && i.lng).map((i) => ({ name: i.address || "Durak", lat: Number(i.lat), lon: Number(i.lng) }));
    return JSON.stringify(points);
  }, [values.stops]);

  useEffect(() => {
    const fetchData = async () => {
      const waypoints = JSON.parse(waypointsStr);
      if (waypoints.length < 2) { setData(null); return; }
      try {
        const response = await polylineHelper({ locations: waypoints, costing: "truck" });
        setData(response ?? null);
        if (response?.summary) {
          setFieldValue("distanceKm", response.summary.length || 0);
          setFieldValue("durationMin", Math.round((response.summary.time || 0) / 60));
        }
      } catch (error) { logger.error("Valhalla API Error:", error); }
    };
    fetchData();
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
            <RouteMapPanel values={values} data={data} dict={dict} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default SecondRouteDialogStep;
