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
} from "@mui/material";
import CustomCard from "../../../cards/card";
import mockData from "@/app/lib/mockData.json";
import { useState } from "react";
import RowActions from "../../vehicle/vehicleTable/menu";

import { Route } from "@/app/lib/type/RoutesType";
import RoutesDialog from "@/app/components/dialogs/routes";
import { StatusChip } from "@/app/components/chips/statusChips";

const RouteTable = () => {
  /* --------------------------------- states --------------------------------- */
  const [open, setOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | undefined>(
    undefined
  );

  /* -------------------------------- handlers -------------------------------- */
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (id: string) => {
    const routes = mockData.routes.find((v) => v.id === id);
    if (!routes) return;

    setSelectedRoute(routes);
    setOpen(true);
  };

  return (
    <>
      <CustomCard sx={{ padding: "0 0 6px 0" }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
          Detailed ACTIVE ROUTES
        </Typography>
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
              {mockData.routes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell sx={{ paddingBlock: 2 }}>{r.id}</TableCell>
                  <TableCell sx={{ paddingBlock: 2 }}>{r.vehicleId}</TableCell>
                  <TableCell sx={{ paddingBlock: 2 }}>
                    {r.stops[0]?.locationName || "N/A"}
                  </TableCell>
                  <TableCell sx={{ paddingBlock: 2 }}>
                    {r.stops[r.stops.length - 1]?.locationName || "N/A"}
                  </TableCell>
                  <TableCell sx={{ paddingBlock: 2 }}>
                    {r.stops[r.stops.length - 1]?.eta || "N/A"}
                  </TableCell>
                  <TableCell sx={{ paddingBlock: 2 }}>
                    <StatusChip status={r.status} />
                  </TableCell>
                  <TableCell align="right">
                    <RowActions id={r.id} handleOpenDetails={handleOpen} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomCard>
      <RoutesDialog
        open={open}
        onClose={handleClose}
        routeData={selectedRoute}
      />
    </>
  );
};

export default RouteTable;
