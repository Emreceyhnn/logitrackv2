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
  CircularProgress,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import CustomCard from "../../../cards/card";
import RowActions from "./menu";
import { StatusChip } from "@/app/components/chips/statusChips";
import { DriverTableProps } from "@/app/lib/type/driver";

const DriverTable = ({
  drivers,
  loading,
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
  /* --------------------------------- render --------------------------------- */
  if (loading) {
    return (
      <CustomCard
        sx={{
          padding: "0 0 6px 0",
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </CustomCard>
    );
  }

  /* -------------------------------- handlers -------------------------------- */
  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1); // MUI uses 0-indexed, our API uses 1-indexed
  };

  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      if (onRequestSort) onRequestSort(property);
    };

  return (
    <>
      <CustomCard sx={{ padding: "0 0 6px 0" }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
          Driver List
        </Typography>
        <Divider />

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
              {drivers.map((d, index) => (
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
              ))}
              {drivers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    No drivers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={meta?.total || 0}
          rowsPerPage={meta?.limit || 10}
          page={(meta?.page || 1) - 1} // MUI is 0-indexed
          onPageChange={handleChangePage}
          onRowsPerPageChange={(e) => {
            const newLimit = parseInt(e.target.value, 10);
            if (onLimitChange) onLimitChange(newLimit);
          }}
        />
      </CustomCard>
    </>
  );
};

export default DriverTable;
