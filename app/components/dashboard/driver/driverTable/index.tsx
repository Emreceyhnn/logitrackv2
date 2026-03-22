"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  alpha,
  useTheme,
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
  onPageChange,
  onLimitChange,
  sortField,
  sortOrder,
  onRequestSort,
}: DriverTableProps) => {
  const theme = useTheme();

  /* -------------------------------- handlers -------------------------------- */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange(newPage + 1); // MUI uses 0-indexed, our API uses 1-indexed
  };
  const createSortHandler =
    (property: string) => () => {
      if (onRequestSort) onRequestSort(property);
    };

  if (loading) {
    return <TableSkeleton title="Driver List" rows={10} columns={8} />;
  }

  return (
    <TableContainer sx={{ p: 0 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
          <TableRow>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>#</TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              <TableSortLabel
                active={sortField === "name"}
                direction={sortField === "name" ? sortOrder : "asc"}
                onClick={createSortHandler("name")}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              <TableSortLabel
                active={sortField === "status"}
                direction={sortField === "status" ? sortOrder : "asc"}
                onClick={createSortHandler("status")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              <TableSortLabel
                active={sortField === "phone"}
                direction={sortField === "phone" ? sortOrder : "asc"}
                onClick={createSortHandler("phone")}
              >
                Phone
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              <TableSortLabel
                active={sortField === "vehicle"}
                direction={sortField === "vehicle" ? sortOrder : "asc"}
                onClick={createSortHandler("vehicle")}
              >
                Vehicle
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              <TableSortLabel
                active={sortField === "homeBaseWarehouse"}
                direction={sortField === "homeBaseWarehouse" ? sortOrder : "asc"}
                onClick={createSortHandler("homeBaseWarehouse")}
              >
                Homebase
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              <TableSortLabel
                active={sortField === "licenseType"}
                direction={sortField === "licenseType" ? sortOrder : "asc"}
                onClick={createSortHandler("licenseType")}
              >
                License
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              <TableSortLabel
                active={sortField === "safetyScore"}
                direction={sortField === "safetyScore" ? sortOrder : "asc"}
                onClick={createSortHandler("safetyScore")}
              >
                Safety Score
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {drivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 3, borderColor: alpha(theme.palette.divider, 0.1) }}>
                  No drivers found
              </TableCell>
            </TableRow>
          ) : (
            drivers.map((d, index) => (
              <TableRow key={d.id} hover sx={{ "& td": { borderColor: alpha(theme.palette.divider, 0.1) } }}>
                <TableCell>
                  {index + 1 + (meta.page - 1) * meta.limit}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
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
                <TableCell>
                  {d.homeBaseWarehouse
                    ? d.homeBaseWarehouse.name
                    : "Not assigned"}
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
    </TableContainer>
  );
};

export default DriverTable;
