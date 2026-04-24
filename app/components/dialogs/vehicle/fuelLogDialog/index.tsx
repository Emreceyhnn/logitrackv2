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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { useState } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { createFuelLog } from "@/app/lib/controllers/fuel";
import { useUserContext } from "@/app/lib/context/UserContext";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

interface AddFuelLogDialogProps {
  open: boolean;
  onClose: () => void;
  vehicleId: string;
  vehiclePlate: string;
  currentDriverId?: string;
  onSuccess: () => void;
}

export default function AddFuelLogDialog({
  open,
  onClose,
  vehicleId,
  vehiclePlate,
  currentDriverId,
  onSuccess,
}: AddFuelLogDialogProps) {
  const dict = useDictionary();
  const { user } = useUserContext();
  const userCurrency = user?.currency || "USD";
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
  const [formData, setFormData] = useState({
    date: dayjs() as Dayjs,
    volumeLiter: "",
    cost: "",
    odometerKm: "",
    location: "",
    fuelType: "DIESEL",
    driverId: currentDriverId || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- handlers -------------------------------- */
  const handleSubmit = async () => {
    if (!formData.volumeLiter || !formData.cost || !formData.odometerKm || !formData.driverId) {
      setError(dict.common.fillAllFields);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createFuelLog({
        vehicleId,
        driverId: formData.driverId,
        date: formData.date.toDate(),
        volumeLiter: parseFloat(formData.volumeLiter),
        cost: parseFloat(formData.cost),
        odometerKm: parseInt(formData.odometerKm),
        location: formData.location || undefined,
        fuelType: formData.fuelType,
        currency: userCurrency,
      });

      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(dict.fuel.dialogs.error || "Failed to add fuel log");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      date: dayjs(),
      volumeLiter: "",
      cost: "",
      odometerKm: "",
      location: "",
      fuelType: "DIESEL",
      driverId: currentDriverId || "",
    });
    setError(null);
    onClose();
  };

  /* ---------------------------------- styles --------------------------------- */
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
            {dict.fuel.dialogs.addTitle} - {vehiclePlate}
          </Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>
          {dict.fuel.addLogDesc}
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

          {!currentDriverId && (
             <Alert severity="warning" sx={{ borderRadius: 2 }}>
               {dict.drivers.table.noVehicle || "No driver assigned to this vehicle. Please assign a driver first."}
             </Alert>
          )}

          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
              {dict.fuel.info}
            </Typography>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label={dict.fuel.fields.date}
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
                <FormControl fullWidth sx={textFieldSx}>
                  <InputLabel sx={{ color: "text.secondary" }}>{dict.fuel.fields.fuelType}</InputLabel>
                  <Select
                    value={formData.fuelType}
                    label={dict.fuel.fields.fuelType}
                    onChange={(e) =>
                      setFormData({ ...formData, fuelType: e.target.value })
                    }
                  >
                    <MenuItem value="DIESEL">{dict.vehicles.fuelTypes.DIESEL}</MenuItem>
                    <MenuItem value="GASOLINE">{dict.vehicles.fuelTypes.GASOLINE}</MenuItem>
                    <MenuItem value="ELECTRIC">{dict.vehicles.fuelTypes.ELECTRIC}</MenuItem>
                    <MenuItem value="HYBRID">{dict.vehicles.fuelTypes.HYBRID}</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction="row" spacing={2}>
                <TextField
                  label={dict.fuel.fields.volume}
                  type="number"
                  placeholder="0.00"
                  value={formData.volumeLiter}
                  onChange={(e) =>
                    setFormData({ ...formData, volumeLiter: e.target.value })
                  }
                  fullWidth
                  sx={textFieldSx}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>L</Typography>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label={dict.fuel.fields.cost}
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
                        <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>{userCurrency}</Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <TextField
                label={dict.fuel.fields.odometer}
                type="number"
                placeholder="0"
                value={formData.odometerKm}
                onChange={(e) =>
                  setFormData({ ...formData, odometerKm: e.target.value })
                }
                fullWidth
                sx={textFieldSx}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>km</Typography>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label={dict.fuel.fields.location}
                placeholder="Shell, BP, etc."
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                fullWidth
                sx={textFieldSx}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
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
            disabled={loading || !currentDriverId}
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
            ) : dict.common.save}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
