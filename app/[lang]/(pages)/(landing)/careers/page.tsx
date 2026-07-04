import type { Metadata } from 'next';
import CareersClient from './CareersClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Careers - LogiTrack v2',
  description: 'Build the future of logistics. Join our team of engineers, designers, and logistics experts.',
};

export default async function CareersPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <CareersClient dict={dict} />;
}
