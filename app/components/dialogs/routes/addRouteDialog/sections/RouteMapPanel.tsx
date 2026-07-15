import { Box, Stack, Typography, useTheme, CircularProgress, TextField, InputAdornment } from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import RadarIcon from "@mui/icons-material/Radar";
import dynamic from "next/dynamic";
import { Dictionary } from "@/app/lib/language/language";
import { RouteFormValues } from "@/app/lib/type/routes";
import {
  DEFAULT_ROUTE_BUFFER_METERS,
  MIN_ROUTE_BUFFER_METERS,
  MAX_ROUTE_BUFFER_METERS,
} from "@/app/lib/type/routeDeviation";

const MapWithPolyline = dynamic(() => import("@/app/components/valhalla/mapWithPolyline"), { ssr: false });

interface ExtendedPalette {
  divider_alpha?: Record<string, string>;
  info?: {
    _alpha?: Record<string, string>;
  };
  warning?: {
    _alpha?: Record<string, string>;
  };
}

interface RouteMapPanelProps {
  values: RouteFormValues;
  data: {
    mapPoints?: Array<{ lat: number; lon: number; name: string }>;
    polyline?: [number, number][] | null;
  } | null;
  dict: Dictionary;
  isLoading?: boolean;
  setFieldValue?: (field: string, value: unknown) => void;
  bufferError?: string | undefined;
}

export default function RouteMapPanel({ values, data, dict, isLoading = false, setFieldValue, bufferError }: RouteMapPanelProps) {
  const theme = useTheme();
  const paletteTheme = theme.palette as unknown as ExtendedPalette;
  // The corridor is only meaningful once the engine has returned a shape.
  const hasShape = Boolean(values.shape);
  const effectiveBuffer = values.bufferMeters || DEFAULT_ROUTE_BUFFER_METERS;
  return (
    <Stack spacing={4} sx={{ height: "100%" }}>
      <Stack direction="row" spacing={2}>
        <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: paletteTheme.divider_alpha?.main_05, border: `1px solid ${paletteTheme.divider_alpha?.main_10}` }}>
          <Typography variant="caption" color="text.secondary" display="block">{dict.routes.dialogs.distanceKmLabel}</Typography>
          <Typography component="div" variant="h6" fontWeight={700} color="white">{values.distanceKm > 0 ? values.distanceKm.toFixed(1) : "--"}</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: paletteTheme.divider_alpha?.main_05, border: `1px solid ${paletteTheme.divider_alpha?.main_10}` }}>
          <Typography variant="caption" color="text.secondary" display="block">{dict.routes.dialogs.durationMinLabel}</Typography>
          <Typography component="div" variant="h6" fontWeight={700} color="white">{values.durationMin > 0 ? values.durationMin : "--"}</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: paletteTheme.divider_alpha?.main_05, border: `1px solid ${paletteTheme.divider_alpha?.main_10}` }}>
          <Typography variant="caption" color="text.secondary" display="block">Tahmini CO₂</Typography>
          <Typography component="div" variant="h6" fontWeight={700} color="error.main">{values.distanceKm > 0 ? `${(values.distanceKm * 0.9).toFixed(1)} kg` : "--"}</Typography>
        </Box>
      </Stack>

      <Box sx={{ p: 2, borderRadius: 2, bgcolor: paletteTheme.info?._alpha?.main_05, border: `1px solid ${paletteTheme.info?._alpha?.main_10}`, display: "flex", gap: 1.5 }}>
        <ElectricBoltIcon fontSize="small" sx={{ color: theme.palette.info.main, mt: 0.2 }} />
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
          <Typography component="span" variant="caption" fontWeight={700} color="info.main">{dict.routes.dialogs.optimizationTip}</Typography> {dict.routes.dialogs.optimizationDesc}
        </Typography>
      </Box>

      {setFieldValue && (
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: paletteTheme.warning?._alpha?.main_05, border: `1px solid ${paletteTheme.warning?._alpha?.main_10}` }}>
          <Stack direction="row" spacing={1.5}>
            <RadarIcon fontSize="small" sx={{ color: theme.palette.warning.main, mt: 0.2 }} />
            <Stack spacing={1.5} sx={{ flex: 1 }}>
              <Stack spacing={0.25}>
                <Typography variant="caption" fontWeight={700} color="warning.main">
                  {dict.routes.dialogs.deviationTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                  {hasShape ? dict.routes.dialogs.deviationDesc : dict.routes.dialogs.deviationNoShape}
                </Typography>
              </Stack>

              <TextField
                type="number"
                size="small"
                disabled={!hasShape}
                label={dict.routes.dialogs.bufferLabel}
                value={values.bufferMeters ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  // Empty clears the override so the route falls back to the
                  // default, rather than persisting a 0m corridor.
                  setFieldValue("bufferMeters", raw === "" ? undefined : Number(raw));
                }}
                placeholder={String(DEFAULT_ROUTE_BUFFER_METERS)}
                error={Boolean(bufferError)}
                helperText={
                  bufferError ||
                  dict.routes.dialogs.bufferHelper.replace("{default}", String(DEFAULT_ROUTE_BUFFER_METERS))
                }
                slotProps={{
                  htmlInput: { min: MIN_ROUTE_BUFFER_METERS, max: MAX_ROUTE_BUFFER_METERS, step: 50 },
                  input: {
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  },
                }}
                sx={{ maxWidth: 260 }}
              />

              {hasShape && !bufferError && (
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, opacity: 0.75 }}>
                  {dict.routes.dialogs.bufferHint}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>
      )}

      <Box sx={{ height: "100%", minHeight: 350, borderRadius: 3, overflow: "hidden", border: `1px solid ${paletteTheme.divider_alpha?.main_10}` }}>
        <Box sx={{ position: "relative", width: "100%", height: "100%", minHeight: 350 }}>
          {/* Faded rather than unmounted so the map is released smoothly when
              the route arrives; the hidden overlay must not catch map drags. */}
          <Box
            aria-hidden={!isLoading}
            aria-busy={isLoading}
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(11, 15, 25, 0.7)",
              backdropFilter: "blur(2px)",
              opacity: isLoading ? 1 : 0,
              visibility: isLoading ? "visible" : "hidden",
              pointerEvents: isLoading ? "auto" : "none",
              transition: "opacity 220ms ease, visibility 220ms ease",
            }}
          >
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={40} color="primary" />
              <Typography variant="body2" color="white" fontWeight={500}>
                {dict.common?.loading || "Yükleniyor..."}
              </Typography>
            </Stack>
          </Box>
          <MapWithPolyline
            Polylines={data?.mapPoints || []}
            routePolyline={data?.polyline ?? null}
            bufferMeters={bufferError ? undefined : effectiveBuffer}
          />
        </Box>
      </Box>
    </Stack>
  );
}
