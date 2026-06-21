import type { Metadata } from "next";
import SupportPageClient from "@/app/components/landing/SupportPageClient";
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
  const title = dict?.landing?.slaPage?.hero?.title || "Service Level Agreement";
  const description = dict?.landing?.slaPage?.hero?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/sla", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/sla", "en")}`,
        tr: `/tr${getLocalizedPath("/sla", "tr")}`,
      },
    },
  };
}

export default async function SlaPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const slaDict = dict?.landing?.slaPage;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": slaDict?.hero?.title || "Service Level Agreement (SLA)",
    "description": slaDict?.hero?.subtitle || "",
    "publisher": {
      "@type": "Organization",
      "name": "LogiTrack",
      "logo": "https://logitrack.emreceyhan.xyz/logo.svg",
    },
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <SupportPageClient pageKey="slaPage" />
    </>
  );
}
