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
  const title = dict?.landing?.helpCenterPage?.hero?.title || "Help & Support Center";
  const description = dict?.landing?.helpCenterPage?.hero?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/help-center", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/help-center", "en")}`,
        tr: `/tr${getLocalizedPath("/help-center", "tr")}`,
      },
    },
  };
}

export default async function HelpCenterPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const helpDict = dict?.landing?.helpCenterPage;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (helpDict?.faqs || []).map((faq: { q: string; a: string }) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <SupportPageClient pageKey="helpCenterPage" />
    </>
  );
}
