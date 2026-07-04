import type { Metadata } from 'next';
import EnterpriseClient from './EnterpriseClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Enterprise Solutions - LogiTrack v2',
  description: 'Built for the scale of global operations with dedicated infrastructure and white-glove onboarding.',
};

export default async function EnterprisePage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <EnterpriseClient dict={dict} />;
}
