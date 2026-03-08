"use client";

import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import { updateShipment } from "@/app/lib/controllers/shipments";
import { useUser } from "@/app/lib/hooks/useUser";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";

interface EditShipmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  shipment: ShipmentWithRelations | null;
}

const EditShipmentDialog = ({
  open,
  onClose,
  onSuccess,
  shipment,
}: EditShipmentDialogProps) => {
  const theme = useTheme();
  const { user } = useUser();

  const [status, setStatus] = useState<string>("PENDING");
  const [itemsCount, setItemsCount] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shipment && open) {
      setStatus(shipment.status || "PENDING");
      setItemsCount(shipment.itemsCount || 1);
      setError(null);
    }
  }, [shipment, open]);

  const handleUpdate = async () => {
    if (!user || !shipment) return;
    setLoading(true);
    setError(null);
    try {
      await updateShipment(shipment.id, user.id, {
        status,
        itemsCount: Number(itemsCount),
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update shipment";
      setError(message);
      console.error(err);
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
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.main,
              p: 1,
              borderRadius: 2,
              display: "flex",
            }}
          >
            <EditIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Edit Shipment
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {shipment?.trackingId}
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
          {error && (
            <Typography variant="caption" color="error" fontWeight={600}>
              {error}
            </Typography>
          )}

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
              <MenuItem value="DELAYED">Delayed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Items Count"
            type="number"
            fullWidth
            value={itemsCount}
            onChange={(e) => setItemsCount(Number(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }}
          />

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
          >
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditShipmentDialog;
