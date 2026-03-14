"use client";
import { Stack, Card, Skeleton, alpha, useTheme } from "@mui/material";

interface KpiSkeletonProps {
  count?: number;
}

export default function KpiSkeleton({ count = 4 }: KpiSkeletonProps) {
  const theme = useTheme();

  return (
    <Stack
      direction={"row"}
      flexWrap="wrap"
      gap={2}
      mt={2}
      justifyContent={"center"}
    >
      {Array.from(new Array(count)).map((_, index) => (
        <Stack
          key={index}
          flexBasis={{ xs: "100%", sm: "48%", md: "23%" }}
          flexGrow={1}
        >
          <Card
            sx={{
              p: 2.5,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: theme.palette.background.paper,
              minHeight: "104px", // Approximate height of StatCard
            }}
          >
            <Stack spacing={1} flexGrow={1}>
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="60%" height={40} />
            </Stack>
            <Skeleton
              variant="rounded"
              width={48}
              height={48}
              sx={{ borderRadius: "16px" }}
            />
          </Card>
        </Stack>
      ))}
    </Stack>
  );
}
