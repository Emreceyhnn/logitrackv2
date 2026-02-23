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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useMemo } from "react";
import FirstStep from "./firstStep";
import TechSpecsStep from "./techSpecsStep";
import DocumentsStep from "./documentsStep";
import {
  AddVehiclePageActions,
  AddVehiclePageProps,
  AddVehiclePageState,
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
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
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

  /* -------------------------------- actions --------------------------------- */
  const actions: AddVehiclePageActions = useMemo(
    () => ({
      updateStep1: (data) => {
        setState((prev) => ({
          ...prev,
          data: { ...prev.data, step1: { ...prev.data.step1, ...data } },
        }));
      },
      updateStep2: (data) => {
        setState((prev) => ({
          ...prev,
          data: { ...prev.data, step2: { ...prev.data.step2, ...data } },
        }));
      },
      updateStep3: (data) => {
        setState((prev) => ({
          ...prev,
          data: { ...prev.data, step3: { ...prev.data.step3, ...data } },
        }));
      },
      setStep: (step) => {
        setState((prev) => ({ ...prev, currentStep: step }));
      },
      nextStep: () => {
        setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
      },
      prevStep: () => {
        setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
      },
      handleSubmit: async () => {
        try {
          setState((prev) => ({ ...prev, isLoading: true, error: null }));

          const { step1, step2, step3 } = state.data;

          const payload = {
            fleetNo: step1.fleetNo,
            plate: step1.plate,
            type: step1.type,
            brand: step1.brand,
            model: step1.model,
            year: step1.year,
            odometerKm: step1.odometerKm,
            photo: step1.photo,
            maxLoadKg: step2.maxLoadKg,
            fuelType: step2.fuelType,
            avgFuelConsumption: step2.avgFuelConsumption,
            fuelLevel: step2.fuelLevel,
            engineSize: step2.engineSize,
            transmission: step2.transmission,
            techNotes: step2.techNotes,
            registrationExpiry: step3.registrationExpiry?.toDate(),
            inspectionExpiry: step3.inspectionExpiry?.toDate(),
            nextServiceKm: step1.nextServiceKm || step3.nextServiceDueKm,
            enableAlerts: step3.enableExpiryAlerts,
          };

          await createVehicle(payload);

          setState((prev) => ({ ...prev, isSuccess: true, isLoading: false }));
          toast.success("Vehicle added successfully");

          setTimeout(() => {
            onClose();
            onSuccess?.();
            actions.reset();
          }, 1500);
        } catch (err: any) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err.message || "Failed to create vehicle",
          }));
          toast.error(err.message || "Failed to create vehicle");
        }
      },

      closeDialog: () => {
        if (!state.isLoading) {
          onClose();
        }
      },
      reset: () => {
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
        });
      },
    }),
    [state.data, state.isLoading, onClose, onSuccess]
  );

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
          <Typography variant="h6" fontWeight={600} color="white">
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
              sx={{ color: "text.secondary", textTransform: "none" }}
            >
              Cancel
            </Button>
            {state.currentStep > 1 && (
              <Button
                variant="outlined"
                onClick={actions.prevStep}
                startIcon={
                  state.currentStep === 1 ? null : (
                    <ArrowBackIcon sx={{ fontSize: 16 }} />
                  )
                }
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: alpha(theme.palette.divider, 0.2),
                  color: "white",
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
              startIcon={
                state.currentStep === 3 ? (
                  <SaveIcon sx={{ fontSize: 18 }} />
                ) : null
              }
              sx={{
                textTransform: "none",
                px: state.currentStep === 3 ? 3 : 4,
                borderRadius: 2,
                boxShadow: "none",
                bgcolor: "#246BFD",
                "&:hover": {
                  bgcolor: alpha("#246BFD", 0.9),
                  boxShadow: "none",
                },
              }}
            >
              {state.currentStep === 3
                ? "Complete & Save Vehicle"
                : "Next Step →"}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;
