import { Avatar, Button, Stack, Typography } from "@mui/material"
import CustomCard from "./card"
import { Driver } from "@/app/lib/type/DriverType"
import CustomRating from "../rating"
import ChatIcon from '@mui/icons-material/Chat';




const DriverCard = (params: Driver | null) => {


    return (
        <CustomCard >
            <Stack spacing={2} p={2}>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <Avatar sx={{ width: 54, height: 54 }} />
                    <Stack spacing={1}>
                        <Stack direction={"row"} spacing={1}>
                            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{params?.fullName ?? ""}</Typography>
                            <CustomRating value={3.5} />
                        </Stack>
                        <Stack direction={"row"} spacing={1}>
                            <Typography sx={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,1)", bgcolor: "info.main", textAlign: "center", borderRadius: "3px" }}>{params?.id ?? ""}</Typography>
                            <Stack direction={"row"}>
                                <Typography sx={{ fontSize: 12, fontWeight: 400 }}>
                                    {params?.licenses.map(l => l.type).join(" - ")}
                                </Typography>

                            </Stack>

                        </Stack>
                    </Stack>

                </Stack>
                <Button variant="contained" sx={{ gap: 1, alignItems: "center", display: "flex", }}><ChatIcon sx={{ width: 18, height: 18 }} />Contact Driver</Button></Stack>

        </CustomCard>
    )

}



export default DriverCard