import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { Box, Typography } from "@mui/material";
import { RouteMap } from "../../googleMaps/RouteMap";

interface MapRoutesDialogCardProps {
  origin?: string | { lat: number; lng: number };
  destination?: string | { lat: number; lng: number };
  waypoints?: Array<{
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
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  onRouteInfoUpdate?: (data: {
    distanceKm: number;
    durationMin: number;
  }) => void;
}

import { useDictionary } from "@/app/lib/language/DictionaryContext";

const MapRoutesDialogCard = ({
  origin,
  destination,
  waypoints,
  addrA,
  addrB,
  vehicleLocation,
}: MapRoutesDialogCardProps) => {
  const dict = useDictionary();
  const isRoute = !!((origin || addrA) && (destination || addrB));

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <GoogleMapsProvider>
        <RouteMap
          origin={
            typeof origin === "object" && origin !== null && "lat" in origin
              ? origin
              : { lat: 0, lng: 0 }
          }
          destination={
            typeof destination === "object" &&
            destination !== null &&
            "lat" in destination
              ? destination
              : { lat: 0, lng: 0 }
          }
          stops={waypoints
            ?.map((w) => w.location)
            .filter(
              (loc): loc is { lat: number; lng: number } =>
                typeof loc === "object" && loc !== null && "lat" in loc
            )}
          markers={
            vehicleLocation
              ? [
                  {
                    id: vehicleLocation.id,
                    position: {
                      lat: vehicleLocation.lat,
                      lng: vehicleLocation.lng,
                    },
                    type: "vehicle",
                    label: vehicleLocation.name,
                  },
                ]
              : []
          }
        />
      </GoogleMapsProvider>

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
