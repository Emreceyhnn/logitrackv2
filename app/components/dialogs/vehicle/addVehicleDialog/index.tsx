"use client";

import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FirstStep from "./firstStep";
import TechSpecsStep from "./techSpecsStep";
import DocumentsStep from "./documentsStep";
import {
  AddVehiclePageProps,
  AddVehiclePageState,
  AddVehiclePageActions,
  VehicleStep1Data,
  VehicleStep2Data,
  VehicleStep3Data,
} from "@/app/lib/type/vehicle";
import { createVehicle } from "@/app/lib/controllers/vehicle";
import { toast } from "sonner";

const initialStep1: VehicleStep1Data = {
  fleetNo: "",
  plate: "",
  type: "",
  brand: "",
  model: "",
  year: "",
  odometerKm: "",
  nextServiceKm: "",
};

const initialStep2: VehicleStep2Data = {
  maxLoadKg: "",
  fuelType: "",
  fuelLevel: 50,
  avgFuelConsumption: "",
  engineSize: "",
  transmission: "",
  techNotes: "",
};

const initialStep3: VehicleStep3Data = {
  registrationExpiry: null,
  inspectionExpiry: null,
  nextServiceDueKm: "",
  enableExpiryAlerts: true,
  documents: [],
};

const AddVehicleDialog = ({
  open,
  onClose,
  onSuccess,
}: AddVehiclePageProps) => {
  /* ---------------------------------- State --------------------------------- */
  const theme = useTheme();
  const [state, setState] = useState<AddVehiclePageState>({
    currentStep: 1,
    data: {
      step1: initialStep1,
      step2: initialStep2,
      step3: initialStep3,
    },
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  /* -------------------------------- Handlers -------------------------------- */
  const actions: AddVehiclePageActions = {
    updateStep1: (data) =>
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, step1: { ...prev.data.step1, ...data } },
      })),
    updateStep2: (data) =>
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, step2: { ...prev.data.step2, ...data } },
      })),
    updateStep3: (data) =>
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, step3: { ...prev.data.step3, ...data } },
      })),
    setStep: (step) => setState((prev) => ({ ...prev, currentStep: step })),
    nextStep: () =>
      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 })),
    prevStep: () =>
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 })),
    reset: () =>
      setState({
        currentStep: 1,
        data: {
          step1: initialStep1,
          step2: initialStep2,
          step3: initialStep3,
        },
        isLoading: false,
        error: null,
        isSuccess: false,
      }),
    closeDialog: () => {
      if (!state.isLoading) {
        onClose();
        setTimeout(actions.reset, 300);
      }
    },
    handleSubmit: async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const payload = {
          fleetNo: state.data.step1.fleetNo,
          plate: state.data.step1.plate,
          type: state.data.step1.type,
          brand: state.data.step1.brand,
          model: state.data.step1.model,
          year: state.data.step1.year,
          odometerKm: state.data.step1.odometerKm,
          photo:
            state.data.step1.photo instanceof File
              ? undefined
              : state.data.step1.photo,
          maxLoadKg: state.data.step2.maxLoadKg,
          fuelType: state.data.step2.fuelType,
          avgFuelConsumption: state.data.step2.avgFuelConsumption,
          fuelLevel: state.data.step2.fuelLevel,
          engineSize: state.data.step2.engineSize,
          transmission: state.data.step2.transmission,
          techNotes: state.data.step2.techNotes,
          registrationExpiry: state.data.step3.registrationExpiry?.toDate(),
          inspectionExpiry: state.data.step3.inspectionExpiry?.toDate(),
          nextServiceKm:
            state.data.step1.nextServiceKm || state.data.step3.nextServiceDueKm,
          enableAlerts: state.data.step3.enableExpiryAlerts,
        };

        await createVehicle(payload);

        setState((prev) => ({ ...prev, isSuccess: true, isLoading: false }));
        toast.success("Vehicle added successfully");

        setTimeout(() => {
          onClose();
          onSuccess?.();
          actions.reset();
        }, 1500);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to create vehicle";
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
        toast.error(message);
      }
    },
  };

  const steps = ["General Info", "Tech Specs", "Documents"];

  return (
    <Dialog
      open={open}
      onClose={actions.closeDialog}
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
          <Typography variant="h6" fontWeight={700} color="white">
            Add New Vehicle
          </Typography>
          <IconButton
            onClick={actions.closeDialog}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 4, px: 2 }}>
          <Stepper
            activeStep={state.currentStep - 1}
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
                      state.currentStep - 1 >= index
                        ? "white"
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
          {state.currentStep === 1 && (
            <FirstStep state={state} actions={actions} />
          )}
          {state.currentStep === 2 && (
            <TechSpecsStep state={state} actions={actions} />
          )}

          {state.currentStep === 3 && (
            <DocumentsStep state={state} actions={actions} />
          )}
        </Box>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="text"
              onClick={actions.closeDialog}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            {state.currentStep > 1 && (
              <Button
                variant="outlined"
                onClick={actions.prevStep}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: alpha(theme.palette.divider, 0.2),
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={
                state.currentStep === 3
                  ? actions.handleSubmit
                  : actions.nextStep
              }
              disabled={state.isLoading}
              endIcon={
                state.isLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
              sx={{
                textTransform: "none",
                px: state.currentStep === 3 ? 3 : 4,
                borderRadius: 2,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                fontWeight: 700,
                minWidth: 140,
              }}
            >
              {state.isLoading
                ? "Saving..."
                : state.currentStep === 3
                  ? "Complete & Save Vehicle"
                  : "Next Step"}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;
