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
  const title = dict?.landing?.careersPage?.hero?.title || "Careers";
  const description = dict?.landing?.careersPage?.hero?.subtitle || "";
  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/careers", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/careers", "en")}`,
        tr: `/tr${getLocalizedPath("/careers", "tr")}`,
      },
    },
  };
}

export default function CareersPage() {

  const jobPostings = [
    {
      title: "Senior Fullstack Engineer",
      team: "Engineering",
      type: "Remote (Global)",
      description: "Join our core product team to build high-performance React and Node.js features.",
    },
    {
      title: "Product Designer",
      team: "Design",
      type: "Hybrid (Istanbul)",
      description: "Craft premium logistics dashboards, visualization systems, and user interfaces.",
    },
    {
      title: "DevOps Infrastructure Lead",
      team: "Infrastructure",
      type: "Remote (Global)",
      description: "Scale Kubernetes clusters, telemetry pipelines, and time-series databases.",
    },
  ].map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": "2026-06-20",
    "validThrough": "2027-06-20",
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "LogiTrack",
      "sameAs": "https://logitrack.emreceyhan.xyz",
      "logo": "https://logitrack.emreceyhan.xyz/logo.svg",
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.title.includes("Istanbul") ? "Istanbul" : "Remote",
        "addressCountry": job.title.includes("Istanbul") ? "TR" : "US",
      },
    },
    "jobLocationType": job.type.includes("Remote") ? "TELECOMMUTE" : "STANDARD",
  }));

  return (
    <>
      <JsonLd data={jobPostings} />
      <CompanyPageClient pageKey="careersPage" />
    </>
  );
}
