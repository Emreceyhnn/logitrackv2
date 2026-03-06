"use client";

import {
  alpha,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Grid,
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
import { useMemo, useState, useEffect } from "react";
import {
  AddShipmentDialogProps,
  AddShipmentPageActions,
  AddShipmentPageState,
  AddShipmentBasicInfo,
  AddShipmentLogistics,
  AddShipmentCargo,
  AddShipmentInventory,
  AddShipmentRoute,
} from "@/app/lib/type/add-shipment";
import { toast } from "sonner";
import { createShipment } from "@/app/lib/controllers/shipments";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { getCustomers } from "@/app/lib/controllers/customer";
import { getInventory } from "@/app/lib/controllers/inventory";
import { getRoutes } from "@/app/lib/controllers/routes";
import { useUser } from "@/app/lib/hooks/useUser";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { CustomerWithRelations } from "@/app/lib/type/customer";
import { RouteWithRelations } from "@/app/lib/type/routes";
import BasicInfoSection from "./sections/BasicInfoSection";
import LogisticsSection from "./sections/LogisticsSection";
import CargoSection from "./sections/CargoSection";
import InventorySection from "./sections/InventorySection";
import RouteSection from "./sections/RouteSection";

const initialBasicInfo: AddShipmentBasicInfo = {
  referenceNumber: "",
  priority: "MEDIUM",
  type: "Standard Freight",
  slaDeadline: null,
};

const initialLogistics: AddShipmentLogistics = {
  originWarehouseId: "",
  destination: "",
  customerId: "",
  contactEmail: "",
  billingAccount: "Standard Billing (Net 30)",
};

const initialCargo: AddShipmentCargo = {
  weightKg: 0,
  volumeM3: 0,
  palletCount: 0,
  cargoType: "General Cargo",
};

const initialInventory: AddShipmentInventory = {
  items: [],
};

const initialRoute: AddShipmentRoute = {
  assignedRouteId: null,
};

const AddShipmentDialog = ({
  open,
  onClose,
  onSuccess,
}: AddShipmentDialogProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const { user } = useUser();

  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<AddShipmentPageState>({
    data: {
      basicInfo: initialBasicInfo,
      logistics: initialLogistics,
      cargo: initialCargo,
      inventory: initialInventory,
      route: initialRoute,
    },
    availableInventory: [],
    currentStep: 1,
    isLoading: false,
    isLoadingInventory: false,
    error: null,
    isSuccess: false,
  });

  const [warehouses, setWarehouses] = useState<WarehouseWithRelations[]>([]);
  const [customers, setCustomers] = useState<CustomerWithRelations[]>([]);
  const [routes, setRoutes] = useState<RouteWithRelations[]>([]);

  /* ------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open && user) {
      const fetchData = async () => {
        try {
          const [wRes, cRes, rRes] = await Promise.all([
            getWarehouses(user.companyId!, user.id!),
            getCustomers(user.companyId!, user.id!),
            getRoutes(user.companyId!, user.id!),
          ]);
          setWarehouses(wRes);
          setCustomers(cRes);
          setRoutes(rRes.routes);
        } catch (error) {
          console.error("Failed to fetch dialog data", error);
        }
      };
      fetchData();
    }
  }, [open, user]);

  useEffect(() => {
    const warehouseId = state.data.logistics.originWarehouseId;
    if (warehouseId && user) {
      const fetchInventory = async () => {
        setState((prev) => ({ ...prev, isLoadingInventory: true }));
        try {
          const inv = await getInventory(
            user.companyId!,
            user.id!,
            warehouseId
          );
          setState((prev) => ({
            ...prev,
            availableInventory: inv,
            isLoadingInventory: false,
          }));
        } catch (error) {
          console.error("Failed to fetch warehouse inventory", error);
          setState((prev) => ({ ...prev, isLoadingInventory: false }));
        }
      };
      fetchInventory();
    } else {
      setState((prev) => ({ ...prev, availableInventory: [] }));
    }
  }, [state.data.logistics.originWarehouseId, user]);

  /* -------------------------------- actions --------------------------------- */
  const actions: AddShipmentPageActions = useMemo(
    () => ({
      updateBasicInfo: (data) => {
        setState((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            basicInfo: { ...prev.data.basicInfo, ...data },
          },
        }));
      },
      updateLogistics: (data) => {
        setState((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            logistics: { ...prev.data.logistics, ...data },
          },
        }));
      },
      updateCargo: (data) => {
        setState((prev) => ({
          ...prev,
          data: { ...prev.data, cargo: { ...prev.data.cargo, ...data } },
        }));
      },
      updateInventory: (data) => {
        setState((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            inventory: { ...prev.data.inventory, ...data },
          },
        }));
      },
      addInventoryItem: (item) => {
        setState((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            inventory: {
              ...prev.data.inventory,
              items: [...prev.data.inventory.items, item],
            },
          },
        }));
      },
      removeInventoryItem: (id) => {
        setState((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            inventory: {
              ...prev.data.inventory,
              items: prev.data.inventory.items.filter((i) => i.id !== id),
            },
          },
        }));
      },
      updateRoute: (data) =>
        setState((prev) => ({
          ...prev,
          data: { ...prev.data, route: { ...prev.data.route, ...data } },
        })),

      setStep: (step) => setState((prev) => ({ ...prev, currentStep: step })),

      handleSubmit: async () => {
        if (!user) return;
        try {
          setState((prev) => ({ ...prev, isLoading: true, error: null }));

          const { basicInfo, logistics, cargo } = state.data;

          // Note: Tracking ID generation is handled by controller if not provided
          await createShipment(
            user.id,
            user.companyId!,
            logistics.customerId,
            logistics.originWarehouseId, // Or address if we support both
            logistics.destination,
            "PENDING",
            state.data.inventory.items.length || 1,
            basicInfo.referenceNumber
          );

          setState((prev) => ({ ...prev, isSuccess: true, isLoading: false }));
          toast.success("Shipment created successfully");

          setTimeout(() => {
            onClose();
            onSuccess?.();
            actions.reset();
          }, 1500);
        } catch (err: any) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err.message || "Failed to create shipment",
          }));
          toast.error(err.message || "Failed to create shipment");
        }
      },
      closeDialog: () => {
        if (!state.isLoading) {
          onClose();
        }
      },
      reset: () => {
        setState({
          data: {
            basicInfo: initialBasicInfo,
            logistics: initialLogistics,
            cargo: initialCargo,
            inventory: initialInventory,
            route: initialRoute,
          },
          availableInventory: [],
          currentStep: 1,
          isLoading: false,
          isLoadingInventory: false,
          error: null,
          isSuccess: false,
        });
      },
    }),
    [state.data, state.isLoading, onClose, onSuccess, user]
  );

  return (
    <Dialog
      open={open}
      onClose={actions.closeDialog}
      maxWidth="lg"
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
          sx={{ mb: 3 }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700} color="white">
              {state.currentStep === 1
                ? "Create Shipment"
                : "Cargo & Inventory Details"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Initialize transport record and logistics data
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
          <Step>
            <StepLabel>Logistics & Basic Info</StepLabel>
          </Step>
          <Step>
            <StepLabel>Cargo & Inventory</StepLabel>
          </Step>
        </Stepper>
      </Box>

      <DialogContent sx={{ mt: 2, pb: 4, minHeight: 400 }}>
        {state.currentStep === 1 ? (
          <Stack spacing={6}>
            <BasicInfoSection state={state.data.basicInfo} actions={actions} />
            <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />
            <LogisticsSection
              state={state.data.logistics}
              actions={actions}
              warehouses={warehouses}
              customers={customers}
            />
          </Stack>
        ) : (
          <Stack spacing={6}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <CargoSection state={state.data.cargo} actions={actions} />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <RouteSection
                  state={state.data.route}
                  actions={actions}
                  routes={routes}
                />
              </Grid>
            </Grid>
            <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />
            <InventorySection
              state={state.data.inventory}
              actions={actions}
              availableInventory={state.availableInventory}
              isLoadingInventory={state.isLoadingInventory}
            />
          </Stack>
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
              : () => actions.setStep(1)
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
              (!state.data.logistics.customerId ||
                !state.data.logistics.destination))
          }
          onClick={
            state.currentStep === 1
              ? () => actions.setStep(2)
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
            : state.currentStep === 1
              ? "Next Step"
              : "Create Shipment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddShipmentDialog;
