export type PaymentMethod = 'card' | 'upn' | 'cash_pickup' | 'cash_delivery';

export interface OrderSummaryItem {
  id: string;
  name: string;
  quantity: number;
  totalPrice: number;
  type: 'service' | 'product' | 'education';
  bookingDate?: string | null;
  bookingTime?: string | null;
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  card: 'Plačilo s kartico',
  upn: 'Bančno nakazilo (UPN)',
  cash_pickup: 'Gotovina ob prevzemu',
  cash_delivery: 'Plačilo ob dostavi',
};

export const paymentMethodDescriptions: Record<PaymentMethod, { title: string; description: string }> = {
  card: { title: 'Plačilo s kartico', description: 'Varna plačila z Mastercard, Visa, Maestro' },
  upn: { title: 'Bančno nakazilo (UPN)', description: 'Nakazilo preko spletne banke' },
  cash_pickup: { title: 'Gotovina ob prevzemu', description: 'Plačilo v naši trgovini ali na tečaju' },
  cash_delivery: { title: 'Plačilo ob dostavi', description: 'Plačate kurirju ob prevzemu paketa' },
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
