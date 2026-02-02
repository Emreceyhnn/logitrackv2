import GoogleMapView from "@/app/components/map";
import mockData from "@/app/lib/data.json";
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
    const vehicles: MapPoint[] = mockData.vehicles
        .filter(v => v.assigned.routeId === routeId)
        .map(v => ({
            position: v.telemetry.location,
            name: v.plate,
            id: v.id,
            type: "V",
        }));

    // 3️⃣ Warehouses (unique)
    const warehouseIds = route
        ? Array.from(
            new Set(
                route.stops
                    .map(s => s.ref.warehouseId)
                    .filter((id): id is string => Boolean(id))
            )
        )
        : [];

    const warehouses: MapPoint[] = mockData.warehouses
        .filter(w => warehouseIds.includes(w.id))
        .map(w => ({
            position: w.geo,
            name: w.name,
            id: w.id,
            type: "W",
        }));

    // 4️⃣ Customers (DELIVERY)
    const deliveryRefs =
        route?.stops
            .filter(s => s.type === "DELIVERY")
            .map(s => ({
                customerId: s.ref.customerId,
                siteId: s.ref.siteId,
            }))
            .filter(
                (r): r is { customerId: string; siteId: string } =>
                    Boolean(r.customerId && r.siteId)
            ) ?? [];

    const customers: MapPoint[] = mockData.customers.flatMap(c =>
        c.deliverySites
            .filter(site =>
                deliveryRefs.some(
                    r => r.customerId === c.id && r.siteId === site.id
                )
            )
            .map(site => ({
                position: site.geo,
                name: site.name,
                id: site.id,
                type: "C",
            }))
    );

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
