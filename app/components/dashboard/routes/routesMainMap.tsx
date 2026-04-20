"use client";

import { useMemo } from "react";
import { Box, Skeleton } from "@mui/material";
import { MapWithMarker } from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { MapRouteData } from "@/app/lib/type/routes";

interface RoutesMainMapProps {
  mapData: MapRouteData[];
  loading?: boolean;
}

const RoutesMainMap = ({ mapData, loading }: RoutesMainMapProps) => {

  // Map Routes to Markers - moved before early return to satisfy hook rules
  const markers = useMemo(() => {
    return mapData.map((d) => {
      let markerType: "warehouse" | "vehicle" | "customer" | "default" = "default";
      if (d.type === "V") markerType = "vehicle";

      return {
        position: d.position,
        label: d.name,
        type: markerType,
      };
    });
  }, [mapData]);

  return (
    <Box sx={{ minHeight: 400, flexGrow: 3, borderRadius: "16px", overflow: "hidden", position: "relative" }}>
      {loading && (
        <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10 }}>
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ minHeight: 400 }} />
        </Box>
      )}
      <GoogleMapsProvider>
        <MapWithMarker markers={markers} />
      </GoogleMapsProvider>
    </Box>
  );
};

export default RoutesMainMap;
