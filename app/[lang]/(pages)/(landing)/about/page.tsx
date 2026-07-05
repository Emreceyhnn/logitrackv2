import type { Metadata } from 'next';
import AboutClient from './AboutClient';
import { getDictionary } from '@/app/lib/language/language';
import { buildSeoAlternates } from '@/app/lib/language/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.landing.pageMeta.about.title,
    description: dict.landing.pageMeta.about.description,
    alternates: buildSeoAlternates('/about', lang),
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
