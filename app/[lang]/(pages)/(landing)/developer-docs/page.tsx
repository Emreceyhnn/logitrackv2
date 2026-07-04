import type { Metadata } from 'next';
import DeveloperDocsClient from './DeveloperDocsClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Developer Docs - LogiTrack v2',
  description: 'Build on the LogiTrack platform with comprehensive API docs, SDKs, and integration guides.',
};

export default async function DeveloperDocsPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <DeveloperDocsClient dict={dict} />;
}
