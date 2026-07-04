import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Privacy Policy - LogiTrack v2',
  description: 'Your data, your rights. Our commitment to privacy, transparency, and global regulatory compliance.',
};

export default async function PrivacyPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <PrivacyClient dict={dict} />;
}
