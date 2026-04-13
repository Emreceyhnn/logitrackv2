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
import { useMemo, useState } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { AddCustomerDialogProps } from "@/app/lib/type/add-customer";
import { toast } from "sonner";
import { createCustomer } from "@/app/lib/controllers/customer";
import { useUser } from "@/app/lib/hooks/useUser";
import IdentitySection from "./sections/IdentitySection";
import ContactSection from "./sections/ContactSection";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { Formik, FormikHelpers } from "formik";
import { addCustomerValidationSchema } from "@/app/lib/validationSchema";

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
  const dict = useDictionary();

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    ...initialIdentity,
    ...initialContact,
  };

  const closeDialog = () => {
    onClose();
    setTimeout(() => {
      setCurrentStep(1);
      setError(null);
    }, 300);
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    if (!user) return;

    setError(null);
    try {
      await createCustomer(
        values.name,
        values.code,
        values.industry || undefined,
        values.taxId || undefined,
        values.email || undefined,
        values.phone || undefined,
        values.locations.filter((l) => l.address.trim() !== "")
      );

      toast.success(dict.customers.dialogs.successAdd);
      onSuccess?.();
      closeDialog();
      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : dict.customers.dialogs.errorAdd;
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [dict.customers.dialogs.steps.identity, dict.customers.dialogs.steps.contact];

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
        <Formik
          initialValues={initialValues}
          validationSchema={useMemo(() => addCustomerValidationSchema(dict), [dict])}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit: formikSubmit,
            isSubmitting,
            validateForm,
          }) => (
            <>
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
                        {dict.customers.dialogs.addTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {dict.customers.registerNewPartner}
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
                  <IdentitySection />
                )}
                {currentStep === 2 && (
                  <ContactSection />
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
                  {currentStep === 1 ? dict.common.cancel : dict.common.back}
                </Button>

                <Button
                  variant="contained"
                  disabled={isSubmitting}
                  onClick={async () => {
                    if (currentStep < 2) {
                      const stepErrors = await validateForm();
                      const hasStep1Errors = Object.keys(stepErrors).some(key => 
                        ["name", "code", "industry", "taxId"].includes(key)
                      );
                      
                      if (!hasStep1Errors) {
                        setCurrentStep(2);
                      } else {
                        // Formik will show errors automatically since fields were likely touched or validateOnBlur is true
                        toast.error(dict.common.fillRequired);
                      }
                    } else {
                      formikSubmit();
                    }
                  }}
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
                    !isSubmitting && currentStep < 2 ? <ArrowForwardIcon /> : undefined
                  }
                  startIcon={
                    isSubmitting && <CircularProgress size={16} color="inherit" />
                  }
                >
                  {isSubmitting
                    ? dict.common.creating
                    : currentStep < 2
                      ? dict.common.nextStep
                      : dict.customers.addCustomer}
                </Button>
              </DialogActions>
            </>
          )}
        </Formik>
      </Dialog>
    </GoogleMapsProvider>
  );
};

export default AddCustomerDialog;
