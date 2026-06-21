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
  const title = dict?.landing?.engineeringPage?.hero?.title || "Engineering Excellence";
  const description = dict?.landing?.engineeringPage?.hero?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/engineering", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/engineering", "en")}`,
        tr: `/tr${getLocalizedPath("/engineering", "tr")}`,
      },
    },
  };
}

export default async function EngineeringPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const engDict = dict?.landing?.engineeringPage;

  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": engDict?.hero?.title || "Engineering Excellence",
    "description": engDict?.hero?.subtitle || "",
    "inLanguage": lang,
    "publisher": {
      "@type": "Organization",
      "name": "LogiTrack",
      "logo": "https://logitrack.emreceyhan.xyz/logo.svg",
    },
  };

  return (
    <>
      <JsonLd data={techArticleSchema} />
      <CompanyPageClient pageKey="engineeringPage" />
    </>
  );
}
