"use client";

import {
  alpha,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import {
  AddWarehouseDialogProps,
  AddWarehousePageActions,
  AddWarehousePageState,
} from "@/app/lib/type/add-warehouse";
import { createWarehouse } from "@/app/lib/controllers/warehouse";
import { useUser } from "@/app/lib/hooks/useUser";
import CustomToast from "@/app/components/toast";
import BasicInfoSection from "./sections/BasicInfoSection";
import LocationSection from "./sections/LocationSection";
import CapacitySection from "./sections/CapacitySection";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";

const initialBasicInfo = {
  name: "",
  code: "",
  type: "WAREHOUSE" as const,
  openingTime: "08:00",
  closingTime: "18:00",
  is247: false,
};

const initialLocation = {
  address: "",
  city: "",
  country: "",
  postalCode: "",
  managerId: "",
};

const initialCapacity = {
  capacityPallets: 5000,
  capacityVolumeM3: 100000,
  specifications: [],
};

const AddWarehouseDialog = ({
  open,
  onClose,
  onSuccess,
}: AddWarehouseDialogProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const { user } = useUser();

  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<AddWarehousePageState>({
    data: {
      basicInfo: initialBasicInfo,
      location: initialLocation,
      capacity: initialCapacity,
    },
    currentStep: 1,
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const showToast = (
    type: "success" | "error" | "info" | "warning",
    message: string
  ) => {
    setToast({ open: true, type, message });
  };

  /* ---------------------------------- actions --------------------------------- */
  const actions: AddWarehousePageActions = {
    updateBasicInfo: (data) =>
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, basicInfo: { ...prev.data.basicInfo, ...data } },
      })),
    updateLocation: (data) =>
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, location: { ...prev.data.location, ...data } },
      })),
    updateCapacity: (data) =>
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, capacity: { ...prev.data.capacity, ...data } },
      })),
    setStep: (step) => setState((prev) => ({ ...prev, currentStep: step })),
    handleSubmit: async () => {
      if (!user || !user.companyId) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        await createWarehouse(
          state.data.basicInfo.name,
          state.data.basicInfo.code,
          state.data.basicInfo.type,
          state.data.location.address,
          state.data.location.city,
          state.data.location.country,
          state.data.location.lat,
          state.data.location.lng,
          state.data.location.managerId || undefined,
          state.data.capacity.capacityPallets,
          state.data.capacity.capacityVolumeM3,
          state.data.basicInfo.is247 ? "24/7" : `${state.data.basicInfo.openingTime} - ${state.data.basicInfo.closingTime}`,
          state.data.capacity.specifications
        );

        showToast("success", "Warehouse created successfully");
        onSuccess?.();
        actions.closeDialog();
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create warehouse";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        showToast("error", errorMessage);
      }
    },
    closeDialog: () => {
      onClose();
      setTimeout(() => actions.reset(), 300);
    },
    reset: () => {
      setState({
        data: {
          basicInfo: initialBasicInfo,
          location: initialLocation,
          capacity: initialCapacity,
        },
        currentStep: 1,
        isLoading: false,
        error: null,
        isSuccess: false,
      });
    },
  };

  const steps = ["Basic Info", "Location", "Capacity"];

  return (
    <GoogleMapsProvider>
      <CustomToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
      <Dialog
        open={open}
        onClose={actions.closeDialog}
        maxWidth="md"
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
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={700} color="white">
                {state.currentStep === 1
                  ? "Add New Warehouse"
                  : state.currentStep === 2
                    ? "Facility Location"
                    : "Operational Capacity"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Step {state.currentStep}: {steps[state.currentStep - 1]}
              </Typography>
            </Stack>
            <IconButton
              onClick={actions.closeDialog}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stepper
            activeStep={state.currentStep - 1}
            sx={{
              mb: 4,
              "& .MuiStepLabel-label": {
                color: alpha("#fff", 0.5),
                fontWeight: 600,
              },
              "& .MuiStepLabel-label.Mui-active": {
                color: theme.palette.primary.main,
              },
              "& .MuiStepLabel-label.Mui-completed": {
                color: alpha("#fff", 0.7),
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
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <DialogContent sx={{ pb: 4, minHeight: 400 }}>
          {state.currentStep === 1 && (
            <BasicInfoSection state={state.data.basicInfo} actions={actions} />
          )}
          {state.currentStep === 2 && (
            <LocationSection state={state.data.location} actions={actions} />
          )}
          {state.currentStep === 3 && (
            <CapacitySection state={state.data.capacity} actions={actions} />
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
              state.currentStep === 1
                ? actions.closeDialog
                : () => actions.setStep(state.currentStep - 1)
            }
            sx={{ color: "text.secondary", textTransform: "none" }}
          >
            {state.currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          <Button
            variant="contained"
            disabled={
              state.isLoading ||
              (state.currentStep === 1 &&
                !state.data.basicInfo.name) ||
              (state.currentStep === 2 &&
                (!state.data.location.address || !state.data.location.city))
            }
            onClick={
              state.currentStep < 3
                ? () => actions.setStep(state.currentStep + 1)
                : actions.handleSubmit
            }
            sx={{
              minWidth: 140,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
            startIcon={
              state.isLoading && <CircularProgress size={16} color="inherit" />
            }
          >
            {state.isLoading
              ? "Creating..."
              : state.currentStep < 3
                ? "Next Step"
                : "Create Warehouse"}
          </Button>
        </DialogActions>
      </Dialog>
    </GoogleMapsProvider>
  );
};

export default AddWarehouseDialog;
