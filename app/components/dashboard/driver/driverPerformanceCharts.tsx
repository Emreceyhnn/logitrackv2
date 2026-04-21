import { Box, Stack, Typography, Divider } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { BarChart } from "@mui/x-charts/BarChart";
import CustomCard from "../../cards/card";
import AnalyticsSkeleton from "@/app/components/skeletons/AnalyticsSkeleton";

interface DriverPerformanceChartsProps {
  data:
    | {
        name: string;
        rating: number;
        workingHours: number;
      }[]
    | undefined;
  loading?: boolean;
}

const DriverPerformanceCharts = ({
  data,
  loading = false,
}: DriverPerformanceChartsProps) => {
  /* -------------------------------- variables ------------------------------- */

  const dict = useDictionary();

  if (loading || !data) {
    return (
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={2}>
        <Box flex={1}>
          <AnalyticsSkeleton title={dict.drivers.dashboard.ratings} />
        </Box>
        <Box flex={1}>
          <AnalyticsSkeleton title={dict.drivers.dashboard.weeklyHours} />
        </Box>
      </Stack>
    );
  }

  const driverNames = data?.map((d) => d.name) ?? [];
  const ratings = data?.map((d) => d.rating) ?? [];
  const workingHours = data?.map((d) => d.workingHours) ?? [];

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={2}>
      <Box flex={1}>
        <CustomCard sx={{ height: "100%", p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600} sx={{ p: 1 }}>
              {dict.drivers.dashboard.ratings}
            </Typography>
            <Divider />
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: driverNames,
                  label: dict.sidebar.drivers,
                  tickLabelStyle: { fill: "theme.palette.text.secondary" },
                },
              ]}
              yAxis={[
                {
                  label: dict.drivers.dashboard.ratingsLabel,
                  labelStyle: { fill: "theme.palette.text.secondary" },
                },
              ]}
              series={[
                {
                  data: ratings,
                  color: "#8b5cf6",
                  label: dict.drivers.dashboard.ratingsLabel,
                  highlightScope: { highlight: "item", fade: "global" },
                },
              ]}
              height={300}
              margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              borderRadius={8}
              slotProps={{
                legend: {},
              }}
            />
          </Stack>
        </CustomCard>
      </Box>
      <Box flex={1}>
        <CustomCard sx={{ height: "100%", p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600} sx={{ p: 1 }}>
              {dict.drivers.dashboard.weeklyHours}
            </Typography>
            <Divider />
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: driverNames,
                  label: dict.sidebar.drivers,
                  tickLabelStyle: { fill: "theme.palette.text.secondary" },
                },
              ]}
              yAxis={[
                {
                  label: dict.drivers.dashboard.hours,
                  labelStyle: { fill: "theme.palette.text.secondary" },
                },
              ]}
              series={[
                {
                  data: workingHours,
                  color: "#10b981",
                  label: dict.drivers.dashboard.hoursThisWeek,
                  highlightScope: { highlight: "item", fade: "global" },
                },
              ]}
              height={300}
              margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              borderRadius={8}
              slotProps={{
                legend: {},
              }}
            />
          </Stack>
        </CustomCard>
      </Box>
    </Stack>
  );
};

export default DriverPerformanceCharts;
