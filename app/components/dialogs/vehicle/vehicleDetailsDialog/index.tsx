"use client";

import {
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
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import { useState } from "react";
import OverviewTab from "./overviewTab";
import DocumentsTab from "./documentsTab";
import MaintenanceTab from "./maintenance";
import CloseIcon from "@mui/icons-material/Close";

import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { updateVehicleStatus } from "@/app/lib/controllers/vehicle";
import { VehicleStatus } from "@/app/lib/type/enums";

import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

import { getStatusMeta } from "@/app/lib/priorityColor";
import DeleteConfirmationDialog from "../../deleteConfirmationDialog";
import { deleteVehicle } from "@/app/lib/controllers/vehicle";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface VehicleDialogParams {
  open: boolean;
  onClose: () => void;
  vehicleData?: VehicleWithRelations;
  onDeleteSuccess?: () => void;
  onEditSuccess?: () => void;
  onUpdateSuccess?: () => void;
  initialTab?: number;
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

const VehicleDialog = (params: VehicleDialogParams) => {
  const {
    open,
    onClose,
    vehicleData,
    onDeleteSuccess,
    onUpdateSuccess,
    initialTab,
  } = params;
  const dict = useDictionary();

  /* --------------------------------- states --------------------------------- */
  const [value, setValue] = useState(initialTab ?? 0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  /* -------------------------------- handlers -------------------------------- */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleData) return;

    try {
      setIsDeleting(true);
      await deleteVehicle(vehicleData.id);
      onClose();
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
  };

  const handleStatusUpdate = async (newStatus: VehicleStatus) => {
    if (!vehicleData) return;
    try {
      setStatusLoading(true);
      await updateVehicleStatus(vehicleData.id, newStatus);

      onUpdateSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setStatusLoading(false);
    }
  };

  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const statusMeta = getStatusMeta(vehicleData?.status, dict) as any;
  
  const statusColor = (theme.palette[statusMeta.paletteKey as keyof typeof theme.palette] as any)?.main || statusMeta.color;
  const statusAlpha = (theme.palette[statusMeta.paletteKey as keyof typeof theme.palette] as any)?._alpha || (theme.palette.primary as any)._alpha;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: (theme.palette.background as any).midnight.main,
          backgroundImage: "none",
          border: `1px solid ${(theme.palette as any).divider_alpha.main_10}`,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          bgcolor: (theme.palette.background as any).midnight.main,
          borderBottom: `1px solid ${(theme.palette as any).divider_alpha.main_10}`,
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
              src={vehicleData?.photo || undefined}
              sx={{
                bgcolor: vehicleData?.photo
                  ? "transparent"
                  : statusAlpha.main_10,
                color: statusColor,
                width: 72,
                height: 72,
                fontSize: "2rem",
                fontWeight: 800,
                borderRadius: 2,
                border: vehicleData?.photo
                  ? `2px solid ${statusAlpha.main_50}`
                  : `1px solid ${statusAlpha.main_20}`,
              }}
            >
              {!vehicleData?.photo &&
                (vehicleData?.model?.charAt(0) || (
                  <LocalShippingIcon fontSize="large" />
                ))}
            </Avatar>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: "white" }}
                >
                  {vehicleData?.plate}
                </Typography>
                <VerifiedIcon color="primary" sx={{ fontSize: "1.2rem" }} />
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={statusMeta.label}
                  size="small"
                  sx={{
                    height: 24,
                    fontWeight: 600,
                    bgcolor: statusAlpha.main_10,
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

          <Stack direction="row" spacing={1} alignItems="center">
            {vehicleData?.status === "MAINTENANCE" ? (
              <Button
                size="small"
                variant="outlined"
                color="success"
                startIcon={<CheckCircleIcon />}
                disabled={statusLoading}
                onClick={() => handleStatusUpdate(VehicleStatus.AVAILABLE)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: (theme.palette.success as any)._alpha.main_05,
                }}
              >
                {dict.vehicles.dialogs.returnToService}
              </Button>
            ) : (
              vehicleData?.status === "AVAILABLE" && (
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  startIcon={<BuildIcon />}
                  disabled={statusLoading}
                  onClick={() => handleStatusUpdate("MAINTENANCE" as VehicleStatus)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    bgcolor: (theme.palette.warning as any)._alpha.main_05,
                  }}
                >
                  {dict.vehicles.dialogs.setMaintenance}
                </Button>
              )
            )}
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "text.secondary",
                ml: 1,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Stack>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: (theme.palette as any).divider_alpha.main_10,
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label={dict.vehicles.dialogs.tabs.overview} {...a11yProps(0)} />
              <Tab label={dict.vehicles.dialogs.tabs.documents} {...a11yProps(1)} />
              <Tab label={dict.vehicles.dialogs.tabs.maintenance} {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <OverviewTab vehicle={vehicleData} onUpdate={onUpdateSuccess} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <DocumentsTab vehicle={vehicleData} onUpdate={onUpdateSuccess} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <MaintenanceTab vehicle={vehicleData} onUpdate={onUpdateSuccess} />
          </CustomTabPanel>
        </Stack>

        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${(theme.palette as any).divider_alpha.main_10}`,
            bgcolor: (theme.palette.error as any)._alpha.main_05,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {dict.common.delete} {dict.vehicles.dialogs.vehicleLabel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dict.common.thisActionCannotBeUndone}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
              sx={{
                textTransform: "none",
                borderWidth: 1.5,
                "&:hover": {
                  borderWidth: 1.5,
                  bgcolor: (theme.palette.error as any)._alpha.main_05,
                },
              }}
            >
              {dict.common.delete}
            </Button>
          </Stack>
        </Box>
      </DialogContent>

      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={dict.vehicles.deleteTitle}
        description={dict.vehicles.deleteDesc}
        loading={isDeleting}
      />
    </Dialog>
  );
};

export default VehicleDialog;
