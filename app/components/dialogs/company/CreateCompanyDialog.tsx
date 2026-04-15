"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  useTheme,
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
import { Formik } from "formik";
import { createCompanyValidationSchema } from "@/app/lib/validationSchema";
import {
  CompanyFormData,
  CreateCompanyDialogProps,
} from "@/app/lib/type/create-company";
import Step1Branding from "./Step1Branding";
import Step2Regional from "./Step2Regional";
import { toast } from "sonner";
import { uploadImageAction } from "@/app/lib/actions/upload";
import { createCompany } from "@/app/lib/controllers/company";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

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
  const dict = useDictionary();

  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0); // For framer-motion slide direction
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

  const handleSubmit = async (values: CompanyFormData) => {
    setLoading(true);
    try {
      let logoUrl = values.logo;

      if (logoUrl && logoUrl.startsWith("data:image")) {
        const uploadResult = await uploadImageAction(
          logoUrl,
          "general",
          "logos"
        );
        logoUrl = uploadResult.url;
      }

      await createCompany(values.name, logoUrl || "");

      toast.success(dict.toasts.successAdd);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : dict.toasts.errorGeneric;
      toast.error(message);
    } finally {
      setLoading(false);
    }
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

  const steps = [
    dict.company.dialogs.steps.branding,
    dict.company.dialogs.steps.regional,
  ];

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
          border: `1px solid ${theme.palette.divider_alpha.main_10}`,
          overflow: "hidden",
        },
      }}
    >
      <Formik
        initialValues={initialFormData}
        validationSchema={useMemo(
          () => createCompanyValidationSchema(dict),
          [dict]
        )}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ values, errors, setFieldValue, submitForm }) => (
          <>
            <Box sx={{ p: 4, pb: 0 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Stack spacing={0.5}>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ letterSpacing: "-0.02em" }}
                  >
                    {activeStep === 0
                      ? dict.company.dialogs.identityTitle
                      : dict.company.dialogs.regionalTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dict.company.dialogs.identitySubtitle}
                  </Typography>
                </Stack>
                <IconButton
                  onClick={onClose}
                  sx={{
                    color: "text.secondary",
                    bgcolor: theme.palette.text.secondary_alpha.main_05,
                    "&:hover": {
                      bgcolor: theme.palette.error._alpha.main_10,
                      color: theme.palette.error.main,
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
                    color: theme.palette.text.primary_alpha.main_40,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: theme.palette.text.primary_alpha.main_80,
                  },
                  "& .MuiStepIcon-root": {
                    color: theme.palette.divider_alpha.main_10,
                  },
                  "& .MuiStepIcon-root.Mui-active": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiStepIcon-root.Mui-completed": {
                    color: theme.palette.primary.main,
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

            <DialogContent
              sx={{ mt: 2, pb: 4, minHeight: 400, overflow: "hidden" }}
            >
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
                  {activeStep === 0 && (
                    <Step1Branding
                      state={{
                        activeStep,
                        formData: values,
                        loading,
                        error: null,
                      }}
                      actions={{
                        handleNext,
                        handleBack,
                        updateFormData: (data) => {
                          Object.keys(data).forEach((key) => {
                            setFieldValue(key, data[key as keyof typeof data]);
                          });
                        },
                        submit: submitForm,
                        reset: () => {},
                      }}
                    />
                  )}
                  {activeStep === 1 && (
                    <Step2Regional
                      state={{
                        activeStep,
                        formData: values,
                        loading,
                        error: null,
                      }}
                      actions={{
                        handleNext,
                        handleBack,
                        updateFormData: (data) => {
                          Object.keys(data).forEach((key) => {
                            setFieldValue(key, data[key as keyof typeof data]);
                          });
                        },
                        submit: submitForm,
                        reset: () => {},
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </DialogContent>

            <DialogActions
              sx={{
                p: 4,
                pt: 1,
                borderTop: `1px solid ${theme.palette.divider_alpha.main_05}`,
                justifyContent: "space-between",
                bgcolor: theme.palette.background.paper_alpha.main_40,
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
                  "&:hover": {
                    bgcolor: theme.palette.text.secondary_alpha.main_10,
                  },
                }}
                startIcon={activeStep > 0 ? <NavigateBeforeIcon /> : null}
              >
                {activeStep === 0 ? dict.common.cancel : dict.common.back}
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  if (activeStep === 0) {
                    // Check if name and industry are valid for first step
                    if (!errors.name && !errors.industry && values.name) {
                      handleNext();
                    } else {
                      toast.error(dict.validation.genericFormError);
                    }
                  } else {
                    submitForm();
                  }
                }}
                disabled={loading}
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
                  boxShadow: `0 8px 20px ${theme.palette.primary._alpha.main_25}`,
                  "&:hover": {
                    boxShadow: `0 12px 24px ${theme.palette.primary._alpha.main_35}`,
                  },
                }}
              >
                {loading
                  ? dict.toasts.loading
                  : activeStep === 1
                    ? dict.common.save
                    : dict.common.next}
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
