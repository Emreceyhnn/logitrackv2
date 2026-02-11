"use client";

import {
  Box,
  Stack,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Card,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import GoogleMapView from "@/app/components/map";
import CustomerDetailDialog from "@/app/components/dialogs/customer/customerDetailDialog";
import mockData from "@/app/lib/mockData.json";
import { useState, useMemo, useEffect } from "react";

export default function CustomersPage() {
  /* --------------------------------- states --------------------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  /* --------------------------------- effects -------------------------------- */
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const COMPANY_ID = 'cmlgt985b0003x0cuhtyxoihd';
        const USER_ID = 'usr_001';
        const data = await import("@/app/lib/controllers/customer").then(mod => mod.getCustomers(COMPANY_ID, USER_ID));

        const mapped = data.map((c: any) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          industry: c.industry || "General",
          taxId: c.taxId,
          billingAddress: {
            city: c.address ? c.address.split(',')[0] : "Istanbul", // Simple parse
            country: "Turkey",
            fullAddress: c.address || "N/A"
          },
          contacts: [
            {
              name: "Primary Contact", // Placeholder
              role: "Manager",
              email: c.email || "N/A",
              phone: c.phone || "N/A"
            }
          ],
          deliverySites: [
            {
              id: `site-${c.id}`,
              name: "Main Site",
              address: {
                fullAddress: c.address || "N/A",
                coordinates: [41.0082 + (Math.random() * 0.1 - 0.05), 28.9784 + (Math.random() * 0.1 - 0.05)] // Random scatter around Istanbul for demo
              }
            }
          ],
          sla: {
            onTimeTargetPct: 95 + (Math.floor(Math.random() * 5)) // Mock SLA
          },
          contract: {
            startDate: c.createdAt,
            endDate: new Date(new Date(c.createdAt).setFullYear(new Date(c.createdAt).getFullYear() + 1)).toISOString(),
            status: "ACTIVE"
          }
        }));

        setCustomers(mapped);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      }
    };

    fetchCustomers();
  }, []);

  /* --------------------------------- utils ---------------------------------- */
  const allLocations = useMemo(() => {
    return customers.flatMap((customer) =>
      customer.deliverySites.map((site: any) => ({
        id: site.id,
        name: `${customer.name} - ${site.name}`,
        position: site.address.coordinates,
        type: "C",
      }))
    );
  }, [customers]);

  /* --------------------------------- filters -------------------------------- */
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lowerTerm = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerTerm) ||
        c.code.toLowerCase().includes(lowerTerm)
    );
  }, [customers, searchTerm]);

  /* -------------------------------- handlers -------------------------------- */
  const handleOpenDetail = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedCustomerId(id);
    setDetailOpen(true);
  };
  const handleCustomerClick = (id: string) => {
    setSelectedCustomerId(id);
  };

  return (
    <Box sx={{ height: "calc(100vh - 100px)", p: 3, display: "flex", gap: 3 }}>
      <Paper
        sx={{
          width: 400,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Customers
          </Typography>
          <TextField
            fullWidth
            placeholder="Search customers..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 0 }}>
          {filteredCustomers.map((customer) => (
            <Box
              key={customer.id}
              onClick={() => handleCustomerClick(customer.id)}
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                bgcolor:
                  selectedCustomerId === customer.id
                    ? "action.selected"
                    : "transparent",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Avatar variant="rounded" sx={{ bgcolor: "secondary.main" }}>
                  {customer.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      lineHeight={1.2}
                    >
                      {customer.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenDetail(e, customer.id)}
                      sx={{ p: 0.5 }}
                    >
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
                  <LocationOnIcon
                    sx={{ fontSize: 16, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {customer.billingAddress.city},{" "}
                    {customer.billingAddress.country}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {customer.contacts?.[0]?.phone || "N/A"}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Chip
                  label={`${customer.deliverySites.length} Sites`}
                  size="small"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
                <Chip
                  label={`SLA: ${customer.sla.onTimeTargetPct}%`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              </Stack>
            </Box>
          ))}
        </Box>
      </Paper>
      <Card
        sx={{
          flex: 1,
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        }}
      >
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
