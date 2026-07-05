import type { Metadata } from 'next';
import FeaturesClient from './FeaturesClient';
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
    title: dict.landing.pageMeta.features.title,
    description: dict.landing.pageMeta.features.description,
    alternates: buildSeoAlternates('/features', lang),
  };
}

export default function FeaturesPage() {
  return <FeaturesClient />;
}
