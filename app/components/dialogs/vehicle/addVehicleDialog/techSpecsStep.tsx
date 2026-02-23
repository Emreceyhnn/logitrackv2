"use client";

import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
  alpha,
  useTheme,
  InputAdornment,
} from "@mui/material";
import ScaleIcon from "@mui/icons-material/Scale";
import ShutterSpeedIcon from "@mui/icons-material/ShutterSpeed";
import OpacityIcon from "@mui/icons-material/Opacity";
import SettingsIcon from "@mui/icons-material/Settings";
import TuneIcon from "@mui/icons-material/Tune";
import { TechSpecsStepProps } from "@/app/lib/type/vehicle";

const TechSpecsStep = ({ state, actions }: TechSpecsStepProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const data = state.data.step2;

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack direction="row" spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1}
          >
            Max Load Capacity
          </Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="0"
            value={data.maxLoadKg}
            onChange={(e) =>
              actions.updateStep2({ maxLoadKg: Number(e.target.value) })
            }
            sx={textFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ScaleIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" color="text.secondary">
                    kg
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1}
          >
            Fuel Type
          </Typography>
          <TextField
            fullWidth
            select
            value={data.fuelType}
            onChange={(e) => actions.updateStep2({ fuelType: e.target.value })}
            placeholder="Select fuel type"
            sx={textFieldSx}
          >
            <MenuItem value="">Select fuel type</MenuItem>
            <MenuItem value="DIESEL">Diesel</MenuItem>
            <MenuItem value="GASOLINE">Gasoline</MenuItem>
            <MenuItem value="ELECTRIC">Electric</MenuItem>
            <MenuItem value="HYBRID">Hybrid</MenuItem>
          </TextField>
        </Box>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1}
          >
            Current Fuel Level
          </Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="50"
            value={data.fuelLevel}
            onChange={(e) =>
              actions.updateStep2({ fuelLevel: Number(e.target.value) })
            }
            sx={textFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ShutterSpeedIcon
                    sx={{ fontSize: 20, color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" color="text.secondary">
                    %
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1}
          >
            Avg. Fuel Consumption
          </Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="e.g. 12.5"
            value={data.avgFuelConsumption}
            onChange={(e) =>
              actions.updateStep2({
                avgFuelConsumption: Number(e.target.value),
              })
            }
            sx={textFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <OpacityIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2" color="text.secondary">
                    L/100km
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1}
          >
            Engine Size
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. 4.0L V8"
            value={data.engineSize}
            onChange={(e) =>
              actions.updateStep2({ engineSize: e.target.value })
            }
            sx={textFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SettingsIcon
                    sx={{ fontSize: 20, color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            mb={1}
          >
            Transmission
          </Typography>
          <TextField
            fullWidth
            select
            value={data.transmission}
            onChange={(e) =>
              actions.updateStep2({ transmission: e.target.value })
            }
            sx={textFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TuneIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">Select transmission</MenuItem>
            <MenuItem value="AUTOMATIC">Automatic</MenuItem>
            <MenuItem value="MANUAL">Manual</MenuItem>
            <MenuItem value="AMULTI">Semi-Automatic</MenuItem>
          </TextField>
        </Box>
      </Stack>

      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          mb={1}
        >
          Additional Technical Notes
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Any specific technical details or modifications..."
          value={data.techNotes}
          onChange={(e) => actions.updateStep2({ techNotes: e.target.value })}
          sx={{
            ...textFieldSx,
            "& .MuiOutlinedInput-root": {
              ...textFieldSx["& .MuiOutlinedInput-root"],
              padding: "12px",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default TechSpecsStep;
