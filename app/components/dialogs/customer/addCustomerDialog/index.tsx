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
import { AddCustomerDialogProps, AddCustomerContact } from "@/app/lib/type/add-customer";
import { toast } from "sonner";
import { createCustomer } from "@/app/lib/controllers/customer";
import { useUser } from "@/app/lib/hooks/useUser";
import IdentitySection from "./sections/IdentitySection";
import ContactSection from "./sections/ContactSection";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";

const initialIdentity = {
  name: "",
  code: "",
  industry: "",
  taxId: "",
};

const initialContact = {
  email: "",
  phone: "",
  locations: [
    { name: "Main Office", address: "", lat: undefined as number | undefined, lng: undefined as number | undefined, isDefault: true }
  ]
};

const AddCustomerDialog = ({
  open,
  onClose,
  onSuccess,
}: AddCustomerDialogProps) => {
  /* ---------------------------------- State --------------------------------- */
  const theme = useTheme();
  const { user } = useUser();

  const [identityData, setIdentityData] = useState(initialIdentity);
  const [contactData, setContactData] = useState(initialContact);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- Handlers -------------------------------- */
  const updateIdentity = (data: Partial<typeof initialIdentity>) => {
    setIdentityData((prev) => ({ ...prev, ...data }));
  };

  const updateContact = (data: Partial<AddCustomerContact>) => {
    setContactData((prev) => ({ ...prev, ...data } as typeof initialContact));
  };

  const resetDialog = () => {
    setIdentityData(initialIdentity);
    setContactData(initialContact);
    setCurrentStep(1);
    setIsLoading(false);
    setError(null);
  };

  const closeDialog = () => {
    onClose();
    setTimeout(resetDialog, 300);
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      await createCustomer(
        identityData.name,
        identityData.code,
        identityData.industry || undefined,
        identityData.taxId || undefined,
        contactData.email || undefined,
        contactData.phone || undefined,
        contactData.locations.filter(l => l.address.trim() !== '')
      );

      toast.success("Customer created successfully");
      onSuccess?.();
      closeDialog();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create customer";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = ["Company Identity", "Contact Details"];

  return (
    <GoogleMapsProvider>
      <Dialog
        open={open}
        onClose={closeDialog}
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
            <IconButton onClick={closeDialog} sx={{ color: "text.secondary" }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stepper
            activeStep={currentStep - 1}
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
          {error && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.05),
                border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
              }}
            >
              <Typography variant="caption" color="error" fontWeight={600}>
                {error}
              </Typography>
            </Box>
          )}
          {currentStep === 1 && (
            <IdentitySection
              state={identityData}
              updateIdentity={updateIdentity}
            />
          )}
          {currentStep === 2 && (
            <ContactSection state={contactData} updateContact={updateContact} />
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
              currentStep === 1
                ? closeDialog
                : () => setCurrentStep(currentStep - 1)
            }
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          <Button
            variant="contained"
            disabled={
              isLoading ||
              (currentStep === 1 && !identityData.name)
            }
            onClick={currentStep < 2 ? () => setCurrentStep(2) : handleSubmit}
            sx={{
              minWidth: 160,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
              py: 1.2,
            }}
            startIcon={
              isLoading && <CircularProgress size={16} color="inherit" />
            }
          >
            {isLoading
              ? "Creating..."
              : currentStep < 2
                ? "Next Step →"
                : "Register Customer"}
          </Button>
        </DialogActions>
      </Dialog>
    </GoogleMapsProvider>
  );
};

export default AddCustomerDialog;
