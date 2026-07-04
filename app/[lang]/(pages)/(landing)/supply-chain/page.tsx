import type { Metadata } from 'next';
import SupplyChainClient from './SupplyChainClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Supply Chain - LogiTrack v2',
  description: 'End-to-end supply chain orchestration from raw materials to last-mile delivery.',
};

export default async function SupplyChainPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <SupplyChainClient dict={dict} />;
}
