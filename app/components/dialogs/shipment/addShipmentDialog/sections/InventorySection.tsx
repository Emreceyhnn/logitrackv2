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
  Tooltip,
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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
    };
    addInventoryItem(newItem);
  };

  const calculateTotals = (items: InventoryShipmentItem[]) => {
    return items.reduce(
      (acc, item) => ({
        weightKg: acc.weightKg + (item.weightKg || 0) * item.quantity,
        volumeM3: acc.volumeM3 + (item.volumeM3 || 0) * item.quantity,
        palletCount: acc.palletCount + (item.palletCount || 0) * item.quantity,
      }),
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
      unit: (product.unit as InventoryShipmentItem["unit"]) || "Each",
      weightKg: product.weightKg || 0,
      volumeM3: product.volumeM3 || 0,
      palletCount: product.palletCount || 0,
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
      <Stack spacing={2.5}>
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
              Inventory Contents
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
              Select from Warehouse
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
              Manual Add
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={2}>
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
                No items added yet.
                {availableInventory.length > 0
                  ? " Select items from the warehouse inventory above."
                  : " Select an origin warehouse to see available items."}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              <Grid container spacing={2} sx={{ mb: 1, px: 1 }}>
                <Grid size={{ xs: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    SKU ID
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4.5 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    ITEM NAME
                  </Typography>
                </Grid>
                <Grid size={{ xs: 2.5 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    QUANTITY / STOCK
                  </Typography>
                </Grid>
                <Grid size={{ xs: 1.5 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    UNIT
                  </Typography>
                </Grid>
                <Grid size={{ xs: 0.5 }} />
              </Grid>

              {state.items.map((item) => (
                <Grid
                  container
                  spacing={2}
                  key={item.id}
                  alignItems="flex-start"
                >
                  <Grid size={{ xs: 3 }}>
                    <CustomTextArea
                      name={`sku-${item.id}`}
                      placeholder="SKU-88219"
                      value={item.sku}
                      onChange={(e) =>
                        updateItem(item.id, { sku: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 4.5 }}>
                    <CustomTextArea
                      name={`name-${item.id}`}
                      placeholder="Enter item name..."
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, { name: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 2.5 }}>
                    <Stack spacing={0.5}>
                      <CustomTextArea
                        name={`qty-${item.id}`}
                        type="number"
                        value={item.quantity.toString()}
                        onChange={(e) =>
                          updateItem(item.id, {
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        error={
                          item.maxQuantity !== undefined &&
                          item.quantity > item.maxQuantity
                        }
                      />
                      {item.maxQuantity !== undefined && (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          sx={{ minHeight: 16 }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                item.quantity > item.maxQuantity
                                  ? "error.main"
                                  : "text.secondary",
                              fontWeight:
                                item.quantity > item.maxQuantity ? 700 : 400,
                              lineHeight: 1,
                            }}
                          >
                            Max: {item.maxQuantity}
                          </Typography>
                          {item.quantity > item.maxQuantity && (
                            <Tooltip title="Stock limit exceeded">
                              <InfoOutlinedIcon
                                sx={{ fontSize: 12, color: "error.main" }}
                              />
                            </Tooltip>
                          )}
                        </Stack>
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 1.5 }}>
                    <CustomTextArea
                      name={`unit-${item.id}`}
                      select
                      value={item.unit}
                      onChange={(e) =>
                        updateItem(item.id, { unit: e.target.value as InventoryShipmentItem["unit"] })
                      }
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
                      sx={{
                        mt: 1,
                        color: "text.secondary",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Stack>
          )}
        </Stack>
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
          Select Product
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
                    secondary={`SKU: ${product.sku} | In Stock: ${product.quantity}`}
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
