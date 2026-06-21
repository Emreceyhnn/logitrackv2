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
  const title = dict?.landing?.missionPage?.hero?.title || "Our Mission";
  const description = dict?.landing?.missionPage?.hero?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/mission", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/mission", "en")}`,
        tr: `/tr${getLocalizedPath("/mission", "tr")}`,
      },
    },
  };
}

export default async function MissionPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const missionDict = dict?.landing?.missionPage;

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": missionDict?.hero?.title || "Our Mission & Vision",
    "description": missionDict?.hero?.subtitle || "",
    "publisher": {
      "@type": "Organization",
      "name": "LogiTrack",
      "logo": "https://logitrack.emreceyhan.xyz/logo.svg",
    },
  };

  return (
    <>
      <JsonLd data={aboutSchema} />
      <CompanyPageClient pageKey="missionPage" />
    </>
  );
}
