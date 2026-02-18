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
  Box,
  TablePagination,
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
  onRefresh,
  onPageChange,
}: DriverTableProps) => {
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

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1); // MUI uses 0-indexed, our API uses 1-indexed
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
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>License</TableCell>
                <TableCell align="right">Safety Score</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {drivers.map((d, index) => (
                <TableRow key={d.id}>
                  <TableCell>{index + 1}</TableCell>
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
          rowsPerPageOptions={[10]}
          component="div"
          count={meta?.total || 0}
          rowsPerPage={meta?.limit || 10}
          page={(meta?.page || 1) - 1} // MUI is 0-indexed
          onPageChange={handleChangePage}
        />
      </CustomCard>
    </>
  );
};

export default DriverTable;
