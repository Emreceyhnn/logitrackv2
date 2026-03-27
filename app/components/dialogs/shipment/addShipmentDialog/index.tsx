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
import { useState, useEffect } from "react";
import {
  AddShipmentDialogProps,
  AddShipmentBasicInfo,
  AddShipmentLogistics,
  AddShipmentCargo,
  AddShipmentInventory,
  AddShipmentRoute,
  InventoryShipmentItem,
} from "@/app/lib/type/add-shipment";
import { toast } from "sonner";
import { createShipment } from "@/app/lib/controllers/shipments";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { getCustomers } from "@/app/lib/controllers/customer";
import { getInventory } from "@/app/lib/controllers/inventory";
import { getRoutes } from "@/app/lib/controllers/routes";
import { useUser } from "@/app/lib/hooks/useUser";
import { InventoryWithRelations } from "@/app/lib/type/inventory";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { CustomerWithRelations } from "@/app/lib/type/customer";
import { RouteWithRelations } from "@/app/lib/type/routes";
import BasicInfoSection from "./sections/BasicInfoSection";
import LogisticsSection from "./sections/LogisticsSection";
import CargoSection from "./sections/CargoSection";
import InventorySection from "./sections/InventorySection";
import RouteSection from "./sections/RouteSection";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";

const initialBasicInfo: AddShipmentBasicInfo = {
  referenceNumber: "",
  priority: "MEDIUM",
  type: "Standard Freight",
  slaDeadline: null,
};

const initialLogistics: AddShipmentLogistics = {
  originWarehouseId: "",
  originLat: undefined,
  originLng: undefined,
  destination: "",
  destinationLat: undefined,
  destinationLng: undefined,
  customerId: "",
  customerLocationId: "",
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
  const [basicInfo, setBasicInfo] =
    useState<AddShipmentBasicInfo>(initialBasicInfo);
  const [logistics, setLogistics] =
    useState<AddShipmentLogistics>(initialLogistics);
  const [cargo, setCargo] = useState<AddShipmentCargo>(initialCargo);
  const [inventory, setInventory] =
    useState<AddShipmentInventory>(initialInventory);
  const [route, setRoute] = useState<AddShipmentRoute>(initialRoute);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableInventory, setAvailableInventory] = useState<InventoryWithRelations[]>([]);

  const [warehouses, setWarehouses] = useState<WarehouseWithRelations[]>([]);
  const [customers, setCustomers] = useState<CustomerWithRelations[]>([]);
  const [routes, setRoutes] = useState<RouteWithRelations[]>([]);

  /* ------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open && user) {
      const fetchData = async () => {
        try {
          const [wRes, cRes, rRes] = await Promise.all([
            getWarehouses(),
            getCustomers(),
            getRoutes(),
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
    const warehouseId = logistics.originWarehouseId;
    if (warehouseId && user) {
      const fetchInventory = async () => {
        setIsLoadingInventory(true);
        try {
          const inv = await getInventory(warehouseId);
          setAvailableInventory(inv);
        } catch (error) {
          console.error("Failed to fetch warehouse inventory", error);
        } finally {
          setIsLoadingInventory(false);
        }
      };
      fetchInventory();
    } else {
      setAvailableInventory([]);
    }
  }, [logistics.originWarehouseId, user]);

  /* -------------------------------- actions --------------------------------- */
  /* -------------------------------- handlers --------------------------------- */
  const updateBasicInfo = (data: Partial<AddShipmentBasicInfo>) =>
    setBasicInfo((prev) => ({ ...prev, ...data }));
  const updateLogistics = (data: Partial<AddShipmentLogistics>) =>
    setLogistics((prev) => ({ ...prev, ...data }));
  const updateCargo = (data: Partial<AddShipmentCargo>) =>
    setCargo((prev) => ({ ...prev, ...data }));
  const updateInventory = (data: Partial<AddShipmentInventory>) =>
    setInventory((prev) => ({ ...prev, ...data }));
  const addInventoryItem = (item: InventoryShipmentItem) =>
    setInventory((prev) => ({ ...prev, items: [...prev.items, item] }));
  const removeInventoryItem = (id: string) =>
    setInventory((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  const updateRoute = (data: Partial<AddShipmentRoute>) =>
    setRoute((prev) => ({ ...prev, ...data }));

  const handleSubmit = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const selectedWarehouse = warehouses.find(
        (w) => w.id === logistics.originWarehouseId
      );
      const originName = selectedWarehouse?.name || logistics.originWarehouseId;

      await createShipment(
        logistics.customerId,
        originName,
        logistics.destination,
        "PENDING",
        inventory.items.length || 1,
        cargo.weightKg,
        cargo.volumeM3,
        cargo.palletCount,
        cargo.cargoType,
        logistics.destinationLat,
        logistics.destinationLng,
        logistics.originLat,
        logistics.originLng,
        basicInfo.referenceNumber,
        logistics.customerLocationId,
        basicInfo.priority,
        basicInfo.type,
        basicInfo.slaDeadline,
        logistics.contactEmail,
        logistics.billingAccount
      );

      toast.success("Shipment created successfully");

      setTimeout(() => {
        onClose();
        onSuccess?.();
        resetForm();
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create shipment";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setBasicInfo(initialBasicInfo);
    setLogistics(initialLogistics);
    setCargo(initialCargo);
    setInventory(initialInventory);
    setRoute(initialRoute);
    setCurrentStep(1);
    setIsLoading(false);
    setIsLoadingInventory(false);
    setError(null);
    setAvailableInventory([]);
  };

  const closeDialog = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <GoogleMapsProvider>
      <Dialog
        open={open}
        onClose={closeDialog}
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
                {currentStep === 1
                  ? "Create Shipment"
                  : "Cargo & Inventory Details"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Initialize transport record and logistics data
              </Typography>
            </Stack>
            <IconButton onClick={closeDialog} sx={{ color: "text.secondary" }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stepper
            activeStep={currentStep - 1}
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
          {error && (
            <Box
              mb={2}
              p={2}
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                borderRadius: 1,
              }}
            >
              <Typography color="error" variant="caption">
                {error}
              </Typography>
            </Box>
          )}
          {currentStep === 1 ? (
            <Stack spacing={6}>
              <BasicInfoSection
                state={basicInfo}
                updateBasicInfo={updateBasicInfo}
              />
              <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />
              <LogisticsSection
                state={logistics}
                updateLogistics={updateLogistics}
                warehouses={warehouses}
                customers={customers}
              />
            </Stack>
          ) : (
            <Stack spacing={6}>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CargoSection state={cargo} updateCargo={updateCargo} />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <RouteSection
                    state={route}
                    updateRoute={updateRoute}
                    routes={routes}
                  />
                </Grid>
              </Grid>
              <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />
              <InventorySection
                state={inventory}
                addInventoryItem={addInventoryItem}
                removeInventoryItem={removeInventoryItem}
                updateInventory={updateInventory}
                updateCargo={updateCargo}
                availableInventory={availableInventory}
                isLoadingInventory={isLoadingInventory}
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
            onClick={currentStep === 1 ? closeDialog : () => setCurrentStep(1)}
            sx={{ color: "text.secondary", textTransform: "none" }}
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          <Button
            variant="contained"
            disabled={
              isLoading ||
              (currentStep === 1 && !logistics.destination)
            }
            onClick={currentStep === 1 ? () => setCurrentStep(2) : handleSubmit}
            sx={{
              minWidth: 140,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
            startIcon={
              isLoading && <CircularProgress size={16} color="inherit" />
            }
          >
            {isLoading
              ? "Creating..."
              : currentStep === 1
                ? "Next Step"
                : "Create Shipment"}
          </Button>
        </DialogActions>
      </Dialog>
    </GoogleMapsProvider>
  );
};

export default AddShipmentDialog;
