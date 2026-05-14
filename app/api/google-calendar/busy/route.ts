import { NextRequest, NextResponse } from 'next/server';
import { listEventsInRange } from '@/lib/googleCalendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get('timeMin');
    const timeMax = searchParams.get('timeMax');

    if (!timeMin || !timeMax) {
      return NextResponse.json({ error: 'Missing timeMin/timeMax' }, { status: 400 });
    }

    console.log(`[Google Calendar API] Fetching busy events from ${timeMin} to ${timeMax}`);

    // Use service account authentication via googleCalendar lib
    const events = await listEventsInRange(timeMin, timeMax);

    const busy = events
      .filter((e: any) => e.start && e.end)
      .map((e: any) => ({
        id: e.id,
        summary: e.summary || 'Busy',
        start: e.start,
        end: e.end,
      }));

    console.log(`[Google Calendar API] Found ${busy.length} busy events`);
    return NextResponse.json({ busy }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
      },
    });
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
