"use client";

import { useState, useCallback } from "react";
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
  CreateCompanyState,
  CreateCompanyActions,
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
  const [state, setState] = useState<CreateCompanyState>({
    activeStep: 0,
    formData: initialFormData,
    loading: false,
    error: null,
  });

  /* --------------------------------- Actions -------------------------------- */
  const handleNext = useCallback(() => {
    setState((prev) => ({ ...prev, activeStep: prev.activeStep + 1 }));
  }, []);

  const handleBack = useCallback(() => {
    setState((prev) => ({ ...prev, activeStep: prev.activeStep - 1 }));
  }, []);

  const updateFormData = useCallback((data: Partial<CompanyFormData>) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      activeStep: 0,
      formData: initialFormData,
      loading: false,
      error: null,
    });
  }, []);

  const submit = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      let logoUrl = state.formData.logo;

      // 1. Upload logo to Cloudinary if it's a base64 string
      if (logoUrl && logoUrl.startsWith("data:image")) {
        const uploadResult = await uploadImageAction(logoUrl, "companies");
        logoUrl = uploadResult.url;
      }

      // 2. Create the company using the controller
      await createCompany(state.formData.name, logoUrl || "");

      toast.success("Company created successfully!");
      onSuccess?.();
      onClose();
      reset();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create company";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
      toast.error(message);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [state.formData, onSuccess, onClose, reset]);

  const actions: CreateCompanyActions = {
    handleNext,
    handleBack,
    updateFormData,
    submit,
    reset,
  };

  /* -------------------------------- Render ---------------------------------- */
  const renderStep = () => {
    switch (state.activeStep) {
      case 0:
        return <Step1Branding state={state} actions={actions} />;
      case 1:
        return <Step2Regional state={state} actions={actions} />;
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
              {state.activeStep === 0 ? "Create Company Portfolio" : "Regional Settings"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure your organization's core profile and presence
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
          activeStep={state.activeStep}
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
          onClick={state.activeStep === 0 ? onClose : actions.handleBack}
          sx={{ color: "text.secondary", textTransform: "none", fontWeight: 600 }}
          startIcon={state.activeStep > 0 ? <NavigateBeforeIcon /> : null}
        >
          {state.activeStep === 0 ? "Cancel" : "Back"}
        </Button>

        <Button
          variant="contained"
          onClick={state.activeStep === 1 ? actions.submit : actions.handleNext}
          disabled={state.loading || (state.activeStep === 0 && !state.formData.name)}
          endIcon={
            state.loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : state.activeStep === 1 ? (
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
          {state.loading
            ? "Creating..."
            : state.activeStep === 1
              ? "Complete Setup"
              : "Next Step"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
