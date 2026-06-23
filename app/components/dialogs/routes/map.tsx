import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { polylineHelper } from "../../valhalla/polylineHelper";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

const MapWithPolyline = dynamic(
  () => import("../../valhalla/mapWithPolyline"),
  { ssr: false }
);

interface MapRoutesDialogCardProps {
  origin?: string | { lat: number; lng: number; address?: string };
  destination?: string | { lat: number; lng: number; address?: string };
  stops?: Array<{
    location: string | { lat: number; lng: number };
    stopover?: boolean;
  }>;
  addrA?: string;
  addrB?: string;
  vehicleLocation?: {
    lat: number;
    lng: number;
    name: string;
    id: string;
  } | null;
  onMapClick?: (e: any) => void;
  onRouteInfoUpdate?: (data: {
    distanceKm: number;
    durationMin: number;
  }) => void;
}

const MapRoutesDialogCard = ({
  origin,
  destination,
  stops,
  addrA,
  addrB,
  vehicleLocation,
  onRouteInfoUpdate,
}: MapRoutesDialogCardProps) => {
  const dict = useDictionary();
  const isRoute = !!((origin || addrA) && (destination || addrB));

  const [data, setData] = useState<any>(null);

  const waypoints = useMemo(() => {
    const points = [];
    if (origin && typeof origin === "object" && "lat" in origin) {
      points.push({ name: (origin as any).address || "Origin", lat: origin.lat, lon: origin.lng });
    }
    
    if (stops) {
      stops.forEach((s) => {
        const loc = s.location;
        if (typeof loc === "object" && "lat" in loc) {
          points.push({ name: "Stop", lat: loc.lat, lon: loc.lng });
        }
      });
    }

    if (destination && typeof destination === "object" && "lat" in destination) {
      points.push({ name: (destination as any).address || "Destination", lat: destination.lat, lon: destination.lng });
    }

    return points;
  }, [origin, destination, stops]);

  useEffect(() => {
    const fetchData = async () => {
      if (waypoints.length < 2) {
        setData(null);
        return;
      }
      try {
        const response = await polylineHelper({
          locations: waypoints,
          costing: "truck",
        });
        setData(response);
        
        if (response?.summary && onRouteInfoUpdate) {
           onRouteInfoUpdate({
             distanceKm: response.summary.length || 0,
             durationMin: Math.round((response.summary.time || 0) / 60)
           });
        }
      } catch (error) {
        console.error("Valhalla API Error:", error);
      }
    };

    fetchData();
  }, [waypoints, onRouteInfoUpdate]);

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <MapWithPolyline
        Polylines={data?.mapPoints || []}
        routePolyline={data?.polyline}
        vehicleLocation={
          vehicleLocation
            ? {
                lat: vehicleLocation.lat,
                lng: vehicleLocation.lng,
                name: vehicleLocation.name,
              }
            : null
        }
      />

      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          bgcolor: (theme) => theme.palette.background.midnight._alpha.main_80,
          backdropFilter: "blur(8px)",
          px: 1.5,
          py: 0.75,
          borderRadius: "8px",
          border: (theme) =>
            `1px solid ${theme.palette.common.white_alpha.main_10}`,
          zIndex: 1,
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          color="white"
          sx={{ letterSpacing: "0.05em" }}
        >
          {isRoute
            ? dict.routes.details.missionRoute
            : dict.routes.details.liveTelemetryMap}
        </Typography>
      </Box>
    </Box>
  );
};

export default MapRoutesDialogCard;
