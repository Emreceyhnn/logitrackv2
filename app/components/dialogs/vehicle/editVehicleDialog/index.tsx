"use client";

import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import { updateVehicle } from "@/app/lib/controllers/vehicle";
import { VehicleType, VehicleStatus } from "@prisma/client";
import * as Yup from "yup";
import { editVehicleValidationSchema } from "@/app/lib/validationSchema";

interface EditVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicle: {
    id: string;
    fleetNo: string;
    plate: string;
    type: VehicleType;
    brand: string;
    model: string;
    year: number;
    maxLoadKg: number;
    fuelType: string;
    status: VehicleStatus;
    odometerKm?: number | null;
    nextServiceKm?: number | null;
    avgFuelConsumption?: number | null;
  };
}

interface VehicleFormData {
  type: VehicleType;
  brand: string;
  model: string;
  year: number | "";
  maxLoadKg: number | "";
  fuelType: string;
  status: VehicleStatus;
  odometerKm?: number | "";
  nextServiceKm?: number | "";
  avgFuelConsumption?: number | "";
}

const EditVehicleDialog = ({
  open,
  onClose,
  onSuccess,
  vehicle,
}: EditVehicleDialogProps) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<VehicleFormData>({
    type: vehicle.type,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    maxLoadKg: vehicle.maxLoadKg,
    fuelType: vehicle.fuelType,
    status: vehicle.status,
    odometerKm: vehicle.odometerKm || "",
    nextServiceKm: vehicle.nextServiceKm || "",
    avgFuelConsumption: vehicle.avgFuelConsumption || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Update form data when vehicle prop changes
  useEffect(() => {
    if (open) {
      setFormData({
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        maxLoadKg: vehicle.maxLoadKg,
        fuelType: vehicle.fuelType,
        status: vehicle.status,
        odometerKm: vehicle.odometerKm || "",
        nextServiceKm: vehicle.nextServiceKm || "",
        avgFuelConsumption: vehicle.avgFuelConsumption || "",
      });
      setError(null);
      setSuccess(false);
      setFieldErrors({});
    }
  }, [open, vehicle]);

  // Professional input styling
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      borderRadius: 1.5,
      "& fieldset": {
        borderColor: alpha(theme.palette.divider, 0.8),
        borderWidth: 1.5,
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
      "&.Mui-disabled": {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.5),
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 500,
      fontSize: "0.875rem",
      "&.Mui-focused": {
        fontWeight: 600,
      },
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "0.9375rem",
      padding: "10px 14px",
    },
  };

  const handleChange = (field: keyof VehicleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await editVehicleValidationSchema.validate(formData, {
        abortEarly: false,
      });
      setFieldErrors({});

      setLoading(true);
      setError(null);

      const updateData = {
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        maxLoadKg: Number(formData.maxLoadKg),
        fuelType: formData.fuelType,
        status: formData.status,
        ...(formData.odometerKm && { odometerKm: Number(formData.odometerKm) }),
        ...(formData.nextServiceKm && {
          nextServiceKm: Number(formData.nextServiceKm),
        }),
        ...(formData.avgFuelConsumption && {
          avgFuelConsumption: Number(formData.avgFuelConsumption),
        }),
      };

      await updateVehicle(vehicle.id, updateData);
      setSuccess(true);

      // Show success for 1.5 seconds then close
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      if (err.name === "ValidationError") {
        // Yup validation errors
        const errors: Record<string, string> = {};
        err.inner.forEach((error: any) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setFieldErrors(errors);
        setError("Please fix the validation errors below");
      } else {
        // Server errors
        console.error("Failed to update vehicle:", err);
        setError(err?.message || "Failed to update vehicle. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setSuccess(false);
      setFieldErrors({});
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                p: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Edit Vehicle
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vehicle.fleetNo} • {vehicle.plate}
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={handleClose}
            disabled={loading}
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
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Vehicle updated successfully!
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Vehicle Information Section */}
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={700}
              letterSpacing={1.2}
              display="block"
              mb={2}
            >
              Vehicle Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                select
                label="Vehicle Type"
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                required
                disabled={loading}
                size="small"
                error={!!fieldErrors.type}
                helperText={fieldErrors.type}
                sx={textFieldSx}
              >
                <MenuItem value="TRUCK">Truck</MenuItem>
                <MenuItem value="VAN">Van</MenuItem>
              </TextField>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                required
                disabled={loading}
                size="small"
                error={!!fieldErrors.status}
                helperText={fieldErrors.status}
                sx={textFieldSx}
              >
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="ON_TRIP">On Trip</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Brand"
                placeholder="e.g., Mercedes"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                required
                disabled={loading}
                size="small"
                error={!!fieldErrors.brand}
                helperText={fieldErrors.brand}
                sx={textFieldSx}
              />
              <TextField
                fullWidth
                label="Model"
                placeholder="e.g., Actros"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                required
                disabled={loading}
                size="small"
                error={!!fieldErrors.model}
                helperText={fieldErrors.model}
                sx={textFieldSx}
              />
              <TextField
                fullWidth
                label="Year"
                type="number"
                placeholder="e.g., 2023"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                required
                disabled={loading}
                size="small"
                inputProps={{ min: 1900, max: 2100 }}
                error={!!fieldErrors.year}
                helperText={fieldErrors.year}
                sx={textFieldSx}
              />
              <TextField
                fullWidth
                select
                label="Fuel Type"
                value={formData.fuelType}
                onChange={(e) => handleChange("fuelType", e.target.value)}
                required
                disabled={loading}
                size="small"
                error={!!fieldErrors.fuelType}
                helperText={fieldErrors.fuelType}
                sx={textFieldSx}
              >
                <MenuItem value="DIESEL">Diesel</MenuItem>
                <MenuItem value="GASOLINE">Gasoline</MenuItem>
                <MenuItem value="ELECTRIC">Electric</MenuItem>
                <MenuItem value="HYBRID">Hybrid</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Max Load (kg)"
                type="number"
                placeholder="e.g., 15000"
                value={formData.maxLoadKg}
                onChange={(e) => handleChange("maxLoadKg", e.target.value)}
                required
                disabled={loading}
                size="small"
                inputProps={{ min: 0 }}
                error={!!fieldErrors.maxLoadKg}
                helperText={fieldErrors.maxLoadKg}
                sx={textFieldSx}
              />
            </Box>
          </Box>

          {/* Optional Fields Section */}
          <Box>
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={700}
              letterSpacing={1.2}
              display="block"
              mb={2}
            >
              Optional Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Odometer (km)"
                type="number"
                placeholder="e.g., 50000"
                value={formData.odometerKm}
                onChange={(e) => handleChange("odometerKm", e.target.value)}
                disabled={loading}
                size="small"
                inputProps={{ min: 0 }}
                error={!!fieldErrors.odometerKm}
                helperText={fieldErrors.odometerKm}
                sx={textFieldSx}
              />
              <TextField
                fullWidth
                label="Next Service (km)"
                type="number"
                placeholder="e.g., 60000"
                value={formData.nextServiceKm}
                onChange={(e) => handleChange("nextServiceKm", e.target.value)}
                disabled={loading}
                size="small"
                inputProps={{ min: 0 }}
                error={!!fieldErrors.nextServiceKm}
                helperText={fieldErrors.nextServiceKm}
                sx={textFieldSx}
              />
              <TextField
                fullWidth
                label="Avg. Fuel Consumption (L/100km)"
                type="number"
                placeholder="e.g., 25.5"
                value={formData.avgFuelConsumption}
                onChange={(e) =>
                  handleChange("avgFuelConsumption", e.target.value)
                }
                disabled={loading}
                size="small"
                inputProps={{ min: 0, step: 0.1 }}
                error={!!fieldErrors.avgFuelConsumption}
                helperText={fieldErrors.avgFuelConsumption}
                sx={textFieldSx}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
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
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                textTransform: "none",
                px: 4,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Vehicle"
              )}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
