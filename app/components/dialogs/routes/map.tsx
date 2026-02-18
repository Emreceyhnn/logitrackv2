import GoogleMapView from "@/app/components/map";
import mockData from "@/app/lib/mockData.json";
import { Stack, Typography } from "@mui/material";

interface MapRoutesDialogCardProps {
  routeId?: string;
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
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
  onMapClick,
}: MapRoutesDialogCardProps) => {
  const vehicles: MapPoint[] = routeId
    ? mockData.fleet
        .filter((v) => v.assignedTo?.routeId === routeId)
        .map((v) => ({
          position: v.currentStatus.location,
          name: v.plate,
          id: v.id,
          type: "V",
        }))
    : [];

  console.log(origin, destination);

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
  const waypoints = routeId
    ? mockData.fleet
        .filter(
          (v) =>
            v.assignedTo?.routeId === routeId &&
            v.currentStatus.location &&
            v.currentStatus.location.lat &&
            v.currentStatus.location.lng
        )
        .map((v) => ({
          location: v.currentStatus.location,
          stopover: true,
        }))
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
