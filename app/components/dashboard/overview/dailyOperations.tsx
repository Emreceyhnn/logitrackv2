import {
  Box,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CustomCard from "../../cards/card";
import DirectionsIcon from "@mui/icons-material/Directions";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { DailyOperationsData } from "@/app/lib/type/overview";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useMemo } from "react";

interface DailyOperationsCardProps {
  values: DailyOperationsData | null;
}

const DailyOperationsCard = ({ values }: DailyOperationsCardProps) => {
  const dict = useDictionary();
  const theme = useTheme();

  const items = useMemo(() => {
    if (!values) return [];
    return [
      {
        label: dict.dashboard.overview.dailyOperations.plannedRoutes,
        value: values.plannedRoutes,
        icon: <DirectionsIcon sx={{ fontSize: 20 }} />,
        color: theme.palette.kpi.indigo,
        bgColor: theme.palette.kpi.indigo_alpha.main_10,
      },
      {
        label: dict.dashboard.overview.dailyOperations.completedDeliveries,
        value: values.completedDeliveries,
        icon: <PlaceIcon sx={{ fontSize: 20 }} />,
        color: theme.palette.kpi.emerald,
        bgColor: theme.palette.kpi.emerald_alpha.main_10,
      },
      {
        label: dict.dashboard.overview.dailyOperations.failedDeliveries,
        value: values.failedDeliveries,
        icon: <ErrorOutlineIcon sx={{ fontSize: 20 }} />,
        color: theme.palette.kpi.error,
        bgColor: theme.palette.error._alpha.main_10,
      },
      {
        label: dict.dashboard.overview.dailyOperations.avgDuration,
        value: values.avgDeliveryTimeMin || "--",
        icon: <AccessTimeIcon sx={{ fontSize: 20 }} />,
        color: theme.palette.kpi.amber,
        bgColor: theme.palette.kpi.amber_alpha.main_10,
      },
      {
        label: dict.dashboard.overview.dailyOperations.fuelConsumed,
        value: values.fuelConsumedLiters,
        icon: <LocalGasStationIcon sx={{ fontSize: 20 }} />,
        color: theme.palette.kpi.sky,
        bgColor: theme.palette.kpi.sky_alpha.main_10,
      },
    ];
  }, [values, dict, theme]);

  if (!values) return null;

  return (
    <CustomCard
      sx={{
        padding: "0 0 6px 0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        {dict.dashboard.overview.dailyOperations.title}
      </Typography>
      <Divider />

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <List sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {items.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: 2,
                bgcolor: theme.palette.background.default_alpha.main_60,
                boxShadow: `0 2px 8px ${theme.palette.common.black_alpha.main_04}`,
                border: `1px solid ${theme.palette.divider_alpha.main_50}`,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    bgcolor: item.bgColor,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="text.secondary"
                >
                  {item.label}
                </Typography>
              </Stack>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="text.primary"
              >
                {item.value}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </CustomCard>
  );
};

export default DailyOperationsCard;
