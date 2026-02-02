"use client";

import { Box, Divider, Stack, Typography } from "@mui/material";
import CustomDialog from "../customDialog";
import { Route } from "@/app/lib/type/RoutesType";
import DriverCard from "../../cards/driverCard";
import MockData from "@/app/lib/data.json"
import MapRoutesDialogCard from "./map";
import RouteProgress from "./proggress";
import RoutesTelemetryCards from "./telemetry";



interface RoutesDialogParams {
    open: boolean;
    onClose: () => void;
    routeData?: Route;
}




const RoutesDialog = (params: RoutesDialogParams) => {
    const { open, onClose, routeData } = params;



    const driver = MockData.drivers.find(
        i => i.id === routeData?.driverId
    ) ?? null


    return (
        <CustomDialog open={open} onClose={onClose} maxWidthData="sm">
            <Stack p={2}>
                <Typography sx={{ fontSize: 24, fontWeight: 600 }}>Route #{routeData?.id} Overview</Typography>
                <Stack alignItems={"center"} spacing={1} direction={"row"}><Box sx={{ width: 10, height: 10, bgcolor: "success.main", borderRadius: "50%" }} /><Typography sx={{ fontSize: 14, fontWeight: 600, color: "success.main" }}>{routeData?.status} - ON TIME</Typography></Stack>
            </Stack>

            <Divider />
            <Stack p={2} spacing={2}>
                {driver && <DriverCard {...driver} />}
                <Divider />
                <MapRoutesDialogCard routeId={routeData?.id ?? ""} />
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <RouteProgress routeData={routeData} />
                    <RoutesTelemetryCards routeId={routeData?.id ?? ""} />
                </Stack>

            </Stack>
        </CustomDialog>
    );
};

export default RoutesDialog;
