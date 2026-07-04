import type { Metadata } from 'next';
import PressKitClient from './PressKitClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Press Kit - LogiTrack v2',
  description: 'Brand assets, press releases, and media resources for logistics technology coverage.',
};

export default async function PressKitPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <PressKitClient dict={dict} />;
}
