
import ActionRequiredCard from "@/app/components/cards/actionRequiredCard";
import KpiCard from "@/app/components/cards/kpiCard";
import { Box, Divider, Stack, Typography } from "@mui/material";





export default function OverviewPage() {




    return (
        <Box position={"relative"} p={4} width={"100%"}>
            <Typography sx={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-2%"
            }}>Overview</Typography>
            <Divider />
            <KpiCard />
            <Stack direction={"row"} spacing={2} p={1} mt={2}>
                <ActionRequiredCard />
            </Stack>



        </Box>
    )
}