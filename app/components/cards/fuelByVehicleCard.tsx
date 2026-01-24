import { Stack } from "@mui/material"
import CustomCard from "./card"
import { BarChart } from "@mui/x-charts"
import mockData from "@/app/lib/data.json";


const FuelByVehicleCard = () => {

    const values = mockData.vehicles.map(i => { return { value: i.fuel.consumptionLPer100Km, plate: i.plate, id: i.id } })

    return (

        <CustomCard>
            <Stack>
                <BarChart
                    xAxis={[{ data: values.map(i => i.plate) }]}
                    series={[{ data: values.map(i => i.value) }]}
                    height={300}

                />

            </Stack>
        </CustomCard>
    )
}


export default FuelByVehicleCard