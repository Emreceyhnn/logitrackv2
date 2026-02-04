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
import mockData from "@/app/lib/mockData.json";
import RowActions from "./menu";
import ShipmentDetailDialog from "../../../dialogs/shipment/shipmentDetailDialog";
import { useState } from "react";
import { Shipment } from "@/app/lib/type/ShipmentType";
import { StatusChip } from "@/app/components/chips/statusChips";
import { PriorityChip } from "@/app/components/chips/priorityChips";


const ShipmentTable = () => {

    const [open, setOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | undefined>(undefined);


    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = (id: string) => {
        const shipment = mockData.shipments.find(s => s.id === id);
        if (!shipment) return;

        setSelectedShipment(shipment as Shipment);
        setOpen(true);
    };


    return (
        <>
            <CustomCard sx={{ padding: "0 0 6px 0" }}>
                <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
                    Shipment List
                </Typography>
                <Divider />


                <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Code</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Pickup (Planned)</TableCell>
                                <TableCell>Dropoff (Planned)</TableCell>
                                <TableCell>Driver</TableCell>
                                <TableCell>Route</TableCell>
                                <TableCell align="right">Cargo Kg</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {mockData.shipments.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.orderNumber}</TableCell>
                                    <TableCell><StatusChip status={s.status} /></TableCell>
                                    <TableCell><PriorityChip status={s.priority} /></TableCell>
                                    <TableCell>{new Date(s.dates.created)?.toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(s.dates.requestedDelivery)?.toLocaleDateString()}</TableCell>
                                    <TableCell>{s.assignedTo?.routeId || '-'}</TableCell>
                                    <TableCell>{s.assignedTo?.routeId || '-'}</TableCell>
                                    <TableCell align="right">
                                        {s.cargoDetails.totalWeightKg}
                                    </TableCell>
                                    <TableCell align="right">
                                        <RowActions id={s.id} handleOpenDetails={handleOpen} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CustomCard>
            <ShipmentDetailDialog open={open} onClose={handleClose} shipmentData={selectedShipment} />
        </>
    );
};

export default ShipmentTable;
