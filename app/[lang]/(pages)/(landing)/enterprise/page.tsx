import type { Metadata } from 'next';
import EnterpriseClient from './EnterpriseClient';

export const metadata: Metadata = {
  title: 'Enterprise Solutions - LogiTrack v2',
  description: 'Built for the scale of global operations with dedicated infrastructure and white-glove onboarding.',
};

export default function EnterprisePage() {
  return <EnterpriseClient />;
}
