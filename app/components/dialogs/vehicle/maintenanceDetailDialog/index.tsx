"use client";

import {
  Dialog,
  DialogContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Alert,
  InputAdornment,
  CircularProgress,
  
  IconButton,
  Typography,
  Box,
  useTheme,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import TireRepairIcon from "@mui/icons-material/TireRepair";
import OpacityIcon from "@mui/icons-material/Opacity";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useState, useEffect } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { updateMaintenanceRecord } from "@/app/lib/controllers/vehicle";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { MaintenanceStatus, MaintenanceRecord } from "@prisma/client";

interface MaintenanceDetailDialogProps {
  open: boolean;
  onClose: () => void;
  record: MaintenanceRecord | null;
  onSuccess: () => void;
}

export default function MaintenanceDetailDialog({
  open,
  onClose,
  record,
  onSuccess,
}: MaintenanceDetailDialogProps) {
  const dict = useDictionary();
  /* --------------------------------- states --------------------------------- */
  const [formData, setFormData] = useState<{
    type: string;
    date: Dayjs;
    cost: string;
    status: MaintenanceStatus;
    description: string;
  }>({
    type: "",
    date: dayjs(),
    cost: "",
    status: "COMPLETED",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setFormData({
        type: record.type,
        date: dayjs(record.date),
        cost: record.cost.toString(),
        status: (record.status as MaintenanceStatus) || "COMPLETED",
        description: record.description || "",
      });
    }
  }, [record]);

  /* -------------------------------- handlers -------------------------------- */
  const handleSubmit = async () => {
    if (!record?.id) return;
    if (!formData.type || !formData.date || !formData.cost) {
      setError(dict.common.fillAllFields);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateMaintenanceRecord(record!.id, {
        type: formData.type,
        date: formData.date.toDate(),
        cost: parseFloat(formData.cost),
        status: formData.status,
        description: formData.description,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(dict.vehicles.dialogs.failedToUpdateRecord || "Failed to update maintenance record");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------- styles --------------------------------- */
  const theme = useTheme();

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.text.darkBlue._alpha.main_50,
      borderRadius: 2,
      height: 48,
      "& fieldset": {
        borderColor: theme.palette.divider_alpha.main_10,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary._alpha.main_30,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.85rem",
      color: "text.secondary",
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
      fontSize: "0.9rem",
    },
  };

  const SERVICE_TYPES = [
    { value: "ROUTINE_MAINTENANCE", label: dict.vehicles.serviceTypes.ROUTINE_MAINTENANCE, icon: <SettingsIcon sx={{ fontSize: 18 }} /> },
    { value: "REPAIR", label: dict.vehicles.serviceTypes.REPAIR, icon: <BuildIcon sx={{ fontSize: 18 }} /> },
    { value: "INSPECTION", label: dict.vehicles.serviceTypes.INSPECTION, icon: <SearchIcon sx={{ fontSize: 18 }} /> },
    { value: "TIRE_CHANGE", label: dict.vehicles.serviceTypes.TIRE_CHANGE, icon: <TireRepairIcon sx={{ fontSize: 18 }} /> },
    { value: "OIL_CHANGE", label: dict.vehicles.serviceTypes.OIL_CHANGE, icon: <OpacityIcon sx={{ fontSize: 18 }} /> },
    { value: "OTHER", label: dict.vehicles.serviceTypes.OTHER, icon: <AssignmentIcon sx={{ fontSize: 18 }} /> },
  ];

  const MAINTENANCE_STATUSES = [
    { value: "SCHEDULED", label: dict.vehicles.statuses.SCHEDULED, color: "#F6AD55" },
    { value: "IN_PROGRESS", label: dict.vehicles.statuses.IN_PROGRESS, color: "#4299E1" },
    { value: "COMPLETED", label: dict.vehicles.statuses.COMPLETED, color: "#48BB78" },
    { value: "CANCELLED", label: dict.vehicles.statuses.CANCELLED, color: "#F56565" },
  ];

  if (!record) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#0B1019",
          backgroundImage: "none",
          border: `1px solid ${theme.palette.divider_alpha.main_10}`,
        },
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700} color="white">
            {dict.vehicles.dialogs.maintenanceDetails}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="caption" sx={{ color: theme.palette.common.white_alpha.main_40, mt: 0.5, display: "block" }}>
          {dict.vehicles.dialogs.maintenanceDetailsDesc || "View and manage the status of this maintenance entry."}
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Stack spacing={4} mt={1}>
          {error && (
            <Alert
              severity="error"
              variant="filled"
              sx={{
                borderRadius: 2,
                bgcolor: theme.palette.error._alpha.main_10,
                color: theme.palette.error.light,
                border: `1px solid ${theme.palette.error._alpha.main_20}`,
              }}
            >
              {error}
            </Alert>
          )}

          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
              {dict.vehicles.dialogs.maintenanceStatus}
            </Typography>
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel sx={{ color: theme.palette.common.white_alpha.main_40 }}>{dict.vehicles.fields.status}</InputLabel>
              <Select
                value={formData.status}
                label={dict.vehicles.fields.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#1A202C",
                      backgroundImage: "none",
                      border: `1px solid ${theme.palette.divider_alpha.main_10}`,
                      mt: 1,
                    }
                  }
                }}
              >
                {MAINTENANCE_STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value} sx={{ py: 1.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: status.color 
                      }} />
                      <Typography variant="body2">{status.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ borderColor: theme.palette.divider_alpha.main_05 }} />

          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
              {dict.vehicles.dialogs.configuration}
            </Typography>
            <Stack spacing={2.5}>
              <FormControl fullWidth sx={textFieldSx}>
                <InputLabel sx={{ color: theme.palette.common.white_alpha.main_40 }}>{dict.vehicles.fields.serviceType}</InputLabel>
                <Select
                  value={formData.type}
                  label={dict.vehicles.fields.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#1A202C",
                        backgroundImage: "none",
                        border: `1px solid ${theme.palette.divider_alpha.main_10}`,
                        mt: 1,
                      }
                    }
                  }}
                >
                  {SERVICE_TYPES.map((st) => (
                    <MenuItem key={st.value} value={st.value} sx={{ py: 1.5 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ color: theme.palette.primary.main, display: 'flex' }}>{st.icon}</Box>
                        <Typography variant="body2">{st.label}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DatePicker
                label={dict.vehicles.dialogs.servicedOn}
                value={formData.date}
                onChange={(newValue) =>
                  setFormData({ ...formData, date: newValue || dayjs() })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: textFieldSx,
                    InputLabelProps: { shrink: true }
                  }
                }}
              />

              <TextField
                label={dict.vehicles.fields.cost}
                type="number"
                placeholder="0.00"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                fullWidth
                sx={textFieldSx}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
              {dict.vehicles.dialogs.additionalInfo}
            </Typography>
            <TextField
              label={dict.vehicles.dialogs.technicianNotes}
              placeholder={dict.vehicles.dialogs.technicianNotesDesc || "Briefly describe the work performed..."}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
              sx={{
                ...textFieldSx,
                "& .MuiOutlinedInput-root": {
                  ...textFieldSx["& .MuiOutlinedInput-root"],
                  height: "auto",
                  padding: "12px 14px",
                }
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <Box sx={{ p: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider_alpha.main_05}` }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            onClick={onClose} 
            disabled={loading}
            sx={{ 
              color: "text.secondary", 
              textTransform: "none", 
              fontWeight: 600 
            }}
          >
            {dict.common.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              boxShadow: `0 8px 24px ${theme.palette.primary._alpha.main_20}`,
              fontWeight: 700,
              minWidth: 140,
            }}
          >
            {loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>{dict.common.updating}</span>
              </Stack>
            ) : dict.vehicles.dialogs.updateRecord}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
