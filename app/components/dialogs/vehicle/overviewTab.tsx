import { Vehicle } from "@/app/lib/type/VehicleType";
import { Stack, Typography, LinearProgress } from "@mui/material";

interface OverviewTabProps {
  vehicle?: Vehicle;
}

const OverviewTab = ({ vehicle }: OverviewTabProps) => {
  if (!vehicle) {
    return <Typography color="text.secondary">No vehicle selected</Typography>;
  }

  return (
    <Stack spacing={2} direction={"column"} minHeight={450}>
      <Typography sx={{ fontSize: 18 }}>Fuel Level</Typography>
      <LinearProgress
        variant="determinate"
        value={vehicle.fuel.levelPct}
        sx={{ width: 100, height: 5 }}
      />
    </Stack>
  );
};

export default OverviewTab;
