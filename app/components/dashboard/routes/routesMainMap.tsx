"use client";

import { Box, Skeleton, alpha, useTheme } from "@mui/material";
import { MapWithMarker } from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { MapRouteData } from "@/app/lib/type/routes";

interface RoutesMainMapProps {
  mapData: MapRouteData[];
  loading?: boolean;
}

const RoutesMainMap = ({ mapData, loading }: RoutesMainMapProps) => {
  const theme = useTheme();

  if (loading)
    return (
      <Box
        sx={{
          minHeight: 400,
          flexGrow: 3,
          borderRadius: "16px",
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ minHeight: 400 }} />
      </Box>
    );

  // Map Routes to Markers
  const markers = mapData.map((d) => {
    let markerType: "warehouse" | "vehicle" | "customer" | "default" = "default";
    if (d.type === "V") markerType = "vehicle";

    return {
      position: d.position,
      label: d.name,
      type: markerType,
    };
  });

  return (
    <Box sx={{ minHeight: 400, flexGrow: 3, borderRadius: "16px", overflow: "hidden" }}>
      <GoogleMapsProvider>
        <MapWithMarker markers={markers} />
      </GoogleMapsProvider>
    </Box>
  );
};

export default RoutesMainMap;
