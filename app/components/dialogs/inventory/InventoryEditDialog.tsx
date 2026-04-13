"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  alpha,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
  SettingsSuggest as SettingsIcon,
} from "@mui/icons-material";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InventoryEditProps, InventoryWithRelations } from "@/app/lib/type/inventory";
import { uploadImageAction } from "@/app/lib/actions/upload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

const schema = yup.object({
  sku: yup.string().optional(),
  imageUrl: yup.string().optional().nullable(),
  quantity: yup.number().typeError("Quantity must be a number").required("Quantity is required").min(0, "Cannot be negative"),
  minStock: yup.number().typeError("Min stock must be a number").required("Min Stock is required").min(0, "Cannot be negative"),
  weightKg: yup.number().nullable().transform((v) => (v === "" || isNaN(v) ? null : v)),
  volumeM3: yup.number().nullable().transform((v) => (v === "" || isNaN(v) ? null : v)),
  palletCount: yup.number().nullable().transform((v) => (v === "" || isNaN(v) ? null : v)),
}).required();

type FormData = {
  sku?: string;
  imageUrl?: string | null;
  quantity: number;
  minStock: number;
  weightKg: number | null;
  volumeM3: number | null;
  palletCount: number | null;
};

export default function InventoryEditDialog({
  isOpen,
  onClose,
  item,
  onUpdate,
}: InventoryEditProps) {
  const theme = useTheme();
  const dict = useDictionary();

  // Redefine schema with localized messages if needed, but for now let's keep it simple
  // or wrap it in a useMemo with dict. Since dict is reactive.
  const validationSchema = React.useMemo(() => yup.object({
    sku: yup.string().optional(),
    imageUrl: yup.string().optional().nullable(),
    quantity: yup.number().typeError(dict.common.noData).required(dict.common.noData).min(0, dict.common.noData),
    minStock: yup.number().typeError(dict.common.noData).required(dict.common.noData).min(0, dict.common.noData),
    weightKg: yup.number().nullable().transform((v) => (v === "" || isNaN(v) ? null : v)),
    volumeM3: yup.number().nullable().transform((v) => (v === "" || isNaN(v) ? null : v)),
    palletCount: yup.number().nullable().transform((v) => (v === "" || isNaN(v) ? null : v)),
  }), [dict]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as unknown as Resolver<FormData>,
    defaultValues: {
      sku: "",
      imageUrl: "",
      quantity: 0,
      minStock: 0,
      weightKg: 0,
      volumeM3: 0,
      palletCount: 0,
    },
  });

  /* ---------------------------------- state --------------------------------- */
  // Local string state for smooth numeric input
  const [localQuantity, setLocalQuantity] = useState(
    item?.quantity?.toString() || ""
  );
  const [localMinStock, setLocalMinStock] = useState(
    item?.minStock?.toString() || ""
  );
  const [localWeight, setLocalWeight] = useState(
    item?.weightKg ? item.weightKg.toString() : ""
  );
  const [localVolume, setLocalVolume] = useState(
    item?.volumeM3 ? item.volumeM3.toString() : ""
  );
  const [localPalletCount, setLocalPalletCount] = useState(
    item?.palletCount ? item.palletCount.toString() : ""
  );

  useEffect(() => {
    if (item && isOpen) {
      reset({
        sku: item.sku || "",
        imageUrl: item.imageUrl || "",
        quantity: item.quantity,
        minStock: item.minStock,
        weightKg: item.weightKg ?? 0,
        volumeM3: item.volumeM3 ?? 0,
        palletCount: item.palletCount ?? 0,
      });
      setLocalQuantity(item.quantity.toString());
      setLocalMinStock(item.minStock.toString());
      setLocalWeight(item.weightKg?.toString() || "");
      setLocalVolume(item.volumeM3?.toString() || "");
      setLocalPalletCount(item.palletCount?.toString() || "");
    }
  }, [item, isOpen, reset]);

  const handleNumChange = (
    val: string, 
    setLocal: (v: string) => void, 
    fieldChange: (v: number | null) => void,
    isFloat: boolean = false
  ) => {
    setLocal(val);
    if (val === "") {
      fieldChange(0);
      return;
    }
    const parsed = isFloat ? parseFloat(val) : parseInt(val);
    if (!isNaN(parsed)) {
      fieldChange(parsed);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!item) return;
    try {
      let finalImageUrl = data.imageUrl || "";

      // If it's a new base64 image, upload it
      if (finalImageUrl.startsWith("data:")) {
        const uploadResult = await uploadImageAction(finalImageUrl, "general");
        finalImageUrl = uploadResult.url;
      }

      await onUpdate(item.id, {
        ...data,
        imageUrl: finalImageUrl,
      } as Partial<InventoryWithRelations>);
      onClose();
    } catch (error) {
      console.error("Failed to update inventory", error);
    }
  };

  if (!item) return null;

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: alpha(theme.palette.background.paper, 0.05),
      borderRadius: 2,
      color: "white",
      "& fieldset": { borderColor: alpha(theme.palette.divider, 0.1) },
      "&:hover fieldset": { borderColor: alpha(theme.palette.primary.main, 0.3) },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
    "& .MuiInputLabel-root": { color: alpha("#fff", 0.5) },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
    "& .MuiInputAdornment-root .MuiTypography-root": { color: alpha("#fff", 0.3) },
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: { 
          bgcolor: "#0B0F19",
          backgroundImage: "none",
          borderRadius: 4, 
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
        }
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
              }}
            >
              <EditIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} color="white">
                {dict.inventory.dialogs.editItem}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: -0.5 }}>
                {item.name} • {item.warehouse.name}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={4}>
            {/* Section 1: Stock Levels */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <InventoryIcon sx={{ color: theme.palette.primary.main, fontSize: "1.2rem" }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: "1px", textTransform: "uppercase" }}>
                  {dict.inventory.dialogs.productInfo}
                </Typography>
              </Stack>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "block", mb: 1.5 }}>
                    {dict.inventory.dialogs.productImage}
                  </Typography>
                  <Controller
                    name="imageUrl"
                    control={control}
                    render={({ field }) => (
                      <Box
                        sx={{
                          width: "100%",
                          height: 140,
                          borderRadius: 3,
                          border: `2px dashed ${alpha(theme.palette.divider, 0.1)}`,
                          bgcolor: alpha(theme.palette.background.paper, 0.05),
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          transition: "all 0.2s ease",
                          overflow: "hidden",
                          mb: 3,
                          "&:hover": {
                            borderColor: theme.palette.primary.main,
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                          },
                        }}
                      >
                        {field.value ? (
                          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                            <Box
                              component="img"
                              src={field.value}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                p: 1,
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => field.onChange("")}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: alpha(theme.palette.error.main, 0.8),
                                color: "white",
                                "&:hover": { bgcolor: theme.palette.error.main },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              id="edit-product-image-upload"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    field.onChange(event.target?.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label
                              htmlFor="edit-product-image-upload"
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                            >
                              <AddPhotoAlternateIcon
                                sx={{ fontSize: 32, color: alpha("#fff", 0.2), mb: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {dict.inventory.dialogs.clickToChange}
                              </Typography>
                            </label>
                          </>
                        )}
                      </Box>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={dict.inventory.dialogs.skuOptional}
                        placeholder={dict.inventory.dialogs.skuPlaceholder}
                        fullWidth
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={dict.inventory.fields.quantity}
                        type="number"
                        fullWidth
                        value={localQuantity}
                        onChange={(e) => handleNumChange(e.target.value, setLocalQuantity, field.onChange)}
                        error={!!errors.quantity}
                        helperText={errors.quantity?.message}
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="minStock"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={dict.inventory.dialogs.safetyThreshold}
                        type="number"
                        fullWidth
                        value={localMinStock}
                        onChange={(e) => handleNumChange(e.target.value, setLocalMinStock, field.onChange)}
                        error={!!errors.minStock}
                        helperText={errors.minStock?.message}
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: alpha(theme.palette.warning.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <WarningIcon color="warning" sx={{ fontSize: "1.1rem" }} />
                <Typography variant="caption" color="warning.light" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                  {dict.inventory.dialogs.auditWarning}
                </Typography>
              </Box>
            </Box>

            {/* Section 2: Physical Attributes */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <SettingsIcon sx={{ color: theme.palette.secondary.main, fontSize: "1.2rem" }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: "1px", textTransform: "uppercase" }}>
                  {dict.inventory.dialogs.loadParams}
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Controller
                    name="weightKg"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={dict.inventory.dialogs.unitWeight}
                        type="number"
                        fullWidth
                        value={localWeight}
                        onChange={(e) => handleNumChange(e.target.value, setLocalWeight, field.onChange, true)}
                        InputProps={{ 
                          endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                        }}
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Controller
                    name="volumeM3"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={dict.inventory.dialogs.totalVolume}
                        type="number"
                        fullWidth
                        value={localVolume}
                        onChange={(e) => handleNumChange(e.target.value, setLocalVolume, field.onChange, true)}
                        InputProps={{ 
                          endAdornment: <InputAdornment position="end">M³</InputAdornment>,
                        }}
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Controller
                    name="palletCount"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={dict.inventory.fields.pallets}
                        type="number"
                        fullWidth
                        value={localPalletCount}
                        onChange={(e) => handleNumChange(e.target.value, setLocalPalletCount, field.onChange, true)}
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

        <Box sx={{ p: 3, px: 4, bgcolor: alpha(theme.palette.background.default, 0.1) }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              onClick={onClose} 
              sx={{ px: 3, fontWeight: 600, color: "text.secondary", textTransform: "none", "&:hover": { color: "white" } }}
            >
              {dict.inventory.dialogs.discardChanges}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ 
                minWidth: 160,
                borderRadius: 2, 
                fontWeight: 700,
                textTransform: "none",
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                py: 1.2,
              }}
            >
              {isSubmitting ? dict.common.saving : dict.inventory.dialogs.commitUpdate}
            </Button>
          </Stack>
        </Box>
      </form>
    </Dialog>
  );
}
