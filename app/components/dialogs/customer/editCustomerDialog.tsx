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
import { CustomerWithRelations } from "@/app/lib/type/customer";
import { updateCustomer } from "@/app/lib/controllers/customer";
import { useTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/app/lib/hooks/useUser";
import IdentitySection from "./addCustomerDialog/sections/IdentitySection";
import ContactSection from "./addCustomerDialog/sections/ContactSection";

interface EditCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: CustomerWithRelations | null;
}

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
  lat: undefined as number | undefined,
  lng: undefined as number | undefined,
};

export default function EditCustomerDialog({
  open,
  onClose,
  onSuccess,
  customer,
}: EditCustomerDialogProps) {
  const { user } = useUser();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  /* ---------------------------------- State --------------------------------- */
  const [identityData, setIdentityData] = useState(initialIdentity);
  const [contactData, setContactData] = useState(initialContact);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------- Lifecycle ------------------------------- */
  useEffect(() => {
    if (customer && open) {
      setIdentityData((prev) => {
        const newData = {
          name: customer.name,
          code: customer.code,
          industry: customer.industry || "",
          taxId: customer.taxId || "",
        };
        if (JSON.stringify(prev) === JSON.stringify(newData)) return prev;
        return newData;
      });
      setContactData((prev) => {
        const newData = {
          email: customer.email || "",
          phone: customer.phone || "",
          address: customer.address || "",
          lat: customer.lat ?? undefined,
          lng: customer.lng ?? undefined,
        };
        if (JSON.stringify(prev) === JSON.stringify(newData)) return prev;
        return newData;
      });
      setCurrentStep(1);
      setError(null);
    }
  }, [customer, open]);

  /* -------------------------------- Handlers -------------------------------- */
  const updateIdentity = (data: Partial<typeof initialIdentity>) => {
    setIdentityData((prev) => ({ ...prev, ...data }));
  };

  const updateContact = (data: Partial<typeof initialContact>) => {
    setContactData((prev) => ({ ...prev, ...data }));
  };

  const closeDialog = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!customer || !user) return;

    startTransition(async () => {
      try {
        setError(null);
        await updateCustomer(customer.id, {
          ...identityData,
          ...contactData,
        });
        toast.success("Customer updated successfully");
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to update customer";
        setError(message);
        console.error(err);
        toast.error(message);
      }
    });
  };

  if (!customer) return null;

  const steps = ["Company Identity", "Contact Details"];

  return (
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
            <Stack spacing={0.2}>
              <Typography variant="h6" fontWeight={700} color="white">
                Edit Customer
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Update details for {customer.name}
              </Typography>
            </Stack>
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
            isPending ||
            (currentStep === 1 && (!identityData.name || !identityData.code))
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
            isPending && <CircularProgress size={16} color="inherit" />
          }
        >
          {isPending
            ? "Updating..."
            : currentStep < 2
              ? "Next Step →"
              : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
