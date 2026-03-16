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
  alpha,
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
import { addMaintenanceRecord } from "@/app/lib/controllers/vehicle";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

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
  /* --------------------------------- states --------------------------------- */
  const [formData, setFormData] = useState({
    type: "",
    date: dayjs() as Dayjs,
    cost: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- handlers -------------------------------- */
  const handleSubmit = async () => {
    if (!formData.type || !formData.date || !formData.cost) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addMaintenanceRecord(vehicleId, {
        type: formData.type,
        date: formData.date.toDate(),
        cost: parseFloat(formData.cost),
        description: formData.description,
      });

      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create maintenance record");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: "",
      date: dayjs(),
      cost: "",
      description: "",
    });
    setError(null);
    onClose();
  };

  /* ---------------------------------- styles --------------------------------- */
  const theme = useTheme();

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: alpha("#1A202C", 0.5),
      borderRadius: 2,
      height: 48,
      "& fieldset": {
        borderColor: alpha(theme.palette.divider, 0.1),
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.3),
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
    { value: "ROUTINE_MAINTENANCE", label: "Routine Maintenance", icon: <SettingsIcon sx={{ fontSize: 18 }} /> },
    { value: "REPAIR", label: "Repair", icon: <BuildIcon sx={{ fontSize: 18 }} /> },
    { value: "INSPECTION", label: "Inspection", icon: <SearchIcon sx={{ fontSize: 18 }} /> },
    { value: "TIRE_CHANGE", label: "Tire Change", icon: <TireRepairIcon sx={{ fontSize: 18 }} /> },
    { value: "OIL_CHANGE", label: "Oil Change", icon: <OpacityIcon sx={{ fontSize: 18 }} /> },
    { value: "OTHER", label: "Other", icon: <AssignmentIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#0B1019",
          backgroundImage: "none",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700} color="white">
            Add Maintenance Record
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="caption" sx={{ color: alpha("#fff", 0.4), mt: 0.5, display: "block" }}>
          Log service and maintenance events for this vehicle.
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={4} mt={1}>
            {error && (
              <Alert 
                severity="error" 
                variant="filled"
                sx={{ 
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.light,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                }}
              >
                {error}
              </Alert>
            )}

            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
                Configuration
              </Typography>
              <Stack spacing={2.5}>
                <FormControl fullWidth sx={textFieldSx}>
                  <InputLabel sx={{ color: alpha("#fff", 0.4) }}>Service Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Service Type"
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: "#1A202C",
                          backgroundImage: "none",
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
                  label="Service Date"
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
                  label="Cost"
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
                Additional Information
              </Typography>
              <TextField
                label="Description / Notes"
                placeholder="Briefly describe the work performed..."
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
        </LocalizationProvider>
      </DialogContent>

      <Box sx={{ p: 3, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
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
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
              fontWeight: 700,
              minWidth: 140,
            }}
          >
            {loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>Saving...</span>
              </Stack>
            ) : "Save Record"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
