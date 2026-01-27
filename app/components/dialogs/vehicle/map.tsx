
import GoogleMapView from "@/app/components/map"
import mockData from "@/app/lib/data.json";
import CustomCard from "../../cards/card";

const MapVehicleOverviewCard = () => {


    const vehicles = mockData.vehicles.map(i => { return ({ position: i.telemetry.location, name: i.plate, id: i.id, type: "V" }) })
    const values = [...vehicles,]


    return (

        <CustomCard sx={{ flexGrow: 1, padding: 0 }}>
            <GoogleMapView warehouseLoc={values} />
        </CustomCard>
    )
}


export default MapVehicleOverviewCard