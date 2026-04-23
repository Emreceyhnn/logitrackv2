import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import DashboardLayoutClient from "@/app/components/dashboard/DashboardLayoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session on the server to avoid client-side roundtrips
  const user = await getAuthenticatedUser();

  return (
    <DashboardLayoutClient user={user}>
      {children}
    </DashboardLayoutClient>
  );
}
