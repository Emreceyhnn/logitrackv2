import type { Metadata } from 'next';
import SecurityCenterClient from './SecurityCenterClient';
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
    title: dict.landing.pageMeta.securityCenter.title,
    description: dict.landing.pageMeta.securityCenter.description,
    alternates: buildSeoAlternates('/security-center', lang),
  };
}

export default async function SecurityCenterPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <SecurityCenterClient dict={dict} />;
}
