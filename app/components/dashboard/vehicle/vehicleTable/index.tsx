"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
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
    <TableContainer sx={{ p: 0 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
          <TableRow>
            <TableCell width={50} sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>#</TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>Plate</TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>Brand/Model</TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>Status</TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>Odometer</TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>Driver</TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>Type</TableCell>
            <TableCell align="right" sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>Fuel Level</TableCell>
            <TableCell align="right" sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}></TableCell>
          </TableRow>
        </TableHead>

        <TableBody sx={{ "& tr:last-child td": { border: 0 } }}>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 3, borderColor: alpha(theme.palette.divider, 0.1) }}>
                <Typography variant="body2" color="text.secondary">
                  No vehicles found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((v, index) => (
              <TableRow key={v.id} hover sx={{ "& td": { borderColor: alpha(theme.palette.divider, 0.1) } }}>
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
  );
};

export default VehicleTable;
