import { notFound } from 'next/navigation';
import { fetchPublicServiceBySlug, fetchPublicServiceSlugs, fetchPublicServices } from '@/lib/public-services';
import TherapyDetailContent from '@/components/TherapyDetailContent';

export async function generateStaticParams() {
  return fetchPublicServiceSlugs(true);
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const richContent = await fetchPublicServiceBySlug(slug);

  if (!richContent || !richContent.isPackage) {
    notFound();
  }

  const allPackages = await fetchPublicServices(true);
  const currentIndex = allPackages.findIndex((service) => service.slug === slug);
  const nextPackage = currentIndex >= 0 ? allPackages[(currentIndex + 1) % allPackages.length] : null;

  return (
    <TherapyDetailContent
      richContent={richContent}
      images={richContent.images}
      backHref="/paketi"
      nextHref={nextPackage ? `/paketi/${nextPackage.slug}` : undefined}
      nextLabel={nextPackage?.name}
    />
  );
}
