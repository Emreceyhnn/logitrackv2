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
  const title = dict?.landing?.smbLogisticsPage?.title || "SMB Logistics";
  const description = dict?.landing?.smbLogisticsPage?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/smb-logistics", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/smb-logistics", "en")}`,
        tr: `/tr${getLocalizedPath("/smb-logistics", "tr")}`,
      },
    },
  };
}

export default async function SmbLogisticsPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const smbDict = dict?.landing?.smbLogisticsPage;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": smbDict?.title || "LogiTrack for SMB Logistics",
    "description": smbDict?.subtitle || "",
    "provider": {
      "@type": "Organization",
      "name": "LogiTrack",
      "url": "https://logitrack.emreceyhan.xyz",
    },
    "serviceType": "Fleet Management and Route Planning for Small and Medium Businesses",
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <SolutionsPageClient pageKey="smbLogisticsPage" />
    </>
  );
}
