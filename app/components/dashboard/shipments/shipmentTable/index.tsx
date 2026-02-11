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
import RowActions from "./menu";
import ShipmentDetailDialog from "../../../dialogs/shipment/shipmentDetailDialog";
import { useState, useEffect } from "react";
import { Shipment } from "@/app/lib/type/ShipmentType";
import { StatusChip } from "@/app/components/chips/statusChips";
import { PriorityChip } from "@/app/components/chips/priorityChips";

const ShipmentTable = () => {
  /* --------------------------------- states --------------------------------- */
  const [open, setOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<
    Shipment | undefined
  >(undefined);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------------- effects -------------------------------- */
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const COMPANY_ID = 'cmlgt985b0003x0cuhtyxoihd';
        const USER_ID = 'usr_001';

        const data = await import("@/app/lib/controllers/shipments").then(mod => mod.getShipments(COMPANY_ID, USER_ID));

        // Map DB data to Frontend Shipment Interface
        const mappedShipments: Shipment[] = data.map((s: any) => ({
          id: s.id,
          orderNumber: s.trackingId,
          status: s.status,
          priority: "NORMAL", // Placeholder as DB doesn't have priority yet
          customerId: s.customer?.name || s.customerId,
          origin: {
            type: "WAREHOUSE", // Assumption based on text
            warehouseId: s.origin
          },
          destination: {
            type: "CUSTOMER_SITE",
            address: s.destination
          },
          dates: {
            created: s.createdAt.toString(),
            requestedDelivery: s.createdAt.toString(), // Placeholder
          },
          items: Array(s.itemsCount).fill(0).map((_, i) => ({
            skuId: `SKU-${i + 1}`,
            name: "Generic Item",
            qty: 1,
            price: 100
          })),
          cargoDetails: {
            totalWeightKg: s.itemsCount * 10, // Estimate
            totalVolumeM3: s.itemsCount * 0.1, // Estimate
            packageCount: s.itemsCount
          },
          assignedTo: s.routeId ? {
            routeId: s.routeId,
            loadSequence: 1
          } : null,
          tracking: {
            currentStage: s.status,
            milestones: []
          },
          routeId: s.routeId || undefined,
          driverId: s.driverId || undefined
        }));

        setShipments(mappedShipments);
      } catch (err: any) {
        console.error("Failed to fetch shipments:", err);
        setError("Failed to load shipments");
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  /* -------------------------------- handlers -------------------------------- */
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (id: string) => {
    const shipment = shipments.find((s) => s.id === id);
    if (!shipment) return;

    setSelectedShipment(shipment);
    setOpen(true);
  };

  if (loading) return <Typography sx={{ p: 2 }}>Loading shipments...</Typography>;
  if (error) return <Typography sx={{ p: 2, color: 'error.main' }}>{error}</Typography>;

  return (
    <>
      <CustomCard sx={{ padding: "0 0 6px 0" }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
          Shipment List
        </Typography>
        <Divider />

        <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Pickup (Planned)</TableCell>
                <TableCell>Dropoff (Planned)</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Route</TableCell>
                <TableCell align="right">Cargo Kg</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {shipments.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.orderNumber}</TableCell>
                  <TableCell>
                    <StatusChip status={s.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityChip status={s.priority} />
                  </TableCell>
                  <TableCell>
                    {new Date(s.dates.created)?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(s.dates.requestedDelivery)?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{s.driverId || "-"}</TableCell>
                  <TableCell>{s.routeId || "-"}</TableCell>
                  <TableCell align="right">
                    {s.cargoDetails.totalWeightKg}
                  </TableCell>
                  <TableCell align="right">
                    <RowActions id={s.id} handleOpenDetails={handleOpen} />
                  </TableCell>
                </TableRow>
              ))}
              {shipments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    No shipments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomCard>
      <ShipmentDetailDialog
        open={open}
        onClose={handleClose}
        shipmentData={selectedShipment}
      />
    </>
  );
};

export default ShipmentTable;
