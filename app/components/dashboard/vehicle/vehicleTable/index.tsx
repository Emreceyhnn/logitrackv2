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
import RowActions from "./menu";
import VehicleDialog from "../../../dialogs/vehicle";
import { useEffect, useState } from "react";
import { Vehicle } from "@/app/lib/type/VehicleType";
import { StatusChip } from "@/app/components/chips/statusChips";
import { getVehicles } from "@/app/lib/controllers/vehicle";

const VehicleTable = () => {
  /* --------------------------------- states --------------------------------- */
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(
    undefined
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        const mappedVehicles: Vehicle[] = data.map((v: any) => ({
          id: v.id,
          fleetNo: v.fleetNo,
          plate: v.plate,
          type: v.type,
          brand: v.brand,
          model: v.model,
          year: v.year,
          status: v.status,
          specs: {
            maxLoadKg: v.maxLoadKg,
            heightM: 3.5,
            fuelType: v.fuelType,
            mpg: 0,
            rangeKm: 0
          },
          currentStatus: {
            location: {
              lat: v.currentLat || 0,
              lng: v.currentLng || 0,
              address: "Unknown"
            },
            speedKph: 0,
            fuelLevelPct: v.fuelLevel || 0,
            odometerKm: v.odometerKm || 0,
            engineStatus: v.status === 'ON_TRIP' ? 'RUNNING' : 'OFF',
            lastPing: new Date().toISOString()
          },
          maintenance: {
            nextServiceKm: (v.odometerKm || 0) + 5000,
            nextServiceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            status: v.status === 'MAINTENANCE' ? 'Attention' : 'Good',
            history: v.maintenanceRecords?.map((m: any) => ({
              id: m.id,
              date: m.date.toString(),
              serviceType: m.type,
              technician: "Unknown",
              cost: m.cost,
              currency: "USD",
              status: "Completed"
            })) || []
          },
          assignedTo: {
            driverId: v.driver?.id || null
          },
          documents: v.documents?.map((d: any) => ({
            type: d.type,
            status: "Valid",
            expiresOn: d.expiryDate ? d.expiryDate.toString() : ""
          })) || []
        }));
        setVehicles(mappedVehicles);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };
    fetchVehicles();
  }, []);

  /* -------------------------------- handlers -------------------------------- */
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (id: string) => {
    const vehicle = vehicles.find((v) => v.id === id);
    if (!vehicle) return;

    setSelectedVehicle(vehicle);
    setOpen(true);
  };

  return (
    <>
      <CustomCard sx={{ padding: "0 0 6px 0" }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
          Vehicle List
        </Typography>
        <Divider />

        <TableContainer component={Paper} elevation={0} sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Plate</TableCell>
                <TableCell>Brand/Model</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Odometer</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Ignition</TableCell>
                <TableCell align="right">Fuel Level</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {vehicles.map((v, index) => (
                <TableRow key={v.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{v.plate}</TableCell>
                  <TableCell>{`${v.brand} - ${v.model} / ${v.year}`}</TableCell>
                  <TableCell>
                    <StatusChip status={v.status} />
                  </TableCell>
                  <TableCell>{v.currentStatus.odometerKm}</TableCell>
                  <TableCell>
                    {v.assignedTo?.driverId ?? "No Assigned"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color:
                        v.currentStatus.engineStatus === "RUNNING"
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {v.currentStatus.engineStatus}
                  </TableCell>
                  <TableCell align="right">
                    {v.currentStatus.fuelLevelPct}%
                  </TableCell>
                  <TableCell align="right">
                    <RowActions id={v.id} handleOpenDetails={handleOpen} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomCard>
      <VehicleDialog
        open={open}
        onClose={handleClose}
        vehicleData={selectedVehicle}
      />
    </>
  );
};

export default VehicleTable;
