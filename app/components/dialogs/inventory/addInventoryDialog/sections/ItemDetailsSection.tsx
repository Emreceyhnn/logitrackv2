"use client";

import {
  alpha,
  Box,
  Stack,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";
import {
  AddInventoryItemDetails,
  AddInventoryPageActions,
} from "@/app/lib/type/add-inventory";
import CustomTextArea from "@/app/components/inputs/customTextArea";

interface ItemDetailsSectionProps {
  state: AddInventoryItemDetails;
  actions: AddInventoryPageActions;
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

const ItemDetailsSection = ({ state, actions }: ItemDetailsSectionProps) => {
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
              onChange={(e) =>
                actions.updateItemDetails({ sku: e.target.value })
              }
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.6 }}
            >
              Unique alphanumeric identifier for the item.
            </Typography>
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
              onChange={(e) =>
                actions.updateItemDetails({ name: e.target.value })
              }
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.6 }}
            >
              Official common name used in fleet logs and warehouse manifests.
            </Typography>
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
              onChange={(e) =>
                actions.updateItemDetails({ category: e.target.value })
              }
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
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ opacity: 0.6 }}
            >
              Classify the item by its logistical function for easier sorting.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ItemDetailsSection;
