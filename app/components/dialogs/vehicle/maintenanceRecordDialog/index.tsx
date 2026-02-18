import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from "@mui/material";
import { useState } from "react";
import { addMaintenanceRecord } from "@/app/lib/controllers/vehicle";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
    date: dayjs(),
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Maintenance Record</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3} mt={1}>
            {error && <Alert severity="error">{error}</Alert>}

            <FormControl fullWidth>
              <InputLabel>Service Type</InputLabel>
              <Select
                value={formData.type}
                label="Service Type"
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <MenuItem value="ROUTINE_MAINTENANCE">
                  Routine Maintenance
                </MenuItem>
                <MenuItem value="REPAIR">Repair</MenuItem>
                <MenuItem value="INSPECTION">Inspection</MenuItem>
                <MenuItem value="TIRE_CHANGE">Tire Change</MenuItem>
                <MenuItem value="OIL_CHANGE">Oil Change</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>

            <DatePicker
              label="Date"
              value={formData.date}
              onChange={(newValue) =>
                setFormData({ ...formData, date: newValue || dayjs() })
              }
              slotProps={{ textField: { fullWidth: true } }}
            />

            <TextField
              label="Cost"
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />

            <TextField
              label="Description / Notes"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Saving..." : "Save Record"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
