import { Box, Stack, Typography, useTheme } from "@mui/material";
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
}

export default function RouteMapPanel({ values, data, dict }: RouteMapPanelProps) {
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
      </Stack>

      <Box sx={{ p: 2, borderRadius: 2, bgcolor: paletteTheme.info?._alpha?.main_05, border: `1px solid ${paletteTheme.info?._alpha?.main_10}`, display: "flex", gap: 1.5 }}>
        <ElectricBoltIcon fontSize="small" sx={{ color: theme.palette.info.main, mt: 0.2 }} />
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
          <Typography component="span" variant="caption" fontWeight={700} color="info.main">{dict.routes.dialogs.optimizationTip}</Typography> {dict.routes.dialogs.optimizationDesc}
        </Typography>
      </Box>

      <Box sx={{ height: "100%", minHeight: 350, borderRadius: 3, overflow: "hidden", border: `1px solid ${paletteTheme.divider_alpha?.main_10}` }}>
        <Box sx={{ position: "relative", width: "100%", height: "100%", minHeight: 350 }}>
          <MapWithPolyline Polylines={data?.mapPoints || []} routePolyline={data?.polyline ?? null} />
        </Box>
      </Box>
    </Stack>
  );
}
