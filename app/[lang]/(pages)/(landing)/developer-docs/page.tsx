import type { Metadata } from 'next';
import DeveloperDocsClient from './DeveloperDocsClient';

export const metadata: Metadata = {
  title: 'Developer Docs - LogiTrack v2',
  description: 'Build on the LogiTrack platform with comprehensive API docs, SDKs, and integration guides.',
};

export default function DeveloperDocsPage() {
  return <DeveloperDocsClient />;
}
