import { createClient } from '@/lib/supabase';

export interface PublicServiceContent {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  howItWorks: string;
  benefits: string[];
  indications: string[];
  contraindications: string[];
  duration: number;
  price: number;
  sessions: number;
  isPackage: boolean;
  images: string[];
}

type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  long_description: string | null;
  how_it_works: string | null;
  benefits: string[] | null;
  indications: string[] | null;
  contraindications: string[] | null;
  duration: number | null;
  price: number | null;
  sessions: number | null;
  is_package: boolean | null;
  image_url: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  active: boolean | null;
};

function normalizeList(value: string[] | null | undefined): string[] {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizeImages(row: ServiceRow): string[] {
  return [row.image_url, row.image_url_2, row.image_url_3].filter(
    (value): value is string => Boolean(value && value.trim())
  );
}

function mapRow(row: ServiceRow): PublicServiceContent {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.description || '',
    longDescription: row.long_description || row.description || '',
    howItWorks: row.how_it_works || '',
    benefits: normalizeList(row.benefits),
    indications: normalizeList(row.indications),
    contraindications: normalizeList(row.contraindications),
    duration: row.duration || 0,
    price: row.price || 0,
    sessions: row.sessions || 1,
    isPackage: Boolean(row.is_package),
    images: normalizeImages(row),
  };
}

export async function fetchPublicServices(isPackage: boolean): Promise<PublicServiceContent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, name, description, long_description, how_it_works, benefits, indications, contraindications, duration, price, sessions, is_package, image_url, image_url_2, image_url_3, active, display_order')
    .eq('active', true)
    .eq('is_package', isPackage)
    .order('display_order', { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as ServiceRow[]).map(mapRow);
}

export async function fetchPublicServiceBySlug(slug: string): Promise<PublicServiceContent | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, slug, name, description, long_description, how_it_works, benefits, indications, contraindications, duration, price, sessions, is_package, image_url, image_url_2, image_url_3, active')
    .eq('active', true)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return mapRow(data as ServiceRow);
}

export async function fetchPublicServiceSlugs(isPackage: boolean): Promise<{ slug: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('services')
    .select('slug, display_order')
    .eq('active', true)
    .eq('is_package', isPackage)
    .order('display_order', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as { slug: string }[];
}
