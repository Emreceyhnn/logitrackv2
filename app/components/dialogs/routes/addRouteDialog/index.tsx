"use client";

import {
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
import { useState, useEffect, useMemo } from "react";
import { AddRouteDialogProps } from "@/app/lib/type/add-route";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";
import { toast } from "sonner";
import { createRoute } from "@/app/lib/controllers/routes";
import { getShipments } from "@/app/lib/controllers/shipments";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { Warehouse } from "@/app/lib/type/enums";
import { useUser } from "@/app/lib/hooks/useUser";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { Formik, Form } from "formik";
import { addRouteValidationSchema } from "@/app/lib/validationSchema";
import { RouteFormValues } from "@/app/lib/type/routes";
import FirstRouteDialogStep from "./firstStep";
import SecondRouteDialogStep from "./secondStep";
import ThirdRouteDialogStep from "./thirdStep";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

const initialValues: RouteFormValues = {
  name: "",
  startTime: null,
  endTime: null,
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
  driverId: "",
  vehicleId: "",
};

const AddRouteDialog = ({ open, onClose, onSuccess }: AddRouteDialogProps) => {
  const theme = useTheme();
  const { user } = useUser();
  const dict = useDictionary();

  /* --------------------------------- states --------------------------------- */
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
  const onSubmit = async (values: RouteFormValues) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const routeDate = values.startTime || new Date();

      await createRoute(
        values.name,
        routeDate,
        values.startTime || new Date(),
        values.endTime || new Date(),
        values.distanceKm,
        values.durationMin,
        values.driverId,
        values.vehicleId,
        {
          type: values.startType,
          id: values.startId,
          address: values.startAddress,
          lat: values.startLat,
          lng: values.startLng,
        },
        {
          type: values.endType,
          id: values.endId,
          address: values.endAddress,
          lat: values.endLat,
          lng: values.endLng,
        }
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
    dict.routes.dialogs.steps.schedule,
    dict.routes.dialogs.steps.locations,
    dict.routes.dialogs.steps.assignments,
  ];

  return (
    <GoogleMapsProvider>
      <Formik
        initialValues={initialValues}
        validationSchema={useMemo(() => addRouteValidationSchema(dict), [dict])}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ handleSubmit, validateForm, setFieldTouched, setFieldValue }) => {
          const handleShipmentSelect = async (shipmentId: string) => {
            const shipment = shipments.find((s) => s.id === shipmentId);
            if (shipment) {
              const warehouse = warehouses.find(
                (w) => w.id === shipment.origin
              );
              const defaultLoc = shipment.customer?.locations?.find(
                (l) => l.isDefault
              );
              const fallbackLoc = shipment.customer?.locations?.[0];

              setFieldValue(
                "endAddress",
                shipment.destination ||
                  defaultLoc?.address ||
                  fallbackLoc?.address ||
                  ""
              );
              setFieldValue(
                "endLat",
                shipment.destinationLat ??
                  defaultLoc?.lat ??
                  fallbackLoc?.lat ??
                  undefined
              );
              setFieldValue(
                "endLng",
                shipment.destinationLng ??
                  defaultLoc?.lng ??
                  fallbackLoc?.lng ??
                  undefined
              );

              if (warehouse) {
                setFieldValue("startAddress", warehouse.address);
                setFieldValue("startLat", warehouse.lat ?? undefined);
                setFieldValue("startLng", warehouse.lng ?? undefined);
                setFieldValue("startId", warehouse.id);
                setFieldValue("startType", "WAREHOUSE");
              }

              const deadlineDate = shipment.slaDeadline
                ? new Date(shipment.slaDeadline)
                : null;
              const hasDeadline =
                deadlineDate && !isNaN(deadlineDate.getTime());

              setFieldValue(
                "name",
                `${dict.routes.dialogs.deliveryLabel}: ${shipment.customer?.name || dict.routes.details.delivery} - ${shipment.trackingId}`
              );
              if (hasDeadline) {
                setFieldValue(
                  "endTime",
                  new Date(deadlineDate!.getTime() + 2 * 60 * 60 * 1000)
                );
              }

              toast.info(
                `${dict.routes.dialogs.prefilledFrom} ${shipment.trackingId}`
              );
            }
          };

          const handleNextStep = async () => {
            let fieldsToValidate: string[] = [];
            if (currentStep === 1) {
              fieldsToValidate = ["name", "startTime", "endTime"];
            } else if (currentStep === 2) {
              fieldsToValidate = ["startAddress", "endAddress"];
            }

            fieldsToValidate.forEach((f) => setFieldTouched(f, true));
            const result = await validateForm();
            const hasErrors = fieldsToValidate.some(
              (f) => result[f as keyof typeof result]
            );

            if (!hasErrors) {
              setCurrentStep((prev) => prev + 1);
            } else {
              toast.error(dict.validation.genericFormError);
            }
          };

          return (
            <Dialog
              open={open}
              onClose={closeDialog}
              maxWidth="md"
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
                >
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={600} color="white">
                      {dict.routes.dialogs.addTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dict.routes.dialogs.addSubtitle}
                    </Typography>
                  </Stack>
                  <IconButton
                    onClick={closeDialog}
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
                    activeStep={currentStep - 1}
                    sx={{
                      "& .MuiStepConnector-line": {
                        borderColor: theme.palette.divider_alpha.main_10,
                      },
                    }}
                  >
                    {steps.map((label, index) => (
                      <Step key={label}>
                        <StepLabel
                          StepIconProps={{
                            sx: {
                              "&.Mui-active": {
                                color: theme.palette.primary.main,
                              },
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
                              currentStep - 1 >= index
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
                  sx={{
                    mb: 4,
                    borderColor: theme.palette.divider_alpha.main_05,
                  }}
                />

                <Box sx={{ minHeight: 400 }}>
                  <Form>
                    {currentStep === 1 && (
                      <FirstRouteDialogStep
                        shipments={shipments}
                        onShipmentSelect={handleShipmentSelect}
                      />
                    )}
                    {currentStep === 2 && <SecondRouteDialogStep />}
                    {currentStep === 3 && <ThirdRouteDialogStep />}
                  </Form>
                </Box>
              </DialogContent>
              <DialogActions
                sx={{ p: 3, pt: 0, justifyContent: "space-between" }}
              >
                <Button
                  onClick={
                    currentStep === 1
                      ? closeDialog
                      : () => setCurrentStep((prev) => prev - 1)
                  }
                  disabled={isLoading}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { bgcolor: theme.palette.divider_alpha.main_05 },
                  }}
                >
                  {currentStep === 1 ? dict.common.cancel : dict.common.back}
                </Button>
                <Button
                  variant="contained"
                  onClick={
                    currentStep === steps.length
                      ? () => handleSubmit()
                      : handleNextStep
                  }
                  disabled={isLoading}
                  startIcon={
                    isLoading && <CircularProgress size={16} color="inherit" />
                  }
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    fontWeight: 600,
                    boxShadow: `0 8px 16px ${theme.palette.primary._alpha.main_20}`,
                  }}
                >
                  {isLoading
                    ? dict.toasts.loading
                    : currentStep === steps.length
                      ? dict.common.save
                      : dict.common.next}
                </Button>
              </DialogActions>
            </Dialog>
          );
        }}
      </Formik>
    </GoogleMapsProvider>
  );
};

export default AddRouteDialog;
