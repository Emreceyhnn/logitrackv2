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
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import RowActions from "./menu";
import { StatusChip } from "@/app/components/chips/statusChips";
import { DriverTableProps } from "@/app/lib/type/driver";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

const DriverTable = ({
  drivers,
  loading = false,
  meta,
  onDriverSelect,
  onEdit,
  onDelete,
  onRefresh,
  onPageChange,
  onLimitChange,
  sortField,
  sortOrder,
  onRequestSort,
}: DriverTableProps) => {
  /* -------------------------------- handlers -------------------------------- */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange(newPage + 1); // MUI uses 0-indexed, our API uses 1-indexed
  };
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      if (onRequestSort) onRequestSort(property);
    };

  if (loading) {
    return <TableSkeleton title="Driver List" rows={10} columns={8} />;
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "name"}
                  direction={sortField === "name" ? sortOrder : "asc"}
                  onClick={createSortHandler("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "status"}
                  direction={sortField === "status" ? sortOrder : "asc"}
                  onClick={createSortHandler("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "phone"}
                  direction={sortField === "phone" ? sortOrder : "asc"}
                  onClick={createSortHandler("phone")}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "vehicle"}
                  direction={sortField === "vehicle" ? sortOrder : "asc"}
                  onClick={createSortHandler("vehicle")}
                >
                  Vehicle
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "licenseType"}
                  direction={sortField === "licenseType" ? sortOrder : "asc"}
                  onClick={createSortHandler("licenseType")}
                >
                  License
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === "safetyScore"}
                  direction={sortField === "safetyScore" ? sortOrder : "asc"}
                  onClick={createSortHandler("safetyScore")}
                >
                  Safety Score
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No drivers found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((d, index) => (
                <TableRow key={d.id}>
                  <TableCell>
                    {index + 1 + (meta.page - 1) * meta.limit}
                  </TableCell>
                  <TableCell>
                    {d.user.name} {d.user.surname}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={d.status} />
                  </TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell>
                    {d.currentVehicle
                      ? d.currentVehicle.plate
                      : "No assigned vehicle"}
                  </TableCell>
                  <TableCell>{d.licenseType}</TableCell>
                  <TableCell align="right">{d.safetyScore}</TableCell>
                  <TableCell align="right">
                    <RowActions
                      id={d.id}
                      handleOpenDetails={() => onDriverSelect(d.id)}
                      handleEdit={() => onEdit(d)}
                      handleDelete={() => onDelete(d.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={meta?.total || 0}
        rowsPerPage={meta?.limit || 10}
        page={(meta?.page || 1) - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={(e) => {
          const newLimit = parseInt(e.target.value, 10);
          if (onLimitChange) onLimitChange(newLimit);
        }}
      />
    </>
  );
};

export default DriverTable;
