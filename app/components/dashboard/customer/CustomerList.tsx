"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton,
  useTheme,
  alpha,
} from "@mui/material";
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
import CustomCard from "../../cards/card";

const CustomerList = ({
  customers,
  selectedId,
  loading = false,
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

  const theme = useTheme();

  if (loading) {
    return (
      <CustomCard
        sx={{
          width: 400,
          p: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100%",
        }}
      >
        <Box sx={{ p: 3, pb: 0 }}>
          <Skeleton
            variant="text"
            width={120}
            height={32}
            sx={{ bgcolor: alpha(theme.palette.text.primary, 0.1), mb: 1 }}
          />
          <Skeleton
            variant="text"
            width={80}
            height={20}
            sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), mb: 2 }}
          />
          <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1), mb: 1 }} />
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto", p: 0 }}>
          {Array.from(new Array(5)).map((_, index) => (
            <Box
              key={index}
              sx={{ p: 2, borderBottom: "1px solid", borderColor: alpha(theme.palette.divider, 0.1) }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="rounded" width={40} height={40} sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="60%" height={24} sx={{ bgcolor: alpha(theme.palette.text.primary, 0.1) }} />
                  <Skeleton width="40%" height={16} sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }} />
                </Box>
              </Stack>
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Skeleton width="80%" height={16} sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }} />
                <Skeleton width="50%" height={16} sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }} />
              </Stack>
            </Box>
          ))}
        </Box>
      </CustomCard>
    );
  }

  return (
    <CustomCard sx={{ width: 400, p: 0, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 0, flexGrow: 1, overflow: "auto" }}>
        {customers.map((customer) => (
          <Box
            key={customer.id}
            onClick={() => onSelect(customer.id)}
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.1),
              cursor: "pointer",
              bgcolor:
                selectedId === customer.id ? alpha(theme.palette.primary.main, 0.08) : "transparent",
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
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
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                  fontWeight: 800,
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
                    ? customer.locations.find((l: import("@prisma/client").CustomerLocation) => l.isDefault)?.address ||
                      customer.locations[0].address
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
                  borderColor: alpha(theme.palette.divider, 0.1),
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
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: "#0B0F19",
          },
        }}
      >
        <MenuItem onClick={() => handleAction("details")}>
          <ListItemIcon>
            <InfoIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText
            primary="Details"
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
          />
        </MenuItem>
        <MenuItem onClick={() => handleAction("edit")}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
          />
        </MenuItem>
        <Divider sx={{ my: 0.5, borderColor: alpha(theme.palette.divider, 0.1) }} />
        <MenuItem
          onClick={() => handleAction("delete")}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
          />
        </MenuItem>
      </Menu>
    </CustomCard>
  );
};

export default CustomerList;
