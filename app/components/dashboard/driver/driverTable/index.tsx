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
  Chip,
} from "@mui/material";
import CustomCard from "../../../cards/card";
import RowActions from "./menu";
import { useEffect, useState } from "react";
import DriverDialog from "../../../dialogs/driver";
import { Driver } from "@/app/lib/type/DriverType";
import { StatusChip } from "@/app/components/chips/statusChips";
import { getDrivers } from "@/app/lib/controllers/driver";

const DriverTable = () => {
  /* --------------------------------- states --------------------------------- */
  const [open, setOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>(
    undefined
  );
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        const mappedDrivers: Driver[] = data.map((d: any) => ({
          id: d.id,
          code: d.employeeId || "N/A",
          fullName: `${d.user.name} ${d.user.surname}`,
          phone: d.phone,
          email: d.user.email,
          status: d.status,
          homeBaseWarehouseId: d.homeBaseWarehouseId || "",
          licenses: d.documents?.map((doc: any) => ({
            type: "Class A", // Placeholder as doc type is typically just "LICENSE"
            expiresOn: doc.expiryDate ? doc.expiryDate.toString() : ""
          })) || [
              // Fallback if no documents, use fields from driver table if present, or mock
              { type: d.licenseType || "Class A", expiresOn: d.licenseExpiry ? d.licenseExpiry.toString() : "" }
            ],
          compliance: {
            lastMedicalCheck: "2024-01-01", // Mock
            workingHours: {
              todayMinutes: 480,
              weekMinutes: 2400
            },
            restRequirement: {
              minRestMinutes: 60,
              met: true
            }
          },
          rating: {
            avg: d.rating || 5,
            count: 10
          },
          assigned: {
            vehicleId: d.currentVehicleId,
            routeId: null,
            activeShipmentIds: d.shipments?.map((s: any) => s.id) || []
          }
        }));
        setDrivers(mappedDrivers);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  /* -------------------------------- handlers -------------------------------- */
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (id: string) => {
    const driver = drivers.find((d) => d.id === id);
    if (!driver) return;
    setSelectedDriver(driver);
    setOpen(true);
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
                <TableCell>Licenses</TableCell>
                <TableCell align="right">Safety Rating</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {drivers.map((d, index) => (
                <TableRow key={d.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{d.fullName}</TableCell>
                  <TableCell>
                    <StatusChip status={d.status} />
                  </TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell>
                    {d.assigned.vehicleId ?? "No assigned vehicle"}
                  </TableCell>
                  <TableCell>
                    {d.licenses.map((l) => l.type).join(", ")}
                  </TableCell>
                  <TableCell align="right">{d.rating.avg} / 5</TableCell>
                  <TableCell align="right">
                    <RowActions id={d.id} handleOpenDetails={handleOpen} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomCard>
      <DriverDialog
        open={open}
        onClose={handleClose}
        driverData={selectedDriver}
      />
    </>
  );
};

export default DriverTable;
