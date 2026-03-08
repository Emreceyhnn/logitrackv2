import GoogleMapView from "@/app/components/map";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/system";

interface MapRoutesDialogCardProps {
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  addrA?: string;
  addrB?: string;
  vehicleLocation?: {
    lat: number;
    lng: number;
    name: string;
    id: string;
  } | null;
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
}

type MapPointType = "V" | "W" | "C";

interface MapPoint {
  position: { lat: number; lng: number };
  name: string;
  id: string;
  type: MapPointType;
}

const MapRoutesDialogCard = ({
  origin,
  destination,
  addrA,
  addrB,
  vehicleLocation,
  onMapClick,
}: MapRoutesDialogCardProps) => {
  const values: MapPoint[] = [];

  // Add Origin (Warehouse style)
  if (origin) {
    values.push({
      position: origin,
      name: "Origin Point",
      id: "origin",
      type: "W",
    });
  }

  // Add Destination (Customer style)
  if (destination) {
    values.push({
      position: destination,
      name: "Final Destination",
      id: "dest",
      type: "C",
    });
  }

  // Add Vehicle Location if active
  if (vehicleLocation) {
    values.push({
      position: { lat: vehicleLocation.lat, lng: vehicleLocation.lng },
      name: `Vehicle: ${vehicleLocation.name}`,
      id: vehicleLocation.id,
      type: "V",
    });
  }

  const isRoute = !!((origin || addrA) && (destination || addrB));

  // If vehicle is live, it's a waypoint on the route to show current progress path
  const waypoints = vehicleLocation
    ? [
        {
          location: { lat: vehicleLocation.lat, lng: vehicleLocation.lng },
          stopover: true,
        },
      ]
    : [];

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <GoogleMapView
        warehouseLoc={values}
        isRoute={isRoute}
        locA={origin}
        locB={destination}
        addrA={addrA}
        addrB={addrB}
        waypoints={waypoints}
        onClick={onMapClick}
      />

      {/* Premium overlay for Map Label */}
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
