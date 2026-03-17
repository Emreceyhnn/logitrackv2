import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/system";
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

const MapRoutesDialogCard = ({
  origin,
  destination,
  addrA,
  addrB,
  vehicleLocation,
  onRouteInfoUpdate,
}: MapRoutesDialogCardProps) => {
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
          bgcolor: alpha("#0B1019", 0.8),
          backdropFilter: "blur(8px)",
          px: 1.5,
          py: 0.75,
          borderRadius: "8px",
          border: `1px solid ${alpha("#fff", 0.1)}`,
          zIndex: 1,
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          color="white"
          sx={{ letterSpacing: "0.05em" }}
        >
          {isRoute ? "MISSION ROUTE" : "LIVE TELEMETRY MAP"}
        </Typography>
      </Box>
    </Box>
  );
};

export default MapRoutesDialogCard;
