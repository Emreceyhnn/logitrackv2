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
import { useState, useEffect } from "react";
import {
  AddRouteDialogProps,
  AddRoutePageState,
  AddRoutePageActions,
  AddRouteStep1,
  AddRouteStep2,
  AddRouteStep3,
} from "@/app/lib/type/add-route";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";
import { toast } from "sonner";
import { createRoute } from "@/app/lib/controllers/routes";
import { getShipments } from "@/app/lib/controllers/shipments";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { Warehouse } from "@prisma/client";
import { useUser } from "@/app/lib/hooks/useUser";
import { getDirections } from "@/app/lib/controllers/map";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import FirstRouteDialogStep from "./firstStep";
import SecondRouteDialogStep from "./secondStep";
import ThirdRouteDialogStep from "./thirdStep";

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

  const [shipments, setShipments] = useState<ShipmentWithRelations[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  /* ------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open && user) {
      const fetchData = async () => {
        try {
          const [shipmentsData, warehousesData] = await Promise.all([
            getShipments(),
            getWarehouses(),
          ]);
          setShipments(
            shipmentsData.filter((s: ShipmentWithRelations) => !s.routeId)
          );
          setWarehouses(warehousesData);
        } catch (error) {
          console.error("Failed to fetch available data for route", error);
        }
      };
      fetchData();
    }
  }, [open, user]);

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
      if (!user) return;
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const routeDate = state.data.step1.startTime || new Date();

        await createRoute(
          user.id,
          state.data.step1.name,
          routeDate,
          state.data.step1.startTime || new Date(),
          state.data.step1.endTime || new Date(),
          state.data.step2.distanceKm,
          state.data.step2.durationMin,
          state.data.step3.driverId,
          state.data.step3.vehicleId,
          user.companyId!,
          {
            type: state.data.step2.startType,
            id: state.data.step2.startId,
            address: state.data.step2.startAddress,
            lat: state.data.step2.startLat,
            lng: state.data.step2.startLng,
          },
          {
            type: state.data.step2.endType,
            id: state.data.step2.endId,
            address: state.data.step2.endAddress,
            lat: state.data.step2.endLat,
            lng: state.data.step2.endLng,
          }
        );

        toast.success("Route created successfully");

        setTimeout(() => {
          onClose();
          onSuccess?.();
          actions.reset();
        }, 1500);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to create route";
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
        toast.error(message);
      }
    },
  };

  const handleShipmentSelect = async (shipmentId: string) => {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (shipment) {
      // Find the origin warehouse from the warehouses list
      const warehouse = warehouses.find((w) => w.id === shipment.origin);

      const updateData: Partial<AddRouteStep2> = {
        endAddress: shipment.destination || shipment.customer?.address || "",
        endLat:
          typeof shipment.destinationLat === "number"
            ? shipment.destinationLat
            : typeof shipment.customer?.lat === "number"
              ? (shipment.customer?.lat as number)
              : undefined,
        endLng:
          typeof shipment.destinationLng === "number"
            ? shipment.destinationLng
            : typeof shipment.customer?.lng === "number"
              ? (shipment.customer?.lng as number)
              : undefined,
      };

      if (warehouse) {
        updateData.startAddress = warehouse.address;
        updateData.startLat = warehouse.lat ?? undefined;
        updateData.startLng = warehouse.lng ?? undefined;
        updateData.startId = warehouse.id;
        updateData.startType = "WAREHOUSE";
      } else {
        // Fallback for start address if warehouse not found
        updateData.startAddress = shipment.origin;
        updateData.startType = "WAREHOUSE"; // Assuming it's still a warehouse even if not in list
      }

      // Pre-fill Step 1: Name
      actions.updateStep1({
        name: `Delivery: ${shipment.customer?.name || "Shipment"} - ${shipment.trackingId}`,
      });

      // Pre-fill Step 2 & Calculate Metrics
      try {
        const origin =
          typeof updateData.startLat === "number" &&
          typeof updateData.startLng === "number"
            ? { lat: updateData.startLat, lng: updateData.startLng }
            : updateData.startAddress;

        const dest =
          typeof updateData.endLat === "number" &&
          typeof updateData.endLng === "number"
            ? { lat: updateData.endLat, lng: updateData.endLng }
            : updateData.endAddress;

        if (origin && dest) {
          const data = await getDirections(origin, dest);

          if (data && data.routes && data.routes.length > 0) {
            const leg = data.routes[0].legs[0];
            updateData.distanceKm = parseFloat(
              (leg.distance.value / 1000).toFixed(1)
            );
            updateData.durationMin = Math.ceil(leg.duration.value / 60);

            // If we didn't have coordinates, let's capture them from the leg
            if (typeof updateData.startLat !== "number" && leg.start_location) {
              updateData.startLat = leg.start_location.lat;
              updateData.startLng = leg.start_location.lng;
            }
            if (typeof updateData.endLat !== "number" && leg.end_location) {
              updateData.endLat = leg.end_location.lat;
              updateData.endLng = leg.end_location.lng;
            }
          }
        }
      } catch (error) {
        console.error("Failed to auto-calculate metrics", error);
      }

      actions.updateStep2(updateData);
      toast.info(
        `Pre-filled and calculated from shipment ${shipment.trackingId}`
      );
    }
  };

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
              shipments={shipments}
              onShipmentSelect={handleShipmentSelect}
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
