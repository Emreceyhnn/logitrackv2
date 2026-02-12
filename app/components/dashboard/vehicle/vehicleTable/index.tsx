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
import { StatusChip } from "@/app/components/chips/statusChips";
import { getVehicles } from "@/app/lib/controllers/vehicle";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";

const VehicleTable = () => {
  /* --------------------------------- states --------------------------------- */
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<
    VehicleWithRelations | undefined
  >(undefined);
  const [vehicles, setVehicles] = useState<VehicleWithRelations[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
        console.log(data);
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
                <TableCell>Type</TableCell>
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
                  <TableCell>{v.odometerKm ?? "N/A"}</TableCell>
                  <TableCell>
                    {v.driver?.user
                      ? `${v.driver.user.name} ${v.driver.user.surname}`
                      : "No Assigned"}
                  </TableCell>
                  <TableCell>{v.type}</TableCell>
                  <TableCell align="right">{v.fuelLevel ?? 0}%</TableCell>
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
