"use client";

import { Box, Typography } from "@mui/material";
import { MapWithMarker } from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { MapRouteData } from "@/app/lib/type/routes";

interface RoutesMainMapProps {
  mapData: MapRouteData[];
  loading?: boolean;
}

const RoutesMainMap = ({ mapData, loading }: RoutesMainMapProps) => {
  if (loading)
    return (
      <Box
        sx={{
          minHeight: 400,
          flexGrow: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading Map...</Typography>
      </Box>
    );

  // Map Routes to Markers
  const markers = mapData.map((d) => ({
    position: d.position,
    label: d.name,
  }));

  return (
    <Box sx={{ minHeight: 400, flexGrow: 3 }}>
      <GoogleMapsProvider>
        <MapWithMarker markers={markers} />
      </GoogleMapsProvider>
    </Box>
  );
};

export default RoutesMainMap;
