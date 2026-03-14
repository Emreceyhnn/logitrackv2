"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CustomerWithRelations,
  CustomerListProps,
} from "@/app/lib/type/customer";

const CustomerList = ({
  customers,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: CustomerListProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuCustomer, setMenuCustomer] =
    useState<CustomerWithRelations | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    customer: CustomerWithRelations
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCustomer(null);
  };

  const handleAction = (action: string) => {
    if (!menuCustomer) return;

    if (action === "details") {
      onSelect(menuCustomer.id);
    } else if (action === "edit") {
      onEdit?.(menuCustomer);
    } else if (action === "delete") {
      onDelete?.(menuCustomer);
    }
    handleMenuClose();
  };

  return (
    <Paper
      sx={{
        width: 400,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Customers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {customers.length} Active Customers
        </Typography>
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
              transition: "background-color 0.2s",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: "secondary.main",
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                  fontWeight: 700,
                }}
              >
                {customer.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    lineHeight={1.2}
                    noWrap
                  >
                    {customer.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, customer)}
                    sx={{ p: 0.5, mt: -0.5, mr: -0.5 }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
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
                  {customer.locations && customer.locations.length > 0
                    ? customer.locations.find(l => l.isDefault)?.address || customer.locations[0].address
                    : "No address provided"}
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
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  borderColor: alpha("#fff", 0.1),
                }}
              />
            </Stack>
          </Box>
        ))}
        {customers.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">No customers found</Typography>
          </Box>
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            minWidth: 150,
            borderRadius: 2,
            mt: 0.5,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "#0B0F19",
          },
        }}
      >
        <MenuItem onClick={() => handleAction("details")}>
          <ListItemIcon>
            <InfoIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText primary="Details" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>
        <MenuItem onClick={() => handleAction("edit")}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>
        <Divider sx={{ my: 0.5, borderColor: "divider" }} />
        <MenuItem onClick={() => handleAction("delete")} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: "body2", fontWeight: 600 }} />
        </MenuItem>
      </Menu>
    </Paper>
  );
};

import { alpha } from "@mui/material";
export default CustomerList;
