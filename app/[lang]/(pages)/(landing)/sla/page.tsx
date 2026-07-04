import type { Metadata } from 'next';
import SlaClient from './SlaClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'SLA - LogiTrack v2',
  description: 'Our commitment to reliability with industry-leading uptime guarantees and transparent incident reporting.',
};

export default async function SlaPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <SlaClient dict={dict} />;
}
