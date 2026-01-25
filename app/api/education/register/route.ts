import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error('Missing Supabase credentials for education registration API');
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, fullName, email, phone, notes } = body ?? {};

    if (!sessionId || !fullName || !email) {
      return NextResponse.json(
        { error: 'sessionId, fullName and email are required' },
        { status: 400 }
      );
    }

    const { data: session, error: sessionError } = await supabase
      .from('education_course_sessions')
      .select('id, course_id, status, start_at, max_participants, education_courses!inner ( title )')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Education session not found' },
        { status: 404 }
      );
    }

    const { count: existingCountRaw } = await supabase
      .from('education_course_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .neq('status', 'cancelled');

    const existingCount = existingCountRaw ?? 0;
    const max = session.max_participants || 0;
    const isWaitlist = max > 0 && existingCount >= max;

    const { data: registration, error: insertError } = await supabase
      .from('education_course_registrations')
      .insert({
        session_id: sessionId,
        full_name: fullName,
        email,
        phone: phone || null,
        notes: notes || null,
        status: isWaitlist ? 'waitlist' : 'pending',
        payment_status: 'unpaid',
      })
      .select('id')
      .single();

    if (insertError || !registration) {
      console.error('Failed to insert education registration:', insertError);
      return NextResponse.json(
        { error: 'Failed to create reservation. Please try again.' },
        { status: 500 }
      );
    }

    const remainingSpots = !max
      ? null
      : Math.max(0, max - (existingCount + (isWaitlist ? 0 : 1)));

    const courseTitle = (() => {
      const relation = session.education_courses as any;
      if (Array.isArray(relation)) {
        return relation[0]?.title ?? 'ORI Education';
      }
      if (relation && typeof relation === 'object') {
        return relation.title ?? 'ORI Education';
      }
      return 'ORI Education';
    })();

    return NextResponse.json({
      success: true,
      waitlist: isWaitlist,
      remainingSpots,
      courseTitle,
      sessionId,
      registrationId: registration.id,
    });
  } catch (error) {
    console.error('Education registration error:', error);
    return NextResponse.json(
      { error: 'Unexpected error. Please try again later.' },
      { status: 500 }
    );
  }
}
