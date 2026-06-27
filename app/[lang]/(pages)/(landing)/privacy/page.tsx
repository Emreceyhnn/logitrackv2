import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy - LogiTrack v2',
  description: 'Your data, your rights. Our commitment to privacy, transparency, and global regulatory compliance.',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
