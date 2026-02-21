"use client";

import { Box, Typography } from "@mui/material";
import GoogleMapView from "@/app/components/map";
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

  return (
    <Box sx={{ minHeight: 400, flexGrow: 3 }}>
      <GoogleMapView warehouseLoc={mapData} />
    </Box>
  );
};

export default RoutesMainMap;
