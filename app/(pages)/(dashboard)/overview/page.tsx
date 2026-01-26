
import ActionRequiredCard from "@/app/components/cards/actionRequiredCard";
import { Box, Divider, Stack, Typography } from "@mui/material";
import DailyOperationsCard from "../../../components/cards/dailyOperations";
import FuelByVehicleCard from "@/app/components/cards/fuelByVehicleCard";
import WarehouseCapacityCard from "@/app/components/cards/warehouseCapacityCard";
import AlertInventoryCard from "@/app/components/cards/inventoryCard";
import ShipmentOnStatusCard from "@/app/components/cards/shipmentsByStatusCard";
import PicksPacksDailyCard from "@/app/components/cards/picsPacksDailyCard";
import MapCard from "@/app/components/cards/mapCard";
import OnTimeTrendsCard from "@/app/components/cards/onTimeTrends";
import OverviewKpiCard from "@/app/components/cards/kpi/overviewKpiCard";





export default function OverviewPage() {







    return (
        <Box position={"relative"} p={4} width={"100%"}>
            <Typography sx={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-2%"
            }}>Overview</Typography>
            <Divider />
            <OverviewKpiCard />
            <Stack direction={"row"} spacing={2} mt={2}>
                <ActionRequiredCard />
                <DailyOperationsCard />
                <FuelByVehicleCard />
                <Stack justifyContent={"space-between"} sx={{ flexGrow: 1 }}>
                    <WarehouseCapacityCard />
                    <AlertInventoryCard />
                </Stack>
            </Stack>
            <Stack mt={2} direction={"row"} spacing={2}>
                <Stack spacing={2} flexGrow={1}>
                    <ShipmentOnStatusCard />
                    <PicksPacksDailyCard />
                </Stack>
                <MapCard />

            </Stack>
            <Stack mt={2}>
                <OnTimeTrendsCard />
            </Stack>

        </Box>
    )
}