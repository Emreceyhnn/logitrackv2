import type { Metadata } from "next";
import PlatformPageClient from "@/app/components/landing/PlatformPageClient";
import { getServerDictionary } from "@/app/lib/language/i18n-server";
import type { Dictionary } from "@/app/lib/language/language";
import { getLocalizedPath } from "@/app/lib/language/navigation";
import JsonLd from "@/app/components/seo/JsonLd";

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const title = dict?.landing?.routeIntelligencePage?.title || "Route Intelligence";
  const description = dict?.landing?.routeIntelligencePage?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/route-intelligence", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/route-intelligence", "en")}`,
        tr: `/tr${getLocalizedPath("/route-intelligence", "tr")}`,
      },
    },
  };
}

export default async function RouteIntelligencePage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const routeDict = dict?.landing?.routeIntelligencePage;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `LogiTrack - ${routeDict?.title || "Route Intelligence"}`,
    "description": routeDict?.subtitle || "",
    "brand": {
      "@type": "Brand",
      "name": "LogiTrack",
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <PlatformPageClient pageKey="routeIntelligencePage" />
    </>
  );
}
