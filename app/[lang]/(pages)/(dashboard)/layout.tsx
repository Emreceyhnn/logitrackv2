import DashboardLayoutClient from "@/app/components/dashboard/DashboardLayoutClient";
import { Metadata } from "next";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { getUserTheme } from "@/app/lib/actions/theme";
import { UserProvider } from "@/app/lib/context/UserContext";
import Providers from "@/app/lib/theme/themeProviders";

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
  const user = await getAuthenticatedUser();
  const userTheme = await getUserTheme();

  return (
    <UserProvider initialUser={user}>
      <Providers initialMode={userTheme || undefined}>
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </Providers>
    </UserProvider>
  );
}
