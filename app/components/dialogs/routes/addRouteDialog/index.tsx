"use client";

import {
  alpha,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";
import {
  AddRouteDialogProps,
  AddRoutePageActions,
  AddRoutePageState,
  AddRouteStep1,
  AddRouteStep2,
  AddRouteStep3,
} from "@/app/lib/type/add-route";
import { toast } from "sonner";
import { createRoute } from "@/app/lib/controllers/routes";
import { useUser } from "@/app/lib/hooks/useUser";
import FirstRouteDialogStep from "./firstStep";
import SecondRouteDialogStep from "./secondStep";
import ThirdRouteDialogStep from "./thirdStep";

const initialStep1: AddRouteStep1 = {
  name: "",
  date: null,
  startTime: null,
  endTime: null,
};

const initialStep2: AddRouteStep2 = {
  startType: "WAREHOUSE",
  startId: "",
  startAddress: "",
  endType: "CUSTOMER",
  endId: "",
  endAddress: "",
  distanceKm: 0,
  durationMin: 0,
};

const initialStep3: AddRouteStep3 = {
  driverId: "",
  vehicleId: "",
};

const AddRouteDialog = ({ open, onClose, onSuccess }: AddRouteDialogProps) => {
  const theme = useTheme();
  const { user } = useUser();

  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<AddRoutePageState>({
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
  const actions: AddRoutePageActions = useMemo(
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
        if (!user) return;
        try {
          setState((prev) => ({ ...prev, isLoading: true, error: null }));

          const { step1, step2, step3 } = state.data;

          const response = await createRoute(
            user.id,
            step1.name,
            step1.date || new Date(),
            step1.startTime || new Date(),
            step1.endTime || new Date(),
            step2.distanceKm,
            step2.durationMin,
            step3.driverId,
            step3.vehicleId,
            user.companyId,
            {
              type: step2.startType,
              id: step2.startId,
              address: step2.startAddress,
              lat: step2.startLat,
              lng: step2.startLng,
            },
            {
              type: step2.endType,
              id: step2.endId,
              address: step2.endAddress,
              lat: step2.endLat,
              lng: step2.endLng,
            }
          );

          setState((prev) => ({ ...prev, isSuccess: true, isLoading: false }));
          toast.success("Route created successfully");

          setTimeout(() => {
            onClose();
            onSuccess?.();
            actions.reset();
          }, 1500);
        } catch (err: any) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err.message || "Failed to create route",
          }));
          toast.error(err.message || "Failed to create route");
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
    [state.data, state.isLoading, onClose, onSuccess, user]
  );

  const steps = ["Schedule", "Locations", "Assignments"];

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
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={600} color="white">
              Add New Route
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Configure your new delivery route details and schedule
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
      <DialogContent>
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
            <FirstRouteDialogStep state={state.data.step1} actions={actions} />
          )}
          {state.currentStep === 2 && (
            <SecondRouteDialogStep state={state.data.step2} actions={actions} />
          )}
          {state.currentStep === 3 && (
            <ThirdRouteDialogStep state={state.data.step3} actions={actions} />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
        <Button
          onClick={state.currentStep === 1 ? onClose : actions.prevStep}
          disabled={state.isLoading}
          sx={{
            color: "text.secondary",
            "&:hover": { bgcolor: alpha(theme.palette.divider, 0.05) },
          }}
        >
          {state.currentStep === 1 ? "Cancel" : "Back"}
        </Button>
        <Button
          variant="contained"
          onClick={
            state.currentStep === steps.length
              ? actions.handleSubmit
              : actions.nextStep
          }
          disabled={
            state.isLoading ||
            (state.currentStep === 1 && !state.data.step1.name) ||
            (state.currentStep === 2 &&
              (!state.data.step2.startAddress ||
                !state.data.step2.endAddress)) ||
            (state.currentStep === 3 &&
              (!state.data.step3.driverId || !state.data.step3.vehicleId))
          }
          startIcon={
            state.isLoading && <CircularProgress size={16} color="inherit" />
          }
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 600,
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          {state.isLoading
            ? "Creating..."
            : state.currentStep === steps.length
              ? "Create Route"
              : "Next Step"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRouteDialog;
