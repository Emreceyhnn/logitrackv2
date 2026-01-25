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
import CustomCard from "../card";
import mockData from "@/app/lib/data.json";
import RowActions from "./menu";

const VehicleTable = () => {
    return (
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
                                <TableCell>{v.status}</TableCell>
                                <TableCell>{v.odometerKm}</TableCell>
                                <TableCell>{v.assigned.driverId ?? "No Assigned"}</TableCell>
                                <TableCell sx={{ color: v.telemetry.ignitionOn ? "success.main" : "error.main" }}>{v.telemetry.ignitionOn.toString()}</TableCell>
                                <TableCell align="right">
                                    {v.fuel.consumptionLPer100Km}
                                </TableCell>
                                <TableCell align="right">
                                    <RowActions />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </CustomCard>
    );
};

export default VehicleTable;
