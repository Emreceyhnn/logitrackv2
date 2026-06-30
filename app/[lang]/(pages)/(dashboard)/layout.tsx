import DashboardLayoutClient from "@/app/components/dashboard/DashboardLayoutClient";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { isWarehouseOnlyRole } from "@/app/lib/roles";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  // Warehouse-only staff are confined to their own panel and must never reach
  // the main dashboard.
  const user = await getAuthenticatedUser();
  if (user && isWarehouseOnlyRole(user.roleName)) {
    redirect(`/${lang}/warehouse-worker`);
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
