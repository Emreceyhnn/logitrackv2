"use client";
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
import mockData from "@/app/lib/mockData.json";
import CustomCard from "../../cards/card";

const WarehouseListTable = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const warehouses = mockData.warehouses;

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
              const palletPct =
                (warehouse.capacity.usedPallets /
                  warehouse.capacity.totalPallets) *
                100;
              const volumePct =
                (warehouse.capacity.usedVolumeM3 /
                  warehouse.capacity.totalVolumeM3) *
                100;

              return (
                <TableRow
                  key={warehouse.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>
                    {warehouse.code}
                  </TableCell>
                  <TableCell>{warehouse.name}</TableCell>
                  <TableCell>{warehouse.address.city}</TableCell>
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
                        {warehouse.capacity.usedPallets.toLocaleString()} /{" "}
                        {warehouse.capacity.totalPallets.toLocaleString()}
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
                        {warehouse.capacity.usedVolumeM3.toLocaleString()}k /{" "}
                        {warehouse.capacity.totalVolumeM3.toLocaleString()}k m³
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                    {warehouse.operatingHours.monFri}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default WarehouseListTable;
