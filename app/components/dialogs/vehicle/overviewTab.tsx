import { Vehicle } from "@/app/lib/type/VehicleType";
import {
  Stack, Typography, LinearProgress, Card, Button,
} from "@mui/material";
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import ConstructionIcon from '@mui/icons-material/Construction';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import MapVehicleOverviewCard from "./map";



interface OverviewTabProps {
  vehicle?: Vehicle;
}

const OverviewTab = ({ vehicle }: OverviewTabProps) => {
  if (!vehicle) {
    return <Typography color="text.secondary">No vehicle selected</Typography>;
  }

  return (
    <Stack spacing={2} direction={"row"} maxHeight={450} height={"100%"} justifyContent={"space-between"}>

      <Stack spacing={2} width={"45%"}>
        <Stack direction={"row"} spacing={1}>
          <Card sx={{ p: 2, gap: 1, display: "flex", alignItems: "start", flexDirection: "column", borderRadius: "8px", flexGrow: 1 }}>
            <Typography sx={{ fontSize: 16 }}>Fuel Level</Typography>
            <Typography sx={{ fontSize: 20 }}>%{vehicle.currentStatus.fuelLevelPct}</Typography>
            <LinearProgress
              variant="determinate"
              value={vehicle.currentStatus.fuelLevelPct}
              sx={{ width: 100, height: 5 }}
            />
            <LocalGasStationIcon sx={{ fontSize: 24, marginTop: "auto" }} />
          </Card>
          <Card sx={{ p: 2, gap: 1, display: "flex", alignItems: "start", flexDirection: "column", borderRadius: "8px", flexGrow: 1 }}>
            <Typography sx={{ fontSize: 16 }}>Odometer</Typography>
            <Typography sx={{ fontSize: 20 }}>{vehicle.currentStatus.odometerKm.toLocaleString("en-US")} km</Typography>
            <SpeedIcon sx={{ fontSize: 24, marginTop: "auto" }} />
          </Card>
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <Card sx={{ p: 2, gap: 1, display: "flex", alignItems: "start", flexDirection: "column", borderRadius: "8px", flexGrow: 1 }}>
            <Typography sx={{ fontSize: 16 }}>Next Service</Typography>
            <Typography sx={{ fontSize: 20 }}>{(vehicle.maintenance.nextServiceKm - vehicle.currentStatus.odometerKm).toLocaleString("en-US")} km left</Typography>
            <ConstructionIcon sx={{ fontSize: 24, marginTop: "auto" }} />
          </Card>
          <Card sx={{ p: 2, gap: 1, display: "flex", alignItems: "start", flexDirection: "column", borderRadius: "8px", flexGrow: 1 }}>
            <Typography sx={{ fontSize: 16 }}>Fuel Consumption</Typography>
            <Typography sx={{ fontSize: 20 }}>{vehicle.specs.mpg ? (235.21 / vehicle.specs.mpg).toFixed(1) : "N/A"}</Typography>
            <OilBarrelIcon sx={{ fontSize: 24, marginTop: "auto" }} />
          </Card>

        </Stack>
        <Stack spacing={2}>
          <Button variant="contained" sx={{ borderRadius: "8px" }}>Assign Driver</Button>
          <Button variant="outlined" sx={{ borderRadius: "8px" }}>Get Vehicle Data</Button>
        </Stack>
      </Stack>
      <Stack width={"50%"}>
        <MapVehicleOverviewCard id={vehicle.id} />
      </Stack>

    </Stack>
  );
};

export default OverviewTab;
