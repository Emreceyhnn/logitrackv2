import type { Metadata } from 'next';
import HelpCenterClient from './HelpCenterClient';

export const metadata: Metadata = {
  title: 'Help Center - LogiTrack v2',
  description: 'Find answers, get support, and access resources to make the most of your LogiTrack platform.',
};

export default function HelpCenterPage() {
  return <HelpCenterClient />;
}
