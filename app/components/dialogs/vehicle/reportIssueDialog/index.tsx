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
import { vehicleReportIssueValidationSchema } from "@/app/lib/validationSchema";
import { getPriorityColor } from "@/app/lib/priorityColor";
import { ValidationError } from "yup";
import { IssuePriority } from "@/app/lib/type/enums";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface ReportIssueDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicleId: string;
  vehiclePlate: string;
}

interface IssueFormData {
  title: string;
  priority: IssuePriority;
  description: string;
}

const ReportIssueDialog = ({
  open,
  onClose,
  onSuccess,
  vehicleId,
  vehiclePlate,
}: ReportIssueDialogProps) => {
  /* ---------------------------------- theme --------------------------------- */
  const theme = useTheme();
  const dict = useDictionary();

  /* --------------------------------- states --------------------------------- */
  const [formData, setFormData] = useState<IssueFormData>({
    title: "",
    priority: IssuePriority.MEDIUM,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        priority: IssuePriority.MEDIUM,
        description: "",
      });
      setError(null);
      setSuccess(false);
      setFieldErrors({});
    }
  }, [open]);

  /* -------------------------------- handlers -------------------------------- */
  const handleChange = (field: keyof IssueFormData, value: string) => {
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

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setSuccess(false);
      setFieldErrors({});
      onClose();
    }
  };

  const handleSubmit = async () => {
    try {
      const schema = vehicleReportIssueValidationSchema(dict);
      await schema.validate(formData, {
        abortEarly: false,
      });
      setFieldErrors({});

      setLoading(true);
      setError(null);

      await createVehicleIssue(vehicleId, {
        title: formData.title,
        type: "VEHICLE",
        priority: formData.priority,
        description: formData.description || undefined,
      });

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setFieldErrors(errors);
        setError(dict.validation.genericFormError);
      } else {
        console.error("Failed to create issue:", err);
        const errorMessage = err instanceof Error ? err.message : dict.toasts.errorGeneric;
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------- styles --------------------------------- */
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: alpha("#1A202C", 0.5),
      borderRadius: 2,
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
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
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                p: 1.25,
                borderRadius: 2,
                display: "flex",
              }}
            >
              <ReportProblemIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} color="white">
                {dict.vehicles.dialogs.reportIssueTitle}
              </Typography>
              <Typography variant="caption" sx={{ color: alpha("#fff", 0.4), mt: 0.5, display: "block" }}>
                {dict.vehicles.dialogs.vehicleLabel}: <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>{vehiclePlate}</span>
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Stack spacing={4}>
          {(error || success) && (
            <Alert 
              severity={success ? "success" : "error"} 
              variant="filled"
              sx={{ 
                borderRadius: 2,
                bgcolor: alpha(success ? theme.palette.success.main : theme.palette.error.main, 0.1),
                color: success ? theme.palette.success.light : theme.palette.error.light,
                border: `1px solid ${alpha(success ? theme.palette.success.main : theme.palette.error.main, 0.2)}`,
              }}
            >
              {success ? dict.toasts.successAdd : error}
            </Alert>
          )}

          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
              {dict.vehicles.dialogs.coreDetails}
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label={dict.vehicles.dialogs.issueTitle}
                placeholder={dict.vehicles.dialogs.issuePlaceholder}
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                disabled={loading}
                error={!!fieldErrors.title}
                helperText={fieldErrors.title}
                sx={textFieldSx}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                select
                label={dict.vehicles.dialogs.priorityLevel}
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                required
                disabled={loading}
                error={!!fieldErrors.priority}
                helperText={fieldErrors.priority}
                sx={textFieldSx}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  renderValue: (value) => {
                    const colorKey = getPriorityColor(value as string) as "error" | "warning" | "info" | "success";
                    const mainColor = theme.palette[colorKey]?.main || theme.palette.text.primary;
                    
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: mainColor,
                            boxShadow: `0 0 10px ${alpha(mainColor, 0.5)}`,
                          }}
                        />
                        <Typography variant="body2" color="white" fontWeight={500}>
                          {dict.vehicles.priorities[value as keyof typeof dict.vehicles.priorities]}
                        </Typography>
                      </Box>
                    );
                  },
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        bgcolor: "#1A202C",
                        backgroundImage: "none",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        mt: 1,
                      }
                    }
                  }
                }}
              >
                {(Object.values(IssuePriority) as IssuePriority[]).map((p) => (
                  <MenuItem key={p as string} value={p} sx={{ py: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: getPriorityColor(p as string),
                        }}
                      />
                      <Typography variant="body2">{dict.vehicles.priorities[p as keyof typeof dict.vehicles.priorities]}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
              {dict.vehicles.dialogs.extendedDescription}
            </Typography>
            <TextField
              fullWidth
              label={dict.vehicles.dialogs.details}
              placeholder={dict.vehicles.dialogs.detailsPlaceholder}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={loading}
              multiline
              rows={4}
              error={!!fieldErrors.description}
              helperText={fieldErrors.description}
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
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
              fontWeight: 700,
              minWidth: 140,
            }}
          >
            {loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>{dict.toasts.loading}</span>
              </Stack>
            ) : dict.vehicles.dialogs.submitIssue}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ReportIssueDialog;
