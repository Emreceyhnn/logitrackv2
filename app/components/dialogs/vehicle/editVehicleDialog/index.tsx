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
import { useState, useMemo, useEffect } from "react";
import FirstStep from "../addVehicleDialog/firstStep";
import TechSpecsStep from "../addVehicleDialog/techSpecsStep";
import {
  AddVehiclePageActions,
  AddVehiclePageState,
} from "@/app/lib/type/vehicle";
import { updateVehicle } from "@/app/lib/controllers/vehicle";
import { toast } from "sonner";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import CircularProgress from "@mui/material/CircularProgress";

export interface EditVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicle: VehicleWithRelations;
}

const EditVehicleDialog = ({
  open,
  onClose,
  onSuccess,
  vehicle,
}: EditVehicleDialogProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<AddVehiclePageState>({
    currentStep: 1,
    data: {
      step1: {
        fleetNo: vehicle?.fleetNo || "",
        plate: vehicle?.plate || "",
        type: vehicle?.type || "",
        brand: vehicle?.brand || "",
        model: vehicle?.model || "",
        year: vehicle?.year || "",
        odometerKm: vehicle?.odometerKm || "",
        nextServiceKm: vehicle?.nextServiceKm || "",
      },
      step2: {
        maxLoadKg: vehicle?.maxLoadKg || "",
        fuelType: vehicle?.fuelType || "",
        fuelLevel: vehicle?.fuelLevel || 50,
        avgFuelConsumption: vehicle?.avgFuelConsumption || "",
        engineSize: "",
        transmission: "",
        techNotes: "",
      },
      step3: {
        registrationExpiry: null, // Edit doc logic handled in details tab usually
        inspectionExpiry: null,
        nextServiceDueKm: "",
        enableExpiryAlerts: true,
        documents: [],
      },
    },
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open && vehicle) {
      setState({
        currentStep: 1,
        data: {
          step1: {
            fleetNo: vehicle.fleetNo || "",
            plate: vehicle.plate || "",
            type: vehicle.type || "",
            brand: vehicle.brand || "",
            model: vehicle.model || "",
            year: vehicle.year || "",
            odometerKm: vehicle.odometerKm || "",
            nextServiceKm: vehicle.nextServiceKm || "",
          },
          step2: {
            maxLoadKg: vehicle.maxLoadKg || "",
            fuelType: vehicle.fuelType || "",
            fuelLevel: vehicle.fuelLevel || 50,
            avgFuelConsumption: vehicle.avgFuelConsumption || "",
            engineSize: "",
            transmission: "",
            techNotes: "",
          },
          step3: {
            registrationExpiry: null,
            inspectionExpiry: null,
            nextServiceDueKm: "",
            enableExpiryAlerts: true,
            documents: [],
          },
        },
        isLoading: false,
        error: null,
        isSuccess: false,
      });
    }
  }, [open, vehicle]);

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

          const { step1, step2 } = state.data;

          const updateData = {
            fleetNo: step1.fleetNo,
            plate: step1.plate,
            type: step1.type as any, // Cast to any to avoid strict enum checking if there's a mismatch
            brand: step1.brand,
            model: step1.model,
            year: Number(step1.year),
            odometerKm: step1.odometerKm ? Number(step1.odometerKm) : null,
            maxLoadKg: step2.maxLoadKg ? Number(step2.maxLoadKg) : 0,
            fuelType: step2.fuelType,
            avgFuelConsumption: step2.avgFuelConsumption
              ? Number(step2.avgFuelConsumption)
              : null,
            fuelLevel: step2.fuelLevel ? Number(step2.fuelLevel) : null,
            nextServiceKm: step1.nextServiceKm
              ? Number(step1.nextServiceKm)
              : null,
          };

          await updateVehicle(vehicle.id, updateData);

          setState((prev) => ({ ...prev, isSuccess: true, isLoading: false }));
          toast.success("Vehicle updated successfully");

          setTimeout(() => {
            onClose();
            onSuccess?.();
          }, 1500);
        } catch (err: any) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err.message || "Failed to update vehicle",
          }));
          toast.error(err.message || "Failed to update vehicle");
        }
      },

      closeDialog: () => {
        if (!state.isLoading) {
          onClose();
        }
      },
      reset: () => {
        // Handled by useEffect
      },
    }),
    [state.data, state.isLoading, onClose, onSuccess, vehicle]
  );

  const steps = ["General Info", "Tech Specs"];

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
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight={600} color="white">
              Edit Vehicle: {vehicle?.plate}
            </Typography>
          </Stack>
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
                state.currentStep === 2
                  ? actions.handleSubmit
                  : actions.nextStep
              }
              disabled={state.isLoading}
              startIcon={
                state.currentStep === 2 && !state.isLoading ? (
                  <SaveIcon sx={{ fontSize: 18 }} />
                ) : null
              }
              sx={{
                textTransform: "none",
                px: state.currentStep === 2 ? 3 : 4,
                borderRadius: 2,
                boxShadow: "none",
                bgcolor: "#246BFD",
                "&:hover": {
                  bgcolor: alpha("#246BFD", 0.9),
                  boxShadow: "none",
                },
              }}
            >
              {state.isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : state.currentStep === 2 ? (
                "Update Vehicle"
              ) : (
                "Next Step →"
              )}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
