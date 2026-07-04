import type { Metadata } from 'next';
import CustomApiClient from './CustomApiClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Custom API - LogiTrack v2',
  description: 'Robust, high-performance APIs for custom logistics integrations and advanced automation.',
};

export default async function CustomApiPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <CustomApiClient dict={dict} />;
}
