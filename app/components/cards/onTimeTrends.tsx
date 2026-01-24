import mockData from "@/app/lib/data.json";
import CustomCard from "./card";
import { Stack } from "@mui/material";
import { LineChart } from "@mui/x-charts";


const OnTimeTrendsCard = () => {

    const values = mockData.analytics.charts.onTimeTrend



    return (
        <CustomCard>
            <Stack>
                <LineChart
                    xAxis={[{ scaleType: "band", data: values.map(i => i.date) }]}
                    series={[
                        {
                            data: values.map(i => i.value),
                            area: false,
                        },
                    ]}
                    height={300}
                />
            </Stack>
        </CustomCard>
    )
}



export default OnTimeTrendsCard