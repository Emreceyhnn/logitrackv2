"use client";

import {
  alpha,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  AddInventoryItemDetails,
  AddInventoryStorageLevels,
} from "@/app/lib/type/add-inventory";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import InfoIcon from "@mui/icons-material/Info";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

interface ReviewSectionProps {
  itemDetails: AddInventoryItemDetails;
  storageLevels: AddInventoryStorageLevels;
}

const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{ py: 1 }}
  >
    <Stack direction="row" spacing={1} alignItems="center">
      {icon && (
        <Box sx={{ color: "text.secondary", opacity: 0.6, display: "flex" }}>
          {icon}
        </Box>
      )}
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
    </Stack>
    <Typography variant="body2" color="white" fontWeight={600}>
      {value}
    </Typography>
  </Stack>
);

const ReviewSection = ({ itemDetails, storageLevels }: ReviewSectionProps) => {
  const theme = useTheme();

  return (
    <Box>
      <Stack spacing={3}>
        {/* Header Summary */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {itemDetails.imageUrl ? (
            <Avatar
              src={itemDetails.imageUrl}
              variant="rounded"
              sx={{ width: 64, height: 64, borderRadius: 2 }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}
            >
              <InventoryIcon sx={{ fontSize: 32 }} />
            </Avatar>
          )}
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="white">
              {itemDetails.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {itemDetails.category} • SKU: {itemDetails.sku || "Auto-generated"}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <InfoIcon sx={{ fontSize: "1rem", color: theme.palette.primary.main }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1 }}>
                  PRICING \u0026 DETAILS
                </Typography>
              </Stack>
              <Box>
                <InfoRow label="Unit Price" value={`${itemDetails.unitValue || 0} TRY`} />
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />
                <InfoRow label="Weight" value={`${itemDetails.weightKg || 0} Kg`} />
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />
                <InfoRow label="Volume" value={`${itemDetails.volumeM3 || 0} M³`} />
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <WarehouseIcon sx={{ fontSize: "1rem", color: theme.palette.primary.main }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1 }}>
                  STORAGE \u0026 STOCK
                </Typography>
              </Stack>
              <Box>
                <InfoRow label="Initial Stock" value={storageLevels.initialQuantity || 0} />
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />
                <InfoRow label="Min. Alert Level" value={storageLevels.minStockLevel || 0} />
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />
                <InfoRow label="Pallets" value={itemDetails.palletCount || 0} />
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.03),
            border: `1px solid ${alpha(theme.palette.info.main, 0.05)}`,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <LocalShippingIcon sx={{ color: theme.palette.info.main, fontSize: "1.1rem" }} />
          <Typography variant="caption" color="text.secondary">
            Shipping parameters are calculated based on unit weight and volume per pallet.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default ReviewSection;
