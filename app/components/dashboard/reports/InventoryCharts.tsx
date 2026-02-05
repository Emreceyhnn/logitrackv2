import { PieChart } from "@mui/x-charts/PieChart";
import { Card, Stack, Typography, useTheme, Box } from "@mui/material";
import mockData from "@/app/lib/mockData.json";

export default function InventoryCharts() {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const categoryStats = mockData.inventory.catalog.reduce(
    (acc, item) => {
      const seed = item.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const unitPrice = (seed % 400) + 20;

      const totalStock = mockData.inventory.stock
        .filter((s) => s.skuId === item.id)
        .reduce((sum, s) => sum + (s.quantity - s.reserved), 0);

      const value = totalStock * unitPrice;

      if (!acc[item.category]) acc[item.category] = { value: 0, count: 0 };
      acc[item.category].value += value;
      acc[item.category].count += 1;
      return acc;
    },
    {} as Record<string, { value: number; count: number }>
  );
  const valuePieData = Object.keys(categoryStats).map((cat, index) => ({
    id: index,
    value: categoryStats[cat].value,
    label: cat,
  }));
  const countPieData = Object.keys(categoryStats).map((cat, index) => ({
    id: index,
    value: categoryStats[cat].count,
    label: cat,
  }));

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Card
          sx={{
            flex: 1,
            p: 2.5,
            borderRadius: "16px",
            boxShadow: theme.shadows[2],
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: `${theme.palette.background.paper}`,
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Inventory Value
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Distribution by category ($)
            </Typography>
          </Stack>

          <Box
            sx={{
              flex: 1,
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PieChart
              series={[
                {
                  data: valuePieData,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  innerRadius: 40,
                  paddingAngle: 2,
                  cornerRadius: 4,
                },
              ]}
              height={300}
            />
          </Box>
        </Card>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Card
          sx={{
            flex: 1,
            p: 2.5,
            borderRadius: "16px",
            boxShadow: theme.shadows[2],
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: `${theme.palette.background.paper}`,
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              SKU Count
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Items count by category
            </Typography>
          </Stack>

          <Box
            sx={{
              flex: 1,
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PieChart
              series={[
                {
                  data: countPieData,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  innerRadius: 40,
                  paddingAngle: 2,
                  cornerRadius: 4,
                },
              ]}
              height={300}
              colors={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]}
            />
          </Box>
        </Card>
      </Box>
    </Stack>
  );
}
