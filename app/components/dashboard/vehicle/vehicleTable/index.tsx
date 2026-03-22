"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import CustomCard from "../../../cards/card";
import RowActions from "./menu";
import { StatusChip } from "@/app/components/chips/statusChips";
import DriverAvatar from "@/app/components/avatar";
import { VehicleTableProps } from "@/app/lib/type/vehicle";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

const VehicleTable = ({ state, actions }: VehicleTableProps) => {
  const theme = useTheme();
  const { vehicles, loading = false } = state;
  const { selectVehicle: onVehicleSelect, onEdit, onDelete } = actions;

  if (loading) {
     return <TableSkeleton title="Vehicle List" rows={5} columns={9} />;
  }

  return (
    <CustomCard sx={{ p: 0, overflow: "hidden" }}>
      <TableContainer sx={{ p: 0, pt: 1 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
          <TableRow>
            <TableCell width={50}>#</TableCell>
            <TableCell>Plate</TableCell>
            <TableCell>Brand/Model</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Odometer</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Fuel Level</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No vehicles found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((v, index) => (
              <TableRow key={v.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{v.plate}</TableCell>
                <TableCell>{`${v.brand} - ${v.model} / ${v.year}`}</TableCell>
                <TableCell>
                  <StatusChip status={v.status} />
                </TableCell>
                <TableCell>
                  {v.odometerKm ? `${v.odometerKm.toLocaleString()} km` : "N/A"}
                </TableCell>
                <TableCell>
                  {v.driver?.user ? (
                    <DriverAvatar
                      avatarUrl={v.driver?.user?.avatarUrl || ""}
                      name={v.driver?.user?.name || ""}
                      surname={v.driver?.user?.surname || ""}
                      rating={v.driver?.rating || 0}
                      size="small"
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Not Assigned
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{v.type}</TableCell>
                <TableCell align="right">{v.fuelLevel ?? 0}%</TableCell>
                <TableCell align="right">
                  <RowActions
                    id={v.id}
                    handleOpenDetails={onVehicleSelect}
                    handleEdit={onEdit}
                    handleDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default VehicleTable;
