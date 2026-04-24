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
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { updateRoute } from "@/app/lib/controllers/routes";
import { useUser } from "@/app/lib/hooks/useUser";
import FirstRouteDialogStep from "./addRouteDialog/firstStep";
import SecondRouteDialogStep from "./addRouteDialog/secondStep";
import ThirdRouteDialogStep from "./addRouteDialog/thirdStep";
import { RouteWithRelations, RouteFormValues } from "@/app/lib/type/routes";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import { Formik, Form } from "formik";
import { editRouteValidationSchema } from "@/app/lib/validationSchema";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { toUTC, utcToUserTz } from "@/app/lib/utils/date";

interface EditRouteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  route: RouteWithRelations | null;
}

const EditRouteDialog = ({ open, onClose, onSuccess, route }: EditRouteDialogProps) => {
  const theme = useTheme();
  const { user } = useUser();
  const dict = useDictionary();

  /* --------------------------------- states --------------------------------- */
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  /* -------------------------------- handlers --------------------------------- */
  const getInitialValues = (): RouteFormValues => {
    const userTz = user?.timezone || "UTC";
    if (!route) {
      return {
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
    }

    // Convert UTC dates from DB to the user's local timezone for the picker
    const startInUserTz = utcToUserTz(route.startTime, userTz);
    const endInUserTz = utcToUserTz(route.endTime, userTz);

    return {
      name: route.name || "",
      startTime: startInUserTz ? startInUserTz.toDate() : null,
      endTime: endInUserTz ? endInUserTz.toDate() : null,
      startType: route.startType || "WAREHOUSE",
      startId: route.startId || "",
      startAddress: route.startAddress || "",
      startLat: route.startLat || 0,
      startLng: route.startLng || 0,
      endType: route.endType || "CUSTOMER",
      endId: route.endId || "",
      endAddress: route.endAddress || "",
      endLat: route.endLat || 0,
      endLng: route.endLng || 0,
      distanceKm: route.distanceKm || 0,
      durationMin: route.durationMin || 0,
      driverId: route.driverId || "",
      vehicleId: route.vehicleId || "",
    };
  };

  const onSubmit = async (values: RouteFormValues) => {
    if (!user || !route) return;
    setIsLoading(true);
    try {
      // Convert user-local wall-clock times back to UTC for storage
      const userTz = user.timezone || "UTC";
      const startUTC = values.startTime ? toUTC(values.startTime, userTz) : undefined;
      const endUTC = values.endTime ? toUTC(values.endTime, userTz) : undefined;

      await updateRoute(route.id, {
        name: values.name,
        startTime: startUTC,
        endTime: endUTC,
        startAddress: values.startAddress,
        startLat: values.startLat,
        startLng: values.startLng,
        endAddress: values.endAddress,
        endLat: values.endLat,
        endLng: values.endLng,
        distanceKm: values.distanceKm,
        durationMin: values.durationMin,
        driver: values.driverId ? { connect: { id: values.driverId } } : { disconnect: true },
        vehicle: values.vehicleId ? { connect: { id: values.vehicleId } } : { disconnect: true },
      });

      toast.success(dict.toasts.successUpdate);
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : dict.toasts.errorGeneric;
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
    dict.routes.dialogs.steps.assignments
  ];

  const validationSchema = useMemo(() => editRouteValidationSchema(dict), [dict]);
  if (!route) return null;

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
            let fieldsToValidate: string[] = [];
            if (currentStep === 1) {
              fieldsToValidate = ['name', 'startTime', 'endTime'];
            } else if (currentStep === 2) {
              fieldsToValidate = ['startAddress', 'endAddress'];
            }

            fieldsToValidate.forEach(f => setFieldTouched(f, true));
            const result = await validateForm();
            const hasErrors = fieldsToValidate.some(f => result[f as keyof typeof result]);

            if (!hasErrors) {
              setCurrentStep(prev => prev + 1);
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
                  backgroundImage: "none",
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider_alpha.main_10}`,
                  overflow: "hidden",
                },
              }}
            >
              <Box sx={{ p: 3, pb: 0 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={600} color="white">
                      {dict.routes.dialogs.editTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dict.routes.dialogs.editSubtitle}
                    </Typography>
                  </Stack>
                  <IconButton onClick={closeDialog} size="small" sx={{ color: "text.secondary" }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
              <DialogContent>
                <Box sx={{ mb: 4, px: 2 }}>
                  <Stepper activeStep={currentStep - 1} sx={{ "& .MuiStepConnector-line": { borderColor: theme.palette.divider_alpha.main_10 } }}>
                    {steps.map((label, index) => (
                      <Step key={label}>
                        <StepLabel StepIconProps={{ sx: { "&.Mui-active": { color: theme.palette.primary.main }, "&.Mui-completed": { color: theme.palette.primary.main } } }}>
                          <Typography variant="caption" fontWeight={600} color={currentStep - 1 >= index ? "text.primary" : "text.secondary"}>
                            {label}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
                <Divider sx={{ mb: 4, borderColor: theme.palette.divider_alpha.main_05 }} />

                <Box sx={{ minHeight: 400 }}>
                  <Form>
                    {currentStep === 1 && <FirstRouteDialogStep />}
                    {currentStep === 2 && <SecondRouteDialogStep />}
                    {currentStep === 3 && <ThirdRouteDialogStep />}
                  </Form>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
                <Button
                  onClick={currentStep === 1 ? closeDialog : () => setCurrentStep(prev => prev - 1)}
                  disabled={isLoading}
                  sx={{ color: "text.secondary", "&:hover": { bgcolor: theme.palette.divider_alpha.main_05 } }}
                >
                  {currentStep === 1 ? dict.common.cancel : dict.common.back}
                </Button>
                <Button
                  variant="contained"
                  onClick={currentStep === steps.length ? () => handleSubmit() : handleNextStep}
                  disabled={isLoading}
                  startIcon={isLoading && <CircularProgress size={16} color="inherit" />}
                  sx={{ borderRadius: 2, px: 4, fontWeight: 600, boxShadow: `0 8px 16px ${theme.palette.primary._alpha.main_20}` }}
                >
                  {isLoading ? dict.toasts.loading : currentStep === steps.length ? dict.common.save : dict.common.next}
                </Button>
              </DialogActions>
            </Dialog>
          );
        }}
      </Formik>
    </GoogleMapsProvider>
  );
};

export default EditRouteDialog;
