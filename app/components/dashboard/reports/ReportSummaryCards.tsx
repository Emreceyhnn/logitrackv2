import {
  Card,
  Stack,
  Typography,
  Grid,
  useTheme,
  Box,
  alpha,
  Avatar,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

const MetricCard = ({
  title,
  value,
  change,
  positive,
  icon,
  color = "primary.main",
}: MetricCardProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: "16px",
        boxShadow: theme.shadows[2],
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: `${theme.palette.background.paper}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          bgcolor: alpha(color, 0.05),
          zIndex: 0,
        }}
      />

      <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 48,
              height: 48,
              borderRadius: 2,
            }}
          >
            {icon}
          </Avatar>
          {change && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                color: positive ? "success.main" : "error.main",
                bgcolor: positive
                  ? alpha(theme.palette.success.main, 0.1)
                  : alpha(theme.palette.error.main, 0.1),
                px: 1,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              {positive ? (
                <TrendingUpIcon fontSize="small" sx={{ fontSize: "1rem" }} />
              ) : (
                <TrendingDownIcon fontSize="small" sx={{ fontSize: "1rem" }} />
              )}
              <Typography variant="caption" fontWeight={700}>
                {change}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: theme.palette.text.primary, mb: 0.5 }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
            sx={{ letterSpacing: 0.5 }}
          >
            {title}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};

interface ReportsMetrics {
  totalShipments: number;
  onTimeRate: number;
  activeVehicles: number;
  totalInventoryValue: number;
}

export default function ReportSummaryCards({ tabIndex, metrics }: { tabIndex: number, metrics?: ReportsMetrics }) {
  const theme = useTheme();

  const getMetrics = () => {
    switch (tabIndex) {
      case 0:
        return [
          {
            title: "Total Shipments",
            value: metrics?.totalShipments.toLocaleString() || "0",
            change: "+12%",
            positive: true,
            icon: <LocalShippingIcon />,
            color: theme.palette.primary.main,
          },
          {
            title: "On-Time Rate",
            value: `${metrics?.onTimeRate.toFixed(1)}%` || "0%",
            change: "+2.1%",
            positive: true,
            icon: <AccessTimeIcon />,
            color: theme.palette.success.main,
          },
          {
            title: "Avg Delivery Time",
            value: "2.3 Days", // Mock
            change: "-5%",
            positive: true,
            icon: <TrendingUpIcon />,
            color: theme.palette.info.main,
          },
          {
            title: "Pending Orders",
            value: "42", // Mock
            change: "+8%",
            positive: false,
            icon: <WarningAmberIcon />,
            color: theme.palette.warning.main,
          },
        ];
      case 1:
        return [
          {
            title: "Active Vehicles",
            value: metrics?.activeVehicles.toString() || "0",
            change: "0%",
            positive: true,
            icon: <DirectionsCarIcon />,
            color: theme.palette.primary.main,
          },
          {
            title: "Avg Fuel Cons.",
            value: "22L/100km", // Mock
            change: "-1.2%",
            positive: true,
            icon: <LocalShippingIcon />,
            color: theme.palette.success.main,
          },
          {
            title: "Maintenance Cost",
            value: "$4,250", // Mock
            change: "+15%",
            positive: false,
            icon: <AttachMoneyIcon />,
            color: theme.palette.error.main,
          },
          {
            title: "Total Distance",
            value: "125k km", // Mock
            change: "+10%",
            positive: true,
            icon: <TrendingUpIcon />,
            color: theme.palette.info.main,
          },
        ];
      case 2:
        return [
          {
            title: "Total Inventory Value",
            value: `$${(metrics?.totalInventoryValue || 0).toLocaleString()}`,
            change: "+5.4%",
            positive: true,
            icon: <AttachMoneyIcon />,
            color: theme.palette.success.main,
          },
          {
            title: "Stock Turnover",
            value: "4.2", // Mock
            change: "+0.3",
            positive: true,
            icon: <TrendingUpIcon />,
            color: theme.palette.info.main,
          },
          {
            title: "Dead Stock",
            value: "$12k", // Mock
            change: "-2%",
            positive: true,
            icon: <WarningAmberIcon />,
            color: theme.palette.error.main,
          },
          {
            title: "Low Stock SKUs",
            value: "15", // Mock
            change: "+3",
            positive: false,
            icon: <Inventory2Icon />,
            color: theme.palette.warning.main,
          },
        ];
      default:
        return [];
    }
  };

  const metricsData = getMetrics();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={3}
      sx={{ mb: 4 }}
      useFlexGap
      flexWrap="wrap"
    >
      {metricsData.map((metric, index) => (
        <Box
          key={index}
          sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 20%" } }}
        >
          <MetricCard {...metric} />
        </Box>
      ))}
    </Stack>
  );
}
