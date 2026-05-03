/**
 * Shipments Page — Hybrid SSR + CSR
 *
 * Rendering Strategy
 * ──────────────────
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  SERVER (this file)                                                 │
 * │  1. Authenticate user via getAuthenticatedUser() (React cache)      │
 * │  2. Call getShipmentsWithDashboardData() directly — hits Redis first│
 * │     falls back to Prisma if cache cold. No extra round-trip.        │
 * │  3. Serialize data into TanStack Query's dehydrated state.          │
 * │  4. Stream HTML to the browser — users see populated content        │
 * │     immediately, no loading spinner on first paint.                 │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  CLIENT (shipmentsContent.tsx)                                      │
 * │  5. HydrationBoundary rehydrates the dehydrated state into the      │
 * │     existing QueryClient — cache is warm on the first render.       │
 * │  6. useShipmentsWithDashboard() finds the data in cache →           │
 * │     isLoading = false, no network call on mount.                    │
 * │  7. When the user applies filters the hook issues a fresh CSR       │
 * │     request and reactively updates the UI.                          │
 * └─────────────────────────────────────────────────────────────────────┘
 */

import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { getShipmentsWithDashboardData } from "@/app/lib/controllers/shipments";
import { shipmentKeys } from "@/app/lib/query-keys/shipment.keys";
import ShipmentContent from "./components/shipmentsContent";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function ShipmentPageSkeleton() {
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

export default async function ShipmentPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/");
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  const clientPage = 1;
  const serverPage = clientPage;
  const pageSize = 10;
  const status = undefined;
  const search = undefined;

  try {
    await queryClient.prefetchQuery({
      queryKey: shipmentKeys.dashboardWithFilters(clientPage, pageSize, status, search),
      queryFn: () => getShipmentsWithDashboardData(serverPage, pageSize, status, search),
      staleTime: 1000 * 60 * 5,
    });
  } catch (error) {
    console.error("[ShipmentPage SSR] prefetch failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<ShipmentPageSkeleton />}>
        <ShipmentContent />
      </Suspense>
    </HydrationBoundary>
  );
}
