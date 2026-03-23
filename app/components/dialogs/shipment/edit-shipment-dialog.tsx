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
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import {
  AddShipmentBasicInfo,
  AddShipmentLogistics,
  AddShipmentCargo,
  AddShipmentInventory,
  AddShipmentRoute,
  ShipmentPriority,
  InventoryShipmentItem,
} from "@/app/lib/type/add-shipment";
import { toast } from "sonner";
import { updateShipment } from "@/app/lib/controllers/shipments";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { getCustomers } from "@/app/lib/controllers/customer";
import { getInventory } from "@/app/lib/controllers/inventory";
import { getRoutes } from "@/app/lib/controllers/routes";
import { useUser } from "@/app/lib/hooks/useUser";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { CustomerWithRelations } from "@/app/lib/type/customer";
import { RouteWithRelations } from "@/app/lib/type/routes";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";
import BasicInfoSection from "./addShipmentDialog/sections/BasicInfoSection";
import LogisticsSection from "./addShipmentDialog/sections/LogisticsSection";
import CargoSection from "./addShipmentDialog/sections/CargoSection";
import InventorySection from "./addShipmentDialog/sections/InventorySection";
import RouteSection from "./addShipmentDialog/sections/RouteSection";

interface EditShipmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  shipment: ShipmentWithRelations | null;
}

// Local type for easier access to optional/extra fields
interface ExtendedShipment extends ShipmentWithRelations {
  priority?: ShipmentPriority;
  type?: string;
  slaDeadline?: Date | string | null;
  contactEmail?: string;
  billingAccount?: string;
}

const EditShipmentDialog = ({
  open,
  onClose,
  onSuccess,
  shipment,
}: EditShipmentDialogProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const { user } = useUser();

  /* --------------------------------- states --------------------------------- */
  const [basicInfo, setBasicInfo] = useState<AddShipmentBasicInfo>({
    referenceNumber: "",
    priority: "MEDIUM",
    type: "Standard Freight",
    slaDeadline: null,
  });
  const [logistics, setLogistics] = useState<AddShipmentLogistics>({
    originWarehouseId: "",
    destination: "",
    customerId: "",
    customerLocationId: "",
    contactEmail: "",
    billingAccount: "Standard Billing (Net 30)",
  });
  const [cargo, setCargo] = useState<AddShipmentCargo>({
    weightKg: 0,
    volumeM3: 0,
    palletCount: 0,
    cargoType: "General Cargo",
  });
  const [inventory, setInventory] = useState<AddShipmentInventory>({
    items: [],
  });
  const [route, setRoute] = useState<AddShipmentRoute>({
    assignedRouteId: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableInventory, setAvailableInventory] = useState<any[]>([]);

  const [warehouses, setWarehouses] = useState<WarehouseWithRelations[]>([]);
  const [customers, setCustomers] = useState<CustomerWithRelations[]>([]);
  const [routes, setRoutes] = useState<RouteWithRelations[]>([]);

  /* ------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open && shipment) {
      const extraShipment = shipment as ExtendedShipment;

      setBasicInfo({
        referenceNumber: shipment.trackingId || "",
        priority: (extraShipment.priority as any) || "MEDIUM",
        type: extraShipment.type || "Standard Freight",
        slaDeadline: extraShipment.slaDeadline
          ? new Date(extraShipment.slaDeadline)
          : null,
      });
      setLogistics({
        originWarehouseId: shipment.origin || "",
        destination: shipment.destination || "",
        customerId: shipment.customerId || "",
        customerLocationId: shipment.customerLocationId || "",
        contactEmail: extraShipment.contactEmail || "",
        billingAccount:
          extraShipment.billingAccount || "Standard Billing (Net 30)",
        destinationLat: shipment.destinationLat ?? undefined,
        destinationLng: shipment.destinationLng ?? undefined,
      });
      setCargo({
        weightKg: shipment.weightKg || 0,
        volumeM3: shipment.volumeM3 || 0,
        palletCount: shipment.palletCount || 0,
        cargoType: shipment.cargoType || "General Cargo",
      });
      setRoute({
        assignedRouteId: shipment.routeId || null,
      });
      setCurrentStep(1);
      setError(null);
    }
  }, [open, shipment]);

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
    if (warehouseId && user && open) {
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
  }, [logistics.originWarehouseId, user, open]);

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
    if (!user || !shipment) return;
    setIsLoading(true);
    setError(null);
    try {
      await updateShipment(shipment.id, {
        customerId: logistics.customerId,
        origin: logistics.originWarehouseId,
        destination: logistics.destination,
        itemsCount: inventory.items.length || shipment.itemsCount || 1,
        weightKg: cargo.weightKg,
        volumeM3: cargo.volumeM3,
        palletCount: cargo.palletCount,
        cargoType: cargo.cargoType,
        destinationLat: logistics.destinationLat,
        destinationLng: logistics.destinationLng,
        trackingId: basicInfo.referenceNumber,
        routeId: route.assignedRouteId,
      });

      toast.success("Shipment updated successfully");

      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update shipment";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!shipment) return null;

  return (
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
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
              }}
            >
              <EditIcon />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={700} color="white">
                Edit Shipment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update transport record and logistics data for{" "}
                {shipment.trackingId}
              </Typography>
            </Stack>
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
            (currentStep === 1 &&
              (!logistics.customerId || !logistics.destination))
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
            ? "Saving..."
            : currentStep === 1
              ? "Next Step"
              : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditShipmentDialog;
