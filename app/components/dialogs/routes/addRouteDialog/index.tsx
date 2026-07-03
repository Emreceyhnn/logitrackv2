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
import { useUser } from "@/app/hooks/useUser";
import { toUTC } from "@/app/lib/utils/date";

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
  stops: [],
};

const AddRouteDialog = ({ open, onClose, onSuccess }: AddRouteDialogProps) => {
  const theme = useTheme();
  const { user } = useUser();
  const dict = useDictionary();

  /* --------------------------------- states --------------------------------- */
  const [currentStep, setCurrentStep] = useState(1);
  const [shipments, setShipments] = useState<ShipmentWithRelations[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(
    null
  );

  /* ------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open && user) {
      const fetchData = async () => {
        try {
          const [shipmentsData, warehousesData] = await Promise.all([
            getShipments({
              unassigned: true,
              status: "PENDING",
            }),
            getWarehouses(),
          ]);
          // Without pagination args getShipments returns a plain array; the
          // paginated variant returns { shipments, totalCount }.
          setShipments(
            Array.isArray(shipmentsData)
              ? shipmentsData
              : shipmentsData.shipments
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

    const userTz = user.timezone || "UTC";
    const startUTC = values.startTime
      ? toUTC(values.startTime, userTz)
      : new Date();
    const endUTC = values.endTime ? toUTC(values.endTime, userTz) : new Date();

    try {
      await toast.promise(
        createRoute(
          values.name,
          startUTC,
          startUTC,
          endUTC,
          values.distanceKm,
          values.durationMin,
          values.driverId,
          values.vehicleId,
          selectedShipmentId || undefined,
          values.stops
        ),
        {
          loading: dict.toasts.loading,
          success: dict.toasts.successAdd,
          error: (err: unknown) =>
            err instanceof Error ? err.message : dict.toasts.errorGeneric,
        }
      );

      onSuccess?.();
      onClose();
      setCurrentStep(1);
      setSelectedShipmentId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const closeDialog = () => {
    onClose();
    setCurrentStep(1);
    setSelectedShipmentId(null);
  };

  const steps = [
    dict.routes.dialogs.steps.schedule,
    dict.routes.dialogs.steps.locations,
    dict.routes.dialogs.steps.assignments,
  ];

  return (
    <>
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
              setSelectedShipmentId(shipmentId);
              const warehouse = warehouses.find(
                (w) =>
                  w.id === shipment.originWarehouseId ||
                  w.id === shipment.origin
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
              } else {
                setFieldValue("startAddress", shipment.origin || "");
                setFieldValue(
                  "startLat",
                  typeof shipment.originLat === "number"
                    ? shipment.originLat
                    : undefined
                );
                setFieldValue(
                  "startLng",
                  typeof shipment.originLng === "number"
                    ? shipment.originLng
                    : undefined
                );
                setFieldValue("startId", "");
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

              const startWaypoint = {
                address: warehouse ? warehouse.address : shipment.origin || "",
                lat: warehouse
                  ? (warehouse.lat ?? undefined)
                  : typeof shipment.originLat === "number"
                    ? shipment.originLat
                    : undefined,
                lng: warehouse
                  ? (warehouse.lng ?? undefined)
                  : typeof shipment.originLng === "number"
                    ? shipment.originLng
                    : undefined,
              };

              const endWaypoint = {
                address:
                  shipment.destination ||
                  defaultLoc?.address ||
                  fallbackLoc?.address ||
                  "",
                lat:
                  shipment.destinationLat ??
                  defaultLoc?.lat ??
                  fallbackLoc?.lat ??
                  undefined,
                lng:
                  shipment.destinationLng ??
                  defaultLoc?.lng ??
                  fallbackLoc?.lng ??
                  undefined,
              };

              const stopsToSet = [];

              if (startWaypoint.address) {
                stopsToSet.push(startWaypoint);
              }

              if (shipment.stops && shipment.stops.length > 0) {
                const destinationLocId = shipment.customerLocationId;

                const intermediateStops = (shipment.stops || []).filter(
                  (stop, index) => {
                    const isFirst = index === 0;
                    const isLast = index === (shipment.stops?.length || 0) - 1;

                    if (isFirst) {
                      const isOrigin =
                        (startWaypoint.address &&
                          stop.address === startWaypoint.address) ||
                        (shipment.origin && stop.address === shipment.origin) ||
                        (warehouse && stop.address === warehouse.address);
                      if (isOrigin) return false;
                    }

                    if (isLast) {
                      const isDestination =
                        (shipment.destination &&
                          stop.address === shipment.destination) ||
                        (destinationLocId &&
                          stop.customerLocationId === destinationLocId) ||
                        (endWaypoint.address &&
                          stop.address === endWaypoint.address);
                      if (isDestination) return false;
                    }

                    return true;
                  }
                );

                intermediateStops.forEach((stop) => {
                  stopsToSet.push({
                    address: stop.address || "",
                    lat: stop.lat ?? undefined,
                    lng: stop.lng ?? undefined,
                  });
                });
              }

              if (endWaypoint.address) {
                stopsToSet.push(endWaypoint);
              }

              setFieldValue("stops", stopsToSet);

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
                    <Typography
                      component="div"
                      variant="h6"
                      fontWeight={600}
                      color="white"
                    >
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
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    fontWeight: 600,
                    boxShadow: `0 8px 16px ${theme.palette.primary._alpha.main_20}`,
                  }}
                >
                  {currentStep === steps.length
                    ? dict.common.save
                    : dict.common.next}
                </Button>
              </DialogActions>
            </Dialog>
          );
        }}
      </Formik>
    </>
  );
};

export default AddRouteDialog;
