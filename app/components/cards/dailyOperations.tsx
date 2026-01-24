import { Divider, List, ListItem, Stack, Typography } from "@mui/material"
import CustomCard from "./card"
import DirectionsIcon from '@mui/icons-material/Directions';
import PlaceIcon from '@mui/icons-material/Place';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';


const DailyOperationsCard = () => {


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
                            p: 0
                        }}
                    >
                        <DirectionsIcon sx={{ fontSize: 20 }} />
                        <Typography sx={{ fontSize: 16 }}>Planned Routes:</Typography>
                        <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>132</Typography>
                    </ListItem>
                    <ListItem
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            gap: 1,
                            padding: "20px 0px"
                        }}
                    >
                        <PlaceIcon sx={{ fontSize: 20 }} />
                        <Typography sx={{ fontSize: 16 }}>Stocks Completed:</Typography>
                        <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>132</Typography>
                    </ListItem>
                    <ListItem
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            gap: 1,
                            p: 0
                        }}
                    >
                        <DirectionsIcon sx={{ fontSize: 20, color: "red" }} />
                        <Typography sx={{ fontSize: 16 }}>Failed Deliveries:</Typography>
                        <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>132</Typography>
                    </ListItem>
                </List>

            </Stack>

        </CustomCard>
    )
}

export default DailyOperationsCard