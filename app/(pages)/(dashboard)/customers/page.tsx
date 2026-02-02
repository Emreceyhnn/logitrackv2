"use client";

import { Box, Stack, Typography, Paper, TextField, InputAdornment, Card, Avatar, Divider, Chip, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import GoogleMapView from "@/app/components/map";
import CustomerDetailDialog from "@/app/components/dialogs/customer/customerDetailDialog";
import mockData from "@/app/lib/data.json";
import { useState, useMemo } from "react";

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const handleOpenDetail = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSelectedCustomerId(id); // Ensure it's selected
        setDetailOpen(true);
    };

    // Prepare map locations from all customers
    const allLocations = useMemo(() => {
        return mockData.customers.flatMap(customer =>
            customer.deliverySites.map(site => ({
                id: site.id,
                name: `${customer.name} - ${site.name}`,
                position: site.geo,
                type: "C"
            }))
        );
    }, []);

    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return mockData.customers;
        const lowerTerm = searchTerm.toLowerCase();
        return mockData.customers.filter(c =>
            c.name.toLowerCase().includes(lowerTerm) ||
            c.code.toLowerCase().includes(lowerTerm)
        );
    }, [searchTerm]);

    const handleCustomerClick = (id: string) => {
        setSelectedCustomerId(id);
        // In a real app we might pan the map here
    };

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', p: 3, display: 'flex', gap: 3 }}>
            {/* Left Side: Customer List */}
            <Paper sx={{ width: 400, display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Customers</Typography>
                    <TextField
                        fullWidth
                        placeholder="Search customers..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
                            }
                        }}
                    />
                </Box>

                <Box sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                    {filteredCustomers.map((customer) => (
                        <Box
                            key={customer.id}
                            onClick={() => handleCustomerClick(customer.id)}
                            sx={{
                                p: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                cursor: 'pointer',
                                bgcolor: selectedCustomerId === customer.id ? 'action.selected' : 'transparent',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                <Avatar variant="rounded" sx={{ bgcolor: 'secondary.main' }}>
                                    {customer.name.charAt(0)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Typography variant="subtitle1" fontWeight={600} lineHeight={1.2}>
                                            {customer.name}
                                        </Typography>
                                        <IconButton size="small" onClick={(e) => handleOpenDetail(e, customer.id)} sx={{ p: 0.5 }}>
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">
                                        {customer.code} • {customer.industry}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack spacing={0.5} sx={{ mt: 1 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {customer.billingAddress.city}, {customer.billingAddress.country}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {customer.contacts[0]?.phone}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                <Chip label={`${customer.deliverySites.length} Sites`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                                <Chip label={`SLA: ${customer.sla.onTimeTargetPct}%`} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                            </Stack>
                        </Box>
                    ))}
                </Box>
            </Paper>
            <Card sx={{ flex: 1, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                <GoogleMapView warehouseLoc={allLocations} zoom={7} />

            </Card>
            <CustomerDetailDialog
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                customerId={selectedCustomerId}
            />
        </Box>
    );
}
