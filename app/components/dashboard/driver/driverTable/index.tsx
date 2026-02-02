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
    Chip,
} from "@mui/material";
import CustomCard from "../../../cards/card";
import mockData from "@/app/lib/data.json";
import RowActions from "./menu";
import { useState } from "react";
import DriverDialog from "../../../dialogs/driver";
import { Driver } from "@/app/lib/type/DriverType";
import { StatusChip } from "@/app/components/chips/statusChips";

const DriverTable = () => {

    const [open, setOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>(undefined);


    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = (id: string) => {
        const driver = mockData.drivers.find(d => d.id === id);
        if (!driver) return;

        setSelectedDriver(driver as unknown as Driver);
        setOpen(true);
    };


    return (
        <>
            <CustomCard sx={{ padding: "0 0 6px 0" }}>
                <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
                    Driver List
                </Typography>
                <Divider />


                <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Home Base</TableCell>
                                <TableCell>Licenses</TableCell>
                                <TableCell align="right">Rating</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {mockData.drivers.map((d, index) => (
                                <TableRow key={d.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{d.fullName}</TableCell>
                                    <TableCell>
                                        <StatusChip status={d.status} />
                                    </TableCell>
                                    <TableCell>{d.phone}</TableCell>
                                    <TableCell>{d.homeBaseWarehouseId}</TableCell>
                                    <TableCell>{d.licenses.map(l => l.type).join(", ")}</TableCell>
                                    <TableCell align="right">
                                        {d.rating.avg} ({d.rating.count})
                                    </TableCell>
                                    <TableCell align="right">
                                        <RowActions id={d.id} handleOpenDetails={handleOpen} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CustomCard>
            <DriverDialog open={open} onClose={handleClose} driverData={selectedDriver} />
        </>
    );
};

export default DriverTable;
