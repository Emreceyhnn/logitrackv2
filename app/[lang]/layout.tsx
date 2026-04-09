import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/style/globals.css";
import Providers from "@/app/lib/theme/themeProviders";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getDictionary } from "@/app/lib/language/language";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    title: dict.landing.metaTitle || "LogiTrack – AI Lojistik Yönetim Platformu",
    description: dict.landing.metaDescription || "Teslimatlarınızı, filonuzu ve operasyonlarınızı tek akıllı panelden yönetin.",
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body className={poppins.variable}>
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
