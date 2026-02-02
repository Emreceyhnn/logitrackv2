
import RoutesKpiCard from "@/app/components/dashboard/routes/routesKpiCard";
import RoutesMainMap from "@/app/components/dashboard/routes/routesMainMap";
import RouteEfficiency from "@/app/components/dashboard/routes/routeEfficiency";
import RouteTable from "@/app/components/dashboard/routes/routeTable";
import { Box, Divider, Stack, Typography } from "@mui/material";



export default function RoutesPage() {



    return (
        <Box position={"relative"} p={4} width={"100%"}>
            <Typography sx={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-2%"
            }}>Routes</Typography>
            <Divider />
            <RoutesKpiCard />
            <Stack mt={2} direction={"row"} spacing={3}>
                <RoutesMainMap />
                <RouteEfficiency />
            </Stack>
            <Stack mt={2}>
                <RouteTable />
            </Stack>
        </Box>
    )
}