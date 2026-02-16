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
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useState, useEffect } from "react";
import { createVehicleIssue } from "@/app/lib/controllers/vehicle";
import * as Yup from "yup";

interface ReportIssueDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicleId: string;
  vehiclePlate: string;
}

interface IssueFormData {
  title: string;
  priority: string;
  description: string;
}

// Yup validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  priority: Yup.string()
    .required("Priority is required")
    .oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"], "Invalid priority"),
  description: Yup.string(),
});

const ReportIssueDialog = ({
  open,
  onClose,
  onSuccess,
  vehicleId,
  vehiclePlate,
}: ReportIssueDialogProps) => {
  const theme = useTheme();

  const [formData, setFormData] = useState<IssueFormData>({
    title: "",
    priority: "MEDIUM",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        priority: "MEDIUM",
        description: "",
      });
      setError(null);
      setSuccess(false);
      setFieldErrors({});
    }
  }, [open]);

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

  const handleChange = (field: keyof IssueFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    // Clear field error when user types
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
      // Validate with Yup
      await validationSchema.validate(formData, { abortEarly: false });
      setFieldErrors({});

      setLoading(true);
      setError(null);

      // Call API to create issue
      await createVehicleIssue(vehicleId, {
        title: formData.title,
        type: "VEHICLE", // Always VEHICLE for vehicle issues
        priority: formData.priority,
        description: formData.description || undefined,
      });

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
        console.error("Failed to create issue:", err);
        setError(err?.message || "Failed to create issue. Please try again.");
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return theme.palette.error.main;
      case "HIGH":
        return theme.palette.warning.main;
      case "MEDIUM":
        return theme.palette.info.main;
      case "LOW":
        return theme.palette.success.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
          background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
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
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                p: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ReportProblemIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Report Issue
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vehiclePlate}
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
            Issue reported successfully!
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Title */}
          <TextField
            fullWidth
            label="Issue Title"
            placeholder="Brief description of the issue"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            disabled={loading}
            size="small"
            error={!!fieldErrors.title}
            helperText={fieldErrors.title}
            sx={textFieldSx}
          />

          {/* Priority */}
          <TextField
            fullWidth
            select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            required
            disabled={loading}
            size="small"
            error={!!fieldErrors.priority}
            helperText={fieldErrors.priority}
            sx={textFieldSx}
            SelectProps={{
              renderValue: (value) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: getPriorityColor(value as string),
                    }}
                  />
                  {value as string}
                </Box>
              ),
            }}
          >
            <MenuItem value="LOW">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: theme.palette.success.main,
                  }}
                />
                Low
              </Box>
            </MenuItem>
            <MenuItem value="MEDIUM">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: theme.palette.info.main,
                  }}
                />
                Medium
              </Box>
            </MenuItem>
            <MenuItem value="HIGH">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: theme.palette.warning.main,
                  }}
                />
                High
              </Box>
            </MenuItem>
            <MenuItem value="CRITICAL">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: theme.palette.error.main,
                  }}
                />
                Critical
              </Box>
            </MenuItem>
          </TextField>

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            placeholder="Provide additional details about the issue..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={loading}
            multiline
            rows={4}
            error={!!fieldErrors.description}
            helperText={fieldErrors.description}
            sx={textFieldSx}
          />

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
                "Submit Issue"
              )}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueDialog;
