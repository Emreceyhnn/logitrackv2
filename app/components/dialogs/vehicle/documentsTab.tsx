import {
    Box, Button, Card, Stack, Typography, Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import WarningIcon from '@mui/icons-material/Warning';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Vehicle } from "@/app/lib/type/VehicleType";

interface OverviewTabProps {
    vehicle?: Vehicle;
}

const DocumentsTab = ({ vehicle }: OverviewTabProps) => {
    if (!vehicle) {
        return <Typography color="text.secondary">No vehicle selected</Typography>;
    }



    return (
        <Stack spacing={2} direction={"row"} maxHeight={450} height={"100%"} justifyContent={"space-center"}>
            <Stack spacing={2}>
                <Stack spacing={2} direction={"row"}>
                    <Card sx={{ p: 2, borderRadius: "8px", maxWidth: 300, width: "100%", gap: 2 }}>
                        <Box sx={{ borderRadius: "8px", bgcolor: "success.main", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CheckCircleIcon sx={{ width: 18, height: 19, }} />
                        </Box>
                        <Typography sx={{ fontSize: 22 }}>Active</Typography>
                        <Typography sx={{ fontSize: 18, marginTop: "auto" }}>4</Typography>
                    </Card>
                    <Card sx={{ p: 2, borderRadius: "8px", maxWidth: 300, width: "100%", gap: 2 }}>
                        <Box sx={{ borderRadius: "8px", bgcolor: "warning.main", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <QueryBuilderIcon sx={{ width: 18, height: 19, }} />
                        </Box>
                        <Typography sx={{ fontSize: 22 }}>Expiring Soon</Typography>
                        <Typography sx={{ fontSize: 18, marginTop: "auto" }}>4</Typography>
                    </Card>
                </Stack>
                <Stack spacing={2} direction={"row"}>
                    <Card sx={{ p: 2, borderRadius: "8px", maxWidth: 300, width: "100%", gap: 2 }}>
                        <Box sx={{ borderRadius: "8px", bgcolor: "error.main", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <WarningIcon sx={{ width: 18, height: 19, }} />
                        </Box>
                        <Typography sx={{ fontSize: 22 }}>Missing / Expired</Typography>
                        <Typography sx={{ fontSize: 18, marginTop: "auto" }}>4</Typography>
                    </Card>
                    <Card sx={{ p: 2, borderRadius: "8px", maxWidth: 300, width: "100%", gap: 2 }}>
                        <Box sx={{ borderRadius: "8px", bgcolor: "info.main", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FileUploadIcon sx={{ width: 18, height: 19, }} />
                        </Box>
                        <Typography sx={{ fontSize: 22 }}>Last Upload</Typography>
                        <Typography sx={{ fontSize: 18, marginTop: "auto" }}>1 Oct 2025</Typography>
                    </Card>
                </Stack>
                <Button variant="contained" sx={{ borderRadius: "8px" }}>Upload New Document</Button>
            </Stack>
            <Stack >
                <Card sx={{ p: 2, borderRadius: "8px", gap: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Document Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Expiry Date</TableCell>
                                <TableCell>Download</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {vehicle.documents.map((v, index) => (
                                <TableRow key={index}>
                                    <TableCell ><Typography sx={{ fontSize: 12 }}>{v.type}</Typography></TableCell>
                                    <TableCell><Typography sx={{ fontSize: 12 }}>{v.status}</Typography></TableCell>
                                    <TableCell>{v.expiresOn}</TableCell>
                                    <TableCell align="center"><IconButton sx={{ bgcolor: "success.main" }}><FileUploadIcon sx={{ width: 15, height: 15 }} /></IconButton></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </Stack>
        </Stack >



    )
}



export default DocumentsTab;