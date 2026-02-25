"use client";

import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BadgeIcon from "@mui/icons-material/Badge";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { CompanyStats } from "@/app/lib/type/company";

interface KpiItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface CompanyKpiCardProps {
  data: CompanyStats | null;
}

export default function CompanyKpiCard({ data }: CompanyKpiCardProps) {
  const theme = useTheme();

  const kpis: KpiItem[] = [
    {
      label: "Total Users",
      value: data?.users ?? 0,
      icon: <PeopleIcon sx={{ fontSize: 22 }} />,
      color: "#6366f1",
    },
    {
      label: "Vehicles",
      value: data?.vehicles ?? 0,
      icon: <DirectionsCarIcon sx={{ fontSize: 22 }} />,
      color: "#0ea5e9",
    },
    {
      label: "Drivers",
      value: data?.drivers ?? 0,
      icon: <BadgeIcon sx={{ fontSize: 22 }} />,
      color: "#10b981",
    },
    {
      label: "Warehouses",
      value: data?.warehouses ?? 0,
      icon: <WarehouseIcon sx={{ fontSize: 22 }} />,
      color: "#f59e0b",
    },
    {
      label: "Customers",
      value: data?.customers ?? 0,
      icon: <GroupsIcon sx={{ fontSize: 22 }} />,
      color: "#ec4899",
    },
    {
      label: "Shipments",
      value: data?.shipments ?? 0,
      icon: <LocalShippingIcon sx={{ fontSize: 22 }} />,
      color: "#8b5cf6",
    },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))"
      gap={2}
    >
      {kpis.map((kpi) => (
        <Card
          key={kpi.label}
          variant="outlined"
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: 3 },
          }}
        >
          <CardContent>
            <Stack spacing={1}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: `${kpi.color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: kpi.color,
                }}
              >
                {kpi.icon}
              </Box>
              {data === null ? (
                <>
                  <Skeleton width={48} height={32} />
                  <Skeleton width={72} height={16} />
                </>
              ) : (
                <>
                  <Typography fontWeight={700} fontSize={24} lineHeight={1}>
                    {kpi.value.toLocaleString()}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {kpi.label}
                  </Typography>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
