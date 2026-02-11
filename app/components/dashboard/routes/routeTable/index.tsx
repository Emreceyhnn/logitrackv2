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
import { useState, useEffect } from "react";
import RowActions from "../../vehicle/vehicleTable/menu";

import { Route } from "@/app/lib/type/RoutesType";
import RoutesDialog from "@/app/components/dialogs/routes";
import { StatusChip } from "@/app/components/chips/statusChips";

const RouteTable = () => {
  /* --------------------------------- states --------------------------------- */
  const [open, setOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any | undefined>(undefined);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------------- effects -------------------------------- */
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // TODO: Replace with actual user ID and company ID from context/auth
        // For now, these permissions might be checked server-side based on session
        // But the controller requires them. We might need a wrapper or use the session in the controller.
        // Assuming the server action handles session if not passed, OR we strictly pass them.
        // Since this is a client component, we can't easily get session here without passing it down.
        // However, for this task, I will assume a hardcoded or context-based user is available 
        // OR simply call the action which (if updated to use auth()) would work.
        // But existing controller expects arguments.
        // Checking `routes.ts`: `export async function getRoutes(companyId: string, userId: string)`
        // We need these IDs. 
        // For the sake of this task enabling the view, I'll use hardcoded IDs matching the seed
        // if context is not available. 

        const COMPANY_ID = 'cmlgt985b0003x0cuhtyxoihd';
        const USER_ID = 'usr_001'; // Admin user from mock/seed

        const data = await import("@/app/lib/controllers/routes").then(mod => mod.getRoutes(COMPANY_ID, USER_ID));
        setRoutes(data);
      } catch (err: any) {
        console.error("Failed to fetch routes:", err);
        setError("Failed to load routes");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  /* -------------------------------- handlers -------------------------------- */
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (id: string) => {
    const route = routes.find((v) => v.id === id);
    if (!route) return;

    // Map backend route to frontend Route interface if needed by Dialog
    // Or update Dialog to accept backend type.
    // For now passing as is (any) or mapping bare minimum
    setSelectedRoute(route);
    setOpen(true);
  };

  if (loading) return <Typography sx={{ p: 2 }}>Loading routes...</Typography>;
  if (error) return <Typography sx={{ p: 2, color: 'error.main' }}>{error}</Typography>;

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
                    <RowActions id={r.id} handleOpenDetails={handleOpen} />
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
