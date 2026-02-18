import {
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
} from "@mui/material";
import { useState } from "react";
import { uploadVehicleDocument } from "@/app/lib/controllers/vehicle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
      const fakeUrl = `https://storage.example.com/vehicles/${vehicleId}/${file.name}`;

      await uploadVehicleDocument(vehicleId, {
        type,
        name,
        url: fakeUrl,
        expiryDate: expiryDate?.toDate(),
        status: "ACTIVE",
      });

      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setType("");
    setName("");
    setExpiryDate(null);
    setFile(null);
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
