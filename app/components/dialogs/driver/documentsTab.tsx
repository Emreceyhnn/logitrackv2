import {
    Box, Button, Card, Stack, Typography, Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Driver } from "@/app/lib/type/DriverType";

interface DocumentsTabProps {
    driver?: Driver;
}

const DocumentsTab = ({ driver }: DocumentsTabProps) => {
    if (!driver) {
        return <Typography color="text.secondary">No driver selected</Typography>;
    }

    const validLicenses = driver.licenses.length;


    return (
        <Stack spacing={2} direction={"row"} maxHeight={450} height={"100%"} justifyContent={"space-center"}>
            <Stack spacing={2}>
                <Stack spacing={2} direction={"row"}>
                    <Card sx={{ p: 2, borderRadius: "8px", maxWidth: 300, width: "100%", gap: 2 }}>
                        <Box sx={{ borderRadius: "8px", bgcolor: "success.main", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CheckCircleIcon sx={{ width: 18, height: 19, }} />
                        </Box>
                        <Typography sx={{ fontSize: 22 }}>Valid</Typography>
                        <Typography sx={{ fontSize: 18, marginTop: "auto" }}>{validLicenses}</Typography>
                    </Card>
                </Stack>
                <Button variant="contained" sx={{ borderRadius: "8px" }}>Upload New Document</Button>
            </Stack>
            <Stack flexGrow={1}>
                <Card sx={{ p: 2, borderRadius: "8px", gap: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>License Type</TableCell>
                                <TableCell>Expiry Date</TableCell>
                                <TableCell>Download</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {driver.licenses.map((l, index) => (
                                <TableRow key={index}>
                                    <TableCell ><Typography sx={{ fontSize: 12 }}>{l.type}</Typography></TableCell>
                                    <TableCell>{l.expiresOn}</TableCell>
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
