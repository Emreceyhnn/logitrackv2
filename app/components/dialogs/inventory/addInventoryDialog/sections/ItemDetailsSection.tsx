"use client";

import {
  Box,
  Stack,
  Typography,
  useTheme,
  MenuItem,
  Grid,
  IconButton,
  alpha,
} from "@mui/material";
import { AddInventoryItemDetails } from "@/app/lib/type/add-inventory";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface ItemDetailsSectionProps {
  state: AddInventoryItemDetails;
  updateItemDetails: (data: Partial<AddInventoryItemDetails>) => void;
}

const CATEGORIES = [
  "Electronics",
  "Machinery",
  "Spare Parts",
  "Raw Materials",
  "Finished Goods",
  "Packaging",
  "Office Supplies",
  "Others",
];

const ItemDetailsSection = ({
  state,
  updateItemDetails,
}: ItemDetailsSectionProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  return (
    <Box>
      <Stack spacing={4}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={700} color="white">
            Product Identity
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Provide the fundamental identification details for the new inventory
            item.
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              SKU (Stock Keeping Unit)
            </Typography>
            <CustomTextArea
              name="sku"
              placeholder="e.g. PJ-2024-X100 (Leave blank to auto-generate)"
              value={state.sku}
              onChange={(e) => updateItemDetails({ sku: e.target.value })}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              ITEM NAME *
            </Typography>
            <CustomTextArea
              name="name"
              placeholder="e.g. Heavy Duty Pallet Jack"
              value={state.name}
              onChange={(e) => updateItemDetails({ name: e.target.value })}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              CATEGORY *
            </Typography>
            <CustomTextArea
              name="category"
              select
              value={state.category}
              onChange={(e) => updateItemDetails({ category: e.target.value })}
            >
              <MenuItem value="" disabled>
                Select a category
              </MenuItem>
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </CustomTextArea>
          </Stack>

          <Stack spacing={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              UNIT VALUE *
            </Typography>
            <CustomTextArea
              name="unitValue"
              type="number"
              placeholder="0.00"
              value={state.unitValue?.toString() || "0"}
              onChange={(e) =>
                updateItemDetails({
                  unitValue: parseFloat(e.target.value) || 0,
                })
              }
            />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              PRODUCT IMAGE *
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: 160,
                borderRadius: 2,
                border: `2px dashed ${alpha(theme.palette.divider, 0.1)}`,
                bgcolor: alpha(theme.palette.background.paper, 0.05),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "all 0.2s ease",
                overflow: "hidden",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                },
              }}
            >
              {state.imageUrl ? (
                <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                  <Box
                    component="img"
                    src={state.imageUrl}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      p: 1,
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => updateItemDetails({ imageUrl: "" })}
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
                    id="product-image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          updateItemDetails({
                            imageUrl: event.target?.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="product-image-upload"
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
                      sx={{ fontSize: 40, color: alpha("#fff", 0.2), mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Drop image or click to upload
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      PNG, JPG, WebP (Max 10MB)
                    </Typography>
                  </label>
                </>
              )}
            </Box>
          </Stack>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  WEIGHT PER UNIT (KG)
                </Typography>
                <CustomTextArea
                  name="weightKg"
                  type="number"
                  placeholder="0.00"
                  value={state.weightKg?.toString() || "0"}
                  onChange={(e) =>
                    updateItemDetails({
                      weightKg: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  VOLUME PER UNIT (M³)
                </Typography>
                <CustomTextArea
                  name="volumeM3"
                  type="number"
                  placeholder="0.000"
                  value={state.volumeM3?.toString() || "0"}
                  onChange={(e) =>
                    updateItemDetails({
                      volumeM3: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  PALLETS PER UNIT
                </Typography>
                <CustomTextArea
                  name="palletCount"
                  type="number"
                  placeholder="0.0"
                  value={state.palletCount?.toString() || "0"}
                  onChange={(e) =>
                    updateItemDetails({
                      palletCount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  DEFAULT CARGO TYPE
                </Typography>
                <CustomTextArea
                  name="cargoType"
                  select
                  value={state.cargoType || "General Cargo"}
                  onChange={(e) =>
                    updateItemDetails({ cargoType: e.target.value })
                  }
                >
                  <MenuItem value="General Cargo">General Cargo</MenuItem>
                  <MenuItem value="Perishable">Perishable</MenuItem>
                  <MenuItem value="Fragile">Fragile</MenuItem>
                  <MenuItem value="Liquid">Liquid</MenuItem>
                </CustomTextArea>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ItemDetailsSection;
