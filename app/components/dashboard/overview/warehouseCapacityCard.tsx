import { Box, Divider, LinearProgress, Stack, Typography, alpha, useTheme } from "@mui/material";
import CustomCard from "../../cards/card";
import { WarehouseCapacityStat } from "@/app/lib/type/overview";
import WarehouseIcon from "@mui/icons-material/Warehouse";

interface WarehouseCapacityCardProps {
  values: WarehouseCapacityStat[];
}

const WarehouseCapacityCard = ({ values }: WarehouseCapacityCardProps) => {
  const theme = useTheme();

  if (!values) return null;

  return (
    <CustomCard sx={{ padding: "0 0 6px 0", height: "100%", maxHeight: 360, display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Warehouse Utilization
      </Typography>
      <Divider />
      
      <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
        {values.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" height="100%" minHeight={150} spacing={2} sx={{ opacity: 0.5 }}>
            <WarehouseIcon sx={{ fontSize: 40 }} />
            <Typography variant="body2">No warehouses found</Typography>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            {values.map((w, index) => {
              const isDanger = w.capacity > 85;
              const isWarning = w.capacity > 65 && !isDanger;
              const barColor = isDanger 
                ? theme.palette.error.main 
                : isWarning 
                  ? theme.palette.warning.main 
                  : theme.palette.success.main;

              return (
                <Stack key={index} spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                    <Typography fontWeight={600} fontSize={15} color="text.primary">
                      {w.warehouseName}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} sx={{ color: barColor }}>
                      {w.capacity}% 
                    </Typography>
                  </Stack>
                  
                  <LinearProgress
                    value={w.capacity}
                    variant="determinate"
                    sx={{
                      height: 8,
                      bgcolor: alpha(theme.palette.divider, 0.1),
                      borderRadius: 4,
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        bgcolor: barColor,
                      },
                    }}
                  />
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      {w.palletUsed.toLocaleString()} / {w.palletCapacity.toLocaleString()} pallets
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {w.volumeUsed.toLocaleString()} / {w.volumeCapacity.toLocaleString()} m³
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Box>
    </CustomCard>
  );
};

export default WarehouseCapacityCard;
