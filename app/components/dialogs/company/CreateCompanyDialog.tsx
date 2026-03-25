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
import { motion, AnimatePresence } from "framer-motion";
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
  timezone: "UTC",
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
  const [direction, setDirection] = useState(0); // For framer-motion slide direction
  const [formData, setFormData] = useState<CompanyFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  /* -------------------------------- Handlers -------------------------------- */
  const handleNext = () => {
    setDirection(1);
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => {
    setDirection(-1);
    setActiveStep((prev) => prev - 1);
  };

  const updateFormData = (data: Partial<CompanyFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetDialog = () => {
    setActiveStep(0);
    setDirection(0);
    setFormData(initialFormData);
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let logoUrl = formData.logo;

      // Handle logo upload if it's a base64 string
      if (logoUrl && logoUrl.startsWith("data:image")) {
        const uploadResult = await uploadImageAction(
          logoUrl,
          "general",
          "logos"
        );
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
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const stepProps = {
    state: { activeStep, formData, loading, error: null },
    actions: {
      handleNext,
      handleBack,
      updateFormData,
      submit: handleSubmit,
      reset: resetDialog,
    },
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
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
          bgcolor: theme.palette.mode === "dark" ? "#0B1019" : "#fff",
          backgroundImage: "none",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
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
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
              {activeStep === 0
                ? "Company Identity"
                : "Regional Ecosystem"}
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
              "&:hover": { 
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main 
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stepper
          activeStep={activeStep}
          sx={{
            "& .MuiStepLabel-label": {
              color: alpha(theme.palette.text.primary, 0.4),
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: alpha(theme.palette.text.primary, 0.8),
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

      <DialogContent sx={{ mt: 2, pb: 4, minHeight: 320, overflow: "hidden" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {activeStep === 0 && <Step1Branding {...stepProps} />}
            {activeStep === 1 && <Step2Regional {...stepProps} />}
          </motion.div>
        </AnimatePresence>
      </DialogContent>

      <DialogActions
        sx={{
          p: 4,
          pt: 1,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          justifyContent: "space-between",
          bgcolor: alpha(theme.palette.background.paper, 0.4),
        }}
      >
        <Button
          onClick={activeStep === 0 ? onClose : handleBack}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            "&:hover": { bgcolor: alpha(theme.palette.text.secondary, 0.1) }
          }}
          startIcon={activeStep > 0 ? <NavigateBeforeIcon /> : null}
        >
          {activeStep === 0 ? "Discard" : "Back"}
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
            minWidth: 160,
            py: 1.2,
            fontWeight: 800,
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
            "&:hover": {
               boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
            }
          }}
        >
          {loading
            ? "Finalizing..."
            : activeStep === 1
              ? "Publish Portfolio"
              : "Next Objective"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
