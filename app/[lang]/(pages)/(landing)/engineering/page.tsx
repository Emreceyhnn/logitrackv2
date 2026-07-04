import type { Metadata } from 'next';
import EngineeringClient from './EngineeringClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Engineering - LogiTrack v2',
  description: 'The technology behind the intelligence. Cloud-native architecture and real-time data processing at global scale.',
};

export default async function EngineeringPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <EngineeringClient dict={dict} />;
}
