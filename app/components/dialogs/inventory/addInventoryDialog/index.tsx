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
import { useState } from "react";
import {
  AddInventoryDialogProps,
  AddInventoryItemDetails,
  AddInventoryStorageLevels,
} from "@/app/lib/type/add-inventory";
import { toast } from "sonner";
import { addInventoryItem } from "@/app/lib/controllers/warehouse";
import { useUser } from "@/app/lib/hooks/useUser";
import ItemDetailsSection from "./sections/ItemDetailsSection";
import StorageLevelsSection from "./sections/StorageLevelsSection";

const initialItemDetails: AddInventoryItemDetails = {
  sku: "",
  name: "",
  category: "",
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

  /* --------------------------------- states --------------------------------- */
  const [itemDetails, setItemDetails] =
    useState<AddInventoryItemDetails>(initialItemDetails);
  const [storageLevels, setStorageLevels] =
    useState<AddInventoryStorageLevels>(initialStorageLevels);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await addInventoryItem(
        storageLevels.warehouseId,
        itemDetails.sku,
        itemDetails.name,
        storageLevels.initialQuantity,
        user.id,
        storageLevels.minStockLevel,
        itemDetails.weightKg || 0,
        itemDetails.volumeM3 || 0,
        itemDetails.palletCount || 0,
        itemDetails.cargoType || "General Cargo"
      );

      toast.success("Item added to inventory successfully");
      onSuccess?.();
      closeDialog();
    } catch (err: any) {
      const message = err.message || "Failed to add inventory item";
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
  };

  const closeDialog = () => {
    onClose();
    setTimeout(() => resetForm(), 300);
  };

  const steps = ["Item Details", "Warehouse Info", "Review"];

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
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <Typography variant="h6" sx={{ lineHeight: 1 }}>
                📦
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} color="white">
              Add Inventory
            </Typography>
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
              color: alpha("#fff", 0.3),
              fontWeight: 600,
              fontSize: "0.65rem",
              textTransform: "uppercase",
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: alpha("#fff", 0.5),
            },
            "& .MuiStepIcon-root": { color: alpha(theme.palette.divider, 0.1) },
            "& .MuiStepIcon-root.Mui-active": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: theme.palette.primary.main,
            },
            "& .MuiStepConnector-line": {
              borderColor: alpha(theme.palette.divider, 0.1),
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
              bgcolor: alpha(theme.palette.error.main, 0.1),
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
            state={itemDetails}
            updateItemDetails={updateItemDetails}
          />
        )}
        {currentStep === 2 && (
          <StorageLevelsSection
            state={storageLevels}
            updateStorageLevels={updateStorageLevels}
          />
        )}
        {currentStep === 3 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              Review step placeholder
            </Typography>
            <Button onClick={() => setCurrentStep(1)}>Go back and edit</Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 1,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
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
          {currentStep === 1 ? "Cancel" : "Back"}
        </Button>

        <Button
          variant="contained"
          disabled={
            isLoading ||
            (currentStep === 1 &&
              (!itemDetails.sku ||
                !itemDetails.name ||
                !itemDetails.category)) ||
            (currentStep === 2 && !storageLevels.warehouseId)
          }
          onClick={currentStep < 2 ? () => setCurrentStep(2) : handleSubmit}
          sx={{
            minWidth: 160,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
            py: 1.2,
          }}
          startIcon={
            isLoading && <CircularProgress size={16} color="inherit" />
          }
        >
          {isLoading
            ? "Adding..."
            : currentStep < 2
              ? "Next Step →"
              : "Add to Inventory"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInventoryDialog;
