"use client";

import {
  Box,
  Stack,
  Typography,
  useTheme,
  MenuItem,
  Grid,
} from "@mui/material";
import { AddInventoryItemDetails } from "@/app/lib/type/add-inventory";
import CustomTextArea from "@/app/components/inputs/customTextArea";

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
              SKU (Stock Keeping Unit) *
            </Typography>
            <CustomTextArea
              name="sku"
              placeholder="e.g. PJ-2024-X100"
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
