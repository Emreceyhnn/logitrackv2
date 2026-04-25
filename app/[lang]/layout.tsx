import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/style/globals.css";
import Providers from "@/app/lib/theme/themeProviders";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getDictionary } from "@/app/lib/language/language";
import { DictionaryProvider } from "@/app/lib/language/DictionaryContext";
import { getUserTheme } from "@/app/lib/actions/theme";
import JsonLd from "@/app/components/seo/JsonLd";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { UserProvider } from "@/app/lib/context/UserContext";

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://logitrack.emreceyhan.xyz";

  return {
    title: {
      default:
        dict.landing.metaTitle || "LogiTrack – AI Lojistik Yönetim Platformu",
      template: `%s | LogiTrack`,
    },
    description:
      dict.landing.metaDescription ||
      "Teslimatlarınızı, filonuzu ve operasyonlarınızı tek akıllı panelden yönetin.",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        tr: "/tr",
      },
    },
    openGraph: {
      type: "website",
      locale: lang === "tr" ? "tr_TR" : "en_US",
      url: `${baseUrl}/${lang}`,
      siteName: "LogiTrack",
      title: dict.landing.metaTitle,
      description: dict.landing.metaDescription,
      images: [
        {
          url: "/logo1.png",
          width: 1200,
          height: 630,
          alt: "LogiTrack AI Logistics",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.landing.metaTitle,
      description: dict.landing.metaDescription,
      images: ["/logo1.png"],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/logo1.png",
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
    verification: {
      google: "google-site-verification-id", // Search Console'dan alınan kodu buraya ekleyin
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
  const user = await getAuthenticatedUser();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://logitrack.emreceyhan.xyz";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LogiTrack",
    url: baseUrl,
    logo: `${baseUrl}/logo1.png`,
    sameAs: [
      "https://twitter.com/logitrack",
      "https://linkedin.com/company/logitrack",
    ],
    description: dict.landing.metaDescription,
  };

  return (
    <html lang={lang}>
      <body className={poppins.variable}>
        <JsonLd data={organizationSchema} />
        <UserProvider initialUser={user}>
          <Providers initialMode={(userTheme as any) || undefined}>
            <DictionaryProvider dict={dict}>{children}</DictionaryProvider>
          </Providers>
        </UserProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
