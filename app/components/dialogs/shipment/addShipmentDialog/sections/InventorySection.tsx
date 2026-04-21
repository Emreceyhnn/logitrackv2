import {
  Button,
  Stack,
  Typography,
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
  Box,
} from "@mui/material";
import { useFormikContext } from "formik";
import { ShipmentFormValues } from "@/app/lib/type/shipment";
import { InventoryShipmentItem } from "@/app/lib/type/add-shipment";
import { InventoryWithRelations } from "@/app/lib/type/inventory";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import AddIcon from "@mui/icons-material/Add";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useState } from "react";

interface InventorySectionProps {
  availableInventory: InventoryWithRelations[];
  isLoadingInventory: boolean;
}

const InventorySection = ({
  availableInventory,
  isLoadingInventory,
}: InventorySectionProps) => {
  /* -------------------------------- variables ------------------------------- */
  const dict = useDictionary();

  const { values, setFieldValue } = useFormikContext<ShipmentFormValues>();

  /* --------------------------------- states --------------------------------- */
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  /* -------------------------------- handlers -------------------------------- */
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

  const handleAddItem = () => {
    const newItem: InventoryShipmentItem = {
      id: crypto.randomUUID(),
      sku: "",
      name: "",
      quantity: 1,
      unit: "Each",
      weightKg: 0,
      volumeM3: 0,
      palletCount: 1,
    };
    const newItems = [...values.inventoryItems, newItem];
    setFieldValue("inventoryItems", newItems);
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
      palletCount: product.palletCount || 1,
      cargoType: product.cargoType || "General Cargo",
    };

    const newItems = [...values.inventoryItems, newItem];
    setFieldValue("inventoryItems", newItems);

    // Auto-fill cargo details
    const totals = calculateTotals(newItems);
    setFieldValue("weightKg", totals.weightKg);
    setFieldValue("volumeM3", totals.volumeM3);
    setFieldValue("palletCount", Math.ceil(totals.palletCount));
    if (newItem.cargoType) {
      setFieldValue("cargoType", newItem.cargoType);
    }

    setIsPickerOpen(false);
  };

  const updateItem = (id: string, updates: Partial<InventoryShipmentItem>) => {
    const updatedItems = values.inventoryItems.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setFieldValue("inventoryItems", updatedItems);

    // Recalculate cargo
    const totals = calculateTotals(updatedItems);
    setFieldValue("weightKg", totals.weightKg);
    setFieldValue("volumeM3", totals.volumeM3);
    setFieldValue("palletCount", Math.ceil(totals.palletCount));
  };

  const handleRemove = (id: string) => {
    const updatedItems = values.inventoryItems.filter((item) => item.id !== id);
    setFieldValue("inventoryItems", updatedItems);

    // Recalculate cargo
    const totals = calculateTotals(updatedItems);
    setFieldValue("weightKg", totals.weightKg);
    setFieldValue("volumeM3", totals.volumeM3);
    setFieldValue("palletCount", Math.ceil(totals.palletCount));
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
                bgcolor: "theme.palette.primary.main",
              }}
            />
            <Typography variant="subtitle2" fontWeight={700} color="white">
              {dict.shipments.dialogs.sections.inventoryDetail}
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
                color: "theme.palette.primary.main",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {dict.shipments.dialogs.fields.warehouse}
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
              {dict.shipments.dialogs.fields.manual}
            </Button>
          </Stack>
        </Stack>

        {values.inventoryItems.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              border: `1px dashed theme.palette.divider_alpha.main_10`,
              bgcolor: "theme.palette.divider_alpha.main_02",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {dict.shipments.dialogs.fields.noItemsAdded}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            {/* Table Headers */}
            <Stack direction="row" spacing={1.5} sx={{ mb: 1, px: 2 }}>
              <Box sx={{ flex: 3 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                >
                  {dict.shipments.dialogs.fields.skuId}
                </Typography>
              </Box>
              <Box sx={{ flex: 5.5 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                >
                  {dict.shipments.dialogs.fields.itemName}
                </Typography>
              </Box>
              <Box sx={{ flex: 1.5 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                >
                  {dict.shipments.dialogs.fields.qty}
                </Typography>
              </Box>
              <Box sx={{ flex: 1.5 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                >
                  {dict.shipments.dialogs.fields.unit}
                </Typography>
              </Box>
              <Box sx={{ width: 40 }} /> {/* Spacer for delete button */}
            </Stack>

            {values.inventoryItems.map((item) => (
              <Box key={item.id}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ px: 1, mb: 1 }}
                >
                  <Box sx={{ flex: 3 }}>
                    <CustomTextArea
                      sx={{ margin: 0, padding: 0 }}
                      name={`sku-${item.id}`}
                      placeholder="SKU"
                      value={item.sku}
                      onChange={(e) =>
                        updateItem(item.id, { sku: e.target.value })
                      }
                    />
                  </Box>
                  <Box sx={{ flex: 5.5 }}>
                    <CustomTextArea
                      sx={{ margin: 0, padding: 0 }}
                      name={`name-${item.id}`}
                      placeholder="Name"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, { name: e.target.value })
                      }
                    />
                  </Box>
                  <Box sx={{ flex: 1.5 }}>
                    <CustomTextArea
                      sx={{ margin: 0, padding: 0 }}
                      name={`qty-${item.id}`}
                      type="number"
                      value={item.quantity.toString()}
                      onChange={(e) =>
                        updateItem(item.id, {
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </Box>
                  <Box sx={{ flex: 1.5 }}>
                    <CustomTextArea
                      sx={{ margin: 0, padding: 0 }}
                      name={`unit-${item.id}`}
                      select
                      value={item.unit}
                      onChange={(e) =>
                        updateItem(item.id, {
                          unit: e.target.value as InventoryShipmentItem["unit"],
                        })
                      }
                    >
                      <MenuItem value="Each">
                        {dict.shipments.dialogs.types.each}
                      </MenuItem>
                      <MenuItem value="Box">
                        {dict.shipments.dialogs.types.box}
                      </MenuItem>
                      <MenuItem value="Pallet">
                        {dict.shipments.dialogs.types.pallet}
                      </MenuItem>
                    </CustomTextArea>
                  </Box>
                  <Box
                    sx={{ width: 40, display: "flex", justifyContent: "start" }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(item.id)}
                      sx={{
                        p: 0.5,
                        color: "text.secondary",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Stack>

                {/* Row Feedback */}
                <Stack direction="row" spacing={3} sx={{ px: 1.5, mb: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "10px" }}
                  >
                    {dict.shipments.dialogs.fields.calculatedPallets}:{" "}
                    <b>
                      {(item.unit === "Pallet"
                        ? item.quantity
                        : item.palletCount && item.palletCount > 0
                          ? item.quantity / item.palletCount
                          : 0
                      ).toFixed(2)}
                    </b>
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "10px" }}
                  >
                    {dict.shipments.dialogs.fields.rowWeight}:{" "}
                    <b>
                      {(item.unit === "Pallet"
                        ? (item.weightKg || 0) *
                          (item.palletCount || 0) *
                          item.quantity
                        : (item.weightKg || 0) * item.quantity
                      ).toFixed(2)}{" "}
                      KG
                    </b>
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
            borderRadius: 3,
            border: "1px solid theme.palette.divider_alpha.main_10",
          },
        }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: 700 }}>
          {dict.shipments.dialogs.fields.warehouseInventory}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            borderColor: "theme.palette.divider_alpha.main_10",
          }}
        >
          <List>
            {availableInventory.map((product) => (
              <ListItem key={product.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => selectProduct(product)}
                  sx={{
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "theme.palette.primary._alpha.main_10",
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
            {dict.common.cancel || "Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventorySection;
