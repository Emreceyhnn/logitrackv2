import type { Metadata } from 'next';
import OurMissionClient from './OurMissionClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Our Mission - LogiTrack v2',
  description: 'Moving the world with intelligence. Learn about our mission to make logistics smarter and more sustainable.',
};

export default async function OurMissionPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <OurMissionClient dict={dict} />;
}
