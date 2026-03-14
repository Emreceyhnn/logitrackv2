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
import { useEffect, useMemo, useState } from "react";
import {
  EditDriverDialogProps,
  EditDriverPageActions,
  EditDriverPageState,
  EditDriverStep1,
  EditDriverStep2,
} from "@/app/lib/type/driver";
import { toast } from "sonner";
import { updateDriver } from "@/app/lib/controllers/driver";
import { uploadImageAction } from "@/app/lib/actions/upload";
import FirstEditDriverDialogStep from "./firstStep";
import SecondEditDriverDialogStep from "./secondStep";

const initialStep1: EditDriverStep1 = {
  phone: "",
  licenseNo: "",
  licenseExpiry: null,
  licenseType: "",
  licencePhoto: null,
  employeeId: "",
};

const initialStep2: EditDriverStep2 = {
  homeWareHouseId: "",
  currentVehicleId: "",
  status: "OFF_DUTY",
  languages: [],
  hazmatCertified: false,
  documents: [],
};

const EditDriverDialog = ({
  open,
  onClose,
  onSuccess,
  driver,
}: EditDriverDialogProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<EditDriverPageState>({
    currentStep: 1,
    data: {
      step1: initialStep1,
      step2: initialStep2,
    },
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (driver && open) {
      setState((prev) => ({
        ...prev,
        data: {
          step1: {
            phone: driver.phone || "",
            employeeId: driver.employeeId || "",
            licenseNo: driver.licenseNumber || "",
            licenseType: driver.licenseType || "",
            licenseExpiry: driver.licenseExpiry
              ? new Date(driver.licenseExpiry)
              : null,
            licencePhoto: null,
          },
          step2: {
            homeWareHouseId: (driver as any).homeBaseWarehouseId || "",
            currentVehicleId: driver.currentVehicle?.id || "",
            status: driver.status,
            languages: (driver as any).languages || [],
            hazmatCertified: (driver as any).hazmatCertified || false,
            documents: [], // existing docs could be loaded here but update API mostly appends currently
          },
        },
      }));
    }
  }, [driver, open]);

  /* -------------------------------- actions --------------------------------- */
  const actions: EditDriverPageActions = useMemo(
    () => ({
      updateStep1: (data) => {
        setState((prev) => ({
          ...prev,
          data: { ...prev.data, step1: { ...prev.data.step1, ...data } },
        }));
      },
      updateStep2: (data) => {
        setState((prev) => ({
          ...prev,
          data: { ...prev.data, step2: { ...prev.data.step2, ...data } },
        }));
      },

      setStep: (step) => {
        setState((prev) => ({ ...prev, currentStep: step }));
      },
      nextStep: () => {
        setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
      },
      prevStep: () => {
        setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
      },
      handleSubmit: async () => {
        if (!driver) return;

        try {
          setState((prev) => ({ ...prev, isLoading: true, error: null }));

          const { step1, step2 } = state.data;

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
          if (step1.licencePhoto) {
            const base64 = await fileToBase64(step1.licencePhoto);
            const uploadResult = await uploadImageAction(
              base64,
              `drivers/${driver.user.id}/license`
            );
            licensePhotoUrl = uploadResult.url;
          }

          // 2. Upload additional documents if exist
          const uploadedDocs = await Promise.all(
            step2.documents.map(async (doc) => {
              if (doc.file) {
                const base64 = await fileToBase64(doc.file);
                const uploadResult = await uploadImageAction(
                  base64,
                  `drivers/${driver.user.id}/docs`
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
            phone: step1.phone,
            employeeId: step1.employeeId,
            licenseNumber: step1.licenseNo,
            licenseExpiry: step1.licenseExpiry,
            licenseType: step1.licenseType,
            status: step2.status as any,
            currentVehicleId: step2.currentVehicleId || null,
            homeBaseWarehouseId: step2.homeWareHouseId || null,
            languages: step2.languages,
            hazmatCertified: step2.hazmatCertified,
            ...(licensePhotoUrl && { licensePhotoUrl }),
            ...(uploadedDocs.length > 0 && {
              documents: uploadedDocs.filter((d) => d !== null) as any[],
            }),
          };

          await updateDriver(driver.id, payload);

          setState((prev) => ({ ...prev, isSuccess: true, isLoading: false }));
          toast.success("Driver updated successfully");

          setTimeout(() => {
            onClose();
            onSuccess?.();
            actions.reset();
          }, 1500);
        } catch (err: any) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err.message || "Failed to update driver",
          }));
          toast.error(err.message || "Failed to update driver");
        }
      },

      closeDialog: () => {
        if (!state.isLoading) {
          onClose();
        }
      },
      reset: () => {
        setState({
          currentStep: 1,
          data: {
            step1: initialStep1,
            step2: initialStep2,
          },
          isLoading: false,
          error: null,
          isSuccess: false,
        });
      },
    }),
    [state.data, state.isLoading, onClose, onSuccess, driver]
  );

  const steps = ["DRIVER CREDENTIALS", "ASSIGNMENT & SETTINGS"];

  if (!driver) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <Box sx={{ p: 3, pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={600} color="white">
              Edit Driver: {driver.user.name} {driver.user.surname}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Update operator details and settings
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
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
            activeStep={state.currentStep - 1}
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
                      "&.Mui-completed": { color: theme.palette.primary.main },
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color={
                      state.currentStep - 1 >= index
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
          {state.currentStep === 1 && (
            <FirstEditDriverDialogStep
              state={state.data.step1}
              actions={actions}
            />
          )}
          {state.currentStep === 2 && (
            <SecondEditDriverDialogStep
              state={state.data.step2}
              actions={actions}
              step1Data={state.data.step1}
              driver={driver}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
        <Button
          onClick={state.currentStep === 1 ? onClose : actions.prevStep}
          disabled={state.isLoading}
          sx={{
            color: "text.secondary",
            "&:hover": { bgcolor: alpha(theme.palette.divider, 0.05) },
          }}
        >
          {state.currentStep === 1 ? "Cancel" : "Back to Credentials"}
        </Button>
        <Button
          variant="contained"
          onClick={
            state.currentStep === 1 ? actions.nextStep : actions.handleSubmit
          }
          disabled={state.isLoading}
          startIcon={
            state.isLoading && <CircularProgress size={16} color="inherit" />
          }
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 600,
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          {state.isLoading
            ? "Saving..."
            : state.currentStep === 1
              ? "Next: Assignment"
              : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDriverDialog;
