import {
  Box,
  Card,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import CustomCard from "../../cards/card";
import {
  WarehouseTableProps,
  WarehouseWithRelations,
} from "@/app/lib/type/warehouse";

const WarehouseListTable = ({ warehouses, loading }: WarehouseTableProps) => {
  const theme = useTheme();

  if (loading)
    return <Typography sx={{ p: 3 }}>Loading warehouses...</Typography>;

  return (
    <CustomCard sx={{ p: 3, borderRadius: "12px", boxShadow: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Warehouse List
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                CODE
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                NAME
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                CITY
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  width: "25%",
                }}
              >
                CAPACITY (PALLETS)
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  width: "25%",
                }}
              >
                CAPACITY (VOLUME)
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textAlign: "right",
                }}
              >
                OPERATING HOURS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.map((warehouse) => {
              // Derived values calculation
              const usedPallets = (warehouse._count?.inventory || 0) * 10; // Mock calculation logic preserved
              const totalPallets = warehouse.capacityPallets || 5000;
              const usedVolume = (warehouse._count?.inventory || 0) * 5; // Mock calculation logic preserved
              const totalVolume = warehouse.capacityVolumeM3 || 100000;

              const palletPct = (usedPallets / totalPallets) * 100;
              const volumePct = (usedVolume / totalVolume) * 100;

              // @ts-ignore - operatingHours might be string or object in DB, handling simplistic case
              const operatingHours =
                warehouse.operatingHours || "08:00 - 18:00";

              return (
                <TableRow
                  key={warehouse.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>
                    {warehouse.code}
                  </TableCell>
                  <TableCell>{warehouse.name}</TableCell>
                  <TableCell>{warehouse.city}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LinearProgress
                        variant="determinate"
                        value={palletPct}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.1)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#3b82f6", // Blue like design
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ minWidth: 80, fontFamily: "monospace" }}
                      >
                        {usedPallets.toLocaleString()} /{" "}
                        {totalPallets.toLocaleString()}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LinearProgress
                        variant="determinate"
                        value={volumePct}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.1)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#10b981", // Green like design
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ minWidth: 100, fontFamily: "monospace" }}
                      >
                        {usedVolume.toLocaleString()}k /{" "}
                        {totalVolume.toLocaleString()}k m³
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                    {typeof operatingHours === "object"
                      ? (operatingHours as any).monFri
                      : operatingHours}
                  </TableCell>
                </TableRow>
              );
            })}
            {warehouses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No warehouses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default WarehouseListTable;
