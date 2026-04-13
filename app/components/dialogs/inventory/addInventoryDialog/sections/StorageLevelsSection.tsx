"use client";

import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useState, useEffect } from "react";
import { AddInventoryStorageLevels } from "@/app/lib/type/add-inventory";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { Warehouse } from "@prisma/client";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { useUser } from "@/app/lib/hooks/useUser";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface StorageLevelsSectionProps {
  state: AddInventoryStorageLevels;
  updateStorageLevels: (data: Partial<AddInventoryStorageLevels>) => void;
}

const StorageLevelsSection = ({
  state,
  updateStorageLevels,
}: StorageLevelsSectionProps) => {
  /* -------------------------------- variables ------------------------------- */
  const dict = useDictionary();
  const theme = useTheme();
  const { user } = useUser();

  /* ---------------------------------- state --------------------------------- */
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  
  // Local string state for smooth numeric input (handles decimals/empty better)
  const [localQuantity, setLocalQuantity] = useState(state.initialQuantity === 0 ? "" : state.initialQuantity.toString());
  const [localMinStock, setLocalMinStock] = useState(state.minStockLevel === 0 ? "" : state.minStockLevel.toString());

  const handleNumChange = (field: keyof AddInventoryStorageLevels, val: string, setLocal: (v: string) => void) => {
    setLocal(val);
    const parsed = parseInt(val);
    updateStorageLevels({ [field]: isNaN(parsed) ? 0 : parsed });
  };

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!user || !user.companyId) return;
      try {
        const data = await getWarehouses();
        setWarehouses(data);
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      }
    };
    fetchWarehouses();
  }, [user]);

  return (
    <Box>
      <Stack spacing={4}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={700} color="white">
            {dict.inventory.dialogs.storageAndLevels}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dict.inventory.dialogs.storageDesc}
          </Typography>
        </Stack>

        <Stack spacing={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ color: theme.palette.primary.main, display: "flex" }}>
                <InfoOutlinedIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle2" fontWeight={700} color="white">
                {dict.inventory.dialogs.warehouseLocation}
              </Typography>
            </Stack>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                {dict.inventory.dialogs.selectFacility}
              </Typography>
              <CustomTextArea
                name="warehouseId"
                select
                value={state.warehouseId}
                onChange={(e) =>
                  updateStorageLevels({ warehouseId: e.target.value })
                }
              >
                <MenuItem value="" disabled>
                  {dict.common.noData}
                </MenuItem>
                {warehouses.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.name} ({w.code})
                  </MenuItem>
                ))}
              </CustomTextArea>
            </Stack>
          </Stack>

          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ color: theme.palette.primary.main, display: "flex" }}>
                <InfoOutlinedIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle2" fontWeight={700} color="white">
                {dict.inventory.dialogs.stockConfig}
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
                    {dict.inventory.dialogs.initialQuantity}
                  </Typography>
                  <CustomTextArea
                    name="initialQuantity"
                    type="number"
                    placeholder="0"
                    value={localQuantity}
                    onChange={(e) => handleNumChange("initialQuantity", e.target.value, setLocalQuantity)}
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
                    {dict.inventory.dialogs.minStockAlert}
                  </Typography>
                  <CustomTextArea
                    name="minStockLevel"
                    type="number"
                    placeholder="10"
                    value={localMinStock}
                    onChange={(e) => handleNumChange("minStockLevel", e.target.value, setLocalMinStock)}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              display: "flex",
              gap: 2,
            }}
          >
            <Box sx={{ color: theme.palette.primary.main, mt: 0.5 }}>
              <InfoOutlinedIcon fontSize="small" />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={700} color="white">
                {dict.inventory.dialogs.movementDetails}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                {dict.inventory.dialogs.putawayDesc}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default StorageLevelsSection;
