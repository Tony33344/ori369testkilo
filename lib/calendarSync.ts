import { createClient } from '@supabase/supabase-js';
import { createCalendarEvent } from './googleCalendar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CalendarSyncPayload {
  bookingId: string;
  date?: string;
  time?: string;
  serviceName?: string;
  duration?: number;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
}

export async function syncBookingToCalendar(payload: CalendarSyncPayload) {
  let { bookingId, date, time, serviceName, duration, clientName, clientEmail, clientPhone, notes } = payload;

  if (!bookingId) {
    throw new Error('bookingId is required');
  }

  if (!date || !time || !serviceName || !duration || !clientName || !clientEmail) {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        id,
        date,
        time_slot,
        notes,
        services (name, duration),
        profiles (full_name, email, phone)
      `)
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      throw new Error('Booking not found for calendar sync');
    }

    date = date || booking.date;
    time = time || (booking.time_slot || '').slice(0, 5);
    const services = booking.services as any;
    const serviceNameValue = Array.isArray(services)
      ? services[0]?.name
      : services?.name;

    const serviceDurationValue = Array.isArray(services)
      ? services[0]?.duration
      : services?.duration;

    const profiles = booking.profiles as any;
    const profileFullName = Array.isArray(profiles) ? profiles[0]?.full_name : profiles?.full_name;
    const profileEmail = Array.isArray(profiles) ? profiles[0]?.email : profiles?.email;
    const profilePhone = Array.isArray(profiles) ? profiles[0]?.phone : profiles?.phone;

    serviceName = serviceName || serviceNameValue || 'Terapija';
    duration = duration || serviceDurationValue || 60;
    clientName = clientName || profileFullName || 'Stranka';
    clientEmail = clientEmail || profileEmail || '';
    clientPhone = clientPhone || profilePhone || '';
    notes = notes || booking.notes || '';
  }

  if (!date || !time || !serviceName || !duration || !clientName || !clientEmail) {
    throw new Error('Missing booking data for calendar sync');
  }

  const result = await createCalendarEvent({
    bookingId,
    date,
    time,
    serviceName,
    duration,
    clientName,
    clientEmail,
    clientPhone,
    notes,
  });

  await supabase
    .from('bookings')
    .update({ google_calendar_event_id: result.eventId })
    .eq('id', bookingId);

  return result;
}
