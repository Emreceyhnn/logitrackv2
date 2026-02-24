"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Typography,
  IconButton,
  Container,
  Paper,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  StepperPageState,
  StepperPageActions,
  StepperFormData,
} from "@/app/lib/type/stepper-example";
import StepOne from "@/app/components/dialogs/stepper-example/StepOne";
import StepTwo from "@/app/components/dialogs/stepper-example/StepTwo";
import StepThree from "@/app/components/dialogs/stepper-example/StepThree";
import CreateCompanyDialog from "@/app/components/dialogs/company/CreateCompanyDialog";
import AddCompanyMemberDialog from "@/app/components/dialogs/company/AddCompanyMemberDialog";
import { toast } from "sonner";

const initialFormData: StepperFormData = {
  firstName: "",
  lastName: "",
  email: "",
  companyName: "",
  role: "",
  experience: "",
  notifications: true,
  newsletter: false,
  theme: "dark",
};

const steps = ["Personal Info", "Professional Info", "Preferences"];

export default function StepperExamplePage() {
  const theme = useTheme();

  /* ---------------------------------- State --------------------------------- */
  const [state, setState] = useState<StepperPageState>({
    activeStep: 0,
    formData: initialFormData,
    isDialogOpen: false,
    isSubmitting: false,
    error: null,
  });
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);

  /* --------------------------------- Actions -------------------------------- */
  const actions: StepperPageActions = {
    handleNext: useCallback(() => {
      setState((prev) => ({ ...prev, activeStep: prev.activeStep + 1 }));
    }, []),

    handleBack: useCallback(() => {
      setState((prev) => ({ ...prev, activeStep: prev.activeStep - 1 }));
    }, []),

    handleReset: useCallback(() => {
      setState((prev) => ({
        ...prev,
        activeStep: 0,
        formData: initialFormData,
        error: null,
      }));
    }, []),

    updateFormData: useCallback((data: Partial<StepperFormData>) => {
      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, ...data },
      }));
    }, []),

    submitForm: useCallback(async () => {
      setState((prev) => ({ ...prev, isSubmitting: true, error: null }));
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Registration complete successfully!");
        actions.toggleDialog(false);
        actions.handleReset();
      } catch (err) {
        setState((prev) => ({ ...prev, error: "Failed to submit form" }));
        toast.error("Form submission failed");
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    }, []),

    toggleDialog: useCallback((open: boolean) => {
      setState((prev) => ({ ...prev, isDialogOpen: open }));
    }, []),
  };

  /* -------------------------------- Components ------------------------------- */
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <StepOne
            formData={state.formData}
            updateFormData={actions.updateFormData}
            onNext={actions.handleNext}
            onBack={actions.handleBack}
          />
        );
      case 1:
        return (
          <StepTwo
            formData={state.formData}
            updateFormData={actions.updateFormData}
            onNext={actions.handleNext}
            onBack={actions.handleBack}
          />
        );
      case 2:
        return (
          <StepThree
            formData={state.formData}
            updateFormData={actions.updateFormData}
            onNext={actions.handleNext}
            onBack={actions.handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={4} alignItems="center">
        <Box textAlign="center">
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, mb: 2, color: "text.primary" }}
          >
            Stepper Dialog Pattern
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Advanced multi-step state management architecture
          </Typography>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: 6,
            width: "100%",
            borderRadius: 4,
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack spacing={4}>
            <Typography variant="body1">
              This page demonstrates the reusable page architecture pattern. The
              state is managed in the page root and passed down to children.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => actions.toggleDialog(true)}
                sx={{
                  alignSelf: "center",
                  minWidth: 200,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Open Stepper Dialog
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setIsCompanyDialogOpen(true)}
                sx={{
                  alignSelf: "center",
                  minWidth: 200,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Create Company Dialog
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setIsMemberDialogOpen(true)}
                sx={{
                  alignSelf: "center",
                  minWidth: 200,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Add Member Dialog
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>

      <Dialog
        open={state.isDialogOpen}
        onClose={() => actions.toggleDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "background.paper",
            backgroundImage: "none",
            boxShadow: theme.shadows[24],
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Complete Registration
          </Typography>
          <IconButton
            onClick={() => actions.toggleDialog(false)}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4, pt: 1 }}>
          <Stepper activeStep={state.activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(state.activeStep)}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
          <Button
            disabled={state.activeStep === 0 || state.isSubmitting}
            onClick={actions.handleBack}
            sx={{ textTransform: "none" }}
          >
            Back
          </Button>
          <Box>
            {state.activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={actions.submitForm}
                disabled={state.isSubmitting}
                sx={{ minWidth: 120, borderRadius: 1.5 }}
              >
                {state.isSubmitting ? "Submitting..." : "Finish"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={actions.handleNext}
                sx={{ minWidth: 120, borderRadius: 1.5 }}
              >
                Next Step
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      <CreateCompanyDialog
        open={isCompanyDialogOpen}
        onClose={() => setIsCompanyDialogOpen(false)}
      />

      <AddCompanyMemberDialog
        open={isMemberDialogOpen}
        onClose={() => setIsMemberDialogOpen(false)}
      />
    </Container>
  );
}
