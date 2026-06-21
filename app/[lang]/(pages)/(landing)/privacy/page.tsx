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
  const title = dict?.landing?.privacyPage?.hero?.title || "Privacy & Data Protection";
  const description = dict?.landing?.privacyPage?.hero?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/privacy", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/privacy", "en")}`,
        tr: `/tr${getLocalizedPath("/privacy", "tr")}`,
      },
    },
  };
}

export default async function PrivacyPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const privacyDict = dict?.landing?.privacyPage;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": privacyDict?.hero?.title || "Privacy Policy",
    "description": privacyDict?.hero?.subtitle || "",
    "publisher": {
      "@type": "Organization",
      "name": "LogiTrack",
      "logo": "https://logitrack.emreceyhan.xyz/logo.svg",
    },
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <SupportPageClient pageKey="privacyPage" />
    </>
  );
}
