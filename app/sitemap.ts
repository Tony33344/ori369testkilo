import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ori369.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/o-nas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/terapije`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/paketi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/cenik`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/rezervacija`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/kontakt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/education`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/motioscan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/trgovina`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/mediji`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${baseUrl}/vprasalnik`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/politika-zasebnosti`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/politika-piskotkov`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/splosni-pogoji`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/obvestilo-o-odstopu`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    const supabase = createClient();
    const { data: services } = await supabase
      .from('services')
      .select('slug, is_package')
      .eq('active', true)
      .neq('slug', 'dryneedeling-terapija');

    const serviceRoutes: MetadataRoute.Sitemap = (services || [])
      .filter((s: any) => s.slug)
      .map((s: any) => ({
        url: `${baseUrl}/${s.is_package ? 'paketi' : 'terapije'}/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

    const { data: courses } = await supabase
      .from('education_courses')
      .select('slug');

    const courseRoutes: MetadataRoute.Sitemap = (courses || [])
      .filter((c: any) => c.slug)
      .map((c: any) => ({
        url: `${baseUrl}/education/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

    return [...staticRoutes, ...serviceRoutes, ...courseRoutes];
  } catch {
    return staticRoutes;
  }
}
