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
  Pagination,
  Tooltip,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
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
  meta,
  onPageChange,
}: CustomerListProps) => {
  const dict = useDictionary();
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

  const getIndustryLabel = (industry: string | null) => {
    if (!industry) return dict.customers.industryGeneral;
    const mapping: Record<string, keyof typeof dict.industries> = {
      "Logistics & Transportation": "logistics",
      "Retail & E-commerce": "retail",
      "E-commerce": "ecommerce",
      Manufacturing: "manufacturing",
      Pharmaceuticals: "pharmaceuticals",
      Automotive: "automotive",
      Aviation: "aviation",
      Technology: "technology",
      Other: "other",
    };

    const key = mapping[industry];
    return key ? dict.industries[key] : industry;
  };

  const theme = useTheme();

  const getCustomerStyles = (name: string) => {
    if (!name)
      return {
        main: theme.palette.primary.main,
        alpha: theme.palette.primary._alpha.main_10,
      };

    // Simple hashing algorithm
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const palette = [
      {
        main: theme.palette.kpi.indigo,
        alpha: theme.palette.kpi.indigo_alpha.main_20,
      },
      {
        main: theme.palette.kpi.sky,
        alpha: theme.palette.kpi.sky_alpha.main_20,
      },
      {
        main: theme.palette.kpi.emerald,
        alpha: theme.palette.kpi.emerald_alpha.main_20,
      },
      {
        main: theme.palette.kpi.amber,
        alpha: theme.palette.kpi.amber_alpha.main_20,
      },
      {
        main: theme.palette.kpi.pink,
        alpha: theme.palette.kpi.pink_alpha.main_20,
      },
      {
        main: theme.palette.kpi.violet,
        alpha: theme.palette.kpi.violet_alpha.main_20,
      },
      {
        main: theme.palette.kpi.cyan,
        alpha: theme.palette.kpi.cyan_alpha.main_20,
      },
      {
        main: theme.palette.primary.main,
        alpha: theme.palette.primary._alpha.main_20,
      },
    ];

    const index = Math.abs(hash) % palette.length;
    return palette[index];
  };

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
            sx={{ bgcolor: theme.palette.text.primary_alpha.main_10, mb: 1 }}
          />
          <Skeleton
            variant="text"
            width={80}
            height={20}
            sx={{ bgcolor: theme.palette.text.primary_alpha.main_05, mb: 2 }}
          />
          <Divider
            sx={{ borderColor: theme.palette.divider_alpha.main_10, mb: 1 }}
          />
        </Box>
        <Box sx={{ flex: 1, overflowY: "auto", p: 0 }}>
          {Array.from(new Array(5)).map((_, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: theme.palette.divider_alpha.main_10,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton
                  variant="rounded"
                  width={40}
                  height={40}
                  sx={{ bgcolor: theme.palette.text.primary_alpha.main_05 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    width="60%"
                    height={24}
                    sx={{ bgcolor: theme.palette.text.primary_alpha.main_10 }}
                  />
                  <Skeleton
                    width="40%"
                    height={16}
                    sx={{ bgcolor: theme.palette.text.primary_alpha.main_05 }}
                  />
                </Box>
              </Stack>
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Skeleton
                  width="80%"
                  height={16}
                  sx={{ bgcolor: theme.palette.text.primary_alpha.main_05 }}
                />
                <Skeleton
                  width="50%"
                  height={16}
                  sx={{ bgcolor: theme.palette.text.primary_alpha.main_05 }}
                />
              </Stack>
            </Box>
          ))}
        </Box>
      </CustomCard>
    );
  }

  return (
    <CustomCard
      sx={{
        width: 400,
        p: 0,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 0, flexGrow: 1, overflow: "auto" }}>
        {customers.map((customer) => {
          const styles = getCustomerStyles(customer.name);
          return (
            <Box
              key={customer.id}
              onClick={() => onSelect(customer.id)}
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: theme.palette.divider_alpha.main_10,
                cursor: "pointer",
                bgcolor:
                  selectedId === customer.id
                    ? theme.palette.primary._alpha.main_08
                    : "transparent",
                "&:hover": { 
                  bgcolor: theme.palette.primary._alpha.main_10,
                  transition: "background-color 0.2s",
                },
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
                    bgcolor: styles.alpha,
                    color: styles.main,
                    width: 40,
                    height: 40,
                    fontSize: "1rem",
                    fontWeight: 800,
                    border: `1px solid ${styles.alpha}`,
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
                    <Tooltip title={customer.name} arrow placement="top-start">
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        lineHeight={1.2}
                        noWrap
                      >
                        {customer.name}
                      </Typography>
                    </Tooltip>
                    <Tooltip title={dict.common.tooltips.actions} arrow>
                      <IconButton
                        size="medium"
                        onClick={(e) => handleMenuOpen(e, customer)}
                        sx={{ 
                          p: 1, 
                          mt: -1, 
                          mr: -1,
                          "&:hover": { bgcolor: "action.hover" }
                        }}
                      >
                        <MoreVertIcon fontSize="medium" sx={{ color: "text.secondary" }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {customer.code} •{" "}
                    {getIndustryLabel(customer.industry || null)}
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={0.5} sx={{ mt: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title={dict.customers.fields.address} arrow placement="left">
                    <LocationOnIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {customer.locations && customer.locations.length > 0
                      ? customer.locations.find((l) => l.isDefault)?.address ||
                        customer.locations[0].address
                      : dict.customers.list.noAddress}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title={dict.customers.fields.phone} arrow placement="left">
                    <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary">
                    {customer.phone || dict.customers.list.na}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Chip
                  label={dict.customers.list.shipmentsCount.replace(
                    "{count}",
                    (customer._count?.shipments ?? 0).toString()
                  )}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    borderColor: theme.palette.divider_alpha.main_10,
                  }}
                />
              </Stack>
            </Box>
          );
        })}
        {customers.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">
              {dict.customers.list.noCustomers}
            </Typography>
          </Box>
        )}
      </Box>

      {meta && (
        <Box
          sx={{
            p: 1.5,
            borderTop: "1px solid",
            borderColor: theme.palette.divider_alpha.main_10,
            display: "flex",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.2)",
          }}
        >
          <Pagination
            count={Math.ceil(meta.total / meta.limit)}
            page={meta.page}
            onChange={(_, page) => onPageChange?.(page)}
            size="small"
            color="primary"
            siblingCount={0}
            boundaryCount={1}
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "0.75rem",
                height: 24,
                minWidth: 24,
                borderRadius: 1,
              },
            }}
          />
        </Box>
      )}

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
            border: `1px solid ${theme.palette.divider_alpha.main_10}`,
            bgcolor: "#0B0F19",
          },
        }}
      >
        <MenuItem onClick={() => handleAction("details")}>
          <ListItemIcon>
            <InfoIcon fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText
            primary={dict.customers.actions.details}
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
          />
        </MenuItem>
        <MenuItem onClick={() => handleAction("edit")}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={dict.customers.actions.edit}
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
          />
        </MenuItem>
        <Divider
          sx={{ my: 0.5, borderColor: theme.palette.divider_alpha.main_10 }}
        />
        <MenuItem
          onClick={() => handleAction("delete")}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary={dict.customers.actions.delete}
            primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
          />
        </MenuItem>
      </Menu>
    </CustomCard>
  );
};

export default CustomerList;
