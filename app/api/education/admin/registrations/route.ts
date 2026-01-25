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

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;
  const supabase = adminCheck.supabase;

  const sessionId = request.nextUrl.searchParams.get('session_id');
  
  try {
    let query = supabase
      .from('education_course_registrations')
      .select(`
        id,
        status,
        payment_status,
        notes,
        created_at,
        user_id,
        full_name,
        email,
        phone,
        order_id,
        session:education_course_sessions (
          id,
          headline,
          start_at,
          course:education_courses (title)
        )
      `)
      .order('created_at', { ascending: false });

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data: registrations, error } = await query;

    if (error) {
      console.error('Failed to fetch registrations:', error);
      return NextResponse.json({ error: error.message || 'Failed to fetch registrations' }, { status: 500 });
    }

    return NextResponse.json({ registrations: registrations || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return adminCheck.response;
  const supabase = adminCheck.supabase;

  try {
    const body = await request.json();
    const { id, status, notes, payment_status } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Registration id is required' }, { status: 400 });
    }

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) payload.status = status;
    if (payment_status) payload.payment_status = payment_status;
    if (notes !== undefined) payload.notes = typeof notes === 'string' ? notes.trim() : notes;

    const { data, error } = await supabase
      .from('education_course_registrations')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Failed to update registration:', error);
      return NextResponse.json({ error: error.message || 'Failed to update registration' }, { status: 500 });
    }

    return NextResponse.json({ success: true, registration: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
