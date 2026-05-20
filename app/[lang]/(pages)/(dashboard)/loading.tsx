"use client";

import { Box, Skeleton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { memo } from "react";

/* -------------------------------------------------------------------------- */
/*  Reusable skeleton primitives                                               */
/* -------------------------------------------------------------------------- */

const CardSkeleton = memo(function CardSkeleton({ height = 110 }: { height?: number }) {
  return (
    <Skeleton
      variant="rounded"
      height={height}
      sx={{ borderRadius: "16px", transform: "none" }}
    />
  );
});

/* -------------------------------------------------------------------------- */
/*  Dashboard Loading                                                           */
/*                                                                              */
/*  Next.js shows this file while the Server Component for a dashboard page   */
/*  is still streaming. It renders inside the existing Layout (sidebar +       */
/*  header are already visible), so only the main content area is replaced.   */
/* -------------------------------------------------------------------------- */

export default function DashboardLoading() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        // Smooth fade-in so it doesn't feel jarring
        animation: "fadeIn 0.15s ease-in",
        "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
      }}
    >
      {/* ── Page header ─────────────────────────────────────────────── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        flexWrap="wrap"
        gap={1}
      >
        <Box>
          <Skeleton
            variant="text"
            width={220}
            height={34}
            sx={{ borderRadius: 1, transform: "none", mb: 0.75 }}
          />
          <Skeleton
            variant="text"
            width={340}
            height={20}
            sx={{ borderRadius: 1, transform: "none" }}
          />
        </Box>

        <Stack direction="row" gap={1}>
          <Skeleton variant="rounded" width={110} height={36} sx={{ borderRadius: "8px", transform: "none" }} />
          <Skeleton variant="rounded" width={36}  height={36} sx={{ borderRadius: "8px", transform: "none" }} />
        </Stack>
      </Stack>

      {/* ── KPI metric cards ────────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} height={110} />
        ))}
      </Box>

      {/* ── Main content area (chart + side panel) ──────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <CardSkeleton height={320} />
        <CardSkeleton height={320} />
      </Box>

      {/* ── Secondary table / list area ─────────────────────────────── */}
      <Box
        sx={{
          borderRadius: "16px",
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.07)"
              : "rgba(0,0,0,0.06)"
          }`,
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            borderBottom: `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.07)"
                : "rgba(0,0,0,0.06)"
            }`,
            display: "flex",
            gap: 4,
          }}
        >
          {[160, 100, 80, 90, 70].map((w, i) => (
            <Skeleton
              key={i}
              variant="text"
              width={w}
              height={18}
              sx={{ borderRadius: 1, transform: "none" }}
            />
          ))}
        </Box>

        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, rowIdx) => (
          <Box
            key={rowIdx}
            sx={{
              px: 2,
              py: 1.75,
              display: "flex",
              gap: 4,
              alignItems: "center",
              borderBottom:
                rowIdx < 5
                  ? `1px solid ${
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.04)"
                    }`
                  : "none",
            }}
          >
            {[160, 100, 80, 90, 70].map((w, colIdx) => (
              <Skeleton
                key={colIdx}
                variant="text"
                width={w * (0.6 + Math.random() * 0.5)}
                height={16}
                sx={{ borderRadius: 1, transform: "none" }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
