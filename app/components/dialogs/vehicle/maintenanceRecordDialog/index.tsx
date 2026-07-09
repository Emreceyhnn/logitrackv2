import { Dialog, DialogContent, Button, Stack, Alert, CircularProgress, IconButton, Typography, Box, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useRef } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { addMaintenanceRecord } from "@/app/lib/controllers/vehicle";
import { useUserContext } from "@/app/lib/context/UserContext";
import dayjs, { Dayjs } from "dayjs";
import { MaintenanceStatus } from "@/app/lib/type/enums";
import { uploadImageAction } from "@/app/lib/actions/upload";
import { logger } from "@/app/lib/logger";

import MaintenanceFormConfiguration from "./sections/MaintenanceFormConfiguration";
import MaintenanceFormDetails from "./sections/MaintenanceFormDetails";

interface MaintenanceFormData {
  type: string;
  date: Dayjs;
  cost: string;
  status: MaintenanceStatus;
  description: string;
  documentUrl: string;
}

interface MaintenanceRecordDialogProps {
  open: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess: () => void;
}

interface ExtendedPalette {
  primary?: {
    _alpha?: Record<string, string>;
  };
  error?: {
    _alpha?: Record<string, string>;
  };
}

export default function MaintenanceRecordDialog({ open, onClose, vehicleId, onSuccess }: MaintenanceRecordDialogProps) {
  const dict = useDictionary();
  const { user } = useUserContext();
  const userCurrency = user?.currency || "USD";
  const theme = useTheme();
  const paletteTheme = theme.palette as unknown as ExtendedPalette;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<MaintenanceFormData>({ type: "", date: dayjs() as Dayjs, cost: "", status: MaintenanceStatus.SCHEDULED, description: "", documentUrl: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = await uploadImageAction(reader.result as string, "documents", `maintenance/${vehicleId}`);
          if (result.success) setFormData((prev) => ({ ...prev, documentUrl: result.url }));
        } catch (err) {
          logger.error("Upload error:", err);
          setError("Upload failed");
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      logger.error(err);
      setError("Failed to read file");
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.type || !formData.date || !formData.cost) {
      setError(dict.common.fillAllFields);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addMaintenanceRecord(vehicleId, { type: formData.type as import("@/app/lib/type/enums").MaintenanceType, date: formData.date.toDate(), cost: parseFloat(formData.cost), currency: userCurrency, status: formData.status, description: formData.description, documentUrl: formData.documentUrl });
      onSuccess();
      handleClose();
    } catch (err) {
      logger.error(err);
      setError(dict.vehicles.dialogs.failedToCreateRecord || "Failed to create maintenance record");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(prev => ({ ...prev, type: "", date: dayjs(), cost: "", status: MaintenanceStatus.SCHEDULED, description: "", documentUrl: "" }));
    setError(null);
    onClose();
  };

  const textFieldSx = { "& .MuiOutlinedInput-root": { borderRadius: 2, height: 48, "& fieldset": { borderColor: "divider" }, "&:hover fieldset": { borderColor: "primary.main" } }, "& .MuiInputLabel-root": { fontSize: "0.85rem" }, "& .MuiOutlinedInput-input": { fontSize: "0.9rem" } };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { overflow: "hidden" } }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography component="div" variant="h6" fontWeight={800} color="text.primary">{dict.vehicles.dialogs.addMaintenanceRecord}</Typography>
          <IconButton onClick={handleClose} size="small" sx={{ color: "text.secondary" }} aria-label="close"><CloseIcon fontSize="small" /></IconButton>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontWeight: 500 }}>{dict.vehicles.dialogs.addMaintenanceDesc || "Log service and maintenance events for this vehicle."}</Typography>
      </Box>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Stack spacing={4} mt={1}>
          {error && <Alert severity="error" variant="filled" sx={{ borderRadius: 2, bgcolor: theme.palette.mode === "dark" ? paletteTheme.error?._alpha?.main_10 : paletteTheme.error?._alpha?.main_05, color: "error.light", border: `1px solid ${paletteTheme.error?._alpha?.main_20}` }}>{error}</Alert>}
          <MaintenanceFormConfiguration dict={dict} userCurrency={userCurrency} formData={formData} setFormData={setFormData} textFieldSx={textFieldSx} />
          <MaintenanceFormDetails dict={dict} formData={formData} setFormData={setFormData} textFieldSx={textFieldSx} uploading={uploading} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
        </Stack>
      </DialogContent>

      <Box sx={{ p: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={handleClose} disabled={loading} sx={{ color: "text.secondary", textTransform: "none", fontWeight: 600 }}>{dict.common.cancel}</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ textTransform: "none", borderRadius: 2, px: 4, boxShadow: `0 8px 24px ${paletteTheme.primary?._alpha?.main_20}`, fontWeight: 700, minWidth: 140 }}>
            {loading ? <Stack direction="row" spacing={1} alignItems="center"><CircularProgress size={16} color="inherit" /><span>{dict.common.saving}</span></Stack> : dict.vehicles.dialogs.saveRecord}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
