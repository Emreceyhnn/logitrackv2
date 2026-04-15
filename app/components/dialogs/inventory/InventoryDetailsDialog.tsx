"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  Avatar,
  useTheme,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  PaletteColor,
} from "@mui/material";
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
  Scale as ScaleIcon,
  ViewInAr as VolumeIcon,
  GridOn as PalletIcon,
  Edit as EditIcon,
  Warehouse as WarehouseIcon,
  History as HistoryIcon,
  Assessment as OverviewIcon,
  TrendingDown as OutIcon,
  TrendingUp as InIcon,
  Build as AdjustIcon,
} from "@mui/icons-material";
import { InventoryDetailsProps, InventoryMovement } from "@/app/lib/type/inventory";
import { getInventoryMovements } from "@/app/lib/controllers/inventory";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

import { useParams } from "next/navigation";

export default function InventoryDetailsDialog({
  isOpen,
  onClose,
  item,
  onEdit,
}: InventoryDetailsProps) {
  const theme = useTheme();
  const dict = useDictionary();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const [tabValue, setTabValue] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === "tr" ? "tr-TR" : "en-US", {
      style: "currency",
      currency: lang === "tr" ? "TRY" : "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);

  const loadMovements = React.useCallback(async () => {
    if (!item) return;
    setLoadingMovements(true);
    try {
      const data = await getInventoryMovements(item.sku, item.warehouseId);
      setMovements(data as InventoryMovement[]);
    } catch (error) {
      console.error("Failed to load movements", error);
    } finally {
      setLoadingMovements(false);
    }
  }, [item]);

  useEffect(() => {
    if (isOpen && item && tabValue === 1) {
      loadMovements();
    }
  }, [isOpen, item, tabValue, loadMovements]);

  if (!item) return null;

  const isLowStock = item.quantity <= item.minStock;
  const statusLabel = 
    item.quantity === 0 ? dict.inventory.status.outOfStock : 
    isLowStock ? dict.inventory.status.lowStock : 
    dict.inventory.status.inStock;
    
  const statusColor = item.quantity === 0 ? "error" : isLowStock ? "warning" : "success";

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "PICK": return <OutIcon sx={{ color: "error.main" }} />;
      case "PUTAWAY": return <InIcon sx={{ color: "success.main" }} />;
      default: return <AdjustIcon sx={{ color: "info.main" }} />;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: "#0B0F19",
          backgroundImage: "none",
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider_alpha.main_10}`,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, pb: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              variant="rounded"
              src={item.imageUrl || undefined}
              sx={{
                width: 56,
                height: 56,
                bgcolor: theme.palette.primary._alpha.main_10,
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary._alpha.main_20}`,
                fontSize: "1.75rem",
                fontWeight: 800,
                borderRadius: 2,
                "& img": {
                  objectFit: "cover",
                },
              }}
            >
              {!item.imageUrl && item.name.charAt(0)}
            </Avatar>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="h6" fontWeight={800} color="white">
                  {item.name}
                </Typography>
                <Chip
                  label={statusLabel}
                  size="small"
                  sx={{ 
                    fontWeight: 700, 
                    height: 20,
                    fontSize: "0.65rem",
                    bgcolor: (theme.palette[statusColor] as PaletteColor)._alpha.main_10,
                    color: (theme.palette[statusColor] as PaletteColor).light,
                    border: `1px solid ${(theme.palette[statusColor] as PaletteColor)._alpha.main_20}`
                  }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {dict.inventory.fields.sku}: {item.sku} • {item.warehouse.name}
              </Typography>
            </Stack>
          </Stack>

          <IconButton onClick={onClose} sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Tabs 
          value={tabValue} 
          onChange={(_, v) => setTabValue(v)}
          sx={{ 
            mt: 3,
            minHeight: 40,
            "& .MuiTab-root": {
              color: theme.palette.common.white_alpha.main_40,
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              minHeight: 40,
              minWidth: 100,
              p: 0,
            },
            "& .Mui-selected": {
              color: `${theme.palette.primary.main} !important`,
            },
            "& .MuiTabs-indicator": {
              bgcolor: theme.palette.primary.main,
              height: 3,
              borderRadius: "3px 3px 0 0",
            }
          }}
        >
          <Tab icon={<OverviewIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label={dict.inventory.dialogs.overview} />
          <Tab icon={<HistoryIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label={dict.inventory.dialogs.history} />
        </Tabs>
      </Box>

      <Divider sx={{ borderColor: theme.palette.divider_alpha.main_10 }} />

      <DialogContent sx={{ p: 0, minHeight: 400 }}>
        {/* Overview Tab */}
        <CustomTabPanel value={tabValue} index={0}>
          <Grid container>
            {/* Left Metrics */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ p: 4, borderRight: { md: `1px solid ${theme.palette.divider_alpha.main_10}` }, bgcolor: theme.palette.background.default_alpha.main_20, height: "100%" }}>
                <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: "1px", textTransform: "uppercase" }}>
                  {dict.inventory.dialogs.stockLevels}
                </Typography>
                
                <Stack spacing={2} mt={2}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: theme.palette.background.paper_alpha.main_05, borderColor: theme.palette.divider_alpha.main_10, borderRadius: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: theme.palette.primary._alpha.main_10, color: theme.palette.primary.main }}>
                        <InventoryIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{dict.inventory.dialogs.available}</Typography>
                        <Typography variant="h5" fontWeight={800} color="white">{item.quantity.toLocaleString()}</Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2, bgcolor: theme.palette.background.paper_alpha.main_05, borderColor: theme.palette.divider_alpha.main_10, borderRadius: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: theme.palette.warning._alpha.main_10, color: theme.palette.warning.light }}>
                        <WarehouseIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{dict.inventory.dialogs.safetyStock}</Typography>
                        <Typography variant="h5" fontWeight={800} color="white">{item.minStock.toLocaleString()}</Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2, bgcolor: theme.palette.success._alpha.main_05, borderColor: theme.palette.success._alpha.main_10, borderRadius: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: theme.palette.success._alpha.main_10, color: theme.palette.success.light }}>
                        <InventoryIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{dict.inventory.fields.unitValue.toUpperCase()}</Typography>
                        <Typography variant="h5" fontWeight={800} color="white">
                          {formatPrice(item.unitValue || 0)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>

                <Box mt={4}>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: "1px", textTransform: "uppercase" }}>
                    {dict.inventory.dialogs.locationData}
                  </Typography>
                  <Stack spacing={1} mt={1.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">{dict.inventory.dialogs.warehouseCode}</Typography>
                      <Typography variant="body2" fontWeight={600} color="white">{item.warehouse.code}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">{dict.inventory.dialogs.cargoType}</Typography>
                      <Typography variant="body2" fontWeight={600} color="white">
                        {item.cargoType === "General" || !item.cargoType ? dict.inventory.category.general : item.cargoType}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Grid>

            {/* Right Specs */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ p: 4 }}>
                <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: "1px", textTransform: "uppercase" }}>
                  {dict.inventory.dialogs.physicalSpecs}
                </Typography>

                <Grid container spacing={3} mt={1}>
                  <Grid size={4}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 3, bgcolor: theme.palette.background.paper_alpha.main_02, borderColor: theme.palette.divider_alpha.main_10 }}>
                      <ScaleIcon sx={{ color: "primary.main", mb: 1 }} />
                      <Typography variant="caption" display="block" color="text.secondary">{dict.inventory.fields.weight.toUpperCase()}</Typography>
                      <Typography variant="h6" fontWeight={800} color="white">{item.weightKg}kg</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={4}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 3, bgcolor: theme.palette.background.paper_alpha.main_02, borderColor: theme.palette.divider_alpha.main_10 }}>
                      <VolumeIcon sx={{ color: "secondary.main", mb: 1 }} />
                      <Typography variant="caption" display="block" color="text.secondary">{dict.inventory.fields.volume.toUpperCase()}</Typography>
                      <Typography variant="h6" fontWeight={800} color="white">{item.volumeM3}m³</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={4}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 3, bgcolor: theme.palette.background.paper_alpha.main_02, borderColor: theme.palette.divider_alpha.main_10 }}>
                      <PalletIcon sx={{ color: "success.main", mb: 1 }} />
                      <Typography variant="caption" display="block" color="text.secondary">{dict.inventory.fields.pallets.toUpperCase()}</Typography>
                      <Typography variant="h6" fontWeight={800} color="white">{item.palletCount}</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, p: 2, borderRadius: 3, bgcolor: theme.palette.info._alpha.main_05, border: `1px solid ${theme.palette.info._alpha.main_10}` }}>
                  <Typography variant="caption" fontWeight={700} color="info.light" sx={{ display: "block", mb: 0.5 }}>{dict.inventory.dialogs.intelTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
                    {dict.inventory.dialogs.intelDesc.replace("{minStock}", item.minStock.toString())}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* History Tab */}
        <CustomTabPanel value={tabValue} index={1}>
          <Box sx={{ p: 0 }}>
            {loadingMovements ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                <CircularProgress size={24} />
              </Box>
            ) : movements.length === 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: "text.secondary" }}>
                <HistoryIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                <Typography variant="body2">{dict.inventory.dialogs.noHistory}</Typography>
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow sx={{ "& th": { bgcolor: theme.palette.background.paper_alpha.main_10, color: "text.secondary", fontWeight: 700, fontSize: "0.7rem", borderBottom: `1px solid ${theme.palette.divider_alpha.main_10}` } }}>
                      <TableCell>{dict.inventory.dialogs.historyFields.type}</TableCell>
                      <TableCell align="right">{dict.inventory.dialogs.historyFields.quantity}</TableCell>
                      <TableCell>{dict.inventory.dialogs.historyFields.user}</TableCell>
                      <TableCell align="right">{dict.inventory.dialogs.historyFields.date}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movements.map((move) => (
                      <TableRow key={move.id} sx={{ "& td": { color: "text.secondary", borderColor: theme.palette.divider_alpha.main_05 } }}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {getMovementIcon(move.type)}
                            <Typography variant="body2" sx={{ color: "white", fontSize: "0.75rem", fontWeight: 600 }}>{move.type}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ color: move.quantity > 0 ? "success.light" : "error.light", fontWeight: 700 }}>
                            {move.quantity > 0 ? `+${move.quantity}` : move.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{move.user ? `${move.user.name} ${move.user.surname}` : dict.inventory.dialogs.historyFields.system}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption">{new Date(move.date).toLocaleString()}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </CustomTabPanel>
      </DialogContent>

      <Box sx={{ p: 3, px: 4, bgcolor: theme.palette.background.default_alpha.main_10, borderTop: `1px solid ${theme.palette.divider_alpha.main_10}` }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            onClick={onClose} 
            sx={{ px: 3, fontWeight: 600, color: "text.secondary", textTransform: "none", "&:hover": { color: "white" } }}
          >
            {dict.inventory.dialogs.closeView}
          </Button>
          <Button
            startIcon={<EditIcon />}
            variant="contained"
            onClick={() => onEdit(item.id)}
            sx={{ 
              minWidth: 160,
              borderRadius: 2, 
              fontWeight: 700,
              textTransform: "none",
              boxShadow: `0 8px 24px ${theme.palette.primary._alpha.main_20}`,
            }}
          >
            {dict.inventory.dialogs.modifySpecs}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
