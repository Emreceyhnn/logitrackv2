"use client";

import {
  alpha,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import {
  AddCustomerDialogProps,
  AddCustomerPageActions,
  AddCustomerPageState,
} from "@/app/lib/type/add-customer";
import { toast } from "sonner";
import { createCustomer } from "@/app/lib/controllers/customer";
import { useUser } from "@/app/lib/hooks/useUser";
import IdentitySection from "./sections/IdentitySection";
import ContactSection from "./sections/ContactSection";

const initialIdentity = {
  name: "",
  code: "",
  industry: "",
  taxId: "",
};

const initialContact = {
  email: "",
  phone: "",
  address: "",
};

const AddCustomerDialog = ({
  open,
  onClose,
  onSuccess,
}: AddCustomerDialogProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const { user } = useUser();

  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<AddCustomerPageState>({
    data: {
      identity: initialIdentity,
      contact: initialContact,
    },
    currentStep: 1,
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  /* ---------------------------------- actions --------------------------------- */
  const actions: AddCustomerPageActions = {
    updateIdentity: (data) =>
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, identity: { ...prev.data.identity, ...data } },
      })),
    updateContact: (data) =>
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, contact: { ...prev.data.contact, ...data } },
      })),
    setStep: (step) => setState((prev) => ({ ...prev, currentStep: step })),
    handleSubmit: async () => {
      if (!user || !user.companyId) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        await createCustomer(
          user.id,
          user.companyId,
          state.data.identity.name,
          state.data.identity.code,
          state.data.identity.industry || undefined,
          state.data.identity.taxId || undefined,
          state.data.contact.email || undefined,
          state.data.contact.phone || undefined,
          state.data.contact.address || undefined
        );

        toast.success("Customer created successfully");
        onSuccess?.();
        actions.closeDialog();
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message || "Failed to create customer",
        }));
        toast.error(err.message || "Failed to create customer");
      }
    },
    closeDialog: () => {
      onClose();
      setTimeout(() => actions.reset(), 300);
    },
    reset: () => {
      setState({
        data: {
          identity: initialIdentity,
          contact: initialContact,
        },
        currentStep: 1,
        isLoading: false,
        error: null,
        isSuccess: false,
      });
    },
  };

  const steps = ["Company Identity", "Contact Details"];

  return (
    <Dialog
      open={open}
      onClose={actions.closeDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0B0F19",
          backgroundImage: "none",
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          maxHeight: "90vh",
        },
      }}
    >
      <Box sx={{ p: 3, pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <Typography variant="h6" sx={{ lineHeight: 1 }}>
                🏢
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} color="white">
              Add New Customer
            </Typography>
          </Stack>
          <IconButton
            onClick={actions.closeDialog}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stepper
          activeStep={state.currentStep - 1}
          sx={{
            mb: 4,
            "& .MuiStepLabel-label": {
              color: alpha("#fff", 0.3),
              fontWeight: 600,
              fontSize: "0.65rem",
              textTransform: "uppercase",
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: alpha("#fff", 0.5),
            },
            "& .MuiStepIcon-root": { color: alpha(theme.palette.divider, 0.1) },
            "& .MuiStepIcon-root.Mui-active": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepConnector-line": {
              borderColor: alpha(theme.palette.divider, 0.1),
            },
            "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
              borderColor: theme.palette.primary.main,
            },
            "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ pb: 4, minHeight: 350 }}>
        {state.currentStep === 1 && (
          <IdentitySection state={state.data.identity} actions={actions} />
        )}
        {state.currentStep === 2 && (
          <ContactSection state={state.data.contact} actions={actions} />
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 1,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={
            state.currentStep === 1
              ? actions.closeDialog
              : () => actions.setStep(state.currentStep - 1)
          }
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {state.currentStep === 1 ? "Cancel" : "Back"}
        </Button>

        <Button
          variant="contained"
          disabled={
            state.isLoading ||
            (state.currentStep === 1 &&
              (!state.data.identity.name || !state.data.identity.code))
          }
          onClick={
            state.currentStep < 2
              ? () => actions.setStep(2)
              : actions.handleSubmit
          }
          sx={{
            minWidth: 160,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
            py: 1.2,
          }}
          startIcon={
            state.isLoading && <CircularProgress size={16} color="inherit" />
          }
        >
          {state.isLoading
            ? "Creating..."
            : state.currentStep < 2
              ? "Next Step →"
              : "Register Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerDialog;
