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
  TablePagination,
  Stack,
  Button,
  Skeleton,
} from "@mui/material";
import CustomCard from "../../../cards/card";
import { useState } from "react";
import RowActions from "../../vehicle/vehicleTable/menu";

import RouteDetailsDialog from "@/app/components/dialogs/routes";
import AddRouteDialog from "@/app/components/dialogs/routes/add-route-dialog";
import { StatusChip } from "@/app/components/chips/statusChips";
import { RouteTableProps, RouteWithRelations } from "@/app/lib/type/routes";

// Extend the props interface to include onRefresh if not already
interface ExtendedRouteTableProps extends RouteTableProps {
  onRefresh?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const RouteTable = ({
  routes,
  loading,
  pagination,
  onPageChange,
  onSelect,
  onRefresh,
  onEdit,
  onDelete,
}: ExtendedRouteTableProps) => {
  /* --------------------------------- states --------------------------------- */
  const [openDetails, setOpenDetails] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteWithRelations | null>(
    null
  );

  /* -------------------------------- handlers -------------------------------- */
  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedRoute(null);
    if (onSelect) onSelect(""); // deselect
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
    if (onRefresh) onRefresh();
  };

  const handleOpenDetails = (id: string) => {
    const route = routes.find((v) => v.id === id);
    if (!route) return;

    setSelectedRoute(route);
    setOpenDetails(true);
    if (onSelect) onSelect(id);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  // We are not handling rowsPerPage change in parent yet strictly, or default to 10.
  // If we want to support it, we need to update RouteTableProps and RoutesPageState.
  // For now, let's just keep it simple or assume fixed page size in UI for now as per strict instructions,
  // or allow it but just trigger page change to 0 if we were to implementing it fully.
  // But strict adherence shows we only passed onPageChange.
  // Let's just consume the pagination.pageSize from props.
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // TODO: Add onPageSizeChange to props if needed.
    // For now just console log or ignore to stick to interface
    console.warn("Change rows per page not implemented in parent yet");
  };

  if (loading && routes.length === 0) {
    return (
      <>
        <CustomCard sx={{ padding: "0 0 6px 0" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
              Detailed ACTIVE ROUTES
            </Typography>
            <Button variant="contained" size="small" disabled>
              Add Route
            </Button>
          </Stack>
          <Divider />
          <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ROUTE ID</TableCell>
                  <TableCell>VEHICLE PLATE</TableCell>
                  <TableCell>ORIGIN</TableCell>
                  <TableCell>DESTINATION</TableCell>
                  <TableCell>ETA</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={90} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomCard>
      </>
    );
  }

  return (
    <>
      <CustomCard sx={{ padding: "0 0 6px 0" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            Detailed ACTIVE ROUTES
          </Typography>
          <Button variant="contained" size="small" onClick={handleOpenAdd}>
            Add Route
          </Button>
        </Stack>
        <Divider />

        <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ROUTE ID</TableCell>
                <TableCell>VEHICLE PLATE</TableCell>
                <TableCell>ORIGIN</TableCell>
                <TableCell>DESTINATION</TableCell>
                <TableCell>ETA</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {routes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell sx={{ paddingBlock: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {r.name || r.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ paddingBlock: 2 }}>
                    {r.vehicle?.plate || "Unassigned"}
                  </TableCell>
                  <TableCell sx={{ paddingBlock: 2 }}>
                    {r.startAddress || "N/A"}
                  </TableCell>
                  <TableCell sx={{ paddingBlock: 2 }}>
                    {r.endAddress || "N/A"}
                  </TableCell>
                  <TableCell sx={{ paddingBlock: 2 }}>
                    {r.endTime ? new Date(r.endTime).toLocaleString() : "N/A"}
                  </TableCell>
                  <TableCell sx={{ paddingBlock: 2 }}>
                    <StatusChip status={r.status} />
                  </TableCell>
                  <TableCell align="right">
                    <RowActions
                      id={r.id}
                      handleOpenDetails={handleOpenDetails}
                      handleEdit={onEdit}
                      handleDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {routes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No routes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={pagination.total}
            rowsPerPage={pagination.pageSize}
            page={pagination.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </CustomCard>
      <RouteDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        route={selectedRoute}
      />
      <AddRouteDialog open={openAdd} onClose={handleCloseAdd} />
    </>
  );
};

export default RouteTable;
