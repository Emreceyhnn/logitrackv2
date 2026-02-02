import { Box } from "@mui/material"
import GoogleMapView from "@/app/components/map"
import mockData from "@/app/lib/data.json";

const RoutesMainMap = () => {

    const vehicles = mockData.routes
        .map(r => mockData.vehicles.find(v => v.id === r.vehicleId))
        .filter((v): v is typeof mockData.vehicles[0] => v !== undefined)
        .map(v => {
            return ({ position: v.telemetry.location, name: v.plate, id: v.id, type: "V" })
        })

    return (
        <Box sx={{ minHeight: 400, flexGrow: 3 }}>
            <GoogleMapView warehouseLoc={vehicles} />
        </Box>
    )


}


export default RoutesMainMap