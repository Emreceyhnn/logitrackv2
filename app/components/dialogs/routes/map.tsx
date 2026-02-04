import GoogleMapView from "@/app/components/map";
import mockData from "@/app/lib/mockData.json";
import CustomCard from "../../cards/card";
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
    // 1️⃣ Route
    const route = mockData.routes.find(r => r.id === routeId);

    // 2️⃣ Vehicles
    const vehicles: MapPoint[] = mockData.fleet
        .filter(v => v.assignedTo?.routeId === routeId)
        .map(v => ({
            position: v.currentStatus.location,
            name: v.plate,
            id: v.id,
            type: "V",
        }));

    // Simplified logic: Just show vehicle location for now as stops don't have refs in new mockData
    // Or we could infer from route origin/dest if available.
    // For now, let's keep it simple to avoid errors.
    const warehouses: MapPoint[] = []; 
    const customers: MapPoint[] = [];

    // 5️⃣ Final values
    const values: MapPoint[] = [...vehicles, ...warehouses, ...customers];

    return (
        <Stack spacing={1}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}>LIVE LOCATION</Typography>
            <Stack sx={{ width: "100%", height: 300, }}><GoogleMapView warehouseLoc={values} /></Stack>
        </Stack>
    );
};

export default MapRoutesDialogCard;
