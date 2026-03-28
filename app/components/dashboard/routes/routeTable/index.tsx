"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  alpha,
  useTheme,
  Typography,
} from "@mui/material";
import { useState } from "react";
import RouteRowActions from "./routeRowActions";
import RouteDetailsDialog from "@/app/components/dialogs/routes";
import { StatusChip } from "@/app/components/chips/statusChips";
import { RouteTableProps, RouteWithRelations } from "@/app/lib/type/routes";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

interface ExtendedRouteTableProps extends RouteTableProps {
  onRefresh?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const RouteTable = ({
  routes,
  loading = false,
  pagination,
  onPageChange,
  onSelect,
  onEdit,
  onDelete,
  onRefresh,
}: ExtendedRouteTableProps) => {
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteWithRelations | null>(
    null
  );

  if (loading) {
    return <TableSkeleton title="Active Routes" rows={10} columns={7} />;
  }

  /* -------------------------------- handlers -------------------------------- */
  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedRoute(null);
    if (onSelect) onSelect("");
  };

  const handleOpenDetails = (id: string) => {
    const route = routes.find((v) => v.id === id);
    if (!route) return;

    setSelectedRoute(route);
    setOpenDetails(true);
    if (onSelect) onSelect(id);
  };

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = () => {
    console.warn("Change rows per page not implemented in parent yet");
  };

  return (
    <TableContainer sx={{ p: 0 }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
          <TableRow>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Route Id
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Vehicle Plate
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Origin
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Destination
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              ETA
            </TableCell>
            <TableCell sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}>
              Status
            </TableCell>
            <TableCell
              sx={{ borderColor: alpha(theme.palette.divider, 0.1) }}
              align="right"
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody sx={{ "& tr:last-child td": { border: 0 } }}>
          {routes.map((r) => (
            <TableRow
              key={r.id}
              hover
              sx={{ "& td": { borderColor: alpha(theme.palette.divider, 0.1) } }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {r.name || r.id}
                </Typography>
              </TableCell>
              <TableCell>{r.vehicle?.plate || "Unassigned"}</TableCell>
              <TableCell>{r.startAddress || "N/A"}</TableCell>
              <TableCell>{r.endAddress || "N/A"}</TableCell>
              <TableCell>
                {r.endTime ? new Date(r.endTime).toLocaleString() : "N/A"}
              </TableCell>
              <TableCell>
                <StatusChip status={r.status} />
              </TableCell>
              <TableCell align="right">
                <RouteRowActions
                  id={r.id}
                  status={r.status}
                  handleOpenDetails={handleOpenDetails}
                  handleEdit={onEdit}
                  handleDelete={onDelete}
                  onRefresh={onRefresh}
                />
              </TableCell>
            </TableRow>
          ))}
          {routes.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                align="center"
                sx={{ py: 3, borderColor: alpha(theme.palette.divider, 0.1) }}
              >
                No routes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.pageSize}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <RouteDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        route={selectedRoute}
      />
    </TableContainer>
  );
};

export default RouteTable;
