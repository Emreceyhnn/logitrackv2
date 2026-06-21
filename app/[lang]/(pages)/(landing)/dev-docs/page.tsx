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
  const title = dict?.landing?.devDocsPage?.hero?.title || "Developer Documentation";
  const description = dict?.landing?.devDocsPage?.hero?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/dev-docs", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/dev-docs", "en")}`,
        tr: `/tr${getLocalizedPath("/dev-docs", "tr")}`,
      },
    },
  };
}

export default async function DevDocsPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const docsDict = dict?.landing?.devDocsPage;

  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": docsDict?.hero?.title || "Developer Documentation",
    "description": docsDict?.hero?.subtitle || "",
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
      <SupportPageClient pageKey="devDocsPage" />
    </>
  );
}
