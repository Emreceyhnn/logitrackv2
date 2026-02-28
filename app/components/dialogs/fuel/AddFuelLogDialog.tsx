"use client";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  useTheme,
  alpha,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { AddFuelLogDialogProps } from "@/app/lib/type/fuel";
import { getVehicles } from "@/app/lib/controllers/vehicle";
import { getDrivers } from "@/app/lib/controllers/driver";
import { createFuelLog } from "@/app/lib/controllers/fuel";
import { useUser } from "@/app/lib/hooks/useUser";
import { toast } from "sonner";

import { uploadImageAction } from "@/app/lib/actions/upload";

const FUEL_TYPES = ["DIESEL", "GASOLINE", "ELECTRIC_KWH", "ADBLUE"];

const AddFuelLogDialog = ({
  open,
  onClose,
  onSuccess,
}: AddFuelLogDialogProps) => {
  const theme = useTheme();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    volumeLiter: "",
    cost: "",
    odometerKm: "",
    fuelType: "DIESEL",
    location: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (open && user) {
      const fetchData = async () => {
        try {
          const [vRes, dRes] = await Promise.all([
            getVehicles({ status: ["AVAILABLE", "IDLE"] }),
            getDrivers(1, 100),
          ]);
          setVehicles(vRes || []);
          setDrivers(dRes.data || []);
        } catch (error) {
          console.error("Failed to fetch vehicles/drivers", error);
        }
      };
      fetchData();
    }
  }, [open, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let receiptUrl = "";
      if (receiptPreview) {
        const uploadResult = await uploadImageAction(
          receiptPreview,
          "receipts"
        );
        receiptUrl = uploadResult.url;
      }

      await createFuelLog({
        ...formData,
        volumeLiter: parseFloat(formData.volumeLiter),
        cost: parseFloat(formData.cost),
        odometerKm: parseInt(formData.odometerKm),
        companyId: user.companyId!,
        date: new Date(formData.date),
        receiptUrl,
      });
      toast.success("Fuel log created successfully");
      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        vehicleId: "",
        driverId: "",
        volumeLiter: "",
        cost: "",
        odometerKm: "",
        fuelType: "DIESEL",
        location: "",
        date: new Date().toISOString().split("T")[0],
      });
      setReceiptPreview(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to create fuel log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "#0B1019",
          backgroundImage: "none",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={700}>
            Log Fuel Purchase
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3} mt={1}>
          <Stack direction="row" spacing={2}>
            <TextField
              select
              fullWidth
              label="Vehicle"
              value={formData.vehicleId}
              onChange={(e) =>
                setFormData({ ...formData, vehicleId: e.target.value })
              }
            >
              {vehicles.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.plate} - {v.brand}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Driver"
              value={formData.driverId}
              onChange={(e) =>
                setFormData({ ...formData, driverId: e.target.value })
              }
            >
              {drivers.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.user.name} {d.user.surname}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Volume (L)"
              type="number"
              value={formData.volumeLiter}
              onChange={(e) =>
                setFormData({ ...formData, volumeLiter: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Total Cost ($)"
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Odometer (KM)"
              type="number"
              value={formData.odometerKm}
              onChange={(e) =>
                setFormData({ ...formData, odometerKm: e.target.value })
              }
            />
            <TextField
              select
              fullWidth
              label="Fuel Type"
              value={formData.fuelType}
              onChange={(e) =>
                setFormData({ ...formData, fuelType: e.target.value })
              }
            >
              {FUEL_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField
            fullWidth
            label="Location / Station"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Shell, Station #123, etc."
          />

          <TextField
            fullWidth
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Fuel Receipt (Optional)
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                component="label"
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: alpha(theme.palette.divider, 0.2),
                  color: "white",
                  px: 3,
                }}
              >
                {receiptPreview ? "Change Receipt" : "Upload Receipt"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {receiptPreview && (
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    overflow: "hidden",
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  }}
                >
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            !formData.vehicleId ||
            !formData.driverId ||
            !formData.volumeLiter ||
            !formData.cost
          }
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
          sx={{ borderRadius: 2, minWidth: 120, textTransform: "none" }}
        >
          {loading ? "Saving..." : "Save Log"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFuelLogDialog;
