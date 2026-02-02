"use client"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Typography,
    Chip,
    Box,
    Paper,
    useTheme,
    alpha,
    Avatar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScaleIcon from '@mui/icons-material/Scale';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import BusinessIcon from '@mui/icons-material/Business';
import MapIcon from '@mui/icons-material/Map';

import { Shipment } from "@/app/lib/type/ShipmentType";
import { StatusChip } from "@/app/components/chips/statusChips";
import { PriorityChip } from "@/app/components/chips/priorityChips";

interface ShipmentDialogParams {
    open: boolean;
    onClose: () => void;
    shipmentData?: Shipment;
}

const ShipmentDetailDialog = (params: ShipmentDialogParams) => {
    const { open, onClose, shipmentData } = params;
    const theme = useTheme();

    if (!shipmentData) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: "hidden"
                }
            }}
        >
            {/* Header Section */}
            <Box sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>
                                {shipmentData.code}
                            </Typography>
                            <StatusChip status={shipmentData.status} />
                            <PriorityChip status={shipmentData.priority} />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <BusinessIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    Customer: <strong>{shipmentData.customerId}</strong>
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <AccessTimeIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    SLA Target: <strong>{shipmentData.sla.onTimeTargetPct}%</strong>
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <IconButton onClick={onClose} size="small" sx={{ bgcolor: alpha(theme.palette.text.secondary, 0.1), '&:hover': { bgcolor: alpha(theme.palette.text.secondary, 0.2) } }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                <Stack direction={{ xs: "column", md: "row" }} sx={{ height: '100%' }}>
                    {/* Left Column: Route & Logistics */}
                    <Box sx={{
                        flex: { xs: 'auto', md: 7 },
                        p: 3,
                        borderRight: { md: `1px solid ${theme.palette.divider}` },
                        borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' }
                    }}>

                        {/* Route Visualizer */}
                        <Box mb={4} sx={{ position: 'relative', pl: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                                Journey
                            </Typography>

                            {/* Connecting Line */}
                            <Box sx={{
                                position: 'absolute',
                                top: 56,
                                bottom: 16,
                                left: 28, // Adjusted based on icon size
                                width: 2,
                                bgcolor: 'divider',
                                zIndex: 0
                            }} />

                            <Stack spacing={4}>
                                {/* Pickup */}
                                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ position: 'relative', zIndex: 1 }}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                                        <Inventory2Icon fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>Pickup</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LocationOnIcon fontSize="inherit" /> Warehouse: {shipmentData.pickup.warehouseId}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, bgcolor: alpha(theme.palette.divider, 0.5), px: 1, py: 0.5, borderRadius: 1, width: 'fit-content' }}>
                                            Planned: {new Date(shipmentData.pickup.plannedAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Dropoff */}
                                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ position: 'relative', zIndex: 1 }}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                                        <LocationOnIcon fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>Dropoff</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <BusinessIcon fontSize="inherit" /> Site: {shipmentData.dropoff.customerSiteId}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, bgcolor: alpha(theme.palette.divider, 0.5), px: 1, py: 0.5, borderRadius: 1, width: 'fit-content' }}>
                                            Planned: {new Date(shipmentData.dropoff.plannedAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {/* Assignment Info */}
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                            Assignment
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Paper variant="outlined" sx={{ p: 1.5, flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: 2 }}>
                                <Avatar variant="rounded" sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main, width: 40, height: 40 }}>
                                    <PersonIcon fontSize="small" />
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">Driver</Typography>
                                    <Typography variant="body2" fontWeight={600}>{shipmentData.driverId}</Typography>
                                </Box>
                            </Paper>
                            <Paper variant="outlined" sx={{ p: 1.5, flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: 2 }}>
                                <Avatar variant="rounded" sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main, width: 40, height: 40 }}>
                                    <LocalShippingIcon fontSize="small" />
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">Vehicle</Typography>
                                    <Typography variant="body2" fontWeight={600}>{shipmentData.vehicleId}</Typography>
                                </Box>
                            </Paper>
                            <Paper variant="outlined" sx={{ p: 1.5, flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: 2 }}>
                                <Avatar variant="rounded" sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main, width: 40, height: 40 }}>
                                    <MapIcon fontSize="small" />
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">Route</Typography>
                                    <Typography variant="body2" fontWeight={600}>{shipmentData.routeId}</Typography>
                                </Box>
                            </Paper>
                        </Stack>
                    </Box>

                    {/* Right Column: Cargo Details */}
                    <Box sx={{ flex: { xs: 'auto', md: 5 }, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                        <Box sx={{ p: 3, height: '100%' }}>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                                Cargo
                            </Typography>

                            {/* Cargo Stats Grid - converted to Stack for simplicity or Box grid */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                                <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                        <ScaleIcon fontSize="small" color="action" />
                                        <Typography variant="caption" color="text.secondary">Weight</Typography>
                                    </Stack>
                                    <Typography variant="h6" fontWeight={700}>{shipmentData.cargo.totalWeightKg} <Typography component="span" variant="caption" color="text.secondary">kg</Typography></Typography>
                                </Paper>

                                <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                        <AspectRatioIcon fontSize="small" color="action" />
                                        <Typography variant="caption" color="text.secondary">Volume</Typography>
                                    </Stack>
                                    <Typography variant="h6" fontWeight={700}>{shipmentData.cargo.totalVolumeM3} <Typography component="span" variant="caption" color="text.secondary">m³</Typography></Typography>
                                </Paper>

                                <Paper elevation={0} sx={{ gridColumn: '1 / -1', p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                        <ViewInArIcon fontSize="small" color="action" />
                                        <Typography variant="caption" color="text.secondary">Pallets</Typography>
                                    </Stack>
                                    <Typography variant="h6" fontWeight={700}>{shipmentData.cargo.pallets} <Typography component="span" variant="caption" color="text.secondary">units</Typography></Typography>
                                </Paper>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
                                Manifest
                            </Typography>
                            <Stack spacing={1} sx={{ maxHeight: 200, overflowY: 'auto', pr: 0.5 }}>
                                {shipmentData.cargo.items.map((item, idx) => (
                                    <Box key={idx} sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        border: `1px solid ${theme.palette.divider}`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>{item.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">Item Code: #{1000 + idx}</Typography>
                                        </Box>
                                        <Chip
                                            label={`${item.qty} ${item.uom}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ borderRadius: 1, fontWeight: 600, height: 24 }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default ShipmentDetailDialog;
