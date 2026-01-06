import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get('timeMin');
    const timeMax = searchParams.get('timeMax');

    if (!timeMin || !timeMax) {
      return NextResponse.json({ error: 'Missing timeMin/timeMax' }, { status: 400 });
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const apiKey = process.env.GOOGLE_CLIENT_ID; // Use GOOGLE_CLIENT_ID as API key for public calendar access

    if (!calendarId) {
      return NextResponse.json({ error: 'GOOGLE_CALENDAR_ID not configured' }, { status: 500 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not configured' }, { status: 500 });
    }

    // Use Google Calendar public API (no authentication needed for public calendars)
    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendarId) + '/events');
    url.searchParams.set('timeMin', timeMin);
    url.searchParams.set('timeMax', timeMax);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('singleEvents', 'true');
    url.searchParams.set('orderBy', 'startTime');
    url.searchParams.set('maxResults', '2500');

    console.log(`[Google Calendar API] Fetching events from ${calendarId}`);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Google Calendar API] Error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to fetch calendar events', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const events = data.items || [];

    const busy = events
      .filter((e: any) => e.start && e.end)
      .map((e: any) => ({
        id: e.id,
        summary: e.summary || 'Busy',
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date,
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
