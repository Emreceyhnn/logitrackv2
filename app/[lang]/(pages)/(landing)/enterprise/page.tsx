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
  const title = dict?.landing?.enterprisePage?.title || "Enterprise Solutions";
  const description = dict?.landing?.enterprisePage?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/enterprise", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/enterprise", "en")}`,
        tr: `/tr${getLocalizedPath("/enterprise", "tr")}`,
      },
    },
  };
}

export default async function EnterprisePage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const enterpriseDict = dict?.landing?.enterprisePage;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": enterpriseDict?.title || "Enterprise Logistics Orchestration",
    "description": enterpriseDict?.subtitle || "",
    "provider": {
      "@type": "Organization",
      "name": "LogiTrack",
      "url": "https://logitrack.emreceyhan.xyz",
    },
    "serviceType": "Enterprise Fleet Tracking and Logistics Orchestration",
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <SolutionsPageClient pageKey="enterprisePage" />
    </>
  );
}
