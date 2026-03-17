import {
  Box,
  Dialog,
  DialogContent,
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
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BadgeIcon from "@mui/icons-material/Badge";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BuildIcon from "@mui/icons-material/Build";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import { uploadVehicleDocument } from "@/app/lib/controllers/vehicle";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
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

      // 2. Upload to Supabase (using 'documents' bucket)
      const uploadResult = await uploadImageAction(
        base64, 
        "documents", 
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

  /* ---------------------------------- styles --------------------------------- */
  const theme = useTheme();

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: alpha("#1A202C", 0.5),
      borderRadius: 2,
      height: 48,
      "& fieldset": {
        borderColor: alpha(theme.palette.divider, 0.1),
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.3),
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.85rem",
      color: "text.secondary",
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
      fontSize: "0.9rem",
    },
  };

  const DOCUMENT_TYPES = [
    {
      value: "REGISTRATION",
      label: "Registration",
      icon: <BadgeIcon sx={{ fontSize: 18 }} />,
    },
    {
      value: "INSURANCE",
      label: "Insurance",
      icon: <VerifiedUserIcon sx={{ fontSize: 18 }} />,
    },
    {
      value: "LICENSE",
      label: "License/Permit",
      icon: <LocalLibraryIcon sx={{ fontSize: 18 }} />,
    },
    {
      value: "INSPECTION",
      label: "Inspection",
      icon: <BadgeIcon sx={{ fontSize: 18 }} />,
    },
    {
      value: "MAINTENANCE",
      label: "Maintenance",
      icon: <BuildIcon sx={{ fontSize: 18 }} />,
    },
    {
      value: "OTHER",
      label: "Other",
      icon: <AssignmentIcon sx={{ fontSize: 18 }} />,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#0B1019",
          backgroundImage: "none",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={700} color="white">
            Upload Document
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography
          variant="caption"
          sx={{ color: alpha("#fff", 0.4), mt: 0.5, display: "block" }}
        >
          Add new compliance or service records to this vehicle.
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Stack spacing={3} mt={1}>
          {error && (
            <Alert
              severity="error"
              variant="filled"
              sx={{
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.light,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              }}
            >
              {error}
            </Alert>
          )}

          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                mb: 1,
                display: "block",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Configuration
            </Typography>
            <Stack spacing={2.5}>
              <FormControl fullWidth sx={textFieldSx}>
                <InputLabel sx={{ color: alpha("#fff", 0.4) }}>
                  Document Type
                </InputLabel>
                <Select
                  value={type}
                  label="Document Type"
                  onChange={(e) => setType(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#1A202C",
                        backgroundImage: "none",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        mt: 1,
                      },
                    },
                  }}
                >
                  {DOCUMENT_TYPES.map((dt) => (
                    <MenuItem
                      key={dt.value}
                      value={dt.value}
                      sx={{ py: 1.5 }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            color: theme.palette.primary.main,
                            display: "flex",
                          }}
                        >
                          {dt.icon}
                        </Box>
                        <Typography variant="body2">{dt.label}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Document Name"
                placeholder="e.g. Q1 Maintenance Receipt"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={textFieldSx}
                InputLabelProps={{ shrink: true }}
              />

              <DatePicker
                label="Expiry Date"
                value={expiryDate}
                onChange={(newValue) => setExpiryDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: textFieldSx,
                    InputLabelProps: { shrink: true },
                  },
                }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                mb: 1.5,
                display: "block",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              File Attachment
            </Typography>
            <Button
              component="label"
              fullWidth
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                height: 100,
                borderRadius: 3,
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                flexDirection: "column",
                gap: 1,
                textTransform: "none",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="body2" fontWeight={600} color="white">
                  {file ? file.name : "Select or drag file"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  JPG or PNG (Max. 10MB)
                </Typography>
              </Stack>
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
              />
            </Button>
          </Box>

          {filePreview && (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 700,
                  mb: 1,
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Preview
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 160,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(theme.palette.common.black, 0.2),
                  position: "relative",
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
            </Box>
          )}
        </Stack>
      </DialogContent>

      <Box
        sx={{
          p: 3,
          pt: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !file}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
              fontWeight: 700,
              minWidth: 140,
            }}
          >
            {loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>Uploading...</span>
              </Stack>
            ) : (
              "Start Upload"
            )}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
