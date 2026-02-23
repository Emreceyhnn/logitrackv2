"use client";

import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";
import {
  AddShipmentCargo,
  AddShipmentPageActions,
} from "@/app/lib/type/add-shipment";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import InventoryIcon from "@mui/icons-material/Inventory";

interface CargoSectionProps {
  state: AddShipmentCargo;
  actions: AddShipmentPageActions;
}

const CargoSection = ({ state, actions }: CargoSectionProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  return (
    <Box>
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main,
            }}
          />
          <Typography variant="subtitle2" fontWeight={700} color="white">
            Cargo Details
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                WEIGHT (KG)
              </Typography>
              <CustomTextArea
                name="weightKg"
                type="number"
                placeholder="0.00"
                value={state.weightKg.toString()}
                onChange={(e) =>
                  actions.updateCargo({
                    weightKg: parseFloat(e.target.value) || 0,
                  })
                }
              >
                <MonitorWeightIcon
                  sx={{ fontSize: 18, color: "text.secondary" }}
                />
              </CustomTextArea>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                VOLUME (M³)
              </Typography>
              <CustomTextArea
                name="volumeM3"
                type="number"
                placeholder="0.00"
                value={state.volumeM3.toString()}
                onChange={(e) =>
                  actions.updateCargo({
                    volumeM3: parseFloat(e.target.value) || 0,
                  })
                }
              >
                <ViewInArIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </CustomTextArea>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                PALLETS
              </Typography>
              <CustomTextArea
                name="palletCount"
                type="number"
                placeholder="Qty"
                value={state.palletCount.toString()}
                onChange={(e) =>
                  actions.updateCargo({
                    palletCount: parseInt(e.target.value) || 0,
                  })
                }
              >
                <InventoryIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </CustomTextArea>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                CARGO TYPE
              </Typography>
              <CustomTextArea
                name="cargoType"
                select
                value={state.cargoType}
                onChange={(e) =>
                  actions.updateCargo({ cargoType: e.target.value })
                }
              >
                <MenuItem value="General Cargo">General Cargo</MenuItem>
                <MenuItem value="Perishable">Perishable</MenuItem>
                <MenuItem value="Fragile">Fragile</MenuItem>
                <MenuItem value="Liquid">Liquid</MenuItem>
              </CustomTextArea>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default CargoSection;
