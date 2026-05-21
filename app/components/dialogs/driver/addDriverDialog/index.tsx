"use client";

import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
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
import { useState, useEffect, useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import {
  AddDriverDialogProps,
  DriverFormValues,
  EligibleUser,
} from "@/app/lib/type/driver";
import { DriverStatus } from "@/app/lib/type/enums";
import { toast } from "sonner";
import {
  createDriver,
  getEligibleUsersForDriver,
} from "@/app/lib/controllers/driver";
import { uploadImageAction } from "@/app/lib/actions/upload";
import { addDriverValidationSchema } from "@/app/lib/validationSchema";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
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
  const dict = useDictionary();
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
    { resetForm }: FormikHelpers<DriverFormValues>
  ) => {
    // 1. Close dialog immediately
    onClose();
    resetForm();
    setCurrentStep(1);

    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    // 2. Run upload and create behind a loading toast
    await toast.promise(
      (async () => {
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
          documents: uploadedDocs.filter((d) => d !== null) as {
            name: string;
            type: string;
            url: string;
            expiryDate?: Date;
          }[],
        };

        await createDriver(payload);
        onSuccess?.();
      })(),
      {
        loading: dict.toasts?.loading || "Saving...",
        success: dict.common.saveSuccess,
        error: (err: unknown) =>
          (err as Error).message || dict.common.errorOccurred,
      }
    );
  };

  const steps = [
    dict.drivers.tabs.personalInfo,
    dict.drivers.tabs.operationalInfo,
  ];

  return (
    <Dialog
      open={open}
      onClose={() => !onSuccess && onClose()}
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
      <Formik
        initialValues={initialValues}
        validationSchema={useMemo(
          () => addDriverValidationSchema(dict),
          [dict]
        )}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ handleSubmit: formikSubmit, validateForm, setFieldTouched }) => {
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
              toast.error(
                dict.common.errorOccurred ||
                  "Please fill in all required fields correctly"
              );
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
              <DialogActions
                sx={{ p: 3, pt: 0, justifyContent: "space-between" }}
              >
                <Button
                  onClick={
                    currentStep === 1
                      ? () => onClose()
                      : () => setCurrentStep(1)
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
                    currentStep === 1 ? handleNext : () => formikSubmit()
                  }
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    fontWeight: 600,
                    boxShadow: `0 8px 16px ${theme.palette.primary._alpha.main_20}`,
                  }}
                >
                  {currentStep === 1
                    ? dict.common.next || "Next"
                    : dict.common.save || "Save"}
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
