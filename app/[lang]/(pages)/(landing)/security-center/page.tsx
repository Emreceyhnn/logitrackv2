import type { Metadata } from 'next';
import SecurityCenterClient from './SecurityCenterClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Security Center - LogiTrack v2',
  description: 'Zero-trust security for mission-critical logistics with enterprise-grade encryption and compliance.',
};

export default async function SecurityCenterPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <SecurityCenterClient dict={dict} />;
}
