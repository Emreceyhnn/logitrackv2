"use client";

import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { Vehicle } from "@/app/lib/type/VehicleType";
import { useState } from "react";
import OverviewTab from "./overviewTab";
import DocumentsTab from "./documentsTab";
import MaintenanceTab from "./maintenance";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface VehicleDialogParams {
  open: boolean;
  onClose: () => void;
  vehicleData?: Vehicle;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const getStatusMeta = (status?: string) => {
  switch (status) {
    case "ON_TRIP":
      return { color: "info.main", text: "On Trip" };
    case "AVAILABLE":
      return { color: "success.main", text: "Available" };
    case "IN_SERVICE":
      return { color: "warning.main", text: "In Service" };
    default:
      return { color: "text.primary", text: status ?? "-" };
  }
};

const VehicleDialog = (params: VehicleDialogParams) => {
  const { open, onClose, vehicleData } = params;

  const [value, setValue] = useState(0);

  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const statusMeta = getStatusMeta(vehicleData?.status);
  const [colorKey, colorVariant] = statusMeta.color.split(".");
  const statusColor =
    (theme.palette as any)[colorKey]?.[colorVariant] ||
    theme.palette.text.primary;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(statusColor, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: alpha(statusColor, 0.1),
                color: statusColor,
                width: 72,
                height: 72,
                fontSize: "2rem",
                fontWeight: 800,
                borderRadius: 2,
              }}
            >
              {vehicleData?.brand?.charAt(0) || (
                <LocalShippingIcon fontSize="large" />
              )}
            </Avatar>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: theme.palette.text.primary }}
                >
                  {vehicleData?.plate}
                </Typography>
                <VerifiedIcon color="primary" sx={{ fontSize: "1.2rem" }} />
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={statusMeta.text}
                  size="small"
                  sx={{
                    height: 24,
                    fontWeight: 600,
                    bgcolor: alpha(statusColor, 0.1),
                    color: statusColor,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <FingerprintIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                  {vehicleData?.brand} {vehicleData?.model} {vehicleData?.year}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              size="small"
              sx={{
                textTransform: "none",
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: theme.palette.text.primary,
                  color: theme.palette.text.primary,
                },
              }}
            >
              Edit
            </Button>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.text.secondary, 0.1),
                "&:hover": {
                  bgcolor: alpha(theme.palette.text.secondary, 0.2),
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Stack>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Overview" {...a11yProps(0)} />
              <Tab label="Documents" {...a11yProps(1)} />
              <Tab label="Maintenance" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <OverviewTab vehicle={vehicleData} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <DocumentsTab vehicle={vehicleData} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <MaintenanceTab vehicle={vehicleData} />
          </CustomTabPanel>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDialog;
