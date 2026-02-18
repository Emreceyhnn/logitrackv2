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

import { DriverWithRelations } from "@/app/lib/type/driver";
import { useState } from "react";
import OverviewTab from "./overviewTab";
import DocumentsTab from "./documentsTab";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import { getStatusMeta } from "@/app/lib/priorityColor";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface DriverDialogParams {
  open: boolean;
  onClose: () => void;
  onEdit?: (driver: DriverWithRelations) => void;
  onDelete?: (id: string) => void;
  driverData: DriverWithRelations | null;
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

const DriverDialog = (params: DriverDialogParams) => {
  const { open, onClose, driverData, onEdit, onDelete } = params;

  /* --------------------------------- states --------------------------------- */
  const [value, setValue] = useState(0);

  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* -------------------------------- handlers -------------------------------- */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!driverData) return null;

  const statusMeta = getStatusMeta(driverData.status);
  const [colorKey, colorVariant] = statusMeta.color;
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
              src={driverData.user.avatarUrl || undefined}
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
              {driverData.user.name?.charAt(0)}
            </Avatar>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: theme.palette.text.primary }}
                >
                  {driverData.user.name} {driverData.user.surname}
                </Typography>
                <Chip
                  label={statusMeta.text}
                  size="small"
                  sx={{
                    height: 24,
                    fontWeight: 600,
                    bgcolor: alpha(statusColor, 0.1),
                    color: statusMeta.color,
                    ml: 1,
                  }}
                />
              </Stack>
              <Stack spacing={1}>
                {driverData.employeeId && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <BadgeIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                    {driverData.employeeId}
                  </Typography>
                )}

                <Stack direction="row" spacing={2} alignItems="center">
                  {driverData.phone && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PhoneIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                      {driverData.phone}
                    </Typography>
                  )}
                  {driverData.user.email && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <EmailIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                      {driverData.user.email}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            {onEdit && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                size="small"
                onClick={() => {
                  onClose();
                  onEdit(driverData);
                }}
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
            )}
            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => {
                  onClose();
                  onDelete(driverData.id);
                }}
                sx={{
                  textTransform: "none",
                  borderColor: "error.main",
                  color: "error.main",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                Delete
              </Button>
            )}
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
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <OverviewTab driver={driverData} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <DocumentsTab driver={driverData} />
          </CustomTabPanel>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DriverDialog;
