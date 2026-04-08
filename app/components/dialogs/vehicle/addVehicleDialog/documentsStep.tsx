"use client";

import { ChangeEvent, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  alpha,
  useTheme,
  InputAdornment,
  Switch,
  IconButton,
  Chip,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/language/language";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SecurityIcon from "@mui/icons-material/Security";
import BuildIcon from "@mui/icons-material/Build";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BadgeIcon from "@mui/icons-material/Badge";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormikContext } from "formik";
import { VehicleFormValues } from "@/app/lib/type/vehicle";

const DocumentsStep = () => {
  /* -------------------------------- variables ------------------------------- */
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const dict = useMemo(() => getDictionary(lang), [lang]);
  
  const theme = useTheme();
  const { values, setFieldValue } = useFormikContext<VehicleFormValues>();

  const DOCUMENT_TYPES = useMemo(() => [
    { value: "REGISTRATION", label: "Registration", icon: <BadgeIcon />, required: true },
    { value: "INSURANCE", label: "Insurance", icon: <VerifiedUserIcon />, required: true },
    { value: "LICENSE", label: "License/Permit", icon: <LocalLibraryIcon /> },
    { value: "INSPECTION", label: "Inspection", icon: <SecurityIcon />, required: true },
    { value: "MAINTENANCE", label: "Maintenance", icon: <BuildIcon /> },
    { value: "OTHER", label: "Other", icon: <AssignmentIcon /> },
  ], []);

  /* --------------------------------- styles --------------------------------- */
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
      display: "none",
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
      fontSize: "0.9rem",
      "&::placeholder": {
        color: alpha("#fff", 0.3),
        opacity: 1,
      },
    },
  };

  const labelSx = {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "text.secondary",
    mb: 1,
    display: "block",
  };

  /* -------------------------------- handlers -------------------------------- */
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: "OTHER",
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + " MB",
        uploadedAt: new Date().toLocaleDateString(),
        file: file,
      }));
      setFieldValue("documents", [...values.documents, ...newFiles]);
    }
  };

  const updateFileType = (id: string, type: string) => {
    setFieldValue(
      "documents",
      values.documents.map((d) => (d.id === id ? { ...d, type } : d))
    );
  };

  const removeFile = (id: string) => {
    setFieldValue(
      "documents",
      values.documents.filter((d) => d.id !== id)
    );
  };

  return (
    <Box sx={{ display: "flex", gap: 6, minHeight: 400 }}>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{ color: "white", mb: 3, fontWeight: 600 }}
        >
          Compliance Dates
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Typography sx={labelSx}>Registration Expiry Date</Typography>
            <DatePicker
              value={values.registrationExpiry}
              onChange={(val) => setFieldValue("registrationExpiry", val)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: textFieldSx,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>Inspection Expiry Date</Typography>
            <DatePicker
              value={values.inspectionExpiry}
              onChange={(val) => setFieldValue("inspectionExpiry", val)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: textFieldSx,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </Box>

          <Box
            sx={{
              p: 2,
              mt: 2,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: alpha(theme.palette.divider, 0.02),
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Switch
              checked={values.enableExpiryAlerts}
              onChange={(e) =>
                setFieldValue("enableExpiryAlerts", e.target.checked)
              }
              color="primary"
              size="small"
              sx={{ mt: 0.5 }}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "white", fontWeight: 600 }}
              >
                Enable Expiry Alerts
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mt: 0.5 }}
              >
                Notify fleet managers 30 days before documents expire.
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ flex: 1.2 }}>
        <Typography
          variant="h6"
          sx={{ color: "white", mb: 3, fontWeight: 600 }}
        >
          {dict.common.documents}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", mb: 1.5, display: "block", fontWeight: 700, textTransform: "uppercase" }}>
            Required Documents
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {DOCUMENT_TYPES.filter(t => t.required).map(t => {
              const isUploaded = values.documents.some((d) => d.type === t.value);
              return (
                <Chip
                  key={t.value}
                  label={t.label}
                  size="small"
                  icon={isUploaded ? <CheckCircleIcon sx={{ fontSize: '14px !important' }} /> : undefined}
                  sx={{
                    bgcolor: isUploaded ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                    color: isUploaded ? theme.palette.success.light : theme.palette.error.light,
                    border: `1px solid ${isUploaded ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2)}`,
                    fontWeight: 600,
                    px: 0.5,
                  }}
                />
              );
            })}
          </Stack>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.divider, 0.02),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: "white", mb: 2, fontWeight: 600 }}
          >
            Upload Files
          </Typography>

          <Box
            component="label"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              borderRadius: 2,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <input type="file" hidden multiple onChange={handleFileUpload} />
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "white", fontWeight: 600, mb: 0.5 }}
            >
              <span style={{ color: theme.palette.primary.main }}>
                {dict.landing.hero.discover}
              </span>{" "}
              or drag and drop
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              DOCX, JPG or PNG (MAX. 10MB)
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ mt: 3 }}>
            {values.documents.map((doc) => {
              const typeInfo =
                DOCUMENT_TYPES.find((t) => t.value === doc.type) ||
                DOCUMENT_TYPES[5];
              return (
                <Box
                  key={doc.id}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: alpha("#1A202C", 0.6),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      bgcolor: alpha("#1A202C", 0.8),
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 1.2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {typeInfo.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {doc.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {doc.size} • {doc.uploadedAt}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => removeFile(doc.id)}
                      sx={{
                        color: alpha("#fff", 0.3),
                        "&:hover": {
                          color: theme.palette.error.main,
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={doc.type}
                        onChange={(e) => updateFileType(doc.id, e.target.value)}
                        sx={{
                          height: 36,
                          borderRadius: 1.5,
                          bgcolor: alpha(theme.palette.common.black, 0.2),
                          color: "white",
                          fontSize: "0.8rem",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.divider, 0.1),
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                          },
                        }}
                      >
                        {DOCUMENT_TYPES.map((type) => (
                          <MenuItem
                            key={type.value}
                            value={type.value}
                            sx={{ fontSize: "0.85rem" }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Box sx={{ display: "flex", opacity: 0.8 }}>
                                {type.icon}
                              </Box>
                              <span>{type.label}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default DocumentsStep;
