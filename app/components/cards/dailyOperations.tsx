import { Divider, List, ListItem, Stack, Typography } from "@mui/material"
import CustomCard from "./card"
import DirectionsIcon from '@mui/icons-material/Directions';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import mockData from "@/app/lib/data.json";

const DailyOperationsCard = () => {

    const values = mockData.overview.today


    return (
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
                Today&apos;s Operations
            </Typography>
            <Divider />
            <Stack p={2}>
                <List sx={{ gap: 1 }}>
                    <ListItem
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            gap: 1,
                            padding: "10px 0px"
                        }}
                    >
                        <DirectionsIcon sx={{ fontSize: 20 }} />
                        <Typography sx={{ fontSize: 16 }}>Planned Routes:</Typography>
                        <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{values.plannedRoutes}</Typography>
                    </ListItem>
                    <ListItem
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            gap: 1,
                            padding: "10px 0px"
                        }}
                    >
                        <PlaceIcon sx={{ fontSize: 20 }} />
                        <Typography sx={{ fontSize: 16 }}>Completed Deliveries:</Typography>
                        <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{values.completedDeliveries}</Typography>
                    </ListItem>
                    <ListItem
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            gap: 1,
                            padding: "10px 0px"
                        }}
                    >
                        <DirectionsIcon sx={{ fontSize: 20, color: "red" }} />
                        <Typography sx={{ fontSize: 16, color: "red" }}>Failed Deliveries:</Typography>
                        <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{values.failedDeliveries}</Typography>
                    </ListItem>
                    <ListItem
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            gap: 1,
                            padding: "10px 0px"
                        }}
                    >
                        <AccessTimeIcon sx={{ fontSize: 20, }} />
                        <Typography sx={{ fontSize: 16 }}>Average Delivery Time Min:</Typography>
                        <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{values.avgDeliveryTimeMin}</Typography>
                    </ListItem>
                    <ListItem
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            gap: 1,
                            padding: "10px 0px"
                        }}
                    >
                        <LocalGasStationIcon sx={{ fontSize: 20, }} />
                        <Typography sx={{ fontSize: 16 }}>Fuel Consumed Liters:</Typography>
                        <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{values.fuelConsumedLiters}</Typography>
                    </ListItem>
                </List>

            </Stack>

        </CustomCard>
    )
}

export default DailyOperationsCard