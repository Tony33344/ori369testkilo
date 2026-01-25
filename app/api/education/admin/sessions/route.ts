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

  return { ok: true as const, supabase: supabaseAdmin };
}

const toISO = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const toNumber = (value: any) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function normalizeSessionPayload(body: any, { includeCourseId }: { includeCourseId: boolean }) {
  const payload: Record<string, any> = {
    status: (body.status || 'upcoming') as 'current' | 'upcoming' | 'past',
    headline: typeof body.headline === 'string' && body.headline.trim().length > 0 ? body.headline.trim() : null,
    start_at: toISO(body.start_at),
    end_at: toISO(body.end_at),
    location: typeof body.location === 'string' && body.location.trim().length > 0 ? body.location.trim() : null,
    language: typeof body.language === 'string' && body.language.trim().length > 0 ? body.language.trim() : 'sl',
    format: typeof body.format === 'string' && body.format.trim().length > 0 ? body.format.trim() : 'in_person',
    price: toNumber(body.price),
    max_participants: toNumber(body.max_participants) ?? 0,
  };

  if (includeCourseId) {
    const courseId = body.course_id || body.courseId;
    if (!courseId || typeof courseId !== 'string') {
      throw new Error('course_id is required');
    }
    payload.course_id = courseId;
  }

  if (!payload.start_at) {
    throw new Error('start_at is required');
  }

  return payload;
}

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;
  const supabase = adminCheck.supabase;

  const courseId = request.nextUrl.searchParams.get('course_id');
  if (!courseId) {
    return NextResponse.json({ error: 'course_id is required' }, { status: 400 });
  }

  try {
    const { data: sessions, error } = await supabase
      .from('education_course_sessions')
      .select('*')
      .eq('course_id', courseId)
      .order('start_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch sessions:', error);
      return NextResponse.json({ error: error.message || 'Failed to fetch sessions' }, { status: 500 });
    }

    return NextResponse.json({ sessions: sessions || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;
  const supabase = adminCheck.supabase;

  try {
    const body = await request.json();
    const payload = normalizeSessionPayload(body, { includeCourseId: true });

    const { data, error } = await supabase
      .from('education_course_sessions')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('Failed to create education session:', error);
      return NextResponse.json({ error: error.message || 'Failed to create session' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid payload' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;
  const supabase = adminCheck.supabase;

  try {
    const body = await request.json();
    const { id } = body;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Session id is required' }, { status: 400 });
    }

    const payload = normalizeSessionPayload(body, { includeCourseId: false });
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('education_course_sessions')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Failed to update education session:', error);
      return NextResponse.json({ error: error.message || 'Failed to update session' }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;
  const supabase = adminCheck.supabase;

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Session id is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('education_course_sessions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete education session:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete session' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
