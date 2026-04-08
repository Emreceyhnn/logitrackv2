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
import { ShipmentStatus, ShipmentPriority } from "@prisma/client";
import { Formik, Form } from "formik";
import { addShipmentValidationSchema } from "@/app/lib/validationSchema";
import { ShipmentFormValues } from "@/app/lib/type/shipment";
import BasicInfoSection from "./sections/BasicInfoSection";
import LogisticsSection from "./sections/LogisticsSection";
import CargoSection from "./sections/CargoSection";
import InventorySection from "./sections/InventorySection";
import RouteSection from "./sections/RouteSection";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";

const initialValues: ShipmentFormValues = {
  referenceNumber: "",
  priority: ShipmentPriority.MEDIUM,
  type: "Standard Freight",
  slaDeadline: null,
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
  weightKg: 0,
  volumeM3: 0,
  palletCount: 0,
  cargoType: "General Cargo",
  assignedRouteId: null,
  inventoryItems: [],
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
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

  /* -------------------------------- handlers --------------------------------- */
  const handleFetchInventory = async (warehouseId: string) => {
    if (!warehouseId || !user) {
      setAvailableInventory([]);
      return;
    }
    setIsLoadingInventory(true);
    try {
      const inv = await getInventory(warehouseId);
      setAvailableInventory(inv);
    } catch (error) {
      console.error("Failed to fetch warehouse inventory", error);
      setAvailableInventory([]);
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const onSubmit = async (values: ShipmentFormValues) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const selectedWarehouse = warehouses.find(
        (w) => w.id === values.originWarehouseId
      );
      const originName = selectedWarehouse?.name || values.originWarehouseId;

      await createShipment(
        values.customerId,
        originName,
        values.destination,
        ShipmentStatus.PENDING,
        values.inventoryItems.length || 1,
        values.weightKg,
        values.volumeM3,
        values.palletCount,
        values.cargoType,
        values.destinationLat,
        values.destinationLng,
        values.originLat,
        values.originLng,
        values.referenceNumber,
        values.customerLocationId,
        values.priority,
        values.type,
        values.slaDeadline,
        values.contactEmail,
        values.billingAccount
      );

      toast.success("Shipment created successfully");
      setTimeout(() => {
        onClose();
        onSuccess?.();
        setCurrentStep(1);
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create shipment";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    if (!isLoading) {
      onClose();
      setCurrentStep(1);
    }
  };

  return (
    <GoogleMapsProvider>
      <Formik
        initialValues={initialValues}
        validationSchema={addShipmentValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, touched, errors, handleSubmit, validateForm, setFieldTouched }) => {
          // Sync available inventory when origin warehouse changes
          useEffect(() => {
            handleFetchInventory(values.originWarehouseId);
          }, [values.originWarehouseId]);

          const handleNextStep = async () => {
             // Validate current fields before going to next step
             const step1Fields = [
               'referenceNumber', 'priority', 'type', 'slaDeadline', 
               'originWarehouseId', 'destination', 'customerId', 
               'customerLocationId', 'contactEmail'
             ];
             
             step1Fields.forEach(field => setFieldTouched(field, true));
             const result = await validateForm();
             
             const hasErrors = step1Fields.some(field => result[field as keyof typeof result]);
             if (!hasErrors) {
               setCurrentStep(2);
             } else {
               toast.error("Please fix the errors in Step 1 first.");
             }
          };

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
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={700} color="white">
                      {currentStep === 1 ? "Create Shipment" : "Cargo & Inventory Details"}
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
                    "& .MuiStepLabel-label": { color: alpha("#fff", 0.5), fontWeight: 600 },
                    "& .MuiStepLabel-label.Mui-active": { color: theme.palette.primary.main },
                    "& .MuiStepLabel-label.Mui-completed": { color: alpha("#fff", 0.7) },
                    "& .MuiStepIcon-root": { color: alpha(theme.palette.divider, 0.1) },
                    "& .MuiStepIcon-root.Mui-active": { color: theme.palette.primary.main },
                    "& .MuiStepIcon-root.Mui-completed": { color: theme.palette.primary.main },
                  }}
                >
                  <Step><StepLabel>Logistics & Basic Info</StepLabel></Step>
                  <Step><StepLabel>Cargo & Inventory</StepLabel></Step>
                </Stepper>
              </Box>

              <DialogContent sx={{ mt: 2, pb: 4, minHeight: 400 }}>
                <Form>
                  {currentStep === 1 ? (
                    <Stack spacing={6}>
                      <BasicInfoSection />
                      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />
                      <LogisticsSection warehouses={warehouses} customers={customers} />
                    </Stack>
                  ) : (
                    <Stack spacing={6}>
                      <Grid container spacing={6}>
                        <Grid size={{ xs: 12, lg: 6 }}>
                          <CargoSection />
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}>
                          <RouteSection routes={routes} />
                        </Grid>
                      </Grid>
                      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />
                      <InventorySection
                        availableInventory={availableInventory}
                        isLoadingInventory={isLoadingInventory}
                      />
                    </Stack>
                  )}
                </Form>
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
                  disabled={isLoading}
                  onClick={currentStep === 1 ? handleNextStep : () => handleSubmit()}
                  sx={{
                    minWidth: 140,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                  startIcon={isLoading && <CircularProgress size={16} color="inherit" />}
                >
                  {isLoading
                    ? "Creating..."
                    : currentStep === 1
                      ? "Next Step"
                      : "Create Shipment"}
                </Button>
              </DialogActions>
            </Dialog>
          );
        }}
      </Formik>
    </GoogleMapsProvider>
  );
};

export default AddShipmentDialog;
