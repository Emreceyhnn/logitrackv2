import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  alpha,
} from "@mui/material";
import { useState } from "react";
import { uploadVehicleDocument } from "@/app/lib/controllers/vehicle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadImageAction } from "@/app/lib/actions/upload";

interface UploadDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess: () => void;
}

export default function UploadDocumentDialog({
  open,
  onClose,
  vehicleId,
  onSuccess,
}: UploadDocumentDialogProps) {
  /* --------------------------------- states --------------------------------- */
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState<Dayjs | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------- handlers -------------------------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name);
      }

      // Generate preview
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!type || !name || !file) {
      setError("Please fill in all required fields and select a file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 2. Upload to Cloudinary
      const uploadResult = await uploadImageAction(
        base64,
        `vehicles/${vehicleId}`
      );

      // 3. Save to DB
      await uploadVehicleDocument(vehicleId, {
        type,
        name,
        url: uploadResult.url,
        expiryDate: expiryDate?.toDate(),
        status: "ACTIVE",
      });

      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setType("");
    setName("");
    setExpiryDate(null);
    setFile(null);
    setFilePreview(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload Document</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3} mt={1}>
            {error && <Alert severity="error">{error}</Alert>}

            <FormControl fullWidth>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={type}
                label="Document Type"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="LICENSE">License</MenuItem>
                <MenuItem value="INSURANCE">Insurance</MenuItem>
                <MenuItem value="PERMIT">Permit</MenuItem>
                <MenuItem value="REGISTRATION">Registration</MenuItem>
                <MenuItem value="INSPECTION">Inspection</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Document Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <DatePicker
              label="Expiry Date"
              value={expiryDate}
              onChange={(newValue) => setExpiryDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />

            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                height: 56,
                borderStyle: "dashed",
                justifyContent: "flex-start",
                paddingLeft: 2,
              }}
            >
              {file ? file.name : "Select File"}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </Button>

            {filePreview && (
              <Box
                sx={{
                  mt: 2,
                  width: "100%",
                  height: 200,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: `1px solid ${alpha("#fff", 0.1)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha("#fff", 0.02),
                }}
              >
                <img
                  src={filePreview}
                  alt="File preview"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </Stack>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !file}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
