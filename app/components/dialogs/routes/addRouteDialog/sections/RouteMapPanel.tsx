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
    <Stack spacing={2} sx={{ height: "100%", minHeight: 0, overflow: "hidden", flex: 1 }}>
      {/* Metrics Row */}
      <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
        <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: paletteTheme.divider_alpha?.main_05, border: `1px solid ${paletteTheme.divider_alpha?.main_10}` }}>
          <Typography variant="caption" color="text.secondary" display="block">{dict.routes.dialogs.distanceKmLabel}</Typography>
          <Typography component="div" variant="body1" fontWeight={700} color="#3b82f6">{values.distanceKm > 0 ? `${values.distanceKm.toFixed(1)} km` : "--"}</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: paletteTheme.divider_alpha?.main_05, border: `1px solid ${paletteTheme.divider_alpha?.main_10}` }}>
          <Typography variant="caption" color="text.secondary" display="block">{dict.routes.dialogs.durationMinLabel}</Typography>
          <Typography component="div" variant="body1" fontWeight={700} color="#10b981">{values.durationMin > 0 ? `${values.durationMin} dk` : "--"}</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: paletteTheme.divider_alpha?.main_05, border: `1px solid ${paletteTheme.divider_alpha?.main_10}` }}>
          <Typography variant="caption" color="text.secondary" display="block">Tahmini CO₂</Typography>
          <Typography component="div" variant="body1" fontWeight={700} color="#f59e0b">{values.distanceKm > 0 ? `${(values.distanceKm * 0.9).toFixed(1)} kg` : "--"}</Typography>
        </Box>
      </Stack>

      {/* Info & Deviation Bar */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ flexShrink: 0 }}>
        <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: paletteTheme.info?._alpha?.main_05, border: `1px solid ${paletteTheme.info?._alpha?.main_10}`, display: "flex", gap: 1, alignItems: "center" }}>
          <ElectricBoltIcon fontSize="small" sx={{ color: theme.palette.info.main }} />
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
            <Typography component="span" variant="caption" fontWeight={700} color="info.main">{dict.routes.dialogs.optimizationTip}</Typography> {dict.routes.dialogs.optimizationDesc}
          </Typography>
        </Box>

        {setFieldValue && (
          <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: paletteTheme.warning?._alpha?.main_05, border: `1px solid ${paletteTheme.warning?._alpha?.main_10}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <RadarIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
              <Typography variant="caption" fontWeight={700} color="warning.main">
                {dict.routes.dialogs.deviationTitle}
              </Typography>
            </Stack>
            <TextField
              type="number"
              size="small"
              disabled={!hasShape}
              value={values.bufferMeters ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                setFieldValue("bufferMeters", raw === "" ? undefined : Number(raw));
              }}
              placeholder={String(DEFAULT_ROUTE_BUFFER_METERS)}
              error={Boolean(bufferError)}
              slotProps={{
                htmlInput: { min: MIN_ROUTE_BUFFER_METERS, max: MAX_ROUTE_BUFFER_METERS, step: 50 },
                input: {
                  endAdornment: <InputAdornment position="end">m</InputAdornment>,
                },
              }}
              sx={{ width: 110, "& .MuiOutlinedInput-input": { py: 0.5, px: 1, fontSize: "0.8rem" } }}
            />
          </Box>
        )}
      </Stack>

      {/* Map Box */}
      <Box sx={{ flex: 1, minHeight: 0, borderRadius: 3, overflow: "hidden", border: `1px solid ${paletteTheme.divider_alpha?.main_10}`, position: "relative" }}>
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
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
