"use client";

import {
  alpha,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import {
  AddDriverDialogProps,
  AddDriverStep1,
  AddDriverStep2,
} from "@/app/lib/type/driver";
import { toast } from "sonner";
import { createDriver } from "@/app/lib/controllers/driver";
import { uploadImageAction } from "@/app/lib/actions/upload";
import FirstDriverDialogStep from "./firstStep";
import SecondDriverDialogStep from "./secondStep";

const initialStep1: AddDriverStep1 = {
  userId: "",
  phone: "",
  employeeId: "",
  licenseNo: "",
  licenseExpiry: null,
  licenseType: "",
  licenseIssueDate: null,
  licenseRegion: "",
  licencePhoto: null,
};

const initialStep2: AddDriverStep2 = {
  homeWareHouseId: "",
  currentVehicleId: "",
  status: "OFF_DUTY",
  languages: [],
  hazmatCertified: false,
  documents: [],
};

const AddDriverDialog = ({
  open,
  onClose,
  onSuccess,
}: AddDriverDialogProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
  const [step1, setStep1] = useState<AddDriverStep1>(initialStep1);
  const [step2, setStep2] = useState<AddDriverStep2>(initialStep2);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- handlers --------------------------------- */
  const updateStep1 = (data: Partial<AddDriverStep1>) =>
    setStep1((prev) => ({ ...prev, ...data }));
  const updateStep2 = (data: Partial<AddDriverStep2>) =>
    setStep2((prev) => ({ ...prev, ...data }));

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      // 1. Upload Licence Photo if exists
      let licensePhotoUrl = "";
      if (step1.licencePhoto) {
        const base64 = await fileToBase64(step1.licencePhoto);
        const uploadResult = await uploadImageAction(
          base64,
          `drivers/${step1.userId}/license`
        );
        licensePhotoUrl = uploadResult.url;
      }

      // 2. Upload additional documents if exist
      const uploadedDocs = await Promise.all(
        step2.documents.map(async (doc) => {
          if (doc.file) {
            const base64 = await fileToBase64(doc.file);
            const uploadResult = await uploadImageAction(
              base64,
              `drivers/${step1.userId}/docs`
            );
            return {
              name: doc.name,
              type: doc.type,
              url: uploadResult.url,
              expiryDate: doc.expiryDate || undefined,
            };
          }
          return null;
        })
      );

      const payload = {
        userId: step1.userId,
        phone: step1.phone,
        employeeId: step1.employeeId,
        licenseNumber: step1.licenseNo,
        licenseExpiry: step1.licenseExpiry,
        licenseType: step1.licenseType,
        status: step2.status as any,
        currentVehicleId: step2.currentVehicleId || null,
        homeBaseWarehouseId: step2.homeWareHouseId || null,
        languages: step2.languages,
        hazmatCertified: step2.hazmatCertified,
        licensePhotoUrl,
        documents: uploadedDocs.filter((d) => d !== null) as any[],
      };

      await createDriver(payload);

      toast.success("Driver added successfully");

      setTimeout(() => {
        onClose();
        onSuccess?.();
        resetForm();
      }, 1500);
    } catch (err: any) {
      const message = err.message || "Failed to create driver";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep1(initialStep1);
    setStep2(initialStep2);
    setCurrentStep(1);
    setIsLoading(false);
    setError(null);
  };

  const closeDialog = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const steps = ["DRIVER CREDENTIALS", "ASSIGNMENT & SETTINGS"];

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#0B1019",
          backgroundImage: "none",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      <Box sx={{ p: 3, pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={600} color="white">
              Add New Driver
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Onboard a new operator to your fleet management system
            </Typography>
          </Stack>
          <IconButton
            onClick={closeDialog}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
      <DialogContent>
        <Box sx={{ mb: 4, px: 2 }}>
          <Stepper
            activeStep={currentStep - 1}
            sx={{
              "& .MuiStepConnector-line": {
                borderColor: alpha(theme.palette.divider, 0.1),
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      "&.Mui-active": { color: theme.palette.primary.main },
                      "&.Mui-completed": { color: theme.palette.primary.main },
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color={
                      currentStep - 1 >= index
                        ? "text.primary"
                        : "text.secondary"
                    }
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Divider
          sx={{ mb: 4, borderColor: alpha(theme.palette.divider, 0.05) }}
        />

        <Box sx={{ minHeight: 400 }}>
          {error && (
            <Box
              mb={3}
              p={2}
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            </Box>
          )}
          {currentStep === 1 && (
            <FirstDriverDialogStep state={step1} updateStep1={updateStep1} />
          )}
          {currentStep === 2 && (
            <SecondDriverDialogStep
              state={step2}
              updateStep2={updateStep2}
              step1Data={step1}
              setStep={setCurrentStep}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
        <Button
          onClick={currentStep === 1 ? closeDialog : () => setCurrentStep(1)}
          disabled={isLoading}
          sx={{
            color: "text.secondary",
            "&:hover": { bgcolor: alpha(theme.palette.divider, 0.05) },
          }}
        >
          {currentStep === 1 ? "Cancel" : "Back to Credentials"}
        </Button>
        <Button
          variant="contained"
          onClick={currentStep === 1 ? () => setCurrentStep(2) : handleSubmit}
          disabled={
            isLoading ||
            (currentStep === 1 &&
              (!step1.userId || !step1.employeeId || !step1.phone))
          }
          startIcon={
            isLoading && <CircularProgress size={16} color="inherit" />
          }
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 600,
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          {isLoading
            ? "Saving..."
            : currentStep === 1
              ? "Next: Assignment"
              : "Complete Onboarding"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDriverDialog;
