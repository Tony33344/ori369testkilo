'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import dynamic from 'next/dynamic';

const BookingCalendar = dynamic(() => import('@/components/BookingCalendar'), {
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
});

const BUSINESS_TIMEZONE = 'Europe/Vienna';

const resolveServiceByPackageParam = (items: any[], packageParam: string) => {
  const normalizedParam = packageParam.toLowerCase();

  const directMatch = items.find((item) => item.slug?.toLowerCase() === normalizedParam);
  if (directMatch) return directMatch;

  const aliasMap: Record<string, string[]> = {
    motioscan: ['motioscan', 'moti-physio', 'meritev-physio-motio', 'physio-motio-meritev'],
    'uvodni-termin': ['uvodni-termin', 'physio-motio-pregled'],
  };

  const aliases = aliasMap[normalizedParam] || [normalizedParam];
  const aliasMatch = items.find((item) => aliases.includes(item.slug?.toLowerCase()));
  if (aliasMatch) return aliasMatch;

  return items.find((item) => {
    const haystack = `${item.slug || ''} ${item.name || ''}`.toLowerCase();
    if (normalizedParam === 'motioscan') {
      return haystack.includes('samo meritev physio motio') || haystack.includes('brez plana terapij');
    }
    if (normalizedParam === 'uvodni-termin') {
      return haystack.includes('prvi pregled + meritev s physio motio') || haystack.includes('celovit personaliziran plan terapij in vaj');
    }
    return haystack.includes(normalizedParam);
  });
};

function BookingForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get('package');
  
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [allSlots, setAllSlots] = useState<string[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<Array<{ start: string; end: string; summary: string }>>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [useCalendarView, setUseCalendarView] = useState(true);
  const [calendarReady, setCalendarReady] = useState(false);

  useEffect(() => {
    loadUser();
    loadServices();
  }, []);

  useEffect(() => {
    if (packageId && services.length > 0) {
      const pkg = resolveServiceByPackageParam(services, packageId);
      if (pkg) setSelectedService(pkg.id);
    }
  }, [packageId, services]);

  useEffect(() => {
    if (selectedService && !selectedDate) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      setSelectedDate(todayStr);
    }
  }, [selectedService, selectedDate]);

  useEffect(() => {
    if (selectedDate && selectedService) {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate, selectedService]);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const redirectPath = `/rezervacija${search || ''}`;
      router.replace(`/prijava?redirect=${encodeURIComponent(redirectPath)}`);
    }
  };

  const loadServices = async () => {
    // Fetch services and order them to match the site display order
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true);
    
    if (data) {
      // Sort therapies first, then packages, each alphabetically by name
      const therapies = data.filter((s: any) => !s.is_package).sort((a: any, b: any) => a.name.localeCompare(b.name, 'sl'));
      const packages = data.filter((s: any) => s.is_package).sort((a: any, b: any) => a.name.localeCompare(b.name, 'sl'));
      setServices([...therapies, ...packages]);
    }
    if (error) console.error('Error loading services:', error);
  };

  const loadAvailableSlots = async (date: string) => {
    if (!selectedService) return;

    const selectedServiceObj = services.find((s) => s.id === selectedService);
    const serviceDurationMin = Number(selectedServiceObj?.duration || 60);
    const slotIntervalMin = Number(selectedServiceObj?.slot_interval_min || 30);

    // Parse date as local noon to avoid UTC midnight shifting day-of-week
    const dayOfWeek = new Date(`${date}T12:00:00`).getDay();

    // Get availability for this day
    const { data: slots } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .eq('active', true);

    if (!slots || slots.length === 0) {
      setAvailableSlots([]);
      return;
    }

    // Get existing bookings for this date
    const { data: bookings } = await supabase
      .from('bookings')
      .select('time_slot, status, services(duration)')
      .eq('date', date)
      .neq('status', 'cancelled');

    const bookingRanges = ((bookings as Array<{ time_slot: string; services?: { duration?: number } | { duration?: number }[] }> | null) || [])
      .map((booking) => {
        const timeValue = (booking.time_slot || '').slice(0, 5);
        if (!timeValue) return null;
        const [hours, minutes] = timeValue.split(':').map(Number);
        const start = hours * 60 + minutes;
        const services = booking.services as any;
        const bookingDuration = Array.isArray(services)
          ? Number(services[0]?.duration || 60)
          : Number(services?.duration || 60);

        return {
          start,
          end: start + bookingDuration,
        };
      })
      .filter((value): value is { start: number; end: number } => Boolean(value));

    // Get busy events from Google Calendar for this date
    let googleBusyRanges: Array<{ start: Date; end: Date }> = [];
    try {
      const dayStartUTC = fromZonedTime(`${date}T00:00:00`, BUSINESS_TIMEZONE);
      const dayEndUTC = fromZonedTime(`${date}T23:59:59`, BUSINESS_TIMEZONE);

      const res = await fetch(`/api/google-calendar/busy?timeMin=${encodeURIComponent(dayStartUTC.toISOString())}&timeMax=${encodeURIComponent(dayEndUTC.toISOString())}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        console.log('[Booking] Google Calendar response:', json);
        
        // Store calendar events for display
        const events = (json?.busy || []).map((e: any) => {
          const s = e?.start?.dateTime || e?.start?.date;
          const en = e?.end?.dateTime || e?.end?.date;
          if (!s || !en) return null;
          const startDate = new Date(s);
          const endDate = new Date(en);
          const startVienna = toZonedTime(startDate, BUSINESS_TIMEZONE);
          const endVienna = toZonedTime(endDate, BUSINESS_TIMEZONE);
          return {
            start: `${startVienna.getHours().toString().padStart(2, '0')}:${startVienna.getMinutes().toString().padStart(2, '0')}`,
            end: `${endVienna.getHours().toString().padStart(2, '0')}:${endVienna.getMinutes().toString().padStart(2, '0')}`,
            summary: e?.summary || 'Busy'
          };
        }).filter(Boolean);
        setCalendarEvents(events);
        
        googleBusyRanges = (json?.busy || [])
          .map((e: any) => {
            const s = e?.start?.dateTime || e?.start?.date;
            const en = e?.end?.dateTime || e?.end?.date;
            if (!s || !en) return null;
            console.log('[Booking] Raw event times:', { start: s, end: en });
            const startDate = new Date(s);
            const endDate = new Date(en);
            console.log('[Booking] Parsed to Date objects:', { start: startDate.toISOString(), end: endDate.toISOString() });
            return { start: startDate, end: endDate };
          })
          .filter(Boolean);
        console.log('[Booking] Parsed busy ranges:', googleBusyRanges);
      }
    } catch (e) {
      console.error('Failed to load Google busy events:', e);
    }

    // Convert busy ranges to business timezone minutes since midnight
    const busyMinutes: Array<{ start: number; end: number }> = googleBusyRanges.map(r => {
      const startBusiness = toZonedTime(r.start, BUSINESS_TIMEZONE);
      const endBusiness = toZonedTime(r.end, BUSINESS_TIMEZONE);
      console.log('[Booking] Converted to business timezone:', {
        startUTC: r.start.toISOString(),
        endUTC: r.end.toISOString(),
        startVienna: startBusiness.toString(),
        endVienna: endBusiness.toString(),
      });
      const startMin = startBusiness.getHours() * 60 + startBusiness.getMinutes();
      const endMin = endBusiness.getHours() * 60 + endBusiness.getMinutes();
      console.log('[Booking] Minutes since midnight:', { startMin, endMin });
      return { start: startMin, end: endMin };
    });

    // Generate all possible time slots and categorize them
    const generatedSlots: string[] = [];
    const available: string[] = [];
    const booked: string[] = [];
    const busy: string[] = [];

    const formatTime = (minutes: number) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    (slots as Array<{ start_time: string; end_time: string }>).forEach((slot) => {
      const [startH, startM] = slot.start_time.split(':').map(Number);
      const [endH, endM] = slot.end_time.split(':').map(Number);
      const startMin = startH * 60 + startM;
      const endMin = endH * 60 + endM;

      for (let time = startMin; time <= endMin - serviceDurationMin; time += slotIntervalMin) {
        const slotTime = formatTime(time);
        if (generatedSlots.includes(slotTime)) continue;
        generatedSlots.push(slotTime);

        const slotStartMin = time;
        // Use the LARGER of service duration or slot interval for blocking
        // This ensures the entire time slot is blocked even if service is shorter
        const blockingDuration = Math.max(serviceDurationMin, slotIntervalMin);
        const slotEndMin = time + blockingDuration;

        // Check if booked
        const overlapsReservation = bookingRanges.some((booking) => slotStartMin < booking.end && slotEndMin > booking.start);
        if (overlapsReservation) {
          booked.push(slotTime);
          continue;
        }

        // Check if overlaps with Google busy
        const overlapsGoogle = busyMinutes.some(b => slotStartMin < b.end && slotEndMin > b.start);
        if (overlapsGoogle) {
          busy.push(slotTime);
          continue;
        }

        // Otherwise available
        available.push(slotTime);
      }
    });

    console.log('[Booking] Final slot categorization:', {
      allSlots: generatedSlots.sort(),
      available: available.sort(),
      booked: booked.sort(),
      busy: busy.sort(),
    });

    setAllSlots(generatedSlots.sort());
    setAvailableSlots(available.sort());
    setBookedSlots(booked.sort());
    setBusySlots(busy.sort());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t('booking.loginRequired'));
      window.location.href = '/prijava?redirect=/rezervacija';
      return;
    }

    if (!selectedService) {
      toast.error(t('booking.selectServiceFirst'));
      return;
    }
    
    if (!selectedDate) {
      toast.error(t('booking.selectDateFirst'));
      return;
    }
    
    if (!selectedTime) {
      toast.error(t('booking.selectDateFirst'));
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        service_id: selectedService,
        date: selectedDate,
        time_slot: selectedTime,
        notes: notes || null,
        status: 'pending'
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast.error(t('booking.error'));
      console.error(error);
    } else {
      // DO NOT sync to Google Calendar here - only sync AFTER successful payment
      // Calendar sync happens in:
      // 1. app/api/stripe/webhook/route.ts (after successful Stripe payment)
      // 2. app/checkout/page.tsx (after successful checkout)
      
      toast.success(t('booking.success'));
      // Redirect to checkout page with booking details
      window.location.href = `/checkout?service=${selectedService}&date=${selectedDate}&time=${selectedTime}&bookingId=${data.id}`;
    }
  };

  // Generate next 14 days for date selection
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEEE, d. MMMM yyyy')
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('booking.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('booking.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
            {!user && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  {t('booking.loginRequired')}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('booking.selectService')} *
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedService(value);
                    if (!value) {
                      setSelectedDate('');
                      setSelectedTime('');
                    } else if (!selectedDate) {
                      setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                    }
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('booking.selectService')}</option>
                  {services.filter(s => !s.is_package).length > 0 && (
                    <optgroup label={t('nav.therapies')}>
                      {services.filter(s => !s.is_package).map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - €{service.price} ({service.duration} min)
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {services.filter(s => s.is_package).length > 0 && (
                    <optgroup label={t('nav.packages')}>
                      {services.filter(s => s.is_package).map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - €{service.price} ({service.sessions} {t('admin.services.sessions')})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Date Selection - Calendar shown immediately when service is selected */}
              {selectedService && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Calendar size={18} />
                    <span>{t('booking.selectDate')} *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCalendarView(!useCalendarView)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {useCalendarView ? t('booking.useDropdown') : t('booking.useCalendar')}
                  </button>
                </div>
                
                {useCalendarView ? (
                  <div className="border border-gray-300 rounded-lg p-4">
                    <BookingCalendar
                      serviceId={selectedService}
                      onDateSelect={(date, time) => {
                        setSelectedDate(date);
                        if (time) setSelectedTime(time);
                      }}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                    />
                  </div>
                ) : (
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('booking.selectDate')}</option>
                    {dateOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              )}

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <Clock size={18} />
                    <span>{t('booking.selectTime')} *</span>
                  </label>
                  
                  {/* Display actual Google Calendar events */}
                  {calendarEvents.length > 0 && (
                    <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="text-sm font-semibold text-orange-900 mb-2">📅 Google Calendar dogodki:</div>
                      <div className="space-y-1">
                        {calendarEvents.map((event, idx) => (
                          <div key={idx} className="text-sm text-orange-800">
                            <span className="font-mono font-bold">{event.start} - {event.end}</span>
                            {event.summary !== 'Busy' && <span className="ml-2 text-orange-600">({event.summary})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Legend for time slots */}
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-100 border-2 border-green-500"></div>
                        <span className="text-gray-600">{t('booking.available')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-100 border-2 border-red-400"></div>
                        <span className="text-gray-600">{t('booking.bookedReservation')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-orange-100 border-2 border-orange-400"></div>
                        <span className="text-gray-600">{t('booking.bookedCalendar')}</span>
                      </div>
                    </div>
                  </div>

                  {(availableSlots.length > 0 || bookedSlots.length > 0 || busySlots.length > 0) ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {[...availableSlots, ...bookedSlots, ...busySlots].sort().map(slot => {
                        const isBooked = bookedSlots.includes(slot);
                        const isBusy = busySlots.includes(slot);
                        const isAvailable = availableSlots.includes(slot);
                        const isSelected = selectedTime === slot;
                        
                        let className = 'px-2 py-2 md:px-3 md:py-2 border-2 rounded-lg font-medium transition-all text-xs md:text-sm ';
                        
                        if (isSelected) {
                          className += 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300';
                        } else if (isBooked) {
                          className += 'bg-red-50 text-red-400 border-red-200 cursor-not-allowed line-through';
                        } else if (isBusy) {
                          className += 'bg-orange-50 text-orange-400 border-orange-200 cursor-not-allowed line-through';
                        } else if (isAvailable) {
                          className += 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100 hover:border-green-500 cursor-pointer';
                        }
                        
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => isAvailable && setSelectedTime(slot)}
                            disabled={!isAvailable}
                            className={className}
                            title={isBooked ? t('booking.bookedReservation') : isBusy ? t('booking.bookedCalendar') : t('booking.available')}
                          >
                            <span className="flex items-center justify-center gap-1">
                              {isBooked && <span>🔒</span>}
                              {isBusy && <span>📅</span>}
                              {slot}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-700 flex items-center gap-2">
                        <Clock size={18} />
                        {t('booking.noSlotsAvailable')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !user}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? t('common.loading') : t('booking.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BookingForm />
    </Suspense>
  );
}
