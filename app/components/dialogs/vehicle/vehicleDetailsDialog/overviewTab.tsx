import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import {
  Stack,
  Typography,
  LinearProgress,
  Card,
  Button,
  alpha,
  Box,
} from "@mui/material";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SpeedIcon from "@mui/icons-material/Speed";
import ConstructionIcon from "@mui/icons-material/Construction";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import MapVehicleOverviewCard from "./map";
import { useState } from "react";
import AssignDriverDialog from "../assignDriverDialog";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface OverviewTabProps {
  vehicle?: VehicleWithRelations;
  onUpdate?: () => void;
}

const OverviewTab = ({ vehicle, onUpdate }: OverviewTabProps) => {
  const dict = useDictionary();
  /* --------------------------------- states --------------------------------- */
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  if (!vehicle) {
    return <Typography color="text.secondary">{dict.common.noData || "No vehicle selected"}</Typography>;
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
        <Stack spacing={2} width={"45%"} sx={{ overflowY: 'auto', pr: 1 }}>
          {vehicle.photo && (
            <Card
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                bgcolor: alpha("#1A202C", 0.5),
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${alpha("#ffffff", 0.05)}`,
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={vehicle.photo}
                alt={`${vehicle.brand} ${vehicle.model}`}
                sx={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1.5,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                }}
              >
                <Typography variant="caption" sx={{ color: "white", fontWeight: 600, opacity: 0.8 }}>
                  {dict.vehicles.dialogs.preview}
                </Typography>
              </Box>
            </Card>
          )}
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
                bgcolor: alpha("#1A202C", 0.5),
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${alpha("#ffffff", 0.05)}`,
              }}
            >
              <Typography sx={{ fontSize: 16, color: "text.secondary" }}>
                {dict.vehicles.fields.fuelLevel}
              </Typography>
              <Typography sx={{ fontSize: 20, color: "white" }}>
                %{vehicle.fuelLevel}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={vehicle.fuelLevel ?? 0}
                sx={{ width: 100, height: 5 }}
              />
              <LocalGasStationIcon
                sx={{
                  fontSize: 24,
                  marginTop: "auto",
                  color: "text.secondary",
                }}
              />
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
                bgcolor: alpha("#1A202C", 0.5),
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${alpha("#ffffff", 0.05)}`,
              }}
            >
              <Typography sx={{ fontSize: 16, color: "text.secondary" }}>
                {dict.vehicles.fields.odometer}
              </Typography>
              <Typography sx={{ fontSize: 20, color: "white" }}>
                {vehicle.odometerKm?.toLocaleString("en-US")} km
              </Typography>
              <SpeedIcon
                sx={{
                  fontSize: 24,
                  marginTop: "auto",
                  color: "text.secondary",
                }}
              />
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
                bgcolor: alpha("#1A202C", 0.5),
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${alpha("#ffffff", 0.05)}`,
              }}
            >
              <Typography sx={{ fontSize: 16, color: "text.secondary" }}>
                {dict.vehicles.fields.service}
              </Typography>
              <Typography sx={{ fontSize: 20, color: "white" }}>
                {vehicle?.nextServiceKm && vehicle?.odometerKm
                  ? (vehicle.nextServiceKm - vehicle.odometerKm).toLocaleString(
                      "en-US"
                    )
                  : dict.common.na}{" "}
                {dict.vehicles.dialogs.kmLeft}
              </Typography>
              <ConstructionIcon
                sx={{
                  fontSize: 24,
                  marginTop: "auto",
                  color: "text.secondary",
                }}
              />
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
                bgcolor: alpha("#1A202C", 0.5),
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${alpha("#ffffff", 0.05)}`,
              }}
            >
              <Typography sx={{ fontSize: 16, color: "text.secondary" }}>
                {dict.vehicles.fields.avgFuelConsumption}
              </Typography>
              <Typography sx={{ fontSize: 20, color: "white" }}>
                {vehicle?.avgFuelConsumption?.toLocaleString("en-US")} L/100km
              </Typography>
              <OilBarrelIcon
                sx={{
                  fontSize: 24,
                  marginTop: "auto",
                  color: "text.secondary",
                }}
              />
            </Card>
          </Stack>
          <Stack spacing={2}>
            <Button
              variant="contained"
              sx={{
                borderRadius: "8px",
                bgcolor: "#246BFD",
                textTransform: "none",
                "&:hover": { bgcolor: alpha("#246BFD", 0.9) },
              }}
              onClick={() => setAssignDialogOpen(true)}
            >
              {vehicle.driver ? dict.drivers.dialogs.editTitle : dict.vehicles.dialogs.assignDriver}
            </Button>
            {/* Removed non-functional 'Get Vehicle Data' button */}
          </Stack>
        </Stack>
        <Stack width={"50%"}>
          <MapVehicleOverviewCard
            id={vehicle.id}
            name={vehicle.plate}
            dbLocation={
              vehicle.currentLat && vehicle.currentLng
                ? { lat: vehicle.currentLat, lng: vehicle.currentLng }
                : null
            }
          />
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
