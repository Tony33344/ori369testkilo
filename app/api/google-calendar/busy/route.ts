import { NextRequest, NextResponse } from 'next/server';
import { listEventsInRange } from '@/lib/googleCalendar';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get('timeMin');
    const timeMax = searchParams.get('timeMax');

    if (!timeMin || !timeMax) {
      return NextResponse.json({ error: 'Missing timeMin/timeMax' }, { status: 400 });
    }

    // Debug: check if env vars are set
    const hasServiceAccountKey = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const hasCalendarId = !!process.env.GOOGLE_CALENDAR_ID;
    console.log(`[Google Calendar API] Service account key set: ${hasServiceAccountKey}, Calendar ID set: ${hasCalendarId}`);

    const events = await listEventsInRange(timeMin, timeMax);

    const busy = events
      .filter((e) => e.start && e.end)
      .map((e) => ({
        id: e.id,
        summary: e.summary || 'Busy',
        start: e.start,
        end: e.end,
      }));

    console.log(`[Google Calendar API] Found ${busy.length} busy events between ${timeMin} and ${timeMax}`);
    return NextResponse.json({ busy });
  } catch (error) {
    console.error('Google Calendar busy error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch busy events', details: errorMessage },
      { status: 500 }
    );
  }
}
