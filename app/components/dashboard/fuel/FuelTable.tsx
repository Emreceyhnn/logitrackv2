"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import CustomCard from "../../cards/card";
import { FuelTableProps } from "@/app/lib/type/fuel";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

const FuelTable = ({ state }: FuelTableProps) => {
  const { logs, loading } = state;

  if (loading) {
    return <TableSkeleton title="Fuel Logs History" rows={5} columns={8} />;
  }

  return (
    <CustomCard sx={{ padding: "0 0 6px 0" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Fuel Logs History
      </Typography>
      <Divider />

      <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Volume (L)</TableCell>
              <TableCell align="right">Cost</TableCell>
              <TableCell align="right">Odometer (KM)</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No fuel logs found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    {new Date(log.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {log.vehicle.plate}
                  </TableCell>
                  <TableCell>{`${log.driver.user.name} ${log.driver.user.surname}`}</TableCell>
                  <TableCell>{log.fuelType}</TableCell>
                  <TableCell align="right">
                    {log.volumeLiter.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ${log.cost.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {log.odometerKm.toLocaleString()}
                  </TableCell>
                  <TableCell>{log.location || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default FuelTable;
