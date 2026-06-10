import type { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAnalyticsDashboardData } from "@/app/lib/controllers/analytics";
import { analyticsKeys } from "@/app/lib/query-keys/analytics.keys";
import AnalyticsContent from "./components/AnalyticsContent";

export const metadata: Metadata = {
  title: "Analytics | LogiTrack",
  description:
    "Deep-dive analytics — on-time rates, cost trends, fleet utilisation and operational KPIs.",
};

function AnalyticsPageSkeleton() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      minHeight="60vh"
    >
      <CircularProgress size={36} />
    </Box>
  );
}

export default async function AnalyticsPage() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 10,
      },
    },
  });

  try {
    await queryClient.prefetchQuery({
      queryKey: analyticsKeys.dashboard(),
      queryFn: () => getAnalyticsDashboardData(),
      staleTime: 1000 * 60 * 10,
    });
  } catch (error) {
    console.error("[AnalyticsPage SSR] prefetch failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<AnalyticsPageSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </HydrationBoundary>
  );
}
