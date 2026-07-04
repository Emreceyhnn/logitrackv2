import type { Metadata } from 'next';
import SmbLogisticsClient from './SmbLogisticsClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'SMB Logistics - LogiTrack v2',
  description: 'Enterprise power with startup simplicity. AI-powered logistics for small and medium businesses.',
};

export default async function SmbLogisticsPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <SmbLogisticsClient dict={dict} />;
}
