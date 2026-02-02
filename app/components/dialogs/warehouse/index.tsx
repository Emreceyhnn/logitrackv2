import { Warehouse } from "@/app/lib/types";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Divider
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import mockData from "@/app/lib/data.json";

interface WarehouseDialogParams {
    open: boolean;
    onClose: () => void;
    warehouseData?: Warehouse;
}

const WarehouseDialog = ({ open, onClose, warehouseData }: WarehouseDialogParams) => {

    if (!warehouseData) return null;

    // Get inventory for this warehouse
    const warehouseStock = mockData.inventory.stockByWarehouse.find(w => w.warehouseId === warehouseData.id);
    const inventoryItems = warehouseStock?.lines.map(line => {
        const itemDetails = mockData.inventory.items.find(i => i.id === line.skuId);
        return {
            ...line,
            details: itemDetails
        };
    }) || [];

    // Calculate capacity percentages
    const palletPct = Math.round((warehouseData.capacity.usedPallets / warehouseData.capacity.maxPallets) * 100);
    const volumePct = Math.round((warehouseData.capacity.usedVolumeM3 / warehouseData.capacity.maxVolumeM3) * 100);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "12px", // Slightly more rounded for modern look
                    backgroundImage: 'none',
                }
            }}
        >

            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 1 }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        {warehouseData.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {warehouseData.code}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        size="small"
                        sx={{ color: 'text.primary', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none' }}
                    >
                        Edit
                    </Button>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </Stack>

            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={4}>
                    {/* General Information */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1, mb: 2 }}>
                            General Information
                        </Typography>

                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <LocationOnIcon color="action" fontSize="medium" sx={{ mt: 0 }} />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">Address</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                                        {warehouseData.address.line1}, {warehouseData.address.district}
                                        <br />
                                        {warehouseData.address.city}, {warehouseData.address.country}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <AccessTimeIcon color="action" fontSize="medium" sx={{ mt: 0 }} />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">Opening Hours</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                                        Mon - Sat: {warehouseData.operatingHours.monFri} {/* Hardcoded adjustment based on image "Mon - Sat" */}
                                        <br />
                                        Sunday: Closed
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Live Capacity Utilization */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1, mb: 2 }}>
                            Live Capacity Utilization
                        </Typography>

                        <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                            <Stack direction="row" spacing={4} justifyContent="space-around" alignItems="center">
                                {/* Pallets Gauge */}
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Box sx={{ width: 100, height: 100, mb: 2 }}>
                                        <Gauge
                                            value={palletPct}
                                            startAngle={0}
                                            endAngle={360}
                                            innerRadius="80%"
                                            outerRadius="100%"
                                            cornerRadius="50%"
                                            sx={{
                                                [`& .${gaugeClasses.valueText}`]: {
                                                    fontSize: 24,
                                                    fontWeight: 'bold',
                                                    transform: 'translate(0px, 0px)',
                                                },
                                                [`& .${gaugeClasses.valueArc}`]: {
                                                    fill: '#3b82f6', // blue-500
                                                },
                                            }}
                                            text={
                                                `${palletPct}%`
                                            }
                                        />
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight="bold">PALLETS</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {warehouseData.capacity.usedPallets.toLocaleString()} / {warehouseData.capacity.maxPallets.toLocaleString()}
                                    </Typography>
                                </Box>

                                {/* Volume Gauge */}
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Box sx={{ width: 100, height: 100, mb: 2 }}>
                                        <Gauge
                                            value={volumePct}
                                            startAngle={0}
                                            endAngle={360}
                                            innerRadius="80%"
                                            outerRadius="100%"
                                            cornerRadius="50%"
                                            sx={{
                                                [`& .${gaugeClasses.valueText}`]: {
                                                    fontSize: 24,
                                                    fontWeight: 'bold',
                                                    transform: 'translate(0px, 0px)',
                                                },
                                                [`& .${gaugeClasses.valueArc}`]: {
                                                    fill: '#10b981', // emerald-500
                                                },
                                            }}
                                            text={
                                                `${volumePct}%`
                                            }
                                        />
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight="bold">VOLUME</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {warehouseData.capacity.usedVolumeM3.toLocaleString()} / {warehouseData.capacity.maxVolumeM3.toLocaleString()} m³
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Contact Details */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1, mb: 2 }}>
                            Contact Details
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                            <Stack spacing={2}>
                                {warehouseData.contacts.map((contact, idx) => (
                                    <Grid container key={idx} alignItems="center" spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">{contact.name}</Typography>
                                                    {contact.role && <Chip label={contact.role} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem', mt: 0.5 }} />}
                                                </Box>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <PhoneIcon sx={{ color: 'text.secondary' }} />
                                                <Typography variant="body2">{contact.phone}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <EmailIcon sx={{ color: 'text.secondary' }} />
                                                <Typography variant="body2">{contact.email}</Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Current Inventory */}
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>
                                Current Inventory
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Showing top {inventoryItems.length} items
                            </Typography>
                        </Stack>

                        <TableContainer component={Paper} variant="outlined" sx={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', py: 1.5 }}>SKU</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', py: 1.5 }}>NAME</TableCell>
                                        <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.75rem', py: 1.5 }}>ON HAND</TableCell>
                                        <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.75rem', py: 1.5 }}>RESERVED</TableCell>
                                        <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.75rem', py: 1.5 }}>AVAILABLE</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inventoryItems.map((item) => (
                                        <TableRow key={item.skuId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                                {item.details?.sku}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '0.85rem' }}>{item.details?.name}</TableCell>
                                            <TableCell align="right" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{item.onHand}</TableCell>
                                            <TableCell align="right" sx={{ fontSize: '0.85rem', color: '#fbbf24' }}>{item.reserved}</TableCell>
                                            <TableCell align="right" sx={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold' }}>{item.available}</TableCell>
                                        </TableRow>
                                    ))}
                                    {inventoryItems.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                                No inventory data available
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider />

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 3 }}>
                <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Close</Button>
                <Button variant="contained" color="primary" sx={{ px: 3 }}>View Detailed Reports</Button>
            </Stack>

        </Dialog>
    )
}

export default WarehouseDialog