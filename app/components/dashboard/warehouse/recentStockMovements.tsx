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
} from "@mui/material";
import CustomCard from "../../cards/card";
import { InventoryMovementWithRelations } from "@/app/lib/type/warehouse";

interface RecentStockMovementsProps {
  movements: InventoryMovementWithRelations[];
  loading?: boolean;
}

const RecentStockMovements = ({
  movements,
  loading,
}: RecentStockMovementsProps) => {
  if (loading) return <Typography>Loading movements...</Typography>;

  return (
    <CustomCard sx={{ p: 3, borderRadius: "12px", boxShadow: 3, flex: 7 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Recent Stock Movements
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
                WAREHOUSE
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                SKU
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                TYPE
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                QTY
              </TableCell>
              <TableCell
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textAlign: "right",
                }}
              >
                TIMESTAMP
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.map((move) => {
              const isPick = move.type === "PICK";
              // @ts-ignore
              const timeDisplay = new Date(move.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <TableRow
                  key={move.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>
                    {move.warehouse?.code}
                  </TableCell>
                  <TableCell>{move.itemName}</TableCell>
                  <TableCell>
                    <Chip
                      label={move.type}
                      size="small"
                      sx={{
                        bgcolor: isPick
                          ? "rgba(251, 191, 36, 0.1)"
                          : "rgba(52, 211, 153, 0.1)",
                        color: isPick ? "#fbbf24" : "#34d399",
                        fontWeight: 700,
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {isPick ? "-" : "+"}
                    {move.quantity}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "text.secondary" }}>
                    {timeDisplay}
                  </TableCell>
                </TableRow>
              );
            })}
            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No recent movements.
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
