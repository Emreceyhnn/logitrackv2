"use client";

import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { LocationDetailsCard } from "./components/LocationDetailsCard";
import { UniqueSkusCard } from "./components/UniqueSkusCard";
import { OperationsDetailsCard } from "./components/OperationsDetailsCard";
import { PalletStorageCard } from "./components/PalletStorageCard";
import { VolumeCapacityCard } from "./components/VolumeCapacityCard";
import { FacilityCapabilitiesSection } from "./components/FacilityCapabilitiesSection";

interface OverviewTabProps {
  warehouse: WarehouseWithRelations;
}

const OverviewTab = ({ warehouse }: OverviewTabProps) => {
  const dict = useDictionary();

  const mockUsedPallets = (warehouse._count?.inventory || 0) * 10;
  const totalPallets = warehouse.capacityPallets || 5000;
  const mockUsedVolume = (warehouse._count?.inventory || 0) * 5;
  const totalVolume = warehouse.capacityVolumeM3 || 100000;

  const palletPct = Math.min((mockUsedPallets / totalPallets) * 100, 100);
  const volumePct = Math.min((mockUsedVolume / totalVolume) * 100, 100);

  const t = dict.warehouses.dialogs.details;

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Top Info Cards */}
        <Grid size={{ xs: 12, md: 4 }}>
          <LocationDetailsCard warehouse={warehouse} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <UniqueSkusCard warehouse={warehouse} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <OperationsDetailsCard warehouse={warehouse} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography
            variant="subtitle1"
            fontWeight={800}
            color="text.primary"
            mb={1}
            mt={1}
          >
            {t.capacityUtilization}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PalletStorageCard 
            mockUsedPallets={mockUsedPallets} 
            totalPallets={totalPallets} 
            palletPct={palletPct} 
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <VolumeCapacityCard 
            mockUsedVolume={mockUsedVolume} 
            totalVolume={totalVolume} 
            volumePct={volumePct} 
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FacilityCapabilitiesSection warehouse={warehouse} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewTab;
