"use client";

import {
  alpha,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Stack,
  useTheme,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CustomerWithRelations, CustomerFormValues } from "@/app/lib/type/customer";
import { updateCustomer } from "@/app/lib/controllers/customer";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useUser } from "@/app/lib/hooks/useUser";
import IdentitySection from "./addCustomerDialog/sections/IdentitySection";
import ContactSection from "./addCustomerDialog/sections/ContactSection";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface EditCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: CustomerWithRelations | null;
}

import { Formik, Form } from "formik";
import { editCustomerValidationSchema } from "@/app/lib/validationSchema";

export default function EditCustomerDialog({
  open,
  onClose,
  onSuccess,
  customer,
}: EditCustomerDialogProps) {
  const { user } = useUser();
  const theme = useTheme();
  const dict = useDictionary();

  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: CustomerFormValues) => {
    if (!customer || !user) return;

    startTransition(async () => {
      try {
        setError(null);
        await updateCustomer(customer.id, {
          name: values.name,
          code: values.code,
          industry: values.industry,
          taxId: values.taxId,
          email: values.email,
          phone: values.phone,
          locations: values.locations.filter(l => l.address.trim() !== "")
        });
        toast.success(dict.customers.dialogs.successUpdate);
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : dict.customers.dialogs.errorUpdate;
        setError(message);
        console.error(err);
        toast.error(message);
      }
    });
  };

  const validationSchema = useMemo(() => editCustomerValidationSchema(dict), [dict]);
  if (!customer) return null;

  const steps = [dict.customers.dialogs.steps.identity, dict.customers.dialogs.steps.contact];

  const customerInitialValues = {
    name: customer.name || "",
    code: customer.code || "",
    industry: customer.industry || "",
    taxId: customer.taxId || "",
    email: customer.email || "",
    phone: customer.phone || "",
    locations: customer.locations?.map(loc => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      lat: loc.lat ?? undefined,
      lng: loc.lng ?? undefined,
      isDefault: loc.isDefault
    })) || [{ name: dict.customers.fields.mainOffice, address: "", lat: undefined, lng: undefined, isDefault: true }],
  };

  return (
    <GoogleMapsProvider>
      <Formik
        initialValues={customerInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors }) => (
          <Dialog
            open={open}
            onClose={onClose}
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
            <Form>
              <Box sx={{ p: 3, pb: 0 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
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
                      <Typography variant="h6" sx={{ lineHeight: 1 }}>🏢</Typography>
                    </Box>
                    <Stack spacing={0.2}>
                      <Typography variant="h6" fontWeight={700} color="white">
                        {dict.customers.dialogs.editTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dict.customers.dialogs.editSubtitle.replace("{name}", customer.name)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
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
                    "& .MuiStepLabel-label.Mui-active": { color: theme.palette.primary.main },
                    "& .MuiStepLabel-label.Mui-completed": { color: alpha("#fff", 0.5) },
                    "& .MuiStepIcon-root": { color: alpha(theme.palette.divider, 0.1) },
                    "& .MuiStepIcon-root.Mui-active": { color: theme.palette.primary.main },
                    "& .MuiStepIcon-root.Mui-completed": { color: theme.palette.primary.main },
                    "& .MuiStepConnector-line": { borderColor: alpha(theme.palette.divider, 0.1) },
                    "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": { borderColor: theme.palette.primary.main },
                    "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": { borderColor: theme.palette.primary.main },
                  }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <DialogContent sx={{ pb: 4, minHeight: 450 }}>
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
                    <Typography variant="caption" color="error" fontWeight={600}>{error}</Typography>
                  </Box>
                )}
                
                {currentStep === 1 && <IdentitySection />}
                {currentStep === 2 && <ContactSection />}
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
                  onClick={currentStep === 1 ? onClose : () => setCurrentStep(1)}
                  sx={{ color: "text.secondary", textTransform: "none", fontWeight: 600 }}
                >
                  {currentStep === 1 ? dict.common.cancel : dict.common.back}
                </Button>

                <Button
                  variant="contained"
                  type={currentStep === 2 ? "submit" : "button"}
                  disabled={isPending || (currentStep === 1 && (!values.name || !!errors.name || !!errors.industry || !!errors.code))}
                  onClick={currentStep === 1 ? () => setCurrentStep(2) : undefined}
                  sx={{
                    minWidth: 160,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                    py: 1.2,
                  }}
                  startIcon={isPending && <CircularProgress size={16} color="inherit" />}
                >
                  {isPending ? dict.common.updating : currentStep < 2 ? dict.common.nextStep : dict.common.saveChanges}
                </Button>
              </DialogActions>
            </Form>
          </Dialog>
        )}
      </Formik>
    </GoogleMapsProvider>
  );
}
