"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Divider,
} from "@mui/material";
import CustomCard from "../../../cards/card";
import mockData from "@/app/lib/data.json";
import RowActions from "./menu";
import VehicleDialog from "../../../dialogs/vehicle";
import { useState } from "react";
import { Vehicle } from "@/app/lib/type/VehicleType";
import { StatusChip } from "@/app/components/chips/statusChips";

const VehicleTable = () => {

    const [open, setOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);


    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = (id: string) => {
        const vehicle = mockData.vehicles.find(v => v.id === id);
        if (!vehicle) return;

        setSelectedVehicle(vehicle);
        setOpen(true);
    };


    return (
        <>
            <CustomCard sx={{ padding: "0 0 6px 0" }}>
                <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
                    Vehicle List
                </Typography>
                <Divider />


                <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Plate</TableCell>
                                <TableCell>Brand/Model</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Odometer</TableCell>
                                <TableCell>Driver</TableCell>
                                <TableCell>Ignition</TableCell>
                                <TableCell align="right">Fuel (L/100km)</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {mockData.vehicles.map((v, index) => (
                                <TableRow key={v.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{v.plate}</TableCell>
                                    <TableCell>{`${v.brand} - ${v.model} / ${v.year}`}</TableCell>
                                    <TableCell><StatusChip status={v.status} /></TableCell>
                                    <TableCell>{v.odometerKm}</TableCell>
                                    <TableCell>{v.assigned.driverId ?? "No Assigned"}</TableCell>
                                    <TableCell sx={{ color: v.telemetry.ignitionOn ? "success.main" : "error.main" }}>{v.telemetry.ignitionOn.toString()}</TableCell>
                                    <TableCell align="right">
                                        {v.fuel.consumptionLPer100Km}
                                    </TableCell>
                                    <TableCell align="right">
                                        <RowActions id={v.id} handleOpenDetails={handleOpen} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CustomCard>
            <VehicleDialog open={open} onClose={handleClose} vehicleData={selectedVehicle} />
        </>
    );
};

export default VehicleTable;
