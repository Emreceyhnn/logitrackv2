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

interface FormData {
  vehicleId: string;
  driverId: string;
  volumeLiter: string;
  cost: string;
  odometerKm: string;
  fuelType: string;
  location: string;
  date: string;
}

const initialForm: FormData = {
  vehicleId: "",
  driverId: "",
  volumeLiter: "",
  cost: "",
  odometerKm: "",
  fuelType: "DIESEL",
  location: "",
  date: new Date().toISOString().split("T")[0],
};

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
  const [formData, setFormData] = useState<FormData>(initialForm);

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

  const updateForm = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setFormData(initialForm);
      setReceiptPreview(null);
    }, 300);
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
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        volumeLiter: parseFloat(formData.volumeLiter) || 0,
        cost: parseFloat(formData.cost) || 0,
        odometerKm: parseInt(formData.odometerKm) || 0,
        fuelType: formData.fuelType,
        location: formData.location || undefined,
        date: new Date(formData.date),
        receiptUrl: receiptUrl || undefined,
      });

      toast.success("Fuel log created successfully");
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to create fuel log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          <Typography variant="h6" fontWeight={700} color="white">
            Log Fuel Purchase
          </Typography>
          <IconButton
            onClick={handleClose}
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
              onChange={(e) => updateForm({ vehicleId: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha("#1A202C", 0.5),
                  borderRadius: 1.5,
                },
              }}
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
              onChange={(e) => updateForm({ driverId: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha("#1A202C", 0.5),
                  borderRadius: 1.5,
                },
              }}
            >
              {drivers.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.user?.name} {d.user?.surname}
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
              onChange={(e) => updateForm({ volumeLiter: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha("#1A202C", 0.5),
                  borderRadius: 1.5,
                },
              }}
            />
            <TextField
              fullWidth
              label="Total Cost ($)"
              type="number"
              value={formData.cost}
              onChange={(e) => updateForm({ cost: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha("#1A202C", 0.5),
                  borderRadius: 1.5,
                },
              }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Odometer (KM)"
              type="number"
              value={formData.odometerKm}
              onChange={(e) => updateForm({ odometerKm: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha("#1A202C", 0.5),
                  borderRadius: 1.5,
                },
              }}
            />
            <TextField
              select
              fullWidth
              label="Fuel Type"
              value={formData.fuelType}
              onChange={(e) => updateForm({ fuelType: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha("#1A202C", 0.5),
                  borderRadius: 1.5,
                },
              }}
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
            onChange={(e) => updateForm({ location: e.target.value })}
            placeholder="Shell, Station #123, etc."
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: alpha("#1A202C", 0.5),
                borderRadius: 1.5,
              },
            }}
          />

          <TextField
            fullWidth
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => updateForm({ date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: alpha("#1A202C", 0.5),
                borderRadius: 1.5,
              },
            }}
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
        <Button onClick={handleClose} sx={{ color: "text.secondary" }}>
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
          sx={{
            borderRadius: 2,
            minWidth: 120,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
        >
          {loading ? "Saving..." : "Save Log"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFuelLogDialog;
