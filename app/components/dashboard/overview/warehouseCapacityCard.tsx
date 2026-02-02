import { Divider, LinearProgress, Stack, Typography } from "@mui/material"
import CustomCard from "../../cards/card"
import mockData from "@/app/lib/data.json";

const WarehouseCapacityCard = () => {



    const values = mockData.warehouses.map(i => { return { warehouseName: i.name, warehouseId: i.id, capacity: (i.capacity.usedPallets / i.capacity.maxPallets) * 100, volume: (i.capacity.usedVolumeM3 / i.capacity.maxVolumeM3) * 100 } })




    return (
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
                Warehouse
            </Typography>
            <Divider />
            <Stack spacing={1} p={2}>
                {
                    values.map((i, index) => (
                        <Stack key={index} spacing={1}>
                            <Typography fontWeight={600}>{i.warehouseName}</Typography>
                            <LinearProgress value={i.capacity} variant="determinate" sx={{
                                bgcolor: "background.dashboardBg",
                                borderRadius: "8px",
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: "8px",
                                    backgroundColor: `${i.capacity > 85 ? "#ef4444" : i.capacity > 60 ? "#f59e0b" : "#22c55e"}`,
                                },
                            }} />
                        </Stack>
                    ))


                }



            </Stack>
        </CustomCard>
    )
}


export default WarehouseCapacityCard