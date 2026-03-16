import { DriverWithRelations } from "@/app/lib/type/driver";
import {
  alpha,
  Stack,
  Typography,
  Card,
  Button,
  Box,
  useTheme,
  Grid,
  Theme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import StarIcon from "@mui/icons-material/Star";
import EmailIcon from "@mui/icons-material/Email";
import HistoryIcon from "@mui/icons-material/History";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

interface OverviewTabProps {
  driver?: DriverWithRelations;
}

const KPICard = ({
  title,
  value,
  icon,
  color,
  theme,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  theme: Theme;
}) => (
  <Card
    sx={{
      p: 2.5,
      borderRadius: 3,
      bgcolor: alpha(theme.palette.background.paper, 0.3),
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      flexGrow: 1,
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: alpha(color, 0.3),
        bgcolor: alpha(color, 0.05),
        transform: "translateY(-2px)",
      },
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: alpha(color, 0.1),
          color: color,
          display: "flex",
        }}
      >
        {icon}
      </Box>
    </Stack>
    <Typography variant="h4" fontWeight={800} color="white">
      {value}
    </Typography>
  </Card>
);

const OverviewTab = ({ driver }: OverviewTabProps) => {
  const theme = useTheme();

  if (!driver) {
    return <Typography color="text.secondary">No driver selected</Typography>;
  }

  return (
    <Stack
      spacing={3}
      sx={{
        overflowY: "auto",
        maxHeight: 450,
        pr: 1,
        "&::-webkit-scrollbar": {
          width: 6,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(theme.palette.text.secondary, 0.2),
          borderRadius: 4,
          "&:hover": {
            backgroundColor: alpha(theme.palette.text.secondary, 0.4),
          },
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KPICard
            title="Driver Rating"
            value={`${driver.rating != null ? driver.rating : "-"} / 5`}
            icon={<StarIcon fontSize="small" />}
            color={theme.palette.warning.main}
            theme={theme}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KPICard
            title="Efficiency Score"
            value={
              driver.efficiencyScore != null
                ? `${driver.efficiencyScore}%`
                : "-"
            }
            icon={<AccessTimeIcon fontSize="small" />}
            color={theme.palette.info.main}
            theme={theme}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KPICard
            title="Safety Score"
            value={driver.safetyScore != null ? `${driver.safetyScore}%` : "-"}
            icon={<MedicalServicesIcon fontSize="small" />}
            color={theme.palette.success.main}
            theme={theme}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.3),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              height: '100%'
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <EventAvailableIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                License Expiry
              </Typography>
            </Stack>
            <Typography variant="h6" fontWeight={700} color="white">
              {driver.licenseExpiry
                ? new Date(driver.licenseExpiry).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.3),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              height: '100%'
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Status
            </Typography>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                color:
                  driver.status === "ON_JOB"
                    ? "success.main"
                    : driver.status === "OFF_DUTY"
                      ? "text.secondary"
                      : "warning.main",
              }}
            >
              {driver.status.replace("_", " ")}
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.3),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              height: '100%'
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <HomeWorkIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Base
              </Typography>
            </Stack>
            <Typography variant="h6" fontWeight={700} color="white" noWrap>
              {driver.homeBaseWarehouse?.name || "Not Set"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {driver.homeBaseWarehouse?.code || "N/A"}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} pt={2}>
        <Button
          variant="contained"
          startIcon={<EmailIcon />}
          sx={{
            flex: 1,
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          Contact Driver
        </Button>
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          sx={{
            flex: 1,
            borderRadius: 2,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            borderColor: alpha(theme.palette.divider, 0.2),
            color: "white",
            "&:hover": {
              borderColor: alpha(theme.palette.divider, 0.5),
              bgcolor: alpha(theme.palette.background.paper, 0.5),
            },
          }}
        >
          View Full History
        </Button>
      </Stack>
    </Stack>
  );
};

export default OverviewTab;
