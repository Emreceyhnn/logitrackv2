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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import TireRepairIcon from "@mui/icons-material/TireRepair";
import OpacityIcon from "@mui/icons-material/Opacity";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useState } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { addMaintenanceRecord } from "@/app/lib/controllers/vehicle";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { MaintenanceStatus } from "@/app/lib/type/enums";

interface MaintenanceRecordDialogProps {
  open: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess: () => void;
}

export default function MaintenanceRecordDialog({
  open,
  onClose,
  vehicleId,
  onSuccess,
}: MaintenanceRecordDialogProps) {
  const dict = useDictionary();
  /* --------------------------------- states --------------------------------- */
  const [formData, setFormData] = useState({
    type: "",
    date: dayjs() as Dayjs,
    cost: "",
    status: MaintenanceStatus.COMPLETED,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- handlers -------------------------------- */
  const handleSubmit = async () => {
    if (!formData.type || !formData.date || !formData.cost) {
      setError(dict.common.fillAllFields);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addMaintenanceRecord(vehicleId, {
        type: formData.type,
        date: formData.date.toDate(),
        cost: parseFloat(formData.cost),
        status: formData.status,
        description: formData.description,
      });

      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(dict.vehicles.dialogs.failedToCreateRecord || "Failed to create maintenance record");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: "",
      date: dayjs(),
      cost: "",
      status: MaintenanceStatus.COMPLETED,
      description: "",
    });
    setError(null);
    onClose();
  };

  /* ---------------------------------- styles --------------------------------- */
  const theme = useTheme();

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      height: 48,
      "& fieldset": {
        borderColor: "divider",
      },
      "&:hover fieldset": {
        borderColor: "primary.main",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.85rem",
    },
    "& .MuiOutlinedInput-input": {
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

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={800} color="text.primary">
            {dict.vehicles.dialogs.addMaintenanceRecord}
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
          {dict.vehicles.dialogs.addMaintenanceDesc || "Log service and maintenance events for this vehicle."}
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
                bgcolor: (theme) => theme.palette.mode === "dark" ? "error._alpha.main_10" : "error._alpha.main_05",
                color: "error.light",
                border: (theme) => `1px solid ${theme.palette.error._alpha.main_20}`,
              }}
            >
              {error}
            </Alert>
          )}

          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
              {dict.vehicles.dialogs.configuration}
            </Typography>
            <Stack spacing={2.5}>
              <FormControl fullWidth sx={textFieldSx}>
                <InputLabel sx={{ color: "text.secondary" }}>{dict.vehicles.dialogs.maintenanceStatus}</InputLabel>
                <Select
                  value={formData.status}
                  label={dict.vehicles.dialogs.maintenanceStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundImage: "none",
                        mt: 1,
                      }
                    }
                  }}
                >
                  {MAINTENANCE_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value as MaintenanceStatus} sx={{ py: 1.5 }}>
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

              <FormControl fullWidth sx={textFieldSx}>
                <InputLabel sx={{ color: "text.secondary" }}>{dict.vehicles.fields.serviceType}</InputLabel>
                <Select
                  value={formData.type}
                  label={dict.vehicles.fields.serviceType}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundImage: "none",
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
                      <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>$</Typography>
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

      <Box sx={{ p: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            onClick={handleClose} 
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
                <span>{dict.common.saving}</span>
              </Stack>
            ) : dict.vehicles.dialogs.saveRecord}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
