"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  useTheme,
  alpha,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import {
  CompanyFormData,
  CreateCompanyDialogProps,
} from "@/app/lib/type/create-company";
import Step1Branding from "./Step1Branding";
import Step2Regional from "./Step2Regional";
import { toast } from "sonner";
import { uploadImageAction } from "@/app/lib/actions/upload";
import { createCompany } from "@/app/lib/controllers/company";

const initialFormData: CompanyFormData = {
  name: "",
  logo: null,
  industry: "",
  timezone: "EST",
  currency: "USD",
  language: "EN",
  regionalVisibility: true,
};

export default function CreateCompanyDialog({
  open,
  onClose,
  onSuccess,
}: CreateCompanyDialogProps) {
  const theme = useTheme();

  /* ---------------------------------- State --------------------------------- */
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CompanyFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- Handlers -------------------------------- */
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const updateFormData = (data: Partial<CompanyFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetDialog = () => {
    setActiveStep(0);
    setFormData(initialFormData);
    setLoading(false);
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let logoUrl = formData.logo;

      if (logoUrl && logoUrl.startsWith("data:image")) {
        const uploadResult = await uploadImageAction(logoUrl, "general", "logos");
        logoUrl = uploadResult.url;
      }

      await createCompany(formData.name, logoUrl || "");

      toast.success("Company created successfully!");
      onSuccess?.();
      onClose();
      resetDialog();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create company";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const legacyState = {
    activeStep,
    formData,
    loading,
    error,
  };

  const legacyActions = {
    handleNext,
    handleBack,
    updateFormData,
    submit: handleSubmit,
    reset: resetDialog,
  };

  /* -------------------------------- Render ---------------------------------- */
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <Step1Branding state={legacyState} actions={legacyActions} />;
      case 1:
        return <Step2Regional state={legacyState} actions={legacyActions} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
      <Box sx={{ p: 4, pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700} color="white">
              {activeStep === 0
                ? "Create Company Portfolio"
                : "Regional Settings"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure your organization&apos;s core profile and presence
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.secondary",
              bgcolor: alpha(theme.palette.text.secondary, 0.05),
              "&:hover": { bgcolor: alpha(theme.palette.text.secondary, 0.1) },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stepper
          activeStep={activeStep}
          sx={{
            "& .MuiStepLabel-label": {
              color: alpha("#fff", 0.5),
              fontWeight: 600,
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: alpha("#fff", 0.7),
            },
            "& .MuiStepIcon-root": { color: alpha(theme.palette.divider, 0.1) },
            "& .MuiStepIcon-root.Mui-active": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: theme.palette.primary.main,
            },
          }}
        >
          <Step>
            <StepLabel>Branding & Legal</StepLabel>
          </Step>
          <Step>
            <StepLabel>Localization & Scope</StepLabel>
          </Step>
        </Stepper>
      </Box>

      <DialogContent sx={{ mt: 2, pb: 4, minHeight: 300 }}>
        {renderStep()}
      </DialogContent>

      <DialogActions
        sx={{
          p: 4,
          pt: 1,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={activeStep === 0 ? onClose : handleBack}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 600,
          }}
          startIcon={activeStep > 0 ? <NavigateBeforeIcon /> : null}
        >
          {activeStep === 0 ? "Cancel" : "Back"}
        </Button>

        <Button
          variant="contained"
          onClick={activeStep === 1 ? handleSubmit : handleNext}
          disabled={loading || (activeStep === 0 && !formData.name)}
          endIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : activeStep === 1 ? (
              <CheckIcon />
            ) : (
              <NavigateNextIcon />
            )
          }
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 4,
            minWidth: 140,
            fontWeight: 600,
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          {loading
            ? "Creating..."
            : activeStep === 1
              ? "Complete Setup"
              : "Next Step"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
