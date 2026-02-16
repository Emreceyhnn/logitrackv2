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
  Box,
  Skeleton,
} from "@mui/material";
import CustomCard from "../../../cards/card";
import RowActions from "./menu";
import { StatusChip } from "@/app/components/chips/statusChips";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import DriverAvatar from "@/app/components/avatar";

interface VehicleTableProps {
  vehicles: VehicleWithRelations[];
  onVehicleSelect: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

const VehicleTable = ({
  vehicles,
  onVehicleSelect,
  onEdit,
  onDelete,
  loading = false,
}: VehicleTableProps) => {
  return (
    <CustomCard sx={{ padding: "0 0 6px 0" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Vehicle List
      </Typography>
      <Divider />

      <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
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
            {loading ? (
              // Skeleton loading state
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" width={80} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="circular" width={32} height={32} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={60} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="text" width={40} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="circular" width={24} height={24} />
                  </TableCell>
                </TableRow>
              ))
            ) : vehicles.length === 0 ? (
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
                    {v.odometerKm
                      ? `${v.odometerKm.toLocaleString()} km`
                      : "N/A"}
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
