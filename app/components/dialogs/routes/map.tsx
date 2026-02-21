import GoogleMapView from "@/app/components/map";
import { Stack, Typography } from "@mui/material";

interface MapRoutesDialogCardProps {
  routeId?: string;
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
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
  routeId,
  origin,
  destination,
  vehicleLocation,
  onMapClick,
}: MapRoutesDialogCardProps) => {
  const vehicles: MapPoint[] = vehicleLocation
    ? [
        {
          position: { lat: vehicleLocation.lat, lng: vehicleLocation.lng },
          name: vehicleLocation.name,
          id: vehicleLocation.id,
          type: "V",
        },
      ]
    : [];

  const warehouses: MapPoint[] = [];
  const customers: MapPoint[] = [];

  const values: MapPoint[] = [...vehicles, ...warehouses, ...customers];

  // If origin/destination provided, we add them to values as well for markers
  if (origin) {
    values.push({ position: origin, name: "Origin", id: "origin", type: "W" });
  }
  if (destination) {
    values.push({
      position: destination,
      name: "Destination",
      id: "dest",
      type: "C",
    });
  }

  const isRoute = !!(origin && destination);

  // Calculate waypoints (Vehicle position)
  const waypoints = vehicleLocation
    ? [
        {
          location: { lat: vehicleLocation.lat, lng: vehicleLocation.lng },
          stopover: true,
        },
      ]
    : [];

  return (
    <Stack spacing={1}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}
      >
        {isRoute ? "ROUTE PREVIEW" : "LIVE LOCATION"}
      </Typography>
      <Stack sx={{ width: "100%", height: 300 }}>
        <GoogleMapView
          warehouseLoc={values}
          isRoute={isRoute}
          locA={origin}
          locB={destination}
          waypoints={waypoints}
          onClick={onMapClick}
        />
      </Stack>
    </Stack>
  );
};

export default MapRoutesDialogCard;
