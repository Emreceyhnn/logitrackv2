import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import { Stack, Typography, LinearProgress, Card, Button } from "@mui/material";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SpeedIcon from "@mui/icons-material/Speed";
import ConstructionIcon from "@mui/icons-material/Construction";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import MapVehicleOverviewCard from "./map";
import { useState } from "react";
import AssignDriverDialog from "../assignDriverDialog";

interface OverviewTabProps {
  vehicle?: VehicleWithRelations;
  onUpdate?: () => void;
}

const OverviewTab = ({ vehicle, onUpdate }: OverviewTabProps) => {
  /* --------------------------------- states --------------------------------- */
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  if (!vehicle) {
    return <Typography color="text.secondary">No vehicle selected</Typography>;
  }

  /* -------------------------------- handlers -------------------------------- */
  const handleAssignSuccess = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <>
      <Stack
        spacing={2}
        direction={"row"}
        maxHeight={450}
        height={"100%"}
        justifyContent={"space-between"}
      >
        <Stack spacing={2} width={"45%"}>
          <Stack direction={"row"} spacing={1}>
            <Card
              sx={{
                p: 2,
                gap: 1,
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
                borderRadius: "8px",
                flexGrow: 1,
              }}
            >
              <Typography sx={{ fontSize: 16 }}>Fuel Level</Typography>
              <Typography sx={{ fontSize: 20 }}>
                %{vehicle.fuelLevel}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={vehicle.fuelLevel ?? 0}
                sx={{ width: 100, height: 5 }}
              />
              <LocalGasStationIcon sx={{ fontSize: 24, marginTop: "auto" }} />
            </Card>
            <Card
              sx={{
                p: 2,
                gap: 1,
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
                borderRadius: "8px",
                flexGrow: 1,
              }}
            >
              <Typography sx={{ fontSize: 16 }}>Odometer</Typography>
              <Typography sx={{ fontSize: 20 }}>
                {vehicle.odometerKm?.toLocaleString("en-US")} km
              </Typography>
              <SpeedIcon sx={{ fontSize: 24, marginTop: "auto" }} />
            </Card>
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <Card
              sx={{
                p: 2,
                gap: 1,
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
                borderRadius: "8px",
                flexGrow: 1,
              }}
            >
              <Typography sx={{ fontSize: 16 }}>Next Service</Typography>
              <Typography sx={{ fontSize: 20 }}>
                {vehicle?.nextServiceKm && vehicle?.odometerKm
                  ? (vehicle.nextServiceKm - vehicle.odometerKm).toLocaleString(
                      "en-US"
                    )
                  : "N/A"}{" "}
                km left
              </Typography>
              <ConstructionIcon sx={{ fontSize: 24, marginTop: "auto" }} />
            </Card>
            <Card
              sx={{
                p: 2,
                gap: 1,
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
                borderRadius: "8px",
                flexGrow: 1,
              }}
            >
              <Typography sx={{ fontSize: 16 }}>Fuel Consumption</Typography>
              <Typography sx={{ fontSize: 20 }}>
                {vehicle?.avgFuelConsumption?.toLocaleString("en-US")} L/100km
              </Typography>
              <OilBarrelIcon sx={{ fontSize: 24, marginTop: "auto" }} />
            </Card>
          </Stack>
          <Stack spacing={2}>
            <Button
              variant="contained"
              sx={{ borderRadius: "8px" }}
              onClick={() => setAssignDialogOpen(true)}
            >
              {vehicle.driver ? "Manage Driver" : "Assign Driver"}
            </Button>
            {/* Removed non-functional 'Get Vehicle Data' button */}
          </Stack>
        </Stack>
        <Stack width={"50%"}>
          <MapVehicleOverviewCard id={vehicle.id} />
        </Stack>
      </Stack>

      <AssignDriverDialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        vehicleId={vehicle.id}
        vehiclePlate={vehicle.plate}
        currentDriver={vehicle.driver}
        onSuccess={handleAssignSuccess}
      />
    </>
  );
};

export default OverviewTab;
