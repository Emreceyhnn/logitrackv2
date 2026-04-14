import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { Box, Typography, useTheme } from "@mui/material";
import { DirectionsMap } from "../../googleMaps/DirectionsMap";

interface MapRoutesDialogCardProps {
  origin?: string | { lat: number; lng: number };
  destination?: string | { lat: number; lng: number };
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
  addrA,
  addrB,
  onRouteInfoUpdate,
}: MapRoutesDialogCardProps) => {
  const theme = useTheme();
  const dict = useDictionary();
  const isRoute = !!((origin || addrA) && (destination || addrB));

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <GoogleMapsProvider>
        <DirectionsMap
          origin={origin}
          destination={destination}
          onRouteInfoUpdate={onRouteInfoUpdate}
        />
      </GoogleMapsProvider>

      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          bgcolor: (theme.palette.background as any).midnight._alpha.main_80,
          backdropFilter: "blur(8px)",
          px: 1.5,
          py: 0.75,
          borderRadius: "8px",
          border: `1px solid ${(theme.palette.common as any).white_alpha.main_10}`,
          zIndex: 1,
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          color="white"
          sx={{ letterSpacing: "0.05em" }}
        >
          {isRoute ? dict.routes.details.missionRoute : dict.routes.details.liveTelemetryMap}
        </Typography>
      </Box>
    </Box>
  );
};

export default MapRoutesDialogCard;
