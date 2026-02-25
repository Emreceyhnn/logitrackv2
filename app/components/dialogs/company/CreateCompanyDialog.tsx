"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import {
  CreateCompanyState,
  CreateCompanyActions,
  CompanyFormData,
  CreateCompanyDialogProps,
} from "@/app/lib/type/create-company";
import Sidebar from "./Sidebar";
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
        loading: false, // Corrected from isLoading to loading
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
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: alpha(theme.palette.background.default, 0.95),
          backdropFilter: "blur(20px)",
          backgroundImage: "none",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: theme.shadows[24],
          overflow: "hidden",
          height: { xs: "auto", md: 700 },
        },
      }}
    >
      <DialogContent sx={{ p: 0, display: "flex", height: "100%" }}>
        {/* Sidebar */}
        <Sidebar activeStep={state.activeStep} />

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: { xs: 3, md: 6 },
            position: "relative",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              color: "text.secondary",
              bgcolor: alpha(theme.palette.text.secondary, 0.05),
              "&:hover": { bgcolor: alpha(theme.palette.text.secondary, 0.1) },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Scrollable Form Content */}
          <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>{renderStep()}</Box>

          {/* Footer Actions */}
          <Box
            sx={{
              mt: 4,
              pt: 4,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                onClick={onClose}
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "transparent", color: "text.primary" },
                }}
              >
                Cancel
              </Button>

              <Stack direction="row" spacing={2}>
                {state.activeStep > 0 && (
                  <Button
                    onClick={actions.handleBack}
                    disabled={state.loading}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      px: 3,
                      borderColor: alpha(theme.palette.divider, 0.2),
                      color: "text.primary",
                    }}
                  >
                    Back
                  </Button>
                )}

                {state.activeStep === 1 ? (
                  <Button
                    variant="contained"
                    onClick={actions.submit}
                    disabled={state.loading}
                    endIcon={state.loading ? null : <CheckIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      px: 4,
                      minWidth: 140,
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                    }}
                  >
                    {state.loading ? "Creating..." : "Complete Setup"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={actions.handleNext}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      px: 4,
                      minWidth: 140,
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                    }}
                  >
                    Continue
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
