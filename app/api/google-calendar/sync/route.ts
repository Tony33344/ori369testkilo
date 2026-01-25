import { NextRequest, NextResponse } from 'next/server';
import { syncBookingToCalendar } from '@/lib/calendarSync';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await syncBookingToCalendar(body);

    return NextResponse.json({
      success: true,
      eventId: result.eventId,
      eventLink: result.eventLink
    });

  } catch (error) {
    console.error('Google Calendar sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Google Calendar', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
