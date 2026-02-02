
import ActionRequiredCard from "@/app/components/dashboard/overview/actionRequiredCard";
import { Box, Divider, Stack, Typography } from "@mui/material";
import DailyOperationsCard from "../../../components/dashboard/overview/dailyOperations";
import FuelByVehicleCard from "@/app/components/dashboard/overview/fuelByVehicleCard";
import WarehouseCapacityCard from "@/app/components/dashboard/overview/warehouseCapacityCard";
import AlertInventoryCard from "@/app/components/dashboard/overview/inventoryCard";
import ShipmentOnStatusCard from "@/app/components/dashboard/overview/shipmentsByStatusCard";
import PicksPacksDailyCard from "@/app/components/dashboard/overview/picsPacksDailyCard";
import OnTimeTrendsCard from "@/app/components/dashboard/overview/onTimeTrends";
import OverviewKpiCard from "@/app/components/dashboard/overview/overviewKpiCard";
import OverviewMapCard from "@/app/components/dashboard/overview/overViewMapCard";





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
                <OverviewMapCard />

            </Stack>
            <Stack mt={2}>
                <OnTimeTrendsCard />
            </Stack>

        </Box>
    )
}