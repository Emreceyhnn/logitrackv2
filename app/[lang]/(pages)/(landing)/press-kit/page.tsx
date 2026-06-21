import type { Metadata } from "next";
import CompanyPageClient from "@/app/components/landing/CompanyPageClient";
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
  const title = dict?.landing?.pressKitPage?.hero?.title || "Press Kit";
  const description = dict?.landing?.pressKitPage?.hero?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/press-kit", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/press-kit", "en")}`,
        tr: `/tr${getLocalizedPath("/press-kit", "tr")}`,
      },
    },
  };
}

export default async function PressKitPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const pressDict = dict?.landing?.pressKitPage;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pressDict?.hero?.title || "Press & Media Assets",
    "description": pressDict?.hero?.subtitle || "",
    "publisher": {
      "@type": "Organization",
      "name": "LogiTrack",
      "logo": "https://logitrack.emreceyhan.xyz/logo.svg",
    },
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <CompanyPageClient pageKey="pressKitPage" />
    </>
  );
}
