import {
    Box, Button, Card, Stack, Typography, Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Divider,
} from "@mui/material"
import { Vehicle } from "@/app/lib/type/VehicleType";
import BuildIcon from '@mui/icons-material/Build';
import { PriorityChip } from "../../chips/priorityChips";

interface OverviewTabProps {
    vehicle?: Vehicle;
}

const MaintenanceTab = ({ vehicle }: OverviewTabProps) => {
    if (!vehicle) {
        return <Typography color="text.secondary">No vehicle selected</Typography>;
    }

    const maintenanceHistory = (vehicle.maintenance.history || []).slice(-4);

    return (
        <Stack spacing={2} maxHeight={750}>
            <Stack spacing={2} direction={"row"} justifyContent={"space-between"}>
                <Card sx={{ boxShadow: 3, p: 2, flex: 1, gap: 1, display: "flex", flexDirection: "column", borderRadius: "8px", justifyContent: "space-evenly" }}>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Typography sx={{ fontSize: 16, fontWeight: 300 }}>
                            Next Service
                        </Typography>
                        <BuildIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                    </Stack>
                    <Typography sx={{ fontSize: 24, fontWeight: 800 }}>{(vehicle.maintenance.nextServiceKm - vehicle.currentStatus.odometerKm)} km</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}>left until next scheduled service</Typography>
                    <Divider sx={{ color: "text.disabled" }} />
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}>ESTIMATED DATE</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 300, color: "info.main" }}>{vehicle.maintenance.nextServiceDate}</Typography>
                    </Stack>
                </Card>
                <Card sx={{ boxShadow: 3, p: 2, flex: 2, borderRadius: "8px" }}>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                            Open Issues
                        </Typography>
                        <Button variant="contained" sx={{ color: "#fff", boxShadow: 3 }}>
                            + Report Issue
                        </Button>
                    </Stack>
                    <Stack maxHeight={190} overflow={"auto"}>
                        {
                            (vehicle.maintenance.openIssues || []).map((i, index) => (
                                <Card key={index} sx={{ mt: 2, p: 2, borderRadius: "8px", bgcolor: "background.dashboardBg", alignItems: "center", display: "flex", gap: 2, minHeight: 80 }}>
                                    <Box sx={{ height: 10, width: 10, borderRadius: "50%", bgcolor: "error.main" }} />
                                    <Stack>
                                        <Typography sx={{ fontSize: 16, fontWeight: 400 }}>Brake Pads Wear</Typography>
                                        <Typography sx={{ fontSize: 12, fontWeight: 200, color: "text.secondary" }}>Reported on {i.createdAt}</Typography>
                                    </Stack>
                                    <PriorityChip status={i.severity} />
                                </Card>
                            ))
                        }
                    </Stack>
                </Card >
            </Stack >
            <Stack>
                <Card sx={{ boxShadow: 3, p: 2, flex: 1, borderRadius: "8px" }}>

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">DATE</TableCell>
                                <TableCell align="left">SERVICE TYPE</TableCell>
                                <TableCell align="left">TECHNICIAN</TableCell>
                                <TableCell align="left">COST</TableCell>
                                <TableCell align="left">STATUS</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {maintenanceHistory.map((v, index) => (
                                <TableRow key={index}>
                                    <TableCell align="left"><Typography sx={{ fontSize: 12 }}>{new Date(v.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: '2-digit',
                                        year: 'numeric'
                                    })}</Typography></TableCell>
                                    <TableCell align="left"><Typography sx={{ fontSize: 12 }}>{v.serviceType}</Typography></TableCell>
                                    <TableCell align="left">{v.technician}</TableCell>
                                    <TableCell align="left">{`${v.cost} ${v.currency}`}</TableCell>
                                    <TableCell align="left"><Box sx={{ padding: "6px 1px", borderRadius: "35px", bgcolor: "success.main", textAlign: "center" }}><Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{v.status}</Typography></Box></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </Card>
            </Stack>
        </Stack>
    )
}



export default MaintenanceTab;