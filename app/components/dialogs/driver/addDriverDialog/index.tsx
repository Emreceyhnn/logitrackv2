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
import { useMemo, useState } from "react";
import {
  AddDriverDialogProps,
  AddDriverPageActions,
  AddDriverPageState,
  AddDriverStep1,
  AddDriverStep2,
} from "@/app/lib/type/driver";
import { toast } from "sonner";
import { createDriver } from "@/app/lib/controllers/driver";
import FirstDriverDialogStep from "./firstStep";
import SecondDriverDialogStep from "./secondStep";

const initialStep1: AddDriverStep1 = {
  userId: "",
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
  const [state, setState] = useState<AddDriverPageState>({
    currentStep: 1,
    data: {
      step1: initialStep1,
      step2: initialStep2,
    },
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  /* -------------------------------- actions --------------------------------- */
  const actions: AddDriverPageActions = useMemo(
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

          const payload = {
            userId: step1.userId,
            licenseNo: step1.licenseNo,
            licenseExpiry: step1.licenseExpiry,
            licenseType: step1.licenseType,
            licenseIssueDate: step1.licenseIssueDate,
            licencePhoto: step1.licencePhoto,
            homeWareHouseId: step2.homeWareHouseId,
            currentVehicleId: step2.currentVehicleId,
            status: step2.status,
            documents: step2.documents,
          };

          await createDriver(payload);

          setState((prev) => ({ ...prev, isSuccess: true, isLoading: false }));
          toast.success("Driver added successfully");

          setTimeout(() => {
            onClose();
            onSuccess?.();
            actions.reset();
          }, 1500);
        } catch (err: any) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err.message || "Failed to create driver",
          }));
          toast.error(err.message || "Failed to create driver");
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
          },
          isLoading: false,
          error: null,
          isSuccess: false,
        });
      },
    }),
    [state.data, state.isLoading, onClose, onSuccess]
  );

  const steps = ["DRIVER CREDENTIALS", "ASSIGNMENT & SETTINGS"];

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            onClick={onClose}
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
            <FirstDriverDialogStep state={state.data.step1} actions={actions} />
          )}
          {state.currentStep === 2 && (
            <SecondDriverDialogStep
              state={state.data.step2}
              actions={actions}
              step1Data={state.data.step1}
            />
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
          {state.currentStep === 1 ? "Cancel" : "Back to Credentials"}
        </Button>
        <Button
          variant="contained"
          onClick={
            state.currentStep === 1 ? actions.nextStep : actions.handleSubmit
          }
          disabled={
            state.isLoading ||
            (state.currentStep === 1 && !state.data.step1.userId)
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
            ? "Saving..."
            : state.currentStep === 1
              ? "Next: Assignment"
              : "Complete Onboarding"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDriverDialog;
