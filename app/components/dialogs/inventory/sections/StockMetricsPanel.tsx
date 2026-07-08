"use client";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  Build as AdjustIcon,
} from "@mui/icons-material";
import { InventoryDetailsProps } from "@/app/lib/type/inventory";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useCurrency } from "@/app/hooks/useCurrency";

type InventoryItem = NonNullable<InventoryDetailsProps["item"]>;

interface StockMetricsPanelProps {
  item: InventoryItem;
  adjustAmount: number;
  setAdjustAmount: (value: number) => void;
  adjustType: string;
  setAdjustType: (value: string) => void;
  adjustNote: string;
  setAdjustNote: (value: string) => void;
  onAdjust: () => void;
  isAdjusting: boolean;
}

export default function StockMetricsPanel({
  item,
  adjustAmount,
  setAdjustAmount,
  adjustType,
  setAdjustType,
  adjustNote,
  setAdjustNote,
  onAdjust,
  isAdjusting,
}: StockMetricsPanelProps) {
  const theme = useTheme();
  const dict = useDictionary();
  const { formatFrom } = useCurrency();

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      height: 42,
      borderRadius: "10px",
      bgcolor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.03)"
          : "rgba(0, 0, 0, 0.02)",
      transition: "all 0.2s ease-in-out",
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": { borderColor: theme.palette.text.secondary },
      "&.Mui-focused": {
        bgcolor: "transparent",
        "& fieldset": {
          borderColor: theme.palette.primary.main,
          borderWidth: "2px",
        },
      },
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
      fontSize: "14px",
      fontWeight: 500,
      transform: "translate(14px, 11px) scale(1)",
    },
    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
    "& legend": {
      fontSize: "0.75em",
    },
  };

  return (
    <Grid size={{ xs: 12, md: 5 }}>
      <Box
        sx={{
          p: 4,
          borderRight: {
            md: `1px solid ${theme.palette.divider_alpha.main_10}`,
          },
          bgcolor: theme.palette.background.default_alpha.main_20,
          height: "100%",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={800}
          color="text.secondary"
          sx={{ letterSpacing: "1px", textTransform: "uppercase" }}
        >
          {dict.inventory.dialogs.stockLevels}
        </Typography>

        <Stack spacing={2} mt={2}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: theme.palette.background.paper_alpha.main_05,
              borderColor: theme.palette.divider_alpha.main_10,
              borderRadius: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary._alpha.main_10,
                  color: theme.palette.primary.main,
                }}
              >
                <InventoryIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {dict.inventory.dialogs.available || "AVAILABLE"}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="text.primary"
                >
                  {(
                    item.quantity - (item.allocatedQuantity || 0)
                  ).toLocaleString("en-US")}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {(item.allocatedQuantity || 0) > 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: theme.palette.error._alpha.main_05,
                borderColor: theme.palette.error._alpha.main_10,
                borderRadius: 3,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: theme.palette.error._alpha.main_10,
                    color: theme.palette.error.main,
                  }}
                >
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    {dict.inventory.status.blocked || "BLOCKED"}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    color="text.primary"
                  >
                    {item.allocatedQuantity.toLocaleString("en-US")}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: theme.palette.background.paper_alpha.main_05,
              borderColor: theme.palette.divider_alpha.main_10,
              borderRadius: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: theme.palette.info._alpha.main_10,
                  color: theme.palette.info.light,
                }}
              >
                <InventoryIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {dict.inventory.dialogs.physical || "PHYSICAL"}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="text.primary"
                >
                  {item.quantity.toLocaleString("en-US")}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Stock Adjustment Form */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              bgcolor: theme.palette.background.paper_alpha.main_05,
              borderColor: theme.palette.divider_alpha.main_10,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                color: "text.primary",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <AdjustIcon sx={{ fontSize: 18, color: "primary.main" }} />
              {dict.inventory.dialogs.quickAdjustment}
            </Typography>
            <Stack spacing={1}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={dict.inventory.dialogs.adjustmentAmount}
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number(e.target.value))}
                    variant="outlined"
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small" sx={fieldSx}>
                    <InputLabel sx={{ color: "text.secondary" }}>
                      {dict.inventory.dialogs.adjustmentType}
                    </InputLabel>
                    <Select
                      value={adjustType}
                      label={dict.inventory.dialogs.adjustmentType}
                      onChange={(e) => setAdjustType(e.target.value)}
                      sx={{ color: "text.primary" }}
                    >
                      <MenuItem value="ADJUSTMENT">{dict.inventory.dialogs.historyTypes?.ADJUSTMENT || "Adjustment"}</MenuItem>
                      <MenuItem value="PURCHASE">{dict.inventory.dialogs.historyTypes?.PURCHASE || "Purchase"}</MenuItem>
                      <MenuItem value="RETURN">{dict.inventory.dialogs.historyTypes?.RETURN || "Return"}</MenuItem>
                      <MenuItem value="DAMAGE">{dict.inventory.dialogs.historyTypes?.DAMAGE || "Damage"}</MenuItem>
                      <MenuItem value="LOSS">{dict.inventory.dialogs.historyTypes?.LOSS || "Loss"}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <TextField
                fullWidth
                size="small"
                label={dict.inventory.dialogs.notes}
                value={adjustNote}
                onChange={(e) => setAdjustNote(e.target.value)}
                variant="outlined"
                multiline
                rows={2}
                sx={fieldSx}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={onAdjust}
                disabled={adjustAmount === 0 || isAdjusting}
                startIcon={
                  isAdjusting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AdjustIcon />
                  )
                }
                sx={{
                  height: 48,
                  borderRadius: 2.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  boxShadow: `0 8px 24px ${theme.palette.primary._alpha.main_30}`,
                  textTransform: "none",
                  "&:hover": {
                    boxShadow: `0 12px 32px ${theme.palette.primary._alpha.main_40}`,
                    transform: "translateY(-1px)",
                  },
                  "&.Mui-disabled": {
                    background: theme.palette.action.disabledBackground,
                    boxShadow: "none",
                    transform: "none",
                  },
                }}
              >
                {dict.common.apply}
              </Button>
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: theme.palette.background.paper_alpha.main_05,
              borderColor: theme.palette.divider_alpha.main_10,
              borderRadius: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: theme.palette.warning._alpha.main_10,
                  color: theme.palette.warning.light,
                }}
              >
                <WarehouseIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {dict.inventory.dialogs.safetyStock}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="text.primary"
                >
                  {item.minStock.toLocaleString("en-US")}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: theme.palette.success._alpha.main_05,
              borderColor: theme.palette.success._alpha.main_10,
              borderRadius: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: theme.palette.success._alpha.main_10,
                  color: theme.palette.success.light,
                }}
              >
                <InventoryIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {dict.inventory.fields.unitValue.toLocaleUpperCase('en-US')}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="text.primary"
                >
                  {formatFrom(item.unitValue || 0, item.currency || "USD")}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>

        <Box mt={4}>
          <Typography
            variant="caption"
            fontWeight={800}
            color="text.secondary"
            sx={{ letterSpacing: "1px", textTransform: "uppercase" }}
          >
            {dict.inventory.dialogs.locationData}
          </Typography>
          <Stack spacing={2} mt={1.5}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" color="text.secondary">
                {dict.inventory.dialogs.warehouseCode}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
              >
                {item.warehouse.code}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" color="text.secondary">
                {dict.inventory.dialogs.cargoType}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
              >
                {dict.inventory?.dialogs?.cargoTypes?.[(item.cargoType || "General") as keyof typeof dict.inventory.dialogs.cargoTypes] || item.cargoType || "General"}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Grid>
  );
}
