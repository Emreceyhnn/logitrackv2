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
import { useDictionary } from "@/app/lib/language/DictionaryContext";
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
  const dict = useDictionary();
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
      setError(dict.common.fillAllFields);
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
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : dict.vehicles.dialogs.failedToUploadDocument || "Failed to upload document";
      setError(errorMessage);
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
      borderRadius: 2,
      height: 48,
      "& fieldset": {
        borderColor: "divider",
      },
      "&:hover fieldset": {
        borderColor: "primary.main",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.85rem",
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "0.9rem",
    },
  };

  const DOCUMENT_TYPES = [
    {
      value: "REGISTRATION",
      label: dict.vehicles.docTypes.REGISTRATION,
      icon: <BadgeIcon sx={{ fontSize: 18 }} />,
    },
    {
      value: "INSURANCE",
      label: dict.vehicles.docTypes.INSURANCE,
      icon: <VerifiedUserIcon sx={{ fontSize: 18 }} />,
    },
    {
      value: "LICENSE",
      label: dict.vehicles.docTypes.LICENSE,
      icon: <LocalLibraryIcon sx={{ fontSize: 18 }} />,
    },
    {
      value: "INSPECTION",
      label: dict.vehicles.docTypes.INSPECTION,
      icon: <BadgeIcon sx={{ fontSize: 18 }} />,
    },
    {
      value: "MAINTENANCE",
      label: dict.vehicles.docTypes.MAINTENANCE,
      icon: <BuildIcon sx={{ fontSize: 18 }} />,
    },
    {
      value: "OTHER",
      label: dict.vehicles.docTypes.OTHER,
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
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={800} color="text.primary">
            {dict.vehicles.dialogs.uploadDocumentTitle}
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
          color="text.secondary"
          sx={{ mt: 0.5, display: "block", fontWeight: 500 }}
        >
          {dict.vehicles.dialogs.uploadDocumentDesc}
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
                bgcolor: (theme) => theme.palette.mode === "dark" ? "error._alpha.main_10" : "error._alpha.main_05",
                color: "error.light",
                border: (theme) => `1px solid ${theme.palette.error._alpha.main_20}`,
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
              {dict.vehicles.dialogs.configuration}
            </Typography>
            <Stack spacing={2.5}>
              <FormControl fullWidth sx={textFieldSx}>
                <InputLabel sx={{ color: "text.secondary" }}>{dict.common.docType}</InputLabel>
                <Select
                  value={type}
                  label={dict.common.docType}
                  onChange={(e) => setType(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundImage: "none",
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
                label={dict.vehicles.dialogs.docName}
                placeholder={dict.vehicles.dialogs.docNamePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={textFieldSx}
                InputLabelProps={{ shrink: true }}
              />

              <DatePicker
                label={dict.vehicles.dialogs.expiryDate}
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
              {dict.vehicles.dialogs.fileAttachment}
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
                borderColor: (theme) => theme.palette.mode === "dark" ? theme.palette.primary._alpha.main_30 : theme.palette.primary._alpha.main_40,
                bgcolor: (theme) => theme.palette.mode === "dark" ? theme.palette.primary._alpha.main_02 : "rgba(0,0,0,0.02)",
                flexDirection: "column",
                gap: 1,
                textTransform: "none",
                "&:hover": {
                  bgcolor: (theme) => theme.palette.mode === "dark" ? theme.palette.primary._alpha.main_05 : "rgba(0,0,0,0.04)",
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="body2" fontWeight={700} color="text.primary">
                  {file ? file.name : dict.vehicles.dialogs.selectOrDragFile}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {dict.vehicles.dialogs.fileFormats}
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
                {dict.vehicles.dialogs.preview}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 160,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  position: "relative",
                }}
              >
                <Box
                  component="img"
                  src={filePreview}
                  alt="File preview"
                  sx={{
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
          borderTop: `1px solid ${theme.palette.divider}`,
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
            {dict.common.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !file}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              boxShadow: `0 8px 24px ${theme.palette.primary._alpha.main_20}`,
              fontWeight: 700,
              minWidth: 140,
            }}
          >
            {loading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>{dict.common.uploading}</span>
              </Stack>
            ) : (
              dict.vehicles.dialogs.startUpload
            )}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
