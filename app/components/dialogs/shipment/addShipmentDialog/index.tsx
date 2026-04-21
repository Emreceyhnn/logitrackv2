"use client";

import {
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
import { useState, useEffect, useMemo, useCallback } from "react";
import { AddShipmentDialogProps } from "@/app/lib/type/add-shipment";
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
import { ShipmentStatus, ShipmentPriority } from "@/app/lib/type/enums";
import { Formik, Form, useFormikContext } from "formik";
import { addShipmentValidationSchema } from "@/app/lib/validationSchema";
import { ShipmentFormValues } from "@/app/lib/type/shipment";
import BasicInfoSection from "./sections/BasicInfoSection";
import LogisticsSection from "./sections/LogisticsSection";
import CargoSection from "./sections/CargoSection";
import InventorySection from "./sections/InventorySection";
import RouteSection from "./sections/RouteSection";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

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

const FormikInventorySync = ({
  onWarehouseChange,
}: {
  onWarehouseChange: (id: string) => void;
}) => {
  const { values } = useFormikContext<ShipmentFormValues>();
  useEffect(() => {
    onWarehouseChange(values.originWarehouseId);
  }, [values.originWarehouseId, onWarehouseChange]);
  return null;
};

const AddShipmentDialog = ({
  open,
  onClose,
  onSuccess,
}: AddShipmentDialogProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const { user } = useUser();
  const dict = useDictionary();

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

  /* -------------------------------- handlers --------------------------------- */
  const handleFetchInventory = useCallback(
    async (warehouseId: string) => {
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
    },
    [user]
  );

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

      toast.success(dict.toasts.successAdd);
      setTimeout(() => {
        onClose();
        onSuccess?.();
        setCurrentStep(1);
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

  const steps = [
    dict.shipments.dialogs.steps.logistics,
    dict.shipments.dialogs.steps.cargo,
  ];

  return (
    <GoogleMapsProvider>
      <Formik
        initialValues={initialValues}
        validationSchema={useMemo(
          () => addShipmentValidationSchema(dict),
          [dict]
        )}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleSubmit, validateForm, setFieldTouched }) => {
          const handleNextStep = async () => {
            // Validate current fields before going to next step
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
              <FormikInventorySync onWarehouseChange={handleFetchInventory} />
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
                    border: `1px solid ${theme.palette.divider_alpha.main_10}`,
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
                          ? dict.shipments.dialogs.addTitle
                          : dict.shipments.dialogs.cargoTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dict.shipments.dialogs.addSubtitle}
                      </Typography>
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
                        color: theme.palette.common.white_alpha.main_50,
                        fontWeight: 600,
                      },
                      "& .MuiStepLabel-label.Mui-active": {
                        color: theme.palette.primary.main,
                      },
                      "& .MuiStepLabel-label.Mui-completed": {
                        color: theme.palette.common.white_alpha.main_70,
                      },
                      "& .MuiStepIcon-root": {
                        color: theme.palette.divider_alpha.main_10,
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
                          sx={{
                            borderColor: theme.palette.divider_alpha.main_05,
                          }}
                        />
                        <LogisticsSection
                          warehouses={warehouses}
                          customers={customers}
                        />
                      </Stack>
                    ) : (
                      <Stack spacing={6}>
                        <Grid container spacing={6}>
                          <Grid size={{ xs: 12, lg: 12 }}>
                            <CargoSection />
                          </Grid>
                        </Grid>
                        <Divider
                          sx={{
                            borderColor: theme.palette.divider_alpha.main_05,
                          }}
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
                    borderTop: `1px solid ${theme.palette.divider_alpha.main_05}`,
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    onClick={
                      currentStep === 1 ? closeDialog : () => setCurrentStep(1)
                    }
                    sx={{ 
                      color: "text.secondary", 
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2,
                      "&:hover": {
                        color: "white",
                        bgcolor: theme.palette.divider_alpha.main_05,
                      }
                    }}
                  >
                    {currentStep === 1 ? dict.common.cancel : dict.common.back}
                  </Button>
                  
                  <Stack direction="row" spacing={2}>
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
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        boxShadow: `0 8px 24px ${theme.palette.primary._alpha.main_20}`,
                        "&:hover": {
                          boxShadow: `0 12px 32px ${theme.palette.primary._alpha.main_40}`,
                          transform: 'translateY(-1px)',
                        },
                        "&:active": {
                          transform: 'translateY(0)',
                        }
                      }}
                      startIcon={
                        isLoading && (
                          <CircularProgress size={16} color="inherit" />
                        )
                      }
                    >
                      {isLoading
                        ? dict.toasts.loading
                        : currentStep === 1
                          ? dict.common.next
                          : dict.common.save}
                    </Button>
                  </Stack>
                </DialogActions>
              </Dialog>
            </>
          );
        }}
      </Formik>
    </GoogleMapsProvider>
  );
};

export default AddShipmentDialog;
