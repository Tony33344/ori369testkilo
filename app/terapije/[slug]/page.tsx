import { notFound } from 'next/navigation';
import { fetchPublicServiceBySlug, fetchPublicServiceSlugs, fetchPublicServices } from '@/lib/public-services';
import TherapyDetailContent from '@/components/TherapyDetailContent';

export async function generateStaticParams() {
  return fetchPublicServiceSlugs(false);
}

export default async function TherapyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const richContent = await fetchPublicServiceBySlug(slug);

  if (!richContent) {
    notFound();
  }

  const allTherapies = await fetchPublicServices(false);
  const currentIndex = allTherapies.findIndex((service) => service.slug === slug);
  const nextTherapy = currentIndex >= 0 ? allTherapies[(currentIndex + 1) % allTherapies.length] : null;

  return (
    <TherapyDetailContent
      richContent={richContent}
      images={richContent.images}
      backHref="/terapije"
      nextHref={nextTherapy ? `/terapije/${nextTherapy.slug}` : undefined}
      nextLabel={nextTherapy?.name}
    />
  );
}
