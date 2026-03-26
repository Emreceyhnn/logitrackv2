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
import BusinessIcon from "@mui/icons-material/Business";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: alpha(theme.palette.background.default, 0.4),
            },
          },
        }}
        PaperProps={{
          sx: {
            bgcolor: "#0B0F19",
            backgroundImage: "radial-gradient(circle at top right, rgba(37, 99, 235, 0.05), transparent), radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.03), transparent)",
            borderRadius: 4,
            border: `1px solid ${alpha("#fff", 0.08)}`,
            maxHeight: "90vh",
            boxShadow: "0 24px 48px -12px rgba(0,0,0,0.5)",
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
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  color: theme.palette.primary.main,
                }}
              >
                <BusinessIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="white" lineHeight={1.2}>
                  Add Customer
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  REGISTER A NEW PARTNER
                </Typography>
              </Box>
            </Stack>
            <IconButton 
              onClick={closeDialog} 
              sx={{ 
                color: "text.secondary",
                bgcolor: alpha("#fff", 0.03),
                "&:hover": { bgcolor: alpha("#fff", 0.08), color: "white" }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stepper
            activeStep={currentStep - 1}
            sx={{
              mb: 4,
              px: 1,
              "& .MuiStepLabel-label": {
                color: alpha("#fff", 0.3),
                fontWeight: 600,
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                mt: 1,
              },
              "& .MuiStepLabel-label.Mui-active": {
                color: "white",
              },
              "& .MuiStepLabel-label.Mui-completed": {
                color: alpha("#fff", 0.6),
              },
              "& .MuiStepIcon-root": { 
                width: 28,
                height: 28,
                color: alpha("#fff", 0.05),
                border: `1px solid ${alpha("#fff", 0.08)}`,
                borderRadius: "50%",
                transition: "all 0.3s ease",
              },
              "& .MuiStepIcon-root.Mui-active": {
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
              "& .MuiStepIcon-root.Mui-completed": {
                color: theme.palette.primary.main,
              },
              "& .MuiStepIcon-text": {
                fill: "white",
                fontWeight: 700,
              },
              "& .MuiStepConnector-line": {
                borderColor: alpha("#fff", 0.05),
                borderTopWidth: 2,
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
            pt: 2,
            borderTop: `1px solid ${alpha("#fff", 0.05)}`,
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
              color: alpha("#fff", 0.5),
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": { color: "white", bgcolor: alpha("#fff", 0.05) }
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
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
              py: 1.2,
              px: 4,
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              }
            }}
            endIcon={
              !isLoading && currentStep < 2 ? <ArrowForwardIcon /> : undefined
            }
            startIcon={
              isLoading && <CircularProgress size={16} color="inherit" />
            }
          >
            {isLoading
              ? "Creating..."
              : currentStep < 2
                ? "Next Details"
                : "Register Customer"}
          </Button>
        </DialogActions>
      </Dialog>
    </GoogleMapsProvider>
  );
};

export default AddCustomerDialog;
