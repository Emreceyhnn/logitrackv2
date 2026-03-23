"use client";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  useTheme,
  alpha,
  Stack
} from "@mui/material";
import CustomCard from "../../cards/card";
import { InventoryMovementWithRelations } from "@/app/lib/type/warehouse";
import HistoryIcon from '@mui/icons-material/History';

interface RecentStockMovementsProps {
  movements: InventoryMovementWithRelations[];
  loading?: boolean;
}

const RecentStockMovements = ({
  movements,
  loading,
}: RecentStockMovementsProps) => {
  const theme = useTheme();

  if (loading) return (
    <CustomCard sx={{ flex: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography color="text.secondary">Loading movements...</Typography>
    </CustomCard>
  );

  return (
    <CustomCard sx={{ flex: 7 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <Box sx={{ 
          p: 1, 
          borderRadius: '12px', 
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          display: 'flex'
        }}>
          <HistoryIcon fontSize="small" />
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
          Recent Stock Movements
        </Typography>
      </Stack>

      <TableContainer>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              {["WAREHOUSE", "ITEM / SKU", "TYPE", "QUANTITY", "TIMESTAMP"].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    color: alpha(theme.palette.text.primary, 0.4),
                    fontWeight: 800,
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                    py: 1.5,
                    ...(head === "TIMESTAMP" && { textAlign: "right" })
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ "& tr:last-child td": { border: 0 } }}>
            {movements.map((move) => {
              const isPick = move.type === "PICK";
              const date = new Date(move.date);
              const timeDisplay = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const dateDisplay = date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric'
              });

              return (
                <TableRow
                  key={move.id}
                  sx={{ 
                    "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                    transition: "background-color 0.2s ease"
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={800} color="text.primary">
                      {move.warehouse?.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {move.itemName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                      {move.sku}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={move.type}
                      size="small"
                      sx={{
                        bgcolor: alpha(isPick ? theme.palette.warning.main : theme.palette.success.main, 0.1),
                        color: isPick ? theme.palette.warning.main : theme.palette.success.main,
                        fontWeight: 800,
                        borderRadius: "8px",
                        fontSize: "0.65rem",
                        height: 24,
                        border: `1px solid ${alpha(isPick ? theme.palette.warning.main : theme.palette.success.main, 0.1)}`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      fontWeight={800} 
                      color={isPick ? "warning.main" : "success.main"}
                    >
                      {isPick ? "-" : "+"}
                      {move.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell 
                    align="right" 
                  >
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {timeDisplay}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
                      {dateDisplay}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    No recent movements recorded yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default RecentStockMovements;
