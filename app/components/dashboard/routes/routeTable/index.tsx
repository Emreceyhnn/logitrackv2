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
} from "@mui/material";
import CustomCard from "../../../cards/card";
import { useUser } from "@/app/lib/hooks/useUser";
import { useState, useEffect } from "react";
import RowActions from "../../vehicle/vehicleTable/menu";

import RouteDetailsDialog from "@/app/components/dialogs/routes";
import AddRouteDialog from "@/app/components/dialogs/routes/add-route-dialog";
import { StatusChip } from "@/app/components/chips/statusChips";

const RouteTable = () => {
  /* --------------------------------- states --------------------------------- */
  const [openDetails, setOpenDetails] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any | undefined>(
    undefined
  );
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const { user, loading: userLoading } = useUser();

  /* --------------------------------- effects -------------------------------- */
  useEffect(() => {
    const fetchRoutes = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await import("@/app/lib/controllers/routes").then((mod) =>
          mod.getRoutes(user.companyId, user.id, page + 1, rowsPerPage)
        );
        setRoutes(data.routes || []);
        setTotalCount(data.totalCount || 0);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch routes:", err);
        setError("Failed to load routes");
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && user) {
      fetchRoutes();
    }
  }, [user, userLoading, page, rowsPerPage]);

  /* -------------------------------- handlers -------------------------------- */
  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedRoute(undefined);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenDetails = (id: string) => {
    const route = routes.find((v) => v.id === id);
    if (!route) return;

    setSelectedRoute(route);
    setOpenDetails(true);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && routes.length === 0)
    return <Typography sx={{ p: 2 }}>Loading routes...</Typography>;
  if (error)
    return <Typography sx={{ p: 2, color: "error.main" }}>{error}</Typography>;

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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </CustomCard>
      <RouteDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        routeData={selectedRoute}
      />
      <AddRouteDialog open={openAdd} onClose={handleCloseAdd} />
    </>
  );
};

export default RouteTable;
