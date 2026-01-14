import { notFound } from 'next/navigation';
import { servicesData } from '@/lib/servicesData';
import TherapyDetailContent from '@/components/TherapyDetailContent';

const therapyImages: Record<string, string> = {
  'elektrostimulacija': '/images/therapies/IMG_5926-768x513.webp',
  'manualna-terapija': '/images/therapies/IMG_5929-768x513.webp',
  'tecar-terapija': '/images/therapies/IMG_5931-768x513.webp',
  'magnetna-terapija': '/images/therapies/IMG_5935-768x513.webp',
  'mis': '/images/therapies/IMG_5938-768x513.webp',
  'laserska-terapija': '/images/therapies/IMG_5947-768x513.webp',
  'media-taping': '/images/therapies/IMG_5953-768x513.webp',
  'cupping': '/images/therapies/IMG_5955-768x513.webp',
  'dryneedeling': '/images/therapies/IMG_5991-768x513.webp',
  'iteracare': '/images/therapies/IMG_5993-768x513.webp',
  'ao-scan': '/images/therapies/IMG_5997-768x513.webp',
  'trakcijska-miza': '/images/therapies/IMG_6004-768x513.webp',
  'skalarni-valovi': '/images/therapies/IMG_6009-Copy-768x513.webp',
  'vodeno-dihanje': '/images/therapies/IMG_5779-768x513.webp',
};

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({ slug }));
}

export default async function TherapyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const richContent = servicesData[slug];

  if (!richContent) {
    notFound();
  }

  const therapyImage = therapyImages[slug] || '/images/therapies/IMG_5779-768x513.webp';

  return <TherapyDetailContent richContent={richContent} therapyImage={therapyImage} />;
}
