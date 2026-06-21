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
  const title = dict?.landing?.globalTrackingPage?.title || "Global Tracking";
  const description = dict?.landing?.globalTrackingPage?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/global-tracking", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/global-tracking", "en")}`,
        tr: `/tr${getLocalizedPath("/global-tracking", "tr")}`,
      },
    },
  };
}

export default async function GlobalTrackingPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const trackingDict = dict?.landing?.globalTrackingPage;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `LogiTrack - ${trackingDict?.title || "Global Tracking"}`,
    "description": trackingDict?.subtitle || "",
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
      <PlatformPageClient pageKey="globalTrackingPage" />
    </>
  );
}
