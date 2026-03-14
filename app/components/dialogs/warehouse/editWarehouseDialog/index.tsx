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
import { useState, useEffect } from "react";
import {
  EditWarehouseDialogProps,
  EditWarehousePageActions,
  EditWarehousePageState,
} from "@/app/lib/type/edit-warehouse";
import { toast } from "sonner";
import { updateWarehouse } from "@/app/lib/controllers/warehouse";
import { useUser } from "@/app/lib/hooks/useUser";
import BasicInfoSection from "./sections/BasicInfoSection";
import LocationSection from "./sections/LocationSection";
import CapacitySection from "./sections/CapacitySection";
import { WarehouseType } from "@prisma/client";

const defaultBasicInfo = {
  name: "",
  code: "",
  type: "WAREHOUSE" as WarehouseType,
  openingTime: "08:00",
  closingTime: "18:00",
  is247: false,
};

const defaultLocation = {
  address: "",
  city: "",
  country: "",
  postalCode: "",
  managerId: "",
};

const defaultCapacity = {
  capacityPallets: 5000,
  capacityVolumeM3: 100000,
  specifications: [],
};

const EditWarehouseDialog = ({
  open,
  onClose,
  onSuccess,
  warehouseData,
}: EditWarehouseDialogProps) => {
  const theme = useTheme();
  const { user } = useUser();

  const [state, setState] = useState<EditWarehousePageState>({
    data: {
      basicInfo: defaultBasicInfo,
      location: defaultLocation,
      capacity: defaultCapacity,
    },
    currentStep: 1,
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  // Populate state when warehouseData is available
  useEffect(() => {
    if (warehouseData && open) {
      const opHours = warehouseData.operatingHours as any;
      let openingTime = "08:00";
      let closingTime = "18:00";
      let is247 = false;

      if (opHours === "24/7" || (opHours && opHours.is247)) {
        is247 = true;
      } else if (opHours && opHours.monFri) {
        const parts = opHours.monFri.split(" - ");
        if (parts.length === 2) {
          openingTime = parts[0];
          closingTime = parts[1];
        }
      } else if (typeof opHours === "string" && opHours.includes(" - ")) {
        const parts = opHours.split(" - ");
        if (parts.length === 2) {
          openingTime = parts[0];
          closingTime = parts[1];
        }
      }

      setState({
        data: {
          basicInfo: {
            name: warehouseData.name || "",
            code: warehouseData.code || "",
            type: warehouseData.type || "WAREHOUSE",
            openingTime,
            closingTime,
            is247,
          },
          location: {
            address: warehouseData.address || "",
            city: warehouseData.city || "",
            country: warehouseData.country || "",
            postalCode: "", // Add if added to schema
            lat: warehouseData.lat || undefined,
            lng: warehouseData.lng || undefined,
            managerId: warehouseData.managerId || "",
          },
          capacity: {
            capacityPallets: warehouseData.capacityPallets || 0,
            capacityVolumeM3: warehouseData.capacityVolumeM3 || 0,
            specifications: warehouseData.specifications || [],
          },
        },
        currentStep: 1,
        isLoading: false,
        error: null,
        isSuccess: false,
      });
    }
  }, [warehouseData, open]);

  const actions: EditWarehousePageActions = {
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
      if (!user || !user.companyId || !warehouseData) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        await updateWarehouse(warehouseData.id, {
          name: state.data.basicInfo.name,
          code: state.data.basicInfo.code,
          type: state.data.basicInfo.type,
          address: state.data.location.address,
          city: state.data.location.city,
          country: state.data.location.country,
          lat: state.data.location.lat,
          lng: state.data.location.lng,
          managerId: state.data.location.managerId || null,
          capacityPallets: state.data.capacity.capacityPallets,
          capacityVolumeM3: state.data.capacity.capacityVolumeM3,
          operatingHours: state.data.basicInfo.is247 ? "24/7" : `${state.data.basicInfo.openingTime} - ${state.data.basicInfo.closingTime}`,
          specifications: state.data.capacity.specifications,
        });

        toast.success("Warehouse updated successfully");
        onSuccess?.();
        actions.closeDialog();
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message || "Failed to update warehouse",
        }));
        toast.error(err.message || "Failed to update warehouse");
      }
    },
    closeDialog: () => {
      onClose();
    },
    reset: () => {
      // Handled by the effect
    },
  };

  const steps = ["Basic Info", "Location", "Capacity"];

  if (!warehouseData) return null;

  return (
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
                ? "Edit Warehouse Details"
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
            ? "Saving..."
            : state.currentStep < 3
              ? "Next Step"
              : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWarehouseDialog;
