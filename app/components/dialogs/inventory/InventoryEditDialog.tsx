"use client";

import React, { useState, useMemo } from "react";
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
import { Formik } from "formik";
import * as yup from "yup";
import { useWarehouses } from "@/app/hooks/useWarehouses";
import { MenuItem } from "@mui/material";
import { InventoryEditProps } from "@/app/lib/type/inventory";
import { uploadImageAction } from "@/app/lib/actions/upload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { toast } from "sonner";
import { useCurrency } from "@/app/hooks/useCurrency";

type FormData = {
  name: string;
  sku?: string;
  warehouseId: string;
  imageUrl?: string | null;
  quantity: number;
  minStock: number;
  weightKg: number | null;
  volumeM3: number | null;
  palletCount: number | null;
  cargoType?: string | null;
  unitValue?: number | null;
};

export default function InventoryEditDialog({
  isOpen,
  onClose,
  item,
  onUpdate,
}: InventoryEditProps) {
  const theme = useTheme();
  const dict = useDictionary();
  const { data: warehouses } = useWarehouses();
  const { convertFrom, symbol, currency: userCurrency } = useCurrency();

  const validationSchema = useMemo(
    () =>
      yup.object({
        name: yup.string().required(dict.common.noData),
        sku: yup.string().optional(),
        warehouseId: yup.string().required(dict.common.noData),
        imageUrl: yup.string().optional().nullable(),
        quantity: yup
          .number()
          .typeError(dict.common.noData)
          .required(dict.common.noData)
          .min(0, dict.common.noData),
        minStock: yup
          .number()
          .typeError(dict.common.noData)
          .required(dict.common.noData)
          .min(0, dict.common.noData),
        weightKg: yup
          .number()
          .nullable()
          .transform((v) => (v === "" || isNaN(v) ? null : v)),
        volumeM3: yup
          .number()
          .nullable()
          .transform((v) => (v === "" || isNaN(v) ? null : v)),
        palletCount: yup
          .number()
          .nullable()
          .transform((v) => (v === "" || isNaN(v) ? null : v)),
        unitValue: yup
          .number()
          .nullable()
          .transform((v) => (v === "" || isNaN(v) ? null : v)),
        cargoType: yup.string().optional().nullable(),
      }),
    [dict]
  );

  const initialValues = useMemo(() => {
    return {
      name: item?.name || "",
      sku: item?.sku || "",
      warehouseId: item?.warehouseId || "",
      imageUrl: item?.imageUrl || "",
      quantity: item?.quantity || 0,
      minStock: item?.minStock || 0,
      weightKg: item?.weightKg || 0,
      volumeM3: item?.volumeM3 || 0,
      palletCount: item?.palletCount || 0,
      unitValue: item
        ? parseFloat(
            convertFrom(item.unitValue || 0, item.currency || "USD").toFixed(2)
          )
        : 0,
      cargoType: item?.cargoType || "General Cargo",
    };
  }, [item, convertFrom]);

  /* ---------------------------------- state --------------------------------- */
  // Local string state for smooth numeric input
  const [localQuantity, setLocalQuantity] = useState(() => item?.quantity?.toString() || "0");
  const [localMinStock, setLocalMinStock] = useState(() => item?.minStock?.toString() || "0");
  const [localWeight, setLocalWeight] = useState(() => item?.weightKg ? item.weightKg.toString() : "0");
  const [localVolume, setLocalVolume] = useState(() => item?.volumeM3 ? item.volumeM3.toString() : "0");
  const [localPalletCount, setLocalPalletCount] = useState(() => item?.palletCount ? item.palletCount.toString() : "0");
  const [localUnitValue, setLocalUnitValue] = useState(() => {
    if (!item) return "0";
    const converted = parseFloat(
      convertFrom(item.unitValue || 0, item.currency || "USD").toFixed(2)
    );
    return converted ? converted.toString() : "0";
  });

  const handleNumChange = (
    val: string,
    setLocal: (v: string) => void,
    setFieldValue: (field: string, value: number | null) => void,
    fieldName: string,
    isFloat: boolean = false
  ) => {
    setLocal(val);
    if (val === "") {
      setFieldValue(fieldName, 0);
      return;
    }
    const parsed = isFloat ? parseFloat(val) : parseInt(val);
    if (!isNaN(parsed)) {
      setFieldValue(fieldName, parsed);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!item) return;

    // 1. Close dialog immediately
    onClose();

    // 2. Run update behind a loading toast
    await toast.promise(
      (async () => {
        let finalImageUrl = data.imageUrl || "";

        if (finalImageUrl.startsWith("data:")) {
          const uploadResult = await uploadImageAction(finalImageUrl, "general");
          finalImageUrl = uploadResult.url;
        }

        await onUpdate(item.id, {
          ...data,
          imageUrl: finalImageUrl,
          currency: userCurrency,
        });
      })(),
      {
        loading: dict.toasts?.loading || "Updating...",
        success: dict.common.saveSuccess || "Inventory updated successfully",
        error: (error: unknown) =>
          (error as Error).message || "Failed to update inventory",
      }
    );
  };

  if (!item) return null;

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: theme.palette.background.paper_alpha.main_05,
      borderRadius: 2,
      color: "white",
      "& fieldset": { borderColor: theme.palette.divider_alpha.main_10 },
      "&:hover fieldset": { borderColor: theme.palette.primary._alpha.main_30 },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.common.white_alpha.main_50,
    },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
    "& .MuiInputAdornment-root .MuiTypography-root": {
      color: theme.palette.common.white_alpha.main_30,
    },
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundImage: "none",
          border: `1px solid ${theme.palette.divider_alpha.main_10}`,
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
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
                bgcolor: theme.palette.secondary._alpha.main_10,
                color: theme.palette.secondary.main,
              }}
            >
              <EditIcon />
            </Box>
            <Box>
              <Typography component="div" variant="h6" fontWeight={700} color="white">
                {dict.inventory.dialogs.editItem}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: -0.5 }}
              >
                {item.name} • {item.warehouse.name}
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "text.secondary" }}
           aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: theme.palette.divider_alpha.main_10 }} />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent
              sx={{
                p: 4,
                maxHeight: "calc(90vh - 160px)",
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: theme.palette.divider_alpha.main_10,
                  borderRadius: "4px",
                  "&:hover": { bgcolor: theme.palette.divider_alpha.main_20 },
                },
              }}
            >
              <Stack spacing={4}>
                {/* Section 1: Stock Levels */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <InventoryIcon
                      sx={{ color: theme.palette.primary.main, fontSize: "1.2rem" }}
                    />
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ letterSpacing: "1px", textTransform: "uppercase" }}
                    >
                      {dict.inventory.dialogs.productInfo}
                    </Typography>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        name="name"
                        label={dict.inventory.fields?.name || "Product Name"}
                        placeholder="Enter product name"
                        fullWidth
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                        sx={textFieldSx}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{ display: "block", mb: 1.5 }}
                      >
                        {dict.inventory.dialogs.productImage}
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          height: 140,
                          borderRadius: 3,
                          border: `2px dashed ${theme.palette.divider_alpha.main_10}`,
                          bgcolor: theme.palette.background.paper_alpha.main_05,
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
                            bgcolor: theme.palette.primary._alpha.main_02,
                          },
                        }}
                      >
                        {values.imageUrl ? (
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <Box
                              component="img"
                              src={values.imageUrl}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                p: 1,
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => setFieldValue("imageUrl", "")}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: theme.palette.error._alpha.main_80,
                                color: "white",
                                "&:hover": {
                                  bgcolor: theme.palette.error.main,
                                },
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
                                    setFieldValue(
                                      "imageUrl",
                                      event.target?.result as string
                                    );
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
                                sx={{
                                  fontSize: 32,
                                  color:
                                    theme.palette.common.white_alpha.main_20,
                                  mb: 1,
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {dict.inventory.dialogs.clickToChange}
                              </Typography>
                            </label>
                          </>
                        )}
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        name="sku"
                        label={dict.inventory.dialogs.skuOptional}
                        placeholder={dict.inventory.dialogs.skuPlaceholder}
                        fullWidth
                        value={values.sku}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={textFieldSx}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        name="warehouseId"
                        select
                        label={dict.inventory.filters?.warehouse || "Warehouse"}
                        fullWidth
                        value={values.warehouseId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.warehouseId && !!errors.warehouseId}
                        helperText={touched.warehouseId && errors.warehouseId}
                        sx={textFieldSx}
                      >
                        {warehouses?.map((w) => (
                          <MenuItem key={w.id} value={w.id}>
                            {w.name} ({w.code})
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        name="quantity"
                        label={dict.inventory.fields.quantity}
                        type="number"
                        fullWidth
                        value={localQuantity}
                        onChange={(e) =>
                          handleNumChange(
                            e.target.value,
                            setLocalQuantity,
                            setFieldValue,
                            "quantity"
                          )
                        }
                        onBlur={handleBlur}
                        error={touched.quantity && !!errors.quantity}
                        helperText={touched.quantity && errors.quantity}
                        sx={textFieldSx}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        name="minStock"
                        label={dict.inventory.dialogs.safetyThreshold}
                        type="number"
                        fullWidth
                        value={localMinStock}
                        onChange={(e) =>
                          handleNumChange(
                            e.target.value,
                            setLocalMinStock,
                            setFieldValue,
                            "minStock"
                          )
                        }
                        onBlur={handleBlur}
                        error={touched.minStock && !!errors.minStock}
                        helperText={touched.minStock && errors.minStock}
                        sx={textFieldSx}
                      />
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      borderRadius: 2.5,
                      bgcolor: theme.palette.warning._alpha.main_05,
                      border: `1px solid ${theme.palette.warning._alpha.main_10}`,
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                    }}
                  >
                    <WarningIcon color="warning" sx={{ fontSize: "1.1rem" }} />
                    <Typography
                      variant="caption"
                      color="warning.light"
                      sx={{ fontWeight: 600, lineHeight: 1.4 }}
                    >
                      {dict.inventory.dialogs.auditWarning}
                    </Typography>
                  </Box>
                </Box>

                {/* Section 2: Physical Attributes */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <SettingsIcon
                      sx={{
                        color: theme.palette.secondary.main,
                        fontSize: "1.2rem",
                      }}
                    />
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ letterSpacing: "1px", textTransform: "uppercase" }}
                    >
                      {dict.inventory.dialogs.loadParams}
                    </Typography>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        name="weightKg"
                        label={dict.inventory.dialogs.unitWeight}
                        type="number"
                        fullWidth
                        value={localWeight}
                        onChange={(e) =>
                          handleNumChange(
                            e.target.value,
                            setLocalWeight,
                            setFieldValue,
                            "weightKg",
                            true
                          )
                        }
                        onBlur={handleBlur}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">Kg</InputAdornment>
                          ),
                        }}
                        sx={textFieldSx}
                      />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        name="volumeM3"
                        label={dict.inventory.dialogs.totalVolume}
                        type="number"
                        fullWidth
                        value={localVolume}
                        onChange={(e) =>
                          handleNumChange(
                            e.target.value,
                            setLocalVolume,
                            setFieldValue,
                            "volumeM3",
                            true
                          )
                        }
                        onBlur={handleBlur}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">M³</InputAdornment>
                          ),
                        }}
                        sx={textFieldSx}
                      />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        name="palletCount"
                        label={dict.inventory.dialogs.palletSpots}
                        type="number"
                        fullWidth
                        value={localPalletCount}
                        onChange={(e) =>
                          handleNumChange(
                            e.target.value,
                            setLocalPalletCount,
                            setFieldValue,
                            "palletCount"
                          )
                        }
                        onBlur={handleBlur}
                        sx={textFieldSx}
                      />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                      <TextField
                        name="cargoType"
                        select
                        label={dict.inventory.table?.cargoType || "Cargo Type"}
                        fullWidth
                        value={values.cargoType || "General Cargo"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={textFieldSx}
                      >
                        <MenuItem value="General Cargo">{dict.inventory?.dialogs?.cargoTypes?.["General Cargo"] || "General Cargo"}</MenuItem>
                        <MenuItem value="Perishable Goods">{dict.inventory?.dialogs?.cargoTypes?.["Perishable Goods"] || "Perishable Goods"}</MenuItem>
                        <MenuItem value="Hazardous Materials">{dict.inventory?.dialogs?.cargoTypes?.["Hazardous Materials"] || "Hazardous Materials"}</MenuItem>
                        <MenuItem value="Fragile Goods">{dict.inventory?.dialogs?.cargoTypes?.["Fragile Goods"] || "Fragile Goods"}</MenuItem>
                        <MenuItem value="Liquid Cargo">{dict.inventory?.dialogs?.cargoTypes?.["Liquid Cargo"] || "Liquid Cargo"}</MenuItem>
                        <MenuItem value="Oversized Cargo">{dict.inventory?.dialogs?.cargoTypes?.["Oversized Cargo"] || "Oversized Cargo"}</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                      <TextField
                        name="unitValue"
                        label={dict.inventory.table?.unitPrice || "Unit Value"}
                        type="number"
                        fullWidth
                        value={localUnitValue}
                        onChange={(e) =>
                          handleNumChange(
                            e.target.value,
                            setLocalUnitValue,
                            setFieldValue,
                            "unitValue",
                            true
                          )
                        }
                        onBlur={handleBlur}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {symbol}
                            </InputAdornment>
                          ),
                        }}
                        sx={textFieldSx}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </DialogContent>

            <Divider sx={{ borderColor: theme.palette.divider_alpha.main_10 }} />

            <Box
              sx={{
                p: 3,
                px: 4,
                bgcolor: theme.palette.background.default_alpha.main_10,
              }}
            >
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  onClick={onClose}
                  sx={{
                    px: 3,
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "none",
                    "&:hover": { color: "white" },
                  }}
                >
                  {dict.inventory.dialogs.discardChanges}
                </Button>
                {Object.keys(errors).length > 0 && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ alignSelf: "center", fontWeight: 600 }}
                  >
                    {dict.common.fillRequired ||
                      "Lütfen formdaki hataları kontrol edin"}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    minWidth: 160,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: `0 8px 24px ${theme.palette.primary._alpha.main_20}`,
                    py: 1.2,
                  }}
                >
                  {dict.inventory.dialogs.commitUpdate}
                </Button>
              </Stack>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}
