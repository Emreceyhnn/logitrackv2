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
import { useState, useEffect, useRef } from "react";
import {
  AddRoutePageState,
  AddRoutePageActions,
  AddRouteStep1,
  AddRouteStep2,
  AddRouteStep3,
} from "@/app/lib/type/add-route";
import { toast } from "sonner";
import { updateRoute } from "@/app/lib/controllers/routes";
import { useUser } from "@/app/lib/hooks/useUser";
import FirstRouteDialogStep from "./addRouteDialog/firstStep";
import SecondRouteDialogStep from "./addRouteDialog/secondStep";
import ThirdRouteDialogStep from "./addRouteDialog/thirdStep";
import { RouteWithRelations } from "@/app/lib/type/routes";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { Prisma } from "@prisma/client";

interface EditRouteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  route: RouteWithRelations | null;
}

const initialStep1: AddRouteStep1 = {
  name: "",
  startTime: null,
  endTime: null,
};

const initialStep2: AddRouteStep2 = {
  startType: "WAREHOUSE",
  startId: "",
  startAddress: "",
  startLat: 0,
  startLng: 0,
  endType: "CUSTOMER",
  endId: "",
  endAddress: "",
  endLat: 0,
  endLng: 0,
  distanceKm: 0,
  durationMin: 0,
};

const initialStep3: AddRouteStep3 = {
  driverId: "",
  vehicleId: "",
};

const EditRouteDialog = ({ open, onClose, onSuccess, route }: EditRouteDialogProps) => {
  const theme = useTheme();
  const { user } = useUser();
  const isInitialized = useRef<string | null>(null);

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

  /* ------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open && route && isInitialized.current !== route.id) {
      isInitialized.current = route.id;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState((prev) => ({
        ...prev,
        currentStep: 1,
        data: {
          step1: {
            name: route.name || "",
            startTime: route.startTime ? new Date(route.startTime) : null,
            endTime: route.endTime ? new Date(route.endTime) : null,
          },
          step2: {
            startType: (route as unknown as Record<string, unknown>).startType as AddRouteStep2["startType"] || "WAREHOUSE",
            startId: (route as unknown as Record<string, unknown>).startId as string || "",
            startAddress: route.startAddress || "",
            startLat: route.startLat || 0,
            startLng: route.startLng || 0,
            endType: (route as unknown as Record<string, unknown>).endType as AddRouteStep2["endType"] || "CUSTOMER",
            endId: (route as unknown as Record<string, unknown>).endId as string || "",
            endAddress: route.endAddress || "",
            endLat: route.endLat || 0,
            endLng: route.endLng || 0,
            distanceKm: route.distanceKm || 0,
            durationMin: route.durationMin || 0,
          },
          step3: {
            driverId: route.driverId || "",
            vehicleId: route.vehicleId || "",
          },
        },
        isLoading: false,
        error: null,
        isSuccess: false,
      }));
    } else if (!open) {
      isInitialized.current = null;
    }
  }, [open, route]);

  /* -------------------------------- handlers --------------------------------- */
  const actions: AddRoutePageActions = {
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
      if (!user || !route) return;
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const payload: Prisma.RouteUpdateInput = {
          name: state.data.step1.name,
          startTime: state.data.step1.startTime,
          endTime: state.data.step1.endTime,
          startAddress: state.data.step2.startAddress,
          startLat: state.data.step2.startLat,
          startLng: state.data.step2.startLng,
          endAddress: state.data.step2.endAddress,
          endLat: state.data.step2.endLat,
          endLng: state.data.step2.endLng,
          distanceKm: state.data.step2.distanceKm,
          durationMin: state.data.step2.durationMin,
          driver: state.data.step3.driverId ? { connect: { id: state.data.step3.driverId } } : { disconnect: true },
          vehicle: state.data.step3.vehicleId ? { connect: { id: state.data.step3.vehicleId } } : { disconnect: true },
        };

        await updateRoute(route.id, payload);

        toast.success("Route updated successfully");

        setTimeout(() => {
          onClose();
          onSuccess?.();
          actions.reset();
        }, 1500);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to update route";
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
        toast.error(message);
      }
    },
  };

  const steps = ["Schedule", "Locations", "Assignments"];

  return (
    <GoogleMapsProvider>
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
                Edit Route
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Update your delivery route details and schedule
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
                        "&.Mui-completed": {
                          color: theme.palette.primary.main,
                        },
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
            {state.error && (
              <Box
                mb={2}
                p={2}
                sx={{
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  borderRadius: 1,
                }}
              >
                <Typography color="error" variant="caption">
                  {state.error}
                </Typography>
              </Box>
            )}
            {state.currentStep === 1 && (
              <FirstRouteDialogStep
                state={state.data.step1}
                updateStep1={actions.updateStep1}
              />
            )}
            {state.currentStep === 2 && (
              <SecondRouteDialogStep
                state={state.data.step2}
                updateStep2={actions.updateStep2}
              />
            )}
            {state.currentStep === 3 && (
              <ThirdRouteDialogStep
                state={state.data.step3}
                updateStep3={actions.updateStep3}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
          <Button
            onClick={
              state.currentStep === 1 ? actions.closeDialog : actions.prevStep
            }
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
              ? "Updating..."
              : state.currentStep === steps.length
                ? "Update Route"
                : "Next Step"}
          </Button>
        </DialogActions>
      </Dialog>
    </GoogleMapsProvider>
  );
};

export default EditRouteDialog;
