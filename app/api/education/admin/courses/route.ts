import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  let user = null;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const { data: { user: authUser } } = await supabase.auth.getUser(token);
    user = authUser;
  }

  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  // Use admin client to check role (bypasses RLS)
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  // Return admin client for database operations
  return { ok: true as const, supabase: supabaseAdmin };
}

function normalizeCoursePayload(body: any) {
  const normalizeText = (value?: string | null) => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const toSlug = (value?: string | null) => {
    if (typeof value !== 'string') return '';
    return value.trim().toLowerCase();
  };

  return {
    slug: toSlug(body.slug),
    title: (body.title || '').trim(),
    subtitle: normalizeText(body.subtitle),
    short_description: normalizeText(body.short_description ?? body.shortDescription),
    long_description: normalizeText(body.long_description ?? body.longDescription),
    level: body.level || 'beginner',
    organizer: normalizeText(body.organizer),
    location: normalizeText(body.location),
    cover_image_url: normalizeText(body.cover_image_url ?? body.coverImageUrl),
    highlight_color: (body.highlight_color ?? body.highlightColor ?? '#00B5AD').trim(),
    published: body.published !== false,
    price: body.price !== undefined ? Number(body.price) : undefined,
    max_attendees: body.max_attendees !== undefined ? Number(body.max_attendees) : undefined,
    status: body.status || 'active',
    language: body.language || 'sl',
    start_time: body.start_time || null,
  };
}

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;
  const supabase = adminCheck.supabase;

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
      published,
      price,
      max_attendees,
      status,
      language,
      start_time,
      created_at,
      updated_at,
      sessions:education_course_sessions (
        id,
        course_id,
        status,
        headline,
        start_at,
        end_at,
        location,
        language,
        format,
        price,
        max_participants,
        created_at,
        updated_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load education courses for admin:', error);
    return NextResponse.json({ error: 'Failed to load education courses' }, { status: 500 });
  }

  const sessionIds = (courses || [])
    .flatMap((course: any) => (course.sessions || []).map((session: any) => session.id))
    .filter(Boolean);

  let registrations: any[] | null = null;

  if (sessionIds.length > 0) {
    const { data, error: registrationsError } = await supabase
      .from('education_course_registrations')
      .select('session_id, status')
      .in('session_id', sessionIds);

    if (registrationsError) {
      console.error('Failed to load registration counts:', registrationsError);
    } else {
      registrations = data;
    }
  }

  const countsMap: Record<string, { total: number; waitlist: number }> = {};

  if (registrations) {
    for (const row of registrations) {
      const bucket = countsMap[row.session_id] || { total: 0, waitlist: 0 };
      bucket.total += row.status === 'cancelled' ? 0 : 1;
      if (row.status === 'waitlist') bucket.waitlist += 1;
      countsMap[row.session_id] = bucket;
    }
  }

  const normalized = (courses || []).map((course: any) => ({
    ...course,
    sessions: (course.sessions || []).map((session: any) => {
      const bucket = countsMap[session.id] || { total: 0, waitlist: 0 };
      const available = session.max_participants && session.max_participants > 0
        ? Math.max(0, session.max_participants - bucket.total)
        : null;

      return {
        ...session,
        registrationsCount: bucket.total,
        waitlistCount: bucket.waitlist,
        availableSpots: available,
      };
    }),
  }));

  return NextResponse.json({ courses: normalized });
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;
  const supabase = adminCheck.supabase;

  const body = await request.json();
  const normalized = normalizeCoursePayload(body);

  if (!normalized.slug || !normalized.title) {
    return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
  }

  const payload = Object.fromEntries(
    Object.entries(normalized).filter(([_, v]) => v !== undefined)
  );

  const { data, error } = await supabase
    .from('education_courses')
    .insert({ ...payload })
    .select('*')
    .single();

  if (error) {
    console.error('Failed to create education course:', error);
    return NextResponse.json({ error: error.message || 'Failed to create course' }, { status: 500 });
  }

  return NextResponse.json({ success: true, course: data });
}

export async function PUT(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;
  const supabase = adminCheck.supabase;

  const body = await request.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: 'Course id is required' }, { status: 400 });
  }

  const normalized = normalizeCoursePayload(body);
  const payload = Object.fromEntries(
    Object.entries(normalized).filter(([_, v]) => v !== undefined)
  );
  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('education_courses')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Failed to update education course:', error);
    return NextResponse.json({ error: error.message || 'Failed to update course' }, { status: 500 });
  }

  return NextResponse.json({ success: true, course: data });
}

export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;
  const supabase = adminCheck.supabase;

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Course id is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('education_courses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete education course:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete course' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
