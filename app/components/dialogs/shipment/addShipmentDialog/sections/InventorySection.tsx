"use client";

import {
  alpha,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
} from "@mui/material";
import {
  AddShipmentInventory,
  InventoryShipmentItem,
  AddShipmentCargo,
} from "@/app/lib/type/add-shipment";
import { InventoryWithRelations } from "@/app/lib/type/inventory";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useState } from "react";

interface InventorySectionProps {
  state: AddShipmentInventory;
  addInventoryItem: (item: InventoryShipmentItem) => void;
  removeInventoryItem: (id: string) => void;
  updateInventory: (data: Partial<AddShipmentInventory>) => void;
  updateCargo: (data: Partial<AddShipmentCargo>) => void;
  availableInventory: InventoryWithRelations[];
  isLoadingInventory: boolean;
}

const InventorySection = ({
  state,
  addInventoryItem,
  removeInventoryItem,
  updateInventory,
  updateCargo,
  availableInventory,
  isLoadingInventory,
}: InventorySectionProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  /* -------------------------------- handlers -------------------------------- */
  const handleAddItem = () => {
    const newItem: InventoryShipmentItem = {
      id: crypto.randomUUID(),
      sku: "",
      name: "",
      quantity: 1,
      unit: "Each",
      weightKg: 0,
      volumeM3: 0,
      palletCount: 1, // Default to 1 to avoid division by zero
    };
    addInventoryItem(newItem);
  };

  const calculateTotals = (items: InventoryShipmentItem[]) => {
    return items.reduce(
      (acc, item) => {
        const qty = item.quantity || 0;
        const perPallet = item.palletCount || 0;
        const unitWeight = item.weightKg || 0;
        const unitVolume = item.volumeM3 || 0;

        let itemTotalWeight = 0;
        let itemTotalVolume = 0;
        let itemTotalPallets = 0;

        if (item.unit === "Pallet") {
          itemTotalPallets = qty;
          itemTotalWeight = unitWeight * perPallet * qty;
          itemTotalVolume = unitVolume * perPallet * qty;
        } else {
          itemTotalPallets = perPallet > 0 ? qty / perPallet : 0;
          itemTotalWeight = unitWeight * qty;
          itemTotalVolume = unitVolume * qty;
        }

        return {
          weightKg: acc.weightKg + itemTotalWeight,
          volumeM3: acc.volumeM3 + itemTotalVolume,
          palletCount: acc.palletCount + itemTotalPallets,
        };
      },
      { weightKg: 0, volumeM3: 0, palletCount: 0 }
    );
  };

  const selectProduct = (product: InventoryWithRelations) => {
    const newItem: InventoryShipmentItem = {
      id: crypto.randomUUID(),
      sku: product.sku,
      name: product.name,
      quantity: 1,
      maxQuantity: product.quantity,
      unit: product.unit === "Pallet" ? "Pallet" : "Each",
      weightKg: product.weightKg || 0,
      volumeM3: product.volumeM3 || 0,
      palletCount: product.palletCount || 1, // Get from DB, default to 1 if missing
      cargoType: product.cargoType || "General Cargo",
    };

    const newItems = [...state.items, newItem];
    addInventoryItem(newItem);

    // Auto-fill cargo details
    const totals = calculateTotals(newItems);
    updateCargo({
      ...totals,
      cargoType: newItem.cargoType || "General Cargo",
    });

    setIsPickerOpen(false);
  };

  const updateItem = (id: string, updates: Partial<InventoryShipmentItem>) => {
    const updatedItems = state.items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateInventory({ items: updatedItems });

    // Recalculate cargo
    const totals = calculateTotals(updatedItems);
    updateCargo(totals);
  };

  const handleRemove = (id: string) => {
    const updatedItems = state.items.filter((item) => item.id !== id);
    removeInventoryItem(id);

    // Recalculate cargo
    const totals = calculateTotals(updatedItems);
    updateCargo(totals);
  };

  return (
    <Box>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: theme.palette.primary.main,
              }}
            />
            <Typography variant="subtitle2" fontWeight={700} color="white">
              Inventory Detail
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={
                isLoadingInventory ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <InventoryIcon sx={{ fontSize: 18 }} />
                )
              }
              size="small"
              onClick={() => setIsPickerOpen(true)}
              disabled={isLoadingInventory || availableInventory.length === 0}
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Warehouse
            </Button>
            <Button
              startIcon={<AddIcon />}
              size="small"
              onClick={handleAddItem}
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Manual
            </Button>
          </Stack>
        </Stack>

        {state.items.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              border: `1px dashed ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: alpha(theme.palette.divider, 0.02),
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No items added.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            <Grid container spacing={1.5} sx={{ mb: 1, px: 1 }}>
              <Grid size={{ xs: 3 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">SKU ID</Typography>
              </Grid>
              <Grid size={{ xs: 5.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">ITEM NAME</Typography>
              </Grid>
              <Grid size={{ xs: 1.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">QTY</Typography>
              </Grid>
              <Grid size={{ xs: 1.5 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">UNIT</Typography>
              </Grid>
              <Grid size={{ xs: 0.5 }} />
            </Grid>

            {state.items.map((item) => (
              <Box key={item.id}>
                <Grid container spacing={1.5} alignItems="center" sx={{ px: 1, mb: 0.5 }}>
                  <Grid size={{ xs: 3 }}>
                    <CustomTextArea
                      name={`sku-${item.id}`}
                      placeholder="SKU"
                      value={item.sku}
                      onChange={(e) => updateItem(item.id, { sku: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 5.5 }}>
                    <CustomTextArea
                      name={`name-${item.id}`}
                      placeholder="Name"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 1.5 }}>
                    <CustomTextArea
                      name={`qty-${item.id}`}
                      type="number"
                      value={item.quantity.toString()}
                      onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                    />
                  </Grid>
                  <Grid size={{ xs: 1.5 }}>
                    <CustomTextArea
                      name={`unit-${item.id}`}
                      select
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, { unit: e.target.value as InventoryShipmentItem["unit"] })}
                    >
                      <MenuItem value="Each">Each</MenuItem>
                      <MenuItem value="Box">Box</MenuItem>
                      <MenuItem value="Pallet">Pallet</MenuItem>
                    </CustomTextArea>
                  </Grid>
                  <Grid size={{ xs: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(item.id)}
                      sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
                
                {/* Row Feedback */}
                <Stack direction="row" spacing={3} sx={{ px: 1.5, mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "10px" }}>
                       Calculated Pallets: <b>{(item.unit === "Pallet" ? item.quantity : (item.palletCount && item.palletCount > 0 ? item.quantity / item.palletCount : 0)).toFixed(2)}</b>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "10px" }}>
                       Row Weight: <b>{(item.unit === "Pallet" ? (item.weightKg || 0) * (item.palletCount || 0) * item.quantity : (item.weightKg || 0) * item.quantity).toFixed(2)} KG</b>
                    </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>

      <Dialog
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#0B0E14",
            backgroundImage: "none",
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: 700 }}>
          Warehouse Inventory
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}
        >
          <List>
            {availableInventory.map((product) => (
              <ListItem key={product.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => selectProduct(product)}
                  sx={{
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemText
                    primary={product.name}
                    secondary={`SKU: ${product.sku} | In Stock: ${product.quantity} | U/Pallet: ${product.palletCount}`}
                    primaryTypographyProps={{ color: "white", fontWeight: 600 }}
                    secondaryTypographyProps={{ color: "text.secondary" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setIsPickerOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventorySection;
