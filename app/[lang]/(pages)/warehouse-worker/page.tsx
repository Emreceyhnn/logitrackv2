import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { isWarehouseOnlyRole } from "@/app/lib/roles";
import { getWarehouseWorkerDashboard } from "@/app/lib/controllers/warehouseWorker";
import { warehouseWorkerKeys } from "@/app/lib/query-keys/warehouseWorker.keys";
import WarehouseWorkerClient from "./WarehouseWorkerClient";

export const metadata: Metadata = {
  title: "Warehouse Worker Dashboard | LogiTrack",
  description:
    "Operational dashboard for warehouse workers and site managers — scan & log stock movements, track picks/packs, monitor site capacity and live activity.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WarehouseWorkerPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(`/${lang}/auth/sign-in`);
  }

  const locked = isWarehouseOnlyRole(user.roleName);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 30 } },
  });

  try {
    await queryClient.prefetchQuery({
      queryKey: warehouseWorkerKeys.dashboard(),
      queryFn: () => getWarehouseWorkerDashboard(),
    });
  } catch (error) {
    console.error("[WarehouseWorkerPage SSR] prefetch failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={null}>
        <WarehouseWorkerClient locked={locked} lang={lang} />
      </Suspense>
    </HydrationBoundary>
  );
}
