"use client";

import {
  alpha,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
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
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useState } from "react";
import {
  AddInventoryDialogProps,
  AddInventoryItemDetails,
  AddInventoryStorageLevels,
} from "@/app/lib/type/add-inventory";
import { toast } from "sonner";
import { addInventoryItem } from "@/app/lib/controllers/warehouse";
import { useUser } from "@/app/lib/hooks/useUser";
import { uploadImageAction } from "@/app/lib/actions/upload";
import ItemDetailsSection from "./sections/ItemDetailsSection";
import StorageLevelsSection from "./sections/StorageLevelsSection";
import ReviewSection from "./sections/ReviewSection";

const initialItemDetails: AddInventoryItemDetails = {
  sku: "",
  name: "",
  category: "",
  unitValue: 0,
};

const initialStorageLevels: AddInventoryStorageLevels = {
  warehouseId: "",
  initialQuantity: 0,
  minStockLevel: 10,
};

const AddInventoryDialog = ({
  open,
  onClose,
  onSuccess,
}: AddInventoryDialogProps) => {
  const theme = useTheme();
  const { user } = useUser();
  const dict = useDictionary();

  /* --------------------------------- states --------------------------------- */
  const [itemDetails, setItemDetails] =
    useState<AddInventoryItemDetails>(initialItemDetails);
  const [storageLevels, setStorageLevels] =
    useState<AddInventoryStorageLevels>(initialStorageLevels);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  /* ---------------------------------- handlers --------------------------------- */
  const updateItemDetails = (data: Partial<AddInventoryItemDetails>) =>
    setItemDetails((prev) => ({ ...prev, ...data }));

  const updateStorageLevels = (data: Partial<AddInventoryStorageLevels>) =>
    setStorageLevels((prev) => ({ ...prev, ...data }));

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      let finalImageUrl = itemDetails.imageUrl || "";

      // If it's a base64 string (starts with data:), upload it first
      if (finalImageUrl.startsWith("data:")) {
        const uploadResult = await uploadImageAction(
          finalImageUrl,
          "general"
        );
        finalImageUrl = uploadResult.url;
      }

      await addInventoryItem(
        storageLevels.warehouseId,
        itemDetails.sku,
        itemDetails.name,
        storageLevels.initialQuantity,
        storageLevels.minStockLevel,
        itemDetails.weightKg || 0,
        itemDetails.volumeM3 || 0,
        itemDetails.palletCount || 0,
        itemDetails.cargoType || "General Cargo",
        finalImageUrl,
        itemDetails.unitValue || 0
      );

      toast.success(dict.toasts.successAdd);
      onSuccess?.();
      closeDialog();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : dict.common.errorOccurred;
      setError(message);
      setIsLoading(false);
      toast.error(message);
    }
  };

  const resetForm = () => {
    setItemDetails(initialItemDetails);
    setStorageLevels(initialStorageLevels);
    setCurrentStep(1);
    setIsLoading(false);
    setError(null);
    setFormKey((prev) => prev + 1);
  };

  const closeDialog = () => {
    onClose();
    setTimeout(() => resetForm(), 300);
  };

  const steps = [
    dict.inventory.dialogs.steps.details,
    dict.inventory.dialogs.steps.storage,
    dict.inventory.dialogs.steps.review
  ];

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0B0F19",
          backgroundImage: "none",
          borderRadius: 4,
          border: `1px solid ${(theme.palette as any).divider_alpha.main_10}`,
          maxHeight: "90vh",
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
                bgcolor: (theme.palette.primary as any)._alpha.main_10,
                color: theme.palette.primary.main,
              }}
            >
              <Typography variant="h6" sx={{ lineHeight: 1 }}>
                📦
              </Typography>
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={700} color="white">
                {dict.inventory.dialogs.addTitle}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dict.inventory.dialogs.addSubtitle}
              </Typography>
            </Stack>
          </Stack>
          <IconButton onClick={closeDialog} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stepper
          activeStep={currentStep - 1}
          sx={{
            mb: 4,
            "& .MuiStepLabel-label": {
              color: (theme.palette.common as any).white_alpha.main_30,
              fontWeight: 600,
              fontSize: "0.65rem",
              textTransform: "uppercase",
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: (theme.palette.common as any).white_alpha.main_50,
            },
            "& .MuiStepIcon-root": { color: (theme.palette as any).divider_alpha.main_10 },
            "& .MuiStepIcon-root.Mui-active": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepConnector-line": {
              borderColor: (theme.palette as any).divider_alpha.main_10,
            },
            "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
              borderColor: theme.palette.primary.main,
            },
            "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
              borderColor: theme.palette.primary.main,
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

      <DialogContent sx={{ pb: 4, minHeight: 450 }}>
        {error && (
          <Box
            mb={2}
            p={2}
            sx={{
              bgcolor: (theme.palette.error as any)._alpha.main_10,
              borderRadius: 1,
            }}
          >
            <Typography color="error" variant="caption">
              {error}
            </Typography>
          </Box>
        )}
        {currentStep === 1 && (
          <ItemDetailsSection
            key={`item-details-${formKey}`}
            state={itemDetails}
            updateItemDetails={updateItemDetails}
          />
        )}
        {currentStep === 2 && (
          <StorageLevelsSection
            key={`storage-levels-${formKey}`}
            state={storageLevels}
            updateStorageLevels={updateStorageLevels}
          />
        )}
        {currentStep === 3 && (
          <ReviewSection
            itemDetails={itemDetails}
            storageLevels={storageLevels}
          />
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 1,
          borderTop: `1px solid ${(theme.palette as any).divider_alpha.main_05}`,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={
            currentStep === 1
              ? closeDialog
              : () => setCurrentStep(currentStep - 1)
          }
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {currentStep === 1 ? dict.common.cancel : dict.common.back}
        </Button>

        <Button
          variant="contained"
          disabled={
            isLoading ||
            (currentStep === 1 &&
              (!itemDetails.name ||
                !itemDetails.category ||
                itemDetails.unitValue === undefined)) ||
            (currentStep === 2 && !storageLevels.warehouseId)
          }
          onClick={
            currentStep === 1 
              ? () => setCurrentStep(2) 
              : currentStep === 2 
                ? () => setCurrentStep(3) 
                : handleSubmit
          }
          sx={{
            minWidth: 160,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: `0 8px 24px ${(theme.palette.primary as any)._alpha.main_20}`,
            py: 1.2,
          }}
          startIcon={
            isLoading && <CircularProgress size={16} color="inherit" />
          }
        >
          {isLoading
            ? dict.common.save
            : currentStep === 1
              ? `${dict.common.next} →`
              : currentStep === 2
                ? `${dict.common.next} →`
                : dict.common.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInventoryDialog;
