import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error('Missing Supabase credentials for education module');
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

export type EducationCourseSession = {
  id: string;
  status: 'current' | 'upcoming' | 'past';
  headline: string | null;
  start_at: string;
  end_at: string | null;
  location: string | null;
  language: string | null;
  format: string | null;
  price: number | null;
  max_participants: number | null;
  registrationsCount: number;
  availableSpots: number | null;
  isFull: boolean;
};

export type EducationCourse = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  short_description: string | null;
  long_description: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  organizer: string | null;
  location: string | null;
  cover_image_url: string | null;
  highlight_color: string | null;
  price: number | null;
  max_attendees: number | null;
  status: string | null;
  language: string | null;
  start_time: string | null;
  sessions: EducationCourseSession[];
};

export async function getEducationOverview(): Promise<EducationCourse[]> {
  const { data: courses, error } = await supabase
    .from('education_courses')
    .select(`
      id,
      slug,
      title,
      subtitle,
      short_description,
      long_description,
      level,
      organizer,
      location,
      cover_image_url,
      highlight_color,
      price,
      max_attendees,
      status,
      language,
      start_time,
      sessions:education_course_sessions (
        id,
        status,
        headline,
        start_at,
        end_at,
        location,
        language,
        format,
        price,
        max_participants
      )
    `)
    .eq('published', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to load education courses:', error);
    return [];
  }

  const sessionIds = (courses || [])
    .flatMap((course) => course.sessions?.map((session: any) => session.id) || [])
    .filter(Boolean);

  const countsMap: Record<string, number> = {};

  if (sessionIds.length > 0) {
    const { data: registrations } = await supabase
      .from('education_course_registrations')
      .select('session_id, status')
      .in('session_id', sessionIds);

    if (registrations) {
      for (const registration of registrations) {
        if (registration.status === 'cancelled') continue;
        countsMap[registration.session_id] = (countsMap[registration.session_id] || 0) + 1;
      }
    }
  }

  return (courses || []).map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    short_description: course.short_description,
    long_description: course.long_description,
    level: (course.level ?? 'beginner') as EducationCourse['level'],
    organizer: course.organizer,
    location: course.location,
    cover_image_url: course.cover_image_url,
    highlight_color: course.highlight_color,
    price: course.price ?? null,
    max_attendees: course.max_attendees ?? null,
    status: course.status ?? null,
    language: course.language ?? null,
    start_time: course.start_time ?? null,
    sessions: (course.sessions || []).map((session: any) => {
      const used = countsMap[session.id] || 0;
      const isFull = session.max_participants && session.max_participants > 0 && used >= session.max_participants;
      return {
        id: session.id,
        status: session.status,
        headline: session.headline,
        start_at: session.start_at,
        end_at: session.end_at,
        location: session.location,
        language: session.language,
        format: session.format,
        // Prefer session price; fallback to course base price when session price is missing
        price: session.price ?? course.price ?? null,
        max_participants: session.max_participants,
        registrationsCount: used,
        availableSpots:
          session.max_participants && session.max_participants > 0
            ? Math.max(0, session.max_participants - used)
            : null,
        isFull,
      } as EducationCourseSession;
    }),
  }));
}
