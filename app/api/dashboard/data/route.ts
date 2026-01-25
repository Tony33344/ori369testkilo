import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use supabaseAdmin to bypass RLS for fetching user's data
    const userId = user.id;

    // Fetch profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Fetch bookings (therapies)
    const { data: bookings } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        services:service_id (name, duration, price)
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });

    // Fetch education registrations for this user
    const { data: registrations, error: regError } = await supabaseAdmin
      .from('education_course_registrations')
      .select(`
        *,
        session:education_course_sessions (
          id,
          headline,
          start_at,
          end_at,
          location,
          price,
          course:education_courses (
            title,
            short_description,
            cover_image_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (regError) {
      console.error('Error fetching registrations:', regError);
    }

    // Fetch orders - exclude education orders
    const { data: allOrders } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          unit_price,
          total_price,
          metadata,
          services (name),
          shop_products:product_id (name)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Filter orders: only shop orders, exclude education orders
    const educationOrderIds = new Set((registrations || []).map((r: any) => r.order_id).filter(Boolean));
    
    const orders = (allOrders || []).filter((order: any) => {
      // Exclude if order_type is 'education' in metadata
      if (order.metadata?.order_type === 'education') return false;
      // Exclude if order is linked to an education registration
      if (educationOrderIds.has(order.id)) return false;
      return true;
    });

    return NextResponse.json({
      profile,
      bookings: bookings || [],
      registrations: registrations || [],
      orders: orders || []
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
