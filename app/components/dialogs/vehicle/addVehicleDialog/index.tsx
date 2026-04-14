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
import { useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FirstStep from "./firstStep";
import TechSpecsStep from "./techSpecsStep";
import DocumentsStep from "./documentsStep";
import {
  AddVehiclePageProps,
  VehicleFormValues,
} from "@/app/lib/type/vehicle";
import { VehicleType } from "@/app/lib/type/enums";
import { createVehicle, uploadVehicleDocument } from "@/app/lib/controllers/vehicle";
import { uploadImageAction } from "@/app/lib/actions/upload";
import { fileToBase64 } from "@/app/lib/utils/fileUtils";

interface VehicleCreateInput {
  plate: string;
  fleetNo?: string;
  brand: string;
  model: string;
  type: VehicleType;
  year: number;
  odometerKm?: number;
  photo?: string;
  maxLoadKg: number;
  fuelType: string;
  avgFuelConsumption?: number;
  fuelLevel?: number;
  engineSize?: string;
  transmission?: string;
  techNotes?: string;
  registrationExpiry?: Date;
  inspectionExpiry?: Date;
  nextServiceKm?: number;
  enableAlerts?: boolean;
}
import { Formik, FormikHelpers } from "formik";
import { addVehicleValidationSchema } from "@/app/lib/validationSchema";
import { toast } from "sonner";

const initialValues: VehicleFormValues = {
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
  avgFuelConsumption: "",
  engineSize: "",
  transmission: "",
  techNotes: "",
  registrationExpiry: null,
  inspectionExpiry: null,
  nextServiceDueKm: "",
  enableExpiryAlerts: true,
  documents: [],
};

const AddVehicleDialog = ({
  open,
  onClose,
  onSuccess,
}: AddVehiclePageProps) => {
  /* ---------------------------------- State --------------------------------- */
  const dict = useDictionary();
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const closeDialog = () => {
    onClose();
    setTimeout(() => {
      setCurrentStep(1);
      setError(null);
    }, 300);
  };

  const handleSubmit = async (
    values: VehicleFormValues,
    { setSubmitting, resetForm }: FormikHelpers<VehicleFormValues>
  ) => {
    try {
      // Logic for documents validation
      const requiredTypes = ["REGISTRATION", "INSPECTION", "INSURANCE"];
      const uploadedTypes = values.documents.map(d => d.type);
      const missingTypes = requiredTypes.filter(t => !uploadedTypes.includes(t));

      if (missingTypes.length > 0) {
        throw new Error(dict.toasts.errorGeneric);
      }

      setError(null);

      let photoUrl = values.photo;
      if (values.photo instanceof File) {
        const base64 = await fileToBase64(values.photo);
        const uploadResult = await uploadImageAction(base64, "vehicles");
        photoUrl = uploadResult.url;
      }

      const payload: VehicleCreateInput = {
        fleetNo: values.fleetNo || undefined,
        plate: values.plate,
        type: values.type as VehicleType,
        brand: values.brand,
        model: values.model,
        year: Number(values.year),
        odometerKm: Number(values.odometerKm),
        photo: (photoUrl as string) || undefined,
        maxLoadKg: Number(values.maxLoadKg),
        fuelType: values.fuelType,
        avgFuelConsumption: Number(values.avgFuelConsumption),
        fuelLevel: Number(values.fuelLevel),
        engineSize: values.engineSize,
        transmission: values.transmission,
        techNotes: values.techNotes,
        registrationExpiry: values.registrationExpiry ? values.registrationExpiry.toDate() : undefined,
        inspectionExpiry: values.inspectionExpiry ? values.inspectionExpiry.toDate() : undefined,
        nextServiceKm: Number(values.nextServiceKm) || Number(values.nextServiceDueKm),
        enableAlerts: values.enableExpiryAlerts,
      };

      const createdVehicle = await createVehicle(payload as unknown as Record<string, unknown>);

      const docPromises = values.documents
        .filter(doc => doc.file)
        .map(async (doc) => {
          const base64 = await fileToBase64(doc.file!);
          const uploadResult = await uploadImageAction(base64, "documents", `vehicles/${createdVehicle.id}`);
          
          return uploadVehicleDocument(createdVehicle.id, {
            type: doc.type || "OTHER",
            name: doc.name,
            url: uploadResult.url,
            status: "ACTIVE",
            expiryDate: values.registrationExpiry ? values.registrationExpiry.toDate() : undefined,
          });
        });

      if (docPromises.length > 0) {
        await Promise.all(docPromises);
      }

      toast.success(dict.toasts.successAdd);
      onSuccess?.();
      closeDialog();
      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : dict.toasts.errorGeneric;
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    dict.vehicles.dialogs.steps.general,
    dict.vehicles.dialogs.steps.specs,
    dict.vehicles.dialogs.steps.docs
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={useMemo(() => addVehicleValidationSchema(dict), [dict])}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm, setFieldValue }) => (
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
              <Typography variant="h6" fontWeight={700} color="white">
                {dict.vehicles.dialogs.addTitle}
              </Typography>
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
                            ? "white"
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
              {currentStep === 2 && <TechSpecsStep />}
              {currentStep === 3 && <DocumentsStep />}
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
                  sx={{
                    color: "text.secondary",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {dict.common.cancel}
                </Button>
                {currentStep > 1 && (
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      borderColor: theme.palette.divider_alpha.main_20,
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {dict.common.back}
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={
                    currentStep === 3
                      ? submitForm
                      : () => setCurrentStep((prev) => prev + 1)
                  }
                  disabled={isSubmitting}
                  endIcon={
                    isSubmitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : null
                  }
                  sx={{
                    textTransform: "none",
                    px: currentStep === 3 ? 3 : 4,
                    borderRadius: 2,
                    boxShadow: `0 8px 24px ${theme.palette.primary._alpha.main_20}`,
                    fontWeight: 700,
                    minWidth: 140,
                  }}
                >
                  {isSubmitting
                    ? dict.toasts.loading
                    : currentStep === 3
                      ? dict.common.save
                      : dict.common.next}
                </Button>
              </Stack>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Formik>
  );
};

export default AddVehicleDialog;
