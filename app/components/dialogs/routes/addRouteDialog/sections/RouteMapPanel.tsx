import { Box, Stack, Typography, useTheme, CircularProgress } from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import dynamic from "next/dynamic";
import { Dictionary } from "@/app/lib/language/language";
import { RouteFormValues } from "@/app/lib/type/routes";

const MapWithPolyline = dynamic(() => import("@/app/components/valhalla/mapWithPolyline"), { ssr: false });

interface ExtendedPalette {
  divider_alpha?: Record<string, string>;
  info?: {
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
}

export default function RouteMapPanel({ values, data, dict, isLoading = false }: RouteMapPanelProps) {
  const theme = useTheme();
  const paletteTheme = theme.palette as unknown as ExtendedPalette;
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

      <Box sx={{ height: "100%", minHeight: 350, borderRadius: 3, overflow: "hidden", border: `1px solid ${paletteTheme.divider_alpha?.main_10}` }}>
        <Box sx={{ position: "relative", width: "100%", height: "100%", minHeight: 350 }}>
          {isLoading && (
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(11, 15, 25, 0.7)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)" }}>
              <Stack alignItems="center" spacing={2}>
                <CircularProgress size={40} color="primary" />
                <Typography variant="body2" color="white" fontWeight={500}>
                  {dict.common?.loading || "Yükleniyor..."}
                </Typography>
              </Stack>
            </Box>
          )}
          <MapWithPolyline Polylines={data?.mapPoints || []} routePolyline={data?.polyline ?? null} />
        </Box>
      </Box>
    </Stack>
  );
}
