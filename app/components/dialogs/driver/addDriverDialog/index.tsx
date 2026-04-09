"use client";

import {
  alpha,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { Formik, FormikHelpers } from "formik";
import {
  AddDriverDialogProps,
  DriverFormValues,
  EligibleUser,
} from "@/app/lib/type/driver";
import { DriverStatus } from "@prisma/client";
import { toast } from "sonner";
import { createDriver, getEligibleUsersForDriver } from "@/app/lib/controllers/driver";
import { uploadImageAction } from "@/app/lib/actions/upload";
import { addDriverValidationSchema } from "@/app/lib/validationSchema";
import { useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/language/language";
import { useMemo } from "react";
import FirstDriverDialogStep from "./firstStep";
import SecondDriverDialogStep from "./secondStep";

const initialValues: DriverFormValues = {
  userId: "",
  phone: "",
  employeeId: "",
  licenseNumber: "",
  licenseExpiry: null,
  licenseType: "",
  licencePhoto: null,
  homeWareHouseId: "",
  currentVehicleId: "",
  status: "OFF_DUTY",
  languages: [],
  hazmatCertified: false,
  documents: [],
};

const AddDriverDialog = ({
  open,
  onClose,
  onSuccess,
}: AddDriverDialogProps) => {
  /* -------------------------------- variables ------------------------------- */
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const dict = useMemo(() => getDictionary(lang), [lang]);
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [eligibleUsers, setEligibleUsers] = useState<EligibleUser[]>([]);

  /* ------------------------------- lifecycles ------------------------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getEligibleUsersForDriver();
        setEligibleUsers(users);
      } catch (error) {
        console.error("Failed to fetch eligible users:", error);
      }
    };
    if (open) {
      fetchUsers();
    }
  }, [open]);

  /* -------------------------------- handlers --------------------------------- */
  const handleSubmit = async (
    values: DriverFormValues,
    { setSubmitting, setStatus, resetForm }: FormikHelpers<DriverFormValues>
  ) => {
    try {
      setSubmitting(true);
      setStatus(null);

      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      // 1. Upload Licence Photo if exists
      let licensePhotoUrl = "";
      if (values.licencePhoto) {
        const base64 = await fileToBase64(values.licencePhoto);
        const uploadResult = await uploadImageAction(
          base64,
          "documents",
          `drivers/${values.userId}/license`
        );
        licensePhotoUrl = uploadResult.url;
      }

      // 2. Upload additional documents if exist
      const uploadedDocs = await Promise.all(
        values.documents.map(async (doc) => {
          if (doc.file) {
            const base64 = await fileToBase64(doc.file);
            const uploadResult = await uploadImageAction(
              base64,
              "documents",
              `drivers/${values.userId}/docs`
            );
            return {
              name: doc.name,
              type: doc.type,
              url: uploadResult.url,
              expiryDate: doc.expiryDate || undefined,
            };
          }
          return null;
        })
      );

      const payload = {
        userId: values.userId,
        phone: values.phone,
        employeeId: values.employeeId,
        licenseNumber: values.licenseNumber,
        licenseExpiry: values.licenseExpiry,
        licenseType: values.licenseType,
        status: values.status as DriverStatus,
        currentVehicleId: values.currentVehicleId || null,
        homeBaseWarehouseId: values.homeWareHouseId || null,
        languages: values.languages,
        hazmatCertified: values.hazmatCertified,
        licensePhotoUrl,
        documents: (uploadedDocs.filter((d) => d !== null) as {
          name: string;
          type: string;
          url: string;
          expiryDate?: Date;
        }[]),
      };

      await createDriver(payload);

      toast.success(dict.common.saveSuccess || "Driver added successfully");

      setTimeout(() => {
        onClose();
        onSuccess?.();
        resetForm();
        setCurrentStep(1);
      }, 1500);
    } catch (err: unknown) {
      const message = (err as Error).message || "Failed to create driver";
      setStatus(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [dict.drivers.fields.firstName + " & " + dict.drivers.fields.lastName, dict.common.settings];

  return (
    <Dialog
      open={open}
      onClose={() => !onSuccess && onClose()}
      maxWidth="md"
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
      <Formik
        initialValues={initialValues}
        validationSchema={useMemo(() => addDriverValidationSchema(dict), [dict])}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({
          handleSubmit: formikSubmit,
          isSubmitting,
          status,
          validateForm,
          setFieldTouched,
        }) => {
          const handleNext = async () => {
            const errors = await validateForm();
            // Fields to check for Step 1
            const step1Fields = [
              "userId",
              "phone",
              "employeeId",
              "licenseNumber",
              "licenseType",
              "licenseExpiry",
            ];
            
            const hasStep1Errors = step1Fields.some(
              (field) => !!(errors as Record<string, string>)[field]
            );

            if (hasStep1Errors) {
              step1Fields.forEach((field) => setFieldTouched(field, true));
              toast.error(dict.common.errorOccurred || "Please fill in all required fields correctly");
              return;
            }
            setCurrentStep(2);
          };

          return (
            <>
              <Box sx={{ p: 3, pb: 0 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack spacing={0.5}>
                    <Typography variant="h6" fontWeight={600} color="white">
                      {dict.drivers.dialogs.addTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dict.drivers.subtitle}
                    </Typography>
                  </Stack>
                  <IconButton
                    onClick={() => onClose()}
                    size="small"
                    sx={{ color: "text.secondary" }}
                    disabled={isSubmitting}
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
                        borderColor: alpha(theme.palette.divider, 0.1),
                      },
                    }}
                  >
                    {steps.map((label, index) => (
                      <Step key={label}>
                        <StepLabel
                          StepIconProps={{
                            sx: {
                              "&.Mui-active": { color: theme.palette.primary.main },
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
                  sx={{ mb: 4, borderColor: alpha(theme.palette.divider, 0.05) }}
                />

                <Box sx={{ minHeight: 400 }}>
                  {status && (
                    <Box
                      mb={3}
                      p={2}
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" color="error">
                        {status}
                      </Typography>
                    </Box>
                  )}
                  {currentStep === 1 && (
                    <FirstDriverDialogStep eligibleUsers={eligibleUsers} />
                  )}
                  {currentStep === 2 && (
                    <SecondDriverDialogStep
                      eligibleUsers={eligibleUsers}
                      setStep={setCurrentStep}
                    />
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
                <Button
                  onClick={
                    currentStep === 1 ? () => onClose() : () => setCurrentStep(1)
                  }
                  disabled={isSubmitting}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { bgcolor: alpha(theme.palette.divider, 0.05) },
                  }}
                >
                  {currentStep === 1 ? dict.common.cancel : dict.common.back}
                </Button>
                <Button
                  variant="contained"
                  onClick={
                    currentStep === 1 ? handleNext : () => formikSubmit()
                  }
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting && (
                      <CircularProgress size={16} color="inherit" />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    fontWeight: 600,
                    boxShadow: `0 8px 16px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  }}
                >
                  {isSubmitting
                    ? (dict.common.saving || "Saving...")
                    : currentStep === 1
                    ? (dict.common.next || "Next")
                    : (dict.common.save || "Save")}
                </Button>
              </DialogActions>
            </>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default AddDriverDialog;
