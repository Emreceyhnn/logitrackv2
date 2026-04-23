import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/style/globals.css";
import Providers from "@/app/lib/theme/themeProviders";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getDictionary } from "@/app/lib/language/language";
import { DictionaryProvider } from "@/app/lib/language/DictionaryContext";
import { getUserTheme } from "@/app/lib/actions/theme";

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
  const dict = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://logitrack.app";

  return {
    title: dict.landing.metaTitle || "LogiTrack – AI Lojistik Yönetim Platformu",
    description: dict.landing.metaDescription || "Teslimatlarınızı, filonuzu ve operasyonlarınızı tek akıllı panelden yönetin.",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        tr: "/tr",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
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
  const dict = await getDictionary(lang);
  const userTheme = await getUserTheme();

  return (
    <html lang={lang}>
      <body className={poppins.variable}>
        <Providers initialMode={(userTheme as any) || undefined}>
          <DictionaryProvider dict={dict}>
            {children}
          </DictionaryProvider>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
