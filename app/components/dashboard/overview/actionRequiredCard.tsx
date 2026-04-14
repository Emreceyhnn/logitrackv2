import { Box, Divider, List, ListItem, ListItemButton, Stack, Typography, alpha, useTheme } from "@mui/material";
import CustomCard from "../../cards/card";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import SummarizeIcon from "@mui/icons-material/Summarize";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ReactNode } from "react";
import { ActionRequiredItems } from "@/app/lib/type/overview";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface ActionRequiredCardProps {
  alerts?: ActionRequiredItems[];
}

const ActionRequiredCard = ({ alerts = [] }: ActionRequiredCardProps) => {
  const dict = useDictionary();
  const theme = useTheme();
  const router = useRouter();

  const handleActionClick = (link?: string) => {
    if (link) {
      router.push(link);
    }
  };

  const setType: Record<ActionRequiredItems["type"], ReactNode> = {
    SHIPMENT_DELAY: (
      <Box
        sx={{
          bgcolor: (theme.palette.error as any)._alpha.main_10,
          color: theme.palette.error.main,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <LocalShippingIcon sx={{ fontSize: 18 }} />
      </Box>
    ),
    vehicle: (
      <Box
        sx={{
          bgcolor: (theme.palette.warning as any)._alpha.main_10,
          color: theme.palette.warning.main,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <DirectionsCarIcon sx={{ fontSize: 18 }} />
      </Box>
    ),
    driver: (
      <Box
        sx={{
          bgcolor: (theme.palette.secondary as any)._alpha.main_10,
          color: theme.palette.secondary.main,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <PersonIcon sx={{ fontSize: 18 }} />
      </Box>
    ),
    DOCUMENT_DUE: (
      <Box
        sx={{
          bgcolor: (theme.palette.info as any)._alpha.main_10,
          color: theme.palette.info.main,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <SummarizeIcon sx={{ fontSize: 18 }} />
      </Box>
    ),
    warehouse: (
      <Box
        sx={{
          bgcolor: (theme.palette.success as any)._alpha.main_10,
          color: theme.palette.success.main,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <WarehouseIcon sx={{ fontSize: 18 }} />
      </Box>
    ),
  };
  return (
    <CustomCard sx={{ padding: "0 0 6px 0", height: "100%", maxHeight: 360, display: "flex", flexDirection: "column" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
          {dict.dashboard.overview.actionRequired.title}
        </Typography>
        {alerts.length > 0 && (
          <Box
            sx={{
              bgcolor: (theme) => (theme.palette.error as any)._alpha.main_10,
              color: "error.main",
              px: 1,
              py: 0.25,
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {dict.dashboard.overview.actionRequired.pendingCount.replace("{count}", alerts.length.toString())}
          </Box>
        )}
      </Stack>
      <Divider />
      
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {alerts.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" height="100%" minHeight={200} spacing={2} p={3}>
            <Box sx={{ color: "success.main", opacity: 0.5 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 48 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" align="center">
              {dict.dashboard.overview.actionRequired.allClear}
            </Typography>
          </Stack>
        ) : (
          <List sx={{ p: 0 }}>
            {alerts.map((i, index) => (
              <Box key={index}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleActionClick(i.link)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      gap: 2,
                      p: 2,
                      transition: "background-color 0.2s",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {setType[i.type]}

                    <Stack spacing={0.25}>
                      <Typography fontSize={14} fontWeight={600} color="text.primary">
                        {i.title}
                      </Typography>
                      <Typography fontSize={13} color="text.secondary">
                        {i.message}
                      </Typography>
                    </Stack>
                  </ListItemButton>
                </ListItem>
                {index !== alerts.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Box>
    </CustomCard>
  );
};

export default ActionRequiredCard;
