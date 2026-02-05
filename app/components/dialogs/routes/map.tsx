import GoogleMapView from "@/app/components/map";
import mockData from "@/app/lib/mockData.json";
import { Stack, Typography } from "@mui/material";

interface MapRoutesDialogCardProps {
  routeId: string;
}

type MapPointType = "V" | "W" | "C";

interface MapPoint {
  position: { lat: number; lng: number };
  name: string;
  id: string;
  type: MapPointType;
}

const MapRoutesDialogCard = ({ routeId }: MapRoutesDialogCardProps) => {
  const vehicles: MapPoint[] = mockData.fleet
    .filter((v) => v.assignedTo?.routeId === routeId)
    .map((v) => ({
      position: v.currentStatus.location,
      name: v.plate,
      id: v.id,
      type: "V",
    }));

  const warehouses: MapPoint[] = [];
  const customers: MapPoint[] = [];

  const values: MapPoint[] = [...vehicles, ...warehouses, ...customers];

  return (
    <Stack spacing={1}>
      <Typography
        sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}
      >
        LIVE LOCATION
      </Typography>
      <Stack sx={{ width: "100%", height: 300 }}>
        <GoogleMapView warehouseLoc={values} />
      </Stack>
    </Stack>
  );
};

export default MapRoutesDialogCard;
