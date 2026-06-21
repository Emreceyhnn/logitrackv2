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
  const title = dict?.landing?.securityCenterPage?.title || "Security Center";
  const description = dict?.landing?.securityCenterPage?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/security-center", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/security-center", "en")}`,
        tr: `/tr${getLocalizedPath("/security-center", "tr")}`,
      },
    },
  };
}

export default async function SecurityCenterPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const securityDict = dict?.landing?.securityCenterPage;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `LogiTrack - ${securityDict?.title || "Security Center"}`,
    "description": securityDict?.subtitle || "",
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
      <PlatformPageClient pageKey="securityCenterPage" />
    </>
  );
}
