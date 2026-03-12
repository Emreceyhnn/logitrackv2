"use client";

import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import {
  EditWarehouseCapacity,
  EditWarehousePageActions,
} from "@/app/lib/type/edit-warehouse";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import GavelIcon from "@mui/icons-material/Gavel";
import SecurityIcon from "@mui/icons-material/Security";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";

interface CapacitySectionProps {
  state: EditWarehouseCapacity;
  actions: EditWarehousePageActions;
}

const SPECIFICATIONS = [
  { label: "Cold Storage", icon: <AcUnitIcon fontSize="small" /> },
  { label: "Hazardous Materials", icon: <WarningAmberIcon fontSize="small" /> },
  { label: "Bonded Warehouse", icon: <GavelIcon fontSize="small" /> },
  { label: "Cross-Docking", icon: <LocalShippingIcon fontSize="small" /> },
  { label: "High Security", icon: <SecurityIcon fontSize="small" /> },
  { label: "Lashing/Loading", icon: <InventoryIcon fontSize="small" /> },
];

const CapacitySection = ({ state, actions }: CapacitySectionProps) => {
  const theme = useTheme();

  const toggleSpec = (spec: string) => {
    const newSpecs = state.specifications.includes(spec)
      ? state.specifications.filter((s) => s !== spec)
      : [...state.specifications, spec];
    actions.updateCapacity({ specifications: newSpecs });
  };

  return (
    <Box>
      <Stack spacing={4}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main,
              boxShadow: `0 0 10px ${theme.palette.primary.main}`,
            }}
          />
          <Typography variant="subtitle1" fontWeight={700} color="white">
            Operational Capacity
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                TOTAL PALLET POSITIONS
              </Typography>
              <CustomTextArea
                name="capacityPallets"
                type="number"
                placeholder="e.g. 5000"
                value={state.capacityPallets.toString()}
                onChange={(e) =>
                  actions.updateCapacity({
                    capacityPallets: parseInt(e.target.value) || 0,
                  })
                }
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                CARGO VOLUME (M3)
              </Typography>
              <CustomTextArea
                name="capacityVolumeM3"
                type="number"
                placeholder="e.g. 100000"
                value={state.capacityVolumeM3.toString()}
                onChange={(e) =>
                  actions.updateCapacity({
                    capacityVolumeM3: parseInt(e.target.value) || 0,
                  })
                }
              />
            </Stack>
          </Grid>
        </Grid>

        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: theme.palette.primary.main,
              }}
            />
            <Typography variant="subtitle1" fontWeight={700} color="white">
              Facility Specifications
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {SPECIFICATIONS.map((spec) => {
              const isActive = state.specifications.includes(spec.label);
              return (
                <Grid size={{ xs: 6, sm: 4 }} key={spec.label}>
                  <Button
                    fullWidth
                    onClick={() => toggleSpec(spec.label)}
                    sx={{
                      height: 80,
                      borderRadius: 3,
                      border: `1px solid ${isActive ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
                      bgcolor: isActive
                        ? alpha(theme.palette.primary.main, 0.05)
                        : "transparent",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      textTransform: "none",
                      color: isActive ? "white" : "text.secondary",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: isActive
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.divider, 0.05),
                        borderColor: isActive
                          ? theme.palette.primary.main
                          : alpha(theme.palette.divider, 0.2),
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: isActive
                          ? theme.palette.primary.main
                          : "inherit",
                      }}
                    >
                      {spec.icon}
                    </Box>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      align="center"
                    >
                      {spec.label}
                    </Typography>
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Stack>

        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
          }}
        >
          <Typography
            variant="caption"
            color="info.main"
            sx={{ display: "block", mb: 0.5, fontWeight: 700 }}
          >
            Operational Guidance Notes
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ensure that hazardous material certifications are up-to-date and
            facility complies with local safety standards before finalizing.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default CapacitySection;
