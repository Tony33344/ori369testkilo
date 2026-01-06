'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/i18n';
import { toast } from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
  serviceId: string;
  onDateSelect: (date: string, timeSlot: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

export default function BookingCalendar({
  serviceId,
  onDateSelect,
  selectedDate,
  selectedTime
}: BookingCalendarProps) {
  const { t } = useLanguage();
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(1);
    return d;
  });

  useEffect(() => {
    // Keep current month aligned with selectedDate (if parent sets it)
    if (!selectedDate) return;
    const d = new Date(selectedDate);
    if (Number.isNaN(d.getTime())) return;
    d.setHours(0, 0, 0, 0);
    d.setDate(1);
    setCurrentMonth(d);
  }, [selectedDate]);

  useEffect(() => {
    if (serviceId) {
      loadAvailability();
    }
  }, [serviceId]);

  const loadAvailability = async () => {
    const { data: slots, error } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('active', true);

    if (error) {
      console.error('Error loading availability:', error);
      setLoading(false);
      return;
    }

    if (slots) {
      setAvailableSlots(slots);
    }
    setLoading(false);
  };

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const monthLabel = useMemo(() => {
    const locale = t('common.locale');
    return currentMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }, [currentMonth, t]);

  const dayNames = useMemo(() => {
    const locale = t('common.locale');
    // Force Monday-first display (common for SI). We'll render Mo..Su.
    const base = new Date('2024-01-01T00:00:00'); // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: 'short' });
    });
  }, [t]);

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    // Monday-first grid offset
    const jsDay = first.getDay(); // 0 Sun..6 Sat
    const mondayFirst = (jsDay + 6) % 7; // 0 Mon..6 Sun
    const cells: Array<Date | null> = [];
    for (let i = 0; i < mondayFirst; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
    return cells;
  }, [currentMonth]);

  const prevMonth = () => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  };

  const isDaySelectable = (date: Date) => {
    const isPast = date < today;
    if (isPast) return false;
    const dayOfWeek = date.getDay();
    return availableSlots.some((s) => s.day_of_week === dayOfWeek);
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (!isDaySelectable(date)) {
      toast.error(t('booking.noSlotsAvailable'));
      return;
    }
    onDateSelect(dateStr, '');
  };

  return (
    <div className="space-y-3">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-base font-semibold text-white capitalize">{monthLabel}</h2>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                if (!date) return <div key={index} className="aspect-square" />;

                const dateStr = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;
                const isToday = date.getTime() === today.getTime();
                const selectable = isDaySelectable(date);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => selectable && handleDateClick(date)}
                    disabled={!selectable}
                    className={`
                      aspect-square rounded-md flex items-center justify-center text-sm font-medium transition-all
                      ${selectable ? 'hover:bg-indigo-50 cursor-pointer text-gray-700' : 'text-gray-300 cursor-not-allowed'}
                      ${isToday && selectable ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-400' : ''}
                      ${isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-indigo-600" />
          <span>{t('booking.selected')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-indigo-100 ring-1 ring-indigo-400" />
          <span>{t('booking.today')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-200" />
          <span>{t('booking.unavailable')}</span>
        </div>
      </div>
    </div>
  );
}
