import type { Metadata } from "next";
import SolutionsPageClient from "@/app/components/landing/SolutionsPageClient";
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
  const title = dict?.landing?.supplyChainPage?.title || "Supply Chain Solutions";
  const description = dict?.landing?.supplyChainPage?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/supply-chain", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/supply-chain", "en")}`,
        tr: `/tr${getLocalizedPath("/supply-chain", "tr")}`,
      },
    },
  };
}

export default async function SupplyChainPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const supplyDict = dict?.landing?.supplyChainPage;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": supplyDict?.title || "Supply Chain Visibility",
    "description": supplyDict?.subtitle || "",
    "provider": {
      "@type": "Organization",
      "name": "LogiTrack",
      "url": "https://logitrack.emreceyhan.xyz",
    },
    "serviceType": "Supply Chain Visibility and Inventory Velocity Management",
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <SolutionsPageClient pageKey="supplyChainPage" />
    </>
  );
}
