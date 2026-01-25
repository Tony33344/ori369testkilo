export type PaymentMethod = 'card' | 'upn' | 'cash_pickup' | 'cash_delivery';

export interface OrderSummaryItem {
  id: string;
  name: string;
  quantity: number;
  totalPrice: number;
  type: 'service' | 'product';
  bookingDate?: string | null;
  bookingTime?: string | null;
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  card: 'Plačilo s kartico',
  upn: 'Bančno nakazilo (UPN)',
  cash_pickup: 'Plačilo ob osebnem prevzemu',
  cash_delivery: 'Plačilo ob dostavi',
};

export const formatOrderDateTime = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('sl-SI', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return '—';
  }
};

export const formatSlotDateTime = (date?: string | null, time?: string | null) => {
  if (!date || !time) return null;
  const [timePart] = time.split('-');
  const [year, month, day] = date.split('-').map((part) => parseInt(part, 10));
  const [hours, minutes] = (timePart || '').split(':').map((part) => parseInt(part, 10));

  if ([year, month, day, hours].some((value) => Number.isNaN(value))) {
    return null;
  }

  const slotDate = new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0, 0);
  return slotDate.toLocaleString('sl-SI', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};
