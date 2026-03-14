import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { paymentMethodLabels, formatOrderDateTime, formatSlotDateTime, OrderSummaryItem } from '@/lib/orderSummary';
import CollapsibleOrderItem from '@/components/CollapsibleOrderItem';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SuccessProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

async function getOrderDetails(sessionId?: string) {
  if (!sessionId) return null;

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single();

  if (error || !data) {
    console.error('Order not found for session:', sessionId, error);
    return null;
  }

  // Get regular order items (services and products)
  const { data: items } = await supabase
    .from('order_items')
    .select('service_id, product_id, quantity, total_price, metadata, services(name), shop_products(name)')
    .eq('order_id', data.id);

  const summaryItems: OrderSummaryItem[] = (items || []).map((item) => {
    const type = item.service_id ? 'service' : 'product';

    const serviceName = Array.isArray(item.services)
      ? item.services[0]?.name
      : (item.services as { name?: string } | null | undefined)?.name;

    const productName = Array.isArray(item.shop_products)
      ? item.shop_products[0]?.name
      : (item.shop_products as { name?: string } | null | undefined)?.name;

    const name = item.service_id ? serviceName : productName;
    const startAt = item.metadata?.start_at;
    const bookingDate = item.metadata?.bookingDate || (startAt ? startAt.slice(0, 10) : null);
    const bookingTime = item.metadata?.bookingTime || (startAt ? new Date(startAt).toISOString().slice(11, 16) : null);

    return {
      id: (item.service_id || item.product_id) as string,
      name: name || 'Artikel',
      quantity: item.quantity,
      totalPrice: item.total_price,
      type,
      bookingDate,
      bookingTime,
    };
  });

  // Get education course registrations for this order
  const { data: eduRegistrations } = await supabase
    .from('education_course_registrations')
    .select('id, session_id, status')
    .eq('order_id', data.id);

  // Add education items to summary
  if (eduRegistrations && eduRegistrations.length > 0) {
    const sessionIds = eduRegistrations.map(r => r.session_id).filter(Boolean);
    
    if (sessionIds.length > 0) {
      const { data: sessionsData } = await supabase
        .from('education_course_sessions')
        .select('id, headline, start_at, price, course:education_courses(id, title)')
        .in('id', sessionIds);

      if (sessionsData) {
        for (const session of sessionsData) {
          const course = Array.isArray(session.course) ? session.course[0] : session.course;
          summaryItems.push({
            id: session.id,
            name: course?.title || 'Izobraževanje',
            quantity: 1,
            totalPrice: Number(session.price || 0),
            type: 'education' as const,
            bookingDate: session.start_at?.slice(0, 10) || null,
            bookingTime: session.start_at ? session.start_at.slice(11, 16) : null,
          });
        }
      }
    }
  }

  // Deduplicate by id + bookingDate + bookingTime + type to avoid duplicate education entries
  const uniqueSummary: OrderSummaryItem[] = [];
  for (const item of summaryItems) {
    const exists = uniqueSummary.some(
      (i) => i.id === item.id && i.bookingDate === item.bookingDate && i.bookingTime === item.bookingTime && i.type === item.type
    );
    if (!exists) uniqueSummary.push(item);
  }

  return {
    reference: (data.metadata as any)?.reference || data.id,
    total: data.total_amount,
    paymentMethod: (data.payment_method || 'card') as keyof typeof paymentMethodLabels,
    createdAt: data.created_at,
    summaryItems: uniqueSummary,
  };
}

function SuccessContent({ order }: { order: Awaited<ReturnType<typeof getOrderDetails>> }) {
  if (!order) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hvala za naročilo!</h1>
          <p className="text-gray-600 mb-6">
            Vaša referenca naročila: <strong className="text-[#00B5AD]">{order.reference}</strong>
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-bold mb-4">Podrobnosti naročila</h2>
            <dl className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <dt className="text-gray-500">Status plačila</dt>
                <dd className="font-semibold">{paymentMethodLabels[order.paymentMethod]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Datum in ura naročila</dt>
                <dd className="font-semibold">{formatOrderDateTime(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Skupni znesek</dt>
                <dd className="font-bold text-[#00B5AD]">€{Number(order.total).toFixed(2)}</dd>
              </div>
            </dl>

            {order.summaryItems.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Kupljeni artikli</h3>
                <div className="space-y-2">
                  {order.summaryItems.map((item) => (
                    <CollapsibleOrderItem
                      key={`${item.id}-${item.bookingDate || ''}-${item.bookingTime || ''}`}
                      id={item.id}
                      name={item.name}
                      quantity={item.quantity}
                      totalPrice={item.totalPrice}
                      type={item.type}
                      bookingDate={item.bookingDate}
                      bookingTime={item.bookingTime}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard#orders"
              className="px-6 py-3 bg-[#00B5AD] text-white rounded-lg hover:bg-[#009891] transition-colors"
            >
              Poglej naročila
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Na domačo stran
            </Link>
            <Link
              href="/trgovina"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
            >
              Nadaljuj z nakupovanjem
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

async function CheckoutSuccessPage({ searchParams }: SuccessProps) {
  const params = await searchParams;
  const order = await getOrderDetails(params?.session_id);
  return <SuccessContent order={order} />;
}

export default function CheckoutSuccessPageWrapper(props: SuccessProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CheckoutSuccessPage {...props} />
    </Suspense>
  );
}
