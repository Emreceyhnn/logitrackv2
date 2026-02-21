"use client";

import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { createInventoryItem } from "@/app/lib/controllers/inventory";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { useUser } from "@/app/lib/hooks/useUser";
import { toast } from "sonner";

interface AddInventoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface WarehouseOption {
  id: string;
  name: string;
  code: string;
}

export default function AddInventoryDialog({
  open,
  onClose,
  onSuccess,
}: AddInventoryDialogProps) {
  const theme = useTheme();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: 0,
    minStock: 0,
    warehouseId: "",
  });
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Fetch warehouses for the dropdown
      const COMPANY_ID = "cmlgt985b0003x0cuhtyxoihd";
      const USER_ID = "usr_001";
      getWarehouses(COMPANY_ID, USER_ID)
        .then((data: any) => {
          setWarehouses(
            data.map((w: any) => ({ id: w.id, name: w.name, code: w.code }))
          );
        })
        .catch(console.error);

      // Reset form
      setFormData({
        name: "",
        sku: "",
        quantity: 0,
        minStock: 0,
        warehouseId: "",
      });
    }
  }, [open]);

  const handleCreate = async () => {
    if (!user) return;
    if (!formData.name || !formData.sku || !formData.warehouseId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const COMPANY_ID = "cmlgt985b0003x0cuhtyxoihd";
      await createInventoryItem(
        user.id,
        COMPANY_ID,
        formData.warehouseId,
        formData.sku,
        formData.name,
        Number(formData.quantity),
        Number(formData.minStock)
      );
      toast.success("Inventory item created successfully");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create inventory item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          p: 3,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              p: 1,
              borderRadius: 2,
              display: "flex",
            }}
          >
            <AddIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Add Inventory Item
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Create a new item in your inventory
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <TextField
            select
            label="Warehouse *"
            fullWidth
            value={formData.warehouseId}
            onChange={(e) =>
              setFormData({ ...formData, warehouseId: e.target.value })
            }
          >
            {warehouses.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name} ({w.code})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Product Name *"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            label="SKU *"
            fullWidth
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
            />
            <TextField
              label="Min Stock Level"
              type="number"
              fullWidth
              value={formData.minStock}
              onChange={(e) =>
                setFormData({ ...formData, minStock: Number(e.target.value) })
              }
            />
          </Stack>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Item"}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
