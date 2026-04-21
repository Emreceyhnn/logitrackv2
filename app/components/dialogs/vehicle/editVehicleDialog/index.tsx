"use client";

import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect, useRef, useMemo } from "react";
import FirstStep from "../addVehicleDialog/firstStep";
import TechSpecsStep from "../addVehicleDialog/techSpecsStep";
import { VehicleWithRelations, VehicleFormValues } from "@/app/lib/type/vehicle";
import { updateVehicle } from "@/app/lib/controllers/vehicle";
import { uploadImageAction } from "@/app/lib/actions/upload";
import { toast } from "sonner";
import { VehicleType } from "@/app/lib/type/enums";
import { Formik, FormikHelpers } from "formik";
import { editVehicleValidationSchema } from "@/app/lib/validationSchema";

export interface EditVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicle: VehicleWithRelations;
}

const EditVehicleDialog = ({
  open,
  onClose,
  onSuccess,
  vehicle,
}: EditVehicleDialogProps) => {
  /* -------------------------------- variables ------------------------------- */
  const dict = useDictionary();
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const isInitialized = useRef<string | null>(null);
  
  const [initialValues, setInitialValues] = useState<VehicleFormValues>({
    fleetNo: "",
    plate: "",
    type: "",
    brand: "",
    model: "",
    year: "",
    odometerKm: "",
    nextServiceKm: "",
    maxLoadKg: "",
    fuelType: "",
    fuelLevel: 50,
    status: "",
    avgFuelConsumption: "",
    engineSize: "",
    transmission: "",
    techNotes: "",
    registrationExpiry: null,
    inspectionExpiry: null,
    nextServiceDueKm: "",
    enableExpiryAlerts: true,
    documents: [],
  });

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (open && vehicle && isInitialized.current !== vehicle.id) {
      isInitialized.current = vehicle.id;
      setInitialValues({
        fleetNo: vehicle.fleetNo || "",
        plate: vehicle.plate || "",
        type: vehicle.type || "",
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        year: vehicle.year || "",
        odometerKm: vehicle.odometerKm || "",
        nextServiceKm: vehicle.nextServiceKm || "",
        photo: vehicle.photo || "",
        maxLoadKg: vehicle.maxLoadKg || "",
        fuelType: vehicle.fuelType || "",
        fuelLevel: vehicle.fuelLevel || 50,
        status: vehicle.status || "AVAILABLE",
        avgFuelConsumption: vehicle.avgFuelConsumption || "",
        engineSize: vehicle.engineSize || "",
        transmission: vehicle.transmission || "",
        techNotes: vehicle.techNotes || "",
        registrationExpiry: null, 
        inspectionExpiry: null,
        nextServiceDueKm: "",
        enableExpiryAlerts: true,
        documents: [], // Edit documents logic is usually separate (e.g. details dialog)
      });
      setCurrentStep(1);
      setError(null);
    } else if (!open) {
      isInitialized.current = null;
    }
  }, [open, vehicle]);

  /* -------------------------------- actions --------------------------------- */
  const closeDialog = () => {
    onClose();
    setTimeout(() => {
      setCurrentStep(1);
      setError(null);
    }, 300);
  };

  const handleSubmit = async (
    values: VehicleFormValues,
    { setSubmitting }: FormikHelpers<VehicleFormValues>
  ) => {
    try {
      setError(null);

      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
        });
      };

      let photoUrl = values.photo;
      if (values.photo instanceof File) {
        const base64 = await fileToBase64(values.photo);
        const uploadResult = await uploadImageAction(base64, "vehicles");
        photoUrl = uploadResult.url;
      }

      const updateData = {
        fleetNo: values.fleetNo || undefined,
        plate: values.plate,
        type: values.type as VehicleType,
        brand: values.brand,
        model: values.model,
        year: Number(values.year),
        odometerKm: values.odometerKm ? Number(values.odometerKm) : null,
        maxLoadKg: values.maxLoadKg ? Number(values.maxLoadKg) : 0,
        fuelType: values.fuelType,
        avgFuelConsumption: values.avgFuelConsumption ? Number(values.avgFuelConsumption) : null,
        fuelLevel: values.fuelLevel ? Number(values.fuelLevel) : null,
        nextServiceKm: values.nextServiceKm ? Number(values.nextServiceKm) : null,
        status: values.status,
        engineSize: values.engineSize,
        transmission: values.transmission,
        techNotes: values.techNotes,
        photo: (photoUrl as string) || null,
      };

      await updateVehicle(vehicle.id, updateData as Parameters<typeof updateVehicle>[1]);

      toast.success(dict.toasts.successUpdate);

      // Give a tiny delay for DB sequence processing
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 500);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : dict.toasts.errorGeneric;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      // Let Formik keep state if it errored out. 
    }
  };

  const steps = [dict.vehicles.dialogs.steps.general, dict.vehicles.dialogs.steps.specs];

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={useMemo(() => editVehicleValidationSchema(dict), [dict])}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm, setFieldValue, validateForm, submitCount, errors }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (submitCount > 0 && Object.keys(errors).length > 0) {
            const getStepForField = (fieldName: string): number => {
              const step1Fields = ["plate", "fleetNo", "brand", "model", "type", "year", "odometerKm", "photo", "status"];
              if (step1Fields.includes(fieldName)) return 1;
              return 2;
            };

            const firstErrorField = Object.keys(errors)[0];
            const targetStep = getStepForField(firstErrorField);
            if (targetStep !== currentStep) {
              setCurrentStep(targetStep);
              toast.error(dict.validation.genericFormError || "Please check errors in the highlighted step.");
            }
          }
        }, [submitCount]);
        
        const handleNext = async () => {
          const errors = await validateForm();
          // Step 1 field keys
          const step1Keys = ['fleetNo', 'plate', 'type', 'brand', 'model', 'year', 'odometerKm', 'nextServiceKm', 'status'];
          const hasStep1Errors = step1Keys.some(key => errors[key as keyof VehicleFormValues]);
          
          if (!hasStep1Errors) {
            setCurrentStep(prev => prev + 1);
            setError(null);
          } else {
             // Let user see errors
             setError(dict.validation.genericFormError || "Please fill required fields in General Info correctly.");
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
                bgcolor: theme.palette.background.midnight.main,
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
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h6" fontWeight={600} color="white">
                    {dict.vehicles.dialogs.editTitle}: {vehicle?.plate}
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

              {error && (
                <Box 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: theme.palette.error._alpha.main_10,
                    border: `1px solid ${theme.palette.error._alpha.main_20}`
                  }}
                >
                  <Typography variant="caption" color="error.light">
                    {error}
                  </Typography>
                </Box>
              )}
            </Box>

            <DialogContent sx={{ p: 3 }}>
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
                            "&.Mui-active": { color: theme.palette.primary.main },
                            "&.Mui-completed": { color: theme.palette.primary.main },
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
                sx={{ mb: 4, borderColor: theme.palette.divider_alpha.main_05 }}
              />

              <Box sx={{ minHeight: 400 }}>
                {currentStep === 1 && (
                  <FirstStep 
                    onFileSelect={(file) => setFieldValue("photo", file)} 
                  />
                )}
                {currentStep === 2 && (
                  <TechSpecsStep />
                )}
              </Box>

              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: `1px solid ${theme.palette.divider_alpha.main_05}`,
                }}
              >
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="text"
                    onClick={closeDialog}
                    sx={{ color: "text.secondary", textTransform: "none" }}
                  >
                    {dict.common.cancel}
                  </Button>
                  {currentStep > 1 && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setCurrentStep((prev) => prev - 1);
                        setError(null);
                      }}
                      startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        borderColor: theme.palette.divider_alpha.main_20,
                        color: "white",
                      }}
                    >
                      {dict.common.back}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={
                      currentStep === 2
                        ? submitForm
                        : handleNext
                    }
                    disabled={isSubmitting}
                    startIcon={
                      currentStep === 2 && !isSubmitting ? (
                        <SaveIcon sx={{ fontSize: 18 }} />
                      ) : isSubmitting ? <CircularProgress size={16} color="inherit" /> : null
                    }
                    sx={{
                      textTransform: "none",
                      px: currentStep === 2 ? 3 : 4,
                      borderRadius: 2,
                      boxShadow: "none",
                      bgcolor: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: theme.palette.primary._alpha.main_90,
                        boxShadow: "none",
                      },
                    }}
                  >
                    {isSubmitting ? (
                      dict.toasts.saving
                    ) : currentStep === 2 ? (
                      dict.common.save
                    ) : (
                      dict.common.next + " →"
                    )}
                  </Button>
                </Stack>
              </Box>
            </DialogContent>
          </Dialog>
        );
      }}
    </Formik>
  );
};

export default EditVehicleDialog;
