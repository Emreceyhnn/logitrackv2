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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import { updateInventoryItem } from "@/app/lib/controllers/inventory";
import { useUser } from "@/app/lib/hooks/useUser";
import { InventoryWithRelations } from "@/app/lib/type/inventory";

interface EditInventoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  item: InventoryWithRelations | null;
}

const EditInventoryDialog = ({
  open,
  onClose,
  onSuccess,
  item,
}: EditInventoryDialogProps) => {
  const theme = useTheme();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    minStock: 0,
    quantity: 0,
  });

  useEffect(() => {
    if (item && open) {
      setFormData({
        name: item.name || "",
        sku: item.sku || "",
        minStock: item.minStock || 0,
        quantity: item.quantity || 0,
      });
    }
  }, [item, open]);

  const handleUpdate = async () => {
    if (!user || !item) return;
    try {
      await updateInventoryItem(item.id, user.id, {
        name: formData.name,
        sku: formData.sku,
        minStock: Number(formData.minStock),
        quantity: Number(formData.quantity),
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
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
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              p: 1,
              borderRadius: 2,
              display: "flex",
            }}
          >
            <EditIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Edit Inventory Item
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item?.sku}
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
            label="Product Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            label="SKU"
            fullWidth
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Quantity (On Hand)"
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
            <Button variant="contained" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditInventoryDialog;
