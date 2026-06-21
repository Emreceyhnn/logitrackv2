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
  const title = dict?.landing?.telemetryHubPage?.title || "Telemetry Hub";
  const description = dict?.landing?.telemetryHubPage?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/telemetry-hub", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/telemetry-hub", "en")}`,
        tr: `/tr${getLocalizedPath("/telemetry-hub", "tr")}`,
      },
    },
  };
}

export default async function TelemetryHubPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const telemetryDict = dict?.landing?.telemetryHubPage;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `LogiTrack - ${telemetryDict?.title || "Telemetry Hub"}`,
    "description": telemetryDict?.subtitle || "",
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
      <PlatformPageClient pageKey="telemetryHubPage" />
    </>
  );
}
