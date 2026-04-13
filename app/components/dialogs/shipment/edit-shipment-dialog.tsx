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
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { updateShipment } from "@/app/lib/controllers/shipments";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { getCustomers } from "@/app/lib/controllers/customer";
import { getRoutes } from "@/app/lib/controllers/routes";
import { useUser } from "@/app/lib/hooks/useUser";
import { InventoryWithRelations } from "@/app/lib/type/inventory";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { CustomerWithRelations } from "@/app/lib/type/customer";
import { RouteWithRelations } from "@/app/lib/type/routes";
import {
  ShipmentWithRelations,
  ShipmentFormValues,
} from "@/app/lib/type/shipment";
import { ShipmentPriority } from "@prisma/client";
import { Formik, Form, useFormikContext } from "formik";
import { editShipmentValidationSchema } from "@/app/lib/validationSchema";
import BasicInfoSection from "./addShipmentDialog/sections/BasicInfoSection";
import LogisticsSection from "./addShipmentDialog/sections/LogisticsSection";
import CargoSection from "./addShipmentDialog/sections/CargoSection";
import InventorySection from "./addShipmentDialog/sections/InventorySection";
import RouteSection from "./addShipmentDialog/sections/RouteSection";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface EditShipmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  shipment: ShipmentWithRelations | null;
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
  const dict = useDictionary();
  const validationSchema = useMemo(() => editShipmentValidationSchema(dict), [dict]);

  /* --------------------------------- states --------------------------------- */
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [availableInventory, setAvailableInventory] = useState<
    InventoryWithRelations[]
  >([]);

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

  const getInitialValues = (): ShipmentFormValues => {
    if (!shipment) {
      return {
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
    }

    return {
      referenceNumber: shipment.trackingId || "",
      priority:
        (shipment.priority as ShipmentPriority) || ShipmentPriority.MEDIUM,
      type: shipment.type || "Standard Freight",
      slaDeadline: shipment.slaDeadline ? new Date(shipment.slaDeadline) : null,
      originWarehouseId: shipment.origin || "",
      originLat: shipment.originLat ?? undefined,
      originLng: shipment.originLng ?? undefined,
      destination: shipment.destination || "",
      destinationLat: shipment.destinationLat ?? undefined,
      destinationLng: shipment.destinationLng ?? undefined,
      customerId: shipment.customerId || "",
      customerLocationId: shipment.customerLocationId || "",
      contactEmail: shipment.contactEmail || "",
      billingAccount: shipment.billingAccount || "Standard Billing (Net 30)",
      weightKg: shipment.weightKg || 0,
      volumeM3: shipment.volumeM3 || 0,
      palletCount: shipment.palletCount || 0,
      cargoType: shipment.cargoType || "General Cargo",
      assignedRouteId: shipment.routeId || null,
      inventoryItems: [],
    };
  };

  const FormikInventorySync = ({
    onWarehouseChange,
    open,
  }: {
    onWarehouseChange: (id: string) => void;
    open: boolean;
  }) => {
    const { values } = useFormikContext<ShipmentFormValues>();
    useEffect(() => {
      if (open) {
        onWarehouseChange(values.originWarehouseId);
      }
    }, [values.originWarehouseId, open, onWarehouseChange]);
    return null;
  };

  const onSubmit = async (values: ShipmentFormValues) => {
    if (!user || !shipment) return;
    setIsLoading(true);
    try {
      await updateShipment(shipment.id, {
        customerId: values.customerId,
        origin: values.originWarehouseId,
        destination: values.destination,
        itemsCount: values.inventoryItems.length || shipment.itemsCount || 1,
        weightKg: values.weightKg,
        volumeM3: values.volumeM3,
        palletCount: values.palletCount,
        cargoType: values.cargoType,
        destinationLat: values.destinationLat,
        destinationLng: values.destinationLng,
        originLat: values.originLat,
        originLng: values.originLng,
        trackingId: values.referenceNumber,
        routeId: values.assignedRouteId,
        priority: values.priority,
        type: values.type,
        slaDeadline: values.slaDeadline,
        contactEmail: values.contactEmail,
        billingAccount: values.billingAccount,
        customerLocationId: values.customerLocationId,
      });

      toast.success(dict.toasts.successUpdate);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : dict.toasts.errorGeneric;
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

  const steps = useMemo(() => [
    dict.shipments.dialogs.steps.logistics,
    dict.shipments.dialogs.steps.cargo
  ], [dict]);

  if (!shipment) return null;

  return (
    <GoogleMapsProvider>
      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleSubmit, validateForm, setFieldTouched }) => {
          const handleNextStep = async () => {
            const step1Fields = [
              "referenceNumber",
              "priority",
              "type",
              "slaDeadline",
              "originWarehouseId",
              "destination",
              "customerId",
              "customerLocationId",
              "contactEmail",
            ];

            step1Fields.forEach((field) => setFieldTouched(field, true));
            const result = await validateForm();

            const hasErrors = step1Fields.some(
              (field) => result[field as keyof typeof result]
            );
            if (!hasErrors) {
              setCurrentStep(2);
            } else {
              toast.error(dict.validation.genericFormError);
            }
          };

          return (
            <>
              <FormikInventorySync
                onWarehouseChange={() => {}} 
                open={open}
              />
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
                        {dict.shipments.dialogs.editTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dict.shipments.dialogs.editSubtitle} {shipment.trackingId}
                      </Typography>
                    </Stack>
                  </Stack>
                  <IconButton
                    onClick={closeDialog}
                    sx={{ color: "text.secondary" }}
                  >
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
                    "& .MuiStepIcon-root": {
                      color: alpha(theme.palette.divider, 0.1),
                    },
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

              <DialogContent sx={{ mt: 2, pb: 4, minHeight: 400 }}>
                <Form>
                  {currentStep === 1 ? (
                    <Stack spacing={6}>
                      <BasicInfoSection />
                      <Divider
                        sx={{ borderColor: alpha(theme.palette.divider, 0.05) }}
                      />
                      <LogisticsSection
                        warehouses={warehouses}
                        customers={customers}
                      />
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
                      <Divider
                        sx={{ borderColor: alpha(theme.palette.divider, 0.05) }}
                      />
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
                  onClick={
                    currentStep === 1 ? closeDialog : () => setCurrentStep(1)
                  }
                  sx={{ color: "text.secondary", textTransform: "none" }}
                >
                  {currentStep === 1 ? dict.common.cancel : dict.common.back}
                </Button>

                <Button
                  variant="contained"
                  disabled={isLoading}
                  onClick={
                    currentStep === 1 ? handleNextStep : () => handleSubmit()
                  }
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
                    ? dict.toasts.loading
                    : currentStep === 1
                      ? dict.common.next
                      : dict.common.save}
                </Button>
              </DialogActions>
              </Dialog>
            </>
          );
        }}
      </Formik>
    </GoogleMapsProvider>
  );
};

export default EditShipmentDialog;
