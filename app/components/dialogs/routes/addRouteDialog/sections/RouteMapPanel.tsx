import { Box, Stack, Typography, useTheme, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import { Dictionary } from "@/app/lib/language/language";
import { RouteFormValues } from "@/app/lib/type/routes";
import { DEFAULT_ROUTE_BUFFER_METERS } from "@/app/lib/type/routeDeviation";

const MapWithPolyline = dynamic(() => import("@/app/components/valhalla/mapWithPolyline"), { ssr: false });

interface ExtendedPalette {
  divider_alpha?: Record<string, string>;
}

interface RouteMapPanelProps {
  values: RouteFormValues;
  data: {
    mapPoints?: Array<{ lat: number; lon: number; name: string }>;
    polyline?: [number, number][] | null;
  } | null;
  dict: Dictionary;
  isLoading?: boolean;
  bufferError?: string | undefined;
}

export default function RouteMapPanel({ values, data, dict, isLoading = false, bufferError }: RouteMapPanelProps) {
  const theme = useTheme();
  const paletteTheme = theme.palette as unknown as ExtendedPalette;
  const effectiveBuffer = values.bufferMeters || DEFAULT_ROUTE_BUFFER_METERS;

  const metrics = [
    {
      label: dict.routes.dialogs.distanceKmLabel,
      value: values.distanceKm > 0 ? `${values.distanceKm.toFixed(1)} km` : "--",
      color: "#3b82f6",
    },
    {
      label: dict.routes.dialogs.durationMinLabel,
      value: values.durationMin > 0 ? `${values.durationMin} dk` : "--",
      color: "#10b981",
    },
    {
      label: "Tahmini CO₂",
      value: values.distanceKm > 0 ? `${(values.distanceKm * 0.9).toFixed(1)} kg` : "--",
      color: "#f59e0b",
    },
  ];

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${paletteTheme.divider_alpha?.main_10}`,
        position: "relative",
      }}
    >
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

      {/* Metrics float over the map so the canvas keeps the full panel height. */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 24,
          zIndex: 800,
          pointerEvents: "none",
        }}
      >
        {metrics.map((metric) => (
          <Box
            key={metric.label}
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "rgba(11, 15, 25, 0.7)",
              backdropFilter: "blur(6px)",
              border: `1px solid ${paletteTheme.divider_alpha?.main_10}`,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block">
              {metric.label}
            </Typography>
            <Typography component="div" variant="body1" fontWeight={700} color={metric.color}>
              {metric.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
