"use client";

import {
  Box,
  Stack,
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Kept if we move search here, but likely search is in header/page
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import {
  CustomerWithRelations,
  CustomerListProps,
} from "@/app/lib/type/customer";

const CustomerList = ({
  customers,
  selectedId,
  onSelect,
}: CustomerListProps) => {
  return (
    <Paper
      sx={{
        width: 400,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        height: "100%", // Match parent
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Customers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {customers.length} Active Customers
        </Typography>
        {/* Search Input could be passed here or handled in Parent. 
            For now, assuming Search is handled in Parent and filtered list passed down. 
        */}
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 0 }}>
        {customers.map((customer) => (
          <Box
            key={customer.id}
            onClick={() => onSelect(customer.id)}
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              cursor: "pointer",
              bgcolor:
                selectedId === customer.id ? "action.selected" : "transparent",
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
                    // Info icon does same as row click for now
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(customer.id);
                    }}
                    sx={{ p: 0.5 }}
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {customer.code} • {customer.industry || "General"}
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={0.5} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {customer.address || "No address provided"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {customer.phone || "N/A"}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Chip
                label={`${customer._count?.shipments ?? 0} Shipments`}
                size="small"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
              {/* Removed fake SLA chip */}
            </Stack>
          </Box>
        ))}
        {customers.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">No customers found</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default CustomerList;
