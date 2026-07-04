import type { Metadata } from 'next';
import HelpCenterClient from './HelpCenterClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Help Center - LogiTrack v2',
  description: 'Find answers, get support, and access resources to make the most of your LogiTrack platform.',
};

export default async function HelpCenterPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <HelpCenterClient dict={dict} />;
}
