"use client";

import { ChangeEvent } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
  alpha,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloseIcon from "@mui/icons-material/Close";
import TagIcon from "@mui/icons-material/Tag";
import PinIcon from "@mui/icons-material/Pin";
import { FirstStepProps } from "@/app/lib/type/vehicle";
import { VehicleType } from "@prisma/client";

const FirstStep = ({ state, actions, onFileSelect }: FirstStepProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const data = state.data.step1;

  /* --------------------------------- styles --------------------------------- */
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: alpha("#1A202C", 0.5),
      borderRadius: 2,
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
      color: "text.secondary",
      fontSize: "0.85rem",
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
  };

  /* -------------------------------- handlers -------------------------------- */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onFileSelect?.(file);
  };

  const handleRemove = () => {
    actions.updateStep1({ photo: undefined });
  };

  const photoPreview = data.photo instanceof File 
    ? URL.createObjectURL(data.photo) 
    : data.photo;

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 4 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Vehicle Photo
        </Typography>
        <Box
          sx={(theme) => ({
            width: "100%",
            aspectRatio: "1/1",
            border: `2px dashed ${alpha(theme.palette.divider, photoPreview ? 0 : 0.1)}`,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: photoPreview ? "default" : "pointer",
            transition: "all 0.2s",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              borderColor: photoPreview ? "none" : alpha(theme.palette.primary.main, 0.3),
              bgcolor: photoPreview ? "none" : alpha(theme.palette.primary.main, 0.02),
            },
          })}
        >
          {photoPreview ? (
            <>
              <Box
                component="img"
                src={photoPreview}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <IconButton
                size="small"
                onClick={handleRemove}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: alpha(theme.palette.error.main, 0.8),
                  color: "white",
                  "&:hover": {
                    bgcolor: theme.palette.error.main,
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Box
              component="label"
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="file"
                hidden
                accept="image/svg+xml,image/png,image/jpeg,image/gif"
                onChange={handleChange}
              />

              <Box
                sx={(theme) => ({
                  p: 2,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mb: 1.5,
                })}
              >
                <AddAPhotoIcon fontSize="large" />
              </Box>

              <Typography variant="body2" fontWeight={500} color="white">
                Click to upload
              </Typography>
              <Typography variant="caption" color="text.secondary">
                SVG, PNG, JPG or GIF
              </Typography>
            </Box>
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.divider, 0.1),
              overflow: "hidden",
              border: photoPreview 
                ? `2px solid ${theme.palette.primary.main}` 
                : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            {photoPreview ? (
              <Box
                component="img"
                src={photoPreview}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                }}
              >
                <AddAPhotoIcon fontSize="small" />
              </Box>
            )}
          </Box>
        </Stack>
      </Stack>

      <Stack spacing={3}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Fleet Number (Optional)"
            placeholder="e.g. V-001 (Leave blank to auto-generate)"
            value={data.fleetNo}
            onChange={(e) => actions.updateStep1({ fleetNo: e.target.value })}
            sx={textFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TagIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="License Plate"
            placeholder="ABC-1234"
            value={data.plate}
            onChange={(e) => actions.updateStep1({ plate: e.target.value })}
            sx={textFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PinIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <TextField
          fullWidth
          select
          label="Vehicle Type"
          value={data.type}
          onChange={(e) =>
            actions.updateStep1({ type: e.target.value as VehicleType })
          }
          sx={textFieldSx}
        >
          <MenuItem value="TRUCK">Heavy Duty Truck</MenuItem>
          <MenuItem value="VAN">Light Delivery Van</MenuItem>
        </TextField>

        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Make / Brand"
            placeholder="e.g. Volvo"
            value={data.brand}
            onChange={(e) => actions.updateStep1({ brand: e.target.value })}
            sx={textFieldSx}
          />
          <TextField
            fullWidth
            label="Model"
            placeholder="e.g. FH16"
            value={data.model}
            onChange={(e) => actions.updateStep1({ model: e.target.value })}
            sx={textFieldSx}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Manufacturing Year"
            type="number"
            placeholder="e.g. 2023"
            value={data.year}
            onChange={(e) =>
              actions.updateStep1({ year: Number(e.target.value) })
            }
            sx={textFieldSx}
          />
          <TextField
            fullWidth
            label="Next Service Interval"
            type="number"
            placeholder="e.g. 50000"
            value={data.nextServiceKm}
            onChange={(e) =>
              actions.updateStep1({ nextServiceKm: Number(e.target.value) })
            }
            sx={textFieldSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" color="text.secondary">
                    km
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <TextField
          fullWidth
          label="Current Odometer Reading"
          type="number"
          value={data.odometerKm}
          onChange={(e) =>
            actions.updateStep1({ odometerKm: Number(e.target.value) })
          }
          sx={textFieldSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="body2" color="text.secondary">
                  km
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  );
};

export default FirstStep;
