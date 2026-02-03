
import { Divider, Stack, Typography } from "@mui/material"
import CustomCard from "../../cards/card"
import { getPicksAndPacks } from "@/app/lib/analyticsUtils";

const PicksPacksDailyCard = () => {

    const { picks, packs } = getPicksAndPacks()




    return (

        <CustomCard sx={{ padding: "0 0 6px 0" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
                Today&apos;s Picks / Packs
            </Typography>
            <Divider />
            <Stack p={2} spacing={1}>
                <Stack alignItems={"center"} justifyContent={"space-between"} direction={"row"} >
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