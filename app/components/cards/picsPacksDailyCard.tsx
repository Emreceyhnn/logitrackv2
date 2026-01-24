import { Stack, Typography } from "@mui/material"
import CustomCard from "./card"
import mockData from "@/app/lib/data.json";

const PicksPacksDailyCard = () => {

    const picks = mockData.inventory.movements.map(i => i.type === "PICK").length
    const packs = mockData.inventory.movements.map(i => i.type === "PACKS").length




    return (
        <CustomCard>
            <Stack>
                <Typography>Today&apos;s Picks/Packs</Typography>
                <Stack alignItems={"center"} justifyContent={"space-between"} direction={"row"}>
                    <Typography>Picks:</Typography>
                    <Typography>{picks}</Typography>
                </Stack>

                <Stack alignItems={"center"} justifyContent={"space-between"} direction={"row"}>
                    <Typography>Packs:</Typography>
                    <Typography>{packs}</Typography>
                </Stack>
            </Stack>
        </CustomCard>
    )
}

export default PicksPacksDailyCard