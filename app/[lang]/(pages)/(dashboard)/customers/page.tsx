/**
 * Customers Page — Hybrid SSR + CSR
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCustomersWithDashboardData } from "@/app/lib/controllers/customer";
import { customerKeys } from "@/app/lib/query-keys/customer.keys";
import CustomerContent from "./components/CustomerContent";

export const metadata: Metadata = {
  title: "Customers | LogiTrack",
  description:
    "View and manage customers — locations, shipment history and contact details.",
};

function CustomersPageSkeleton() {
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

export default async function CustomersPage() {

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
  const search = undefined;

  try {
    await queryClient.prefetchQuery({
      queryKey: customerKeys.dashboardWithFilters(clientPage, pageSize, search),
      queryFn: () => getCustomersWithDashboardData(serverPage, pageSize, search),
      staleTime: 1000 * 60 * 5,
    });
  } catch (error) {
    console.error("[CustomersPage SSR] prefetch failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<CustomersPageSkeleton />}>
        <CustomerContent />
      </Suspense>
    </HydrationBoundary>
  );
}
