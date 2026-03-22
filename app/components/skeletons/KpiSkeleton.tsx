"use client";
import { Stack, Card, Skeleton, alpha, useTheme, Box } from "@mui/material";

interface KpiSkeletonProps {
  count?: number;
}

export default function KpiSkeleton({ count = 4 }: KpiSkeletonProps) {
  const theme = useTheme();

  return (
    <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
      {Array.from(new Array(count)).map((_, index) => (
        <Box
          key={index}
          sx={{ width: { xs: "100%", sm: "calc(50% - 8px)", md: "calc(25% - 12px)" } }}
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
              minHeight: "104px",
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
        </Box>
      ))}
    </Stack>
  );
}
