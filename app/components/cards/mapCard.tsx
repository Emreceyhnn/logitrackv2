import CustomCard from "./card"
import GoogleMapView from "@/app/components/map"
import mockData from "@/app/lib/data.json";

const MapCard = () => {

    const warehouses = mockData.warehouses.map(i => { return ({ position: i.geo, name: i.name, id: i.id, type: "W" }) })
    const vehicles = mockData.vehicles.map(i => { return ({ position: i.telemetry.location, name: i.plate, id: i.id, type: "V" }) })
    const customers = mockData.customers.flatMap(i =>
        i.deliverySites.map(y => ({
            position: y.geo,
            name: y.name,
            type: "C",
            id: y.id
        }))
    )


    const values = [...warehouses, ...vehicles, ...customers]


    return (

        <CustomCard sx={{ flexGrow: 10, p: 2 }}>
            <GoogleMapView warehouseLoc={values} />
        </CustomCard>
    )
}


export default MapCard