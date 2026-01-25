import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { syncBookingToCalendar } from '@/lib/calendarSync';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_session_id', session.id)
          .single();

        if (!order) {
          console.error('Order not found for session:', session.id);
          break;
        }

        const { error: updateError } = await supabase
          .from('orders')
          .update({
            stripe_payment_intent_id: session.payment_intent as string,
            status: 'paid',
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        if (updateError) {
          console.error('Error updating order:', updateError);
          break;
        }

        // If this Stripe session was created for a booking, update booking payment linkage
        const bookingId = (session.metadata as any)?.bookingId;
        if (bookingId) {
          const { error: bookingUpdateError } = await supabase
            .from('bookings')
            .update({
              stripe_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string,
              payment_status: 'paid',
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', bookingId);

          if (bookingUpdateError) {
            console.error('Error updating booking with Stripe payment info:', bookingUpdateError);
          } else {
            try {
              await syncBookingToCalendar({ bookingId });
            } catch (syncError) {
              console.error('Failed to sync booking to Google Calendar after Stripe payment:', syncError);
            }
          }
        }

        const metadata = order.metadata as any;
        const orderReference = metadata?.reference || order.id;
        const orderedItems = Array.isArray(metadata?.items) ? metadata.items : [];

        for (const item of orderedItems) {
          if (item?.type !== 'service') continue;

          const serviceId = item.itemId || item.serviceId;
          const bookingDate = item.bookingDate;
          const bookingTime = item.bookingTime;

          if (!serviceId || !bookingDate || !bookingTime) {
            continue;
          }

          let bookingId = item.bookingId as string | undefined;

          if (!bookingId) {
            const { data: existingBooking } = await supabase
              .from('bookings')
              .select('id')
              .eq('service_id', serviceId)
              .eq('date', bookingDate)
              .eq('time_slot', bookingTime)
              .eq('notes', `Order: ${orderReference}`)
              .maybeSingle();

            if (existingBooking?.id) {
              bookingId = existingBooking.id;
            }
          }

          if (!bookingId) {
            const { data: newBooking, error: bookingInsertError } = await supabase
              .from('bookings')
              .insert({
                user_id: order.user_id || null,
                service_id: serviceId,
                date: bookingDate,
                time_slot: bookingTime,
                status: 'confirmed',
                notes: `Order: ${orderReference}`,
                payment_status: 'paid',
                paid_at: new Date().toISOString(),
                stripe_session_id: session.id,
                stripe_payment_intent_id: session.payment_intent as string,
              })
              .select('id')
              .single();

            if (bookingInsertError) {
              console.error('Error creating booking from Stripe order:', bookingInsertError);
            } else {
              bookingId = newBooking?.id || undefined;
            }
          }

          if (bookingId) {
            try {
              await syncBookingToCalendar({ bookingId });
            } catch (syncError) {
              console.error('Failed to sync Stripe-created booking to Google Calendar:', syncError);
            }
          }
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
          console.error('Error updating order on payment success:', error);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
          console.error('Error updating order on payment failure:', error);
        }

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', charge.payment_intent as string);

        if (error) {
          console.error('Error updating order on refund:', error);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
