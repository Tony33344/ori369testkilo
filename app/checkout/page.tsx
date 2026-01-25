'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CreditCard, Building2, Truck, Store, ArrowLeft, CheckCircle, Loader2, QrCode } from 'lucide-react';
import { useCart } from '@/components/CartProvider';
import { companyData, generateUPNReference, formatIBAN, generateUPNQRData } from '@/lib/companyData';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { OrderSummaryItem, paymentMethodLabels, formatOrderDateTime, formatSlotDateTime } from '@/lib/orderSummary';

type PaymentMethod = 'card' | 'upn' | 'cash_pickup' | 'cash_delivery';
type ShippingMethod = 'pickup' | 'post' | 'delivery';

type DiscountAppliesTo = 'all' | 'products' | 'services';

interface DiscountCode {
  id: string;
  code: string;
  percent_off: number;
  applies_to: DiscountAppliesTo;
  min_subtotal: number | null;
  active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  max_uses: number | null;
  uses_count: number | null;
}

interface ServiceDetails {
  id: string;
  name: string;
  price: number;
  duration?: number;
  image_url?: string;
}

interface EducationSession {
  id: string;
  headline: string | null;
  start_at: string;
  end_at: string | null;
  price: number | null;
  course: {
    id: string;
    title: string;
  } | null;
}


const syncBookingToCalendar = async (bookingId?: string | null) => {
  if (!bookingId) return;
  try {
    const response = await fetch('/api/google-calendar/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });
    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null);
      console.error('Google Calendar sync failed for booking', bookingId, response.status, errorPayload);
    }
  } catch (error) {
    console.error('Failed to sync booking to Google Calendar:', error);
  }
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-12" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, clearCart, total: cartTotal } = useCart();

  const [authedUser, setAuthedUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  // URL params for direct service/education checkout
  const serviceId = searchParams.get('service');
  const bookingDate = searchParams.get('date');
  const bookingTime = searchParams.get('time');
  const bookingId = searchParams.get('bookingId');
  const educationCourseId = searchParams.get('courseId');
  const educationSessionId = searchParams.get('sessionId');
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('pickup');
  const [loading, setLoading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null);
  const [educationSession, setEducationSession] = useState<EducationSession | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [upnQrDataUrl, setUpnQrDataUrl] = useState<string>('');
  const [createdOrderTotal, setCreatedOrderTotal] = useState<number>(0);
  const [orderSummaryItems, setOrderSummaryItems] = useState<OrderSummaryItem[]>([]);
  const [orderCreatedAt, setOrderCreatedAt] = useState<string>('');
  
  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerDateOfBirth, setCustomerDateOfBirth] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerPostal, setCustomerPostal] = useState('');
  const [notes, setNotes] = useState('');
  const [saveDetailsToProfile, setSaveDetailsToProfile] = useState(true);
  const [gdprConsent, setGdprConsent] = useState(false);

  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);

  // Determine if this is a service checkout or cart checkout
  const isServiceCheckout = !!serviceId;
  const isEducationCheckout = !!educationCourseId || !!educationSessionId;
  const educationMode = isEducationCheckout && !isServiceCheckout;

  const cartItems = educationMode ? [] : cart.items;
  const hasProducts = educationMode ? false : cartItems.some(item => item.type === 'product');
  const hasServices = educationMode ? true : cartItems.some(item => item.type === 'service') || isServiceCheckout;

  // Load service details if service checkout
  useEffect(() => {
    if (serviceId) {
      loadServiceDetails(serviceId);
    }
  }, [serviceId]);

  // Load education session/course details if education checkout
  useEffect(() => {
    if (educationSessionId) {
      loadEducationDetails(educationSessionId);
    }
  }, [educationSessionId]);

  // Load user info if logged in
  useEffect(() => {
    loadUserInfo();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ori369_save_details_to_profile');
      if (saved === '0') setSaveDetailsToProfile(false);
      if (saved === '1') setSaveDetailsToProfile(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ori369_save_details_to_profile', saveDetailsToProfile ? '1' : '0');
    } catch {
      // ignore
    }
  }, [saveDetailsToProfile]);

  async function loadServiceDetails(id: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data && !error) {
      setServiceDetails(data);
    }
  }

  async function loadEducationDetails(id: string) {
    const { data, error } = await supabase
      .from('education_course_sessions')
      .select('id, headline, start_at, end_at, price, course:education_courses(id, title)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Failed to load education session', error);
      return;
    }
    setEducationSession(data as unknown as EducationSession);
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        setAuthedUser(data.user);
        toast.success('Prijava uspešna.');
        await loadUserInfo();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: {
          data: {
            full_name: authFullName || null,
          },
        },
      });
      if (error) throw error;
      setAuthedUser(data.user);
      toast.success('Registracija uspešna. Preverite e-pošto in potrdite naslov.');
      await loadUserInfo();
    } catch (err: any) {
      console.error('Auth error:', err);
      toast.error(err?.message || 'Napaka pri prijavi/registraciji.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function loadUserInfo() {
    const { data: { user } } = await supabase.auth.getUser();
    setAuthedUser(user || null);
    if (user) {
      setCustomerEmail(user.email || '');
      setAuthEmail(user.email || '');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setCustomerName(profile.full_name || '');
        setCustomerPhone(profile.phone || '');
        setCustomerAddress((profile as any).address || '');
        setCustomerCity((profile as any).city || '');
        setCustomerPostal((profile as any).postal || '');
      }
    }
  }

  async function persistProfileFromCheckout() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload: any = {
      full_name: customerName || null,
      phone: customerPhone || null,
      date_of_birth: customerDateOfBirth || null,
      address: customerAddress || null,
      city: customerCity || null,
      postal: customerPostal || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
    if (error) {
      console.error('Failed to persist profile from checkout:', error);
      toast.error('Podatkov ni bilo mogoče shraniti v profil. Preverite prijavo in pravila dostopa.');
    }
  }

  // Calculate totals
  const serviceDirectTotal = serviceDetails?.price || 0;
  const educationTotal = isEducationCheckout ? Number(educationSession?.price || 0) : 0;
  const servicesCartTotal = cartItems
    .filter(item => item.type === 'service')
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const productsTotal = cartItems
    .filter(item => item.type === 'product')
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const shippingCost = hasProducts ? (
    shippingMethod === 'post' ? companyData.shipping.post :
    shippingMethod === 'delivery' ? companyData.shipping.payOnDelivery :
    0
  ) : 0;
  
  const servicesTotal = (isServiceCheckout ? serviceDirectTotal : 0) + servicesCartTotal + educationTotal;
  const subtotal = servicesTotal + productsTotal;

  const eligibleSubtotal = (() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.applies_to === 'products') return productsTotal;
    if (appliedDiscount.applies_to === 'services') return servicesTotal;
    return subtotal;
  })();

  const discountAmount = (() => {
    if (!appliedDiscount) return 0;
    const pct = Number(appliedDiscount.percent_off) || 0;
    if (pct <= 0) return 0;
    const raw = (eligibleSubtotal * pct) / 100;
    return Math.round(raw * 100) / 100;
  })();

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const total = discountedSubtotal + shippingCost;

  async function applyDiscountCode() {
    const code = discountCodeInput.trim();
    if (!code) {
      setAppliedDiscount(null);
      return;
    }

    setDiscountLoading(true);
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .ilike('code', code)
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setAppliedDiscount(null);
        toast.error('Neveljavna koda za popust.');
        return;
      }

      const dc = data as any as DiscountCode;
      const min = dc.min_subtotal != null ? Number(dc.min_subtotal) : 0;
      if (min > 0 && subtotal < min) {
        setAppliedDiscount(null);
        toast.error(`Popust velja za naročila nad €${min.toFixed(2)}.`);
        return;
      }

      setAppliedDiscount(dc);
      toast.success('Koda za popust je uporabljena.');
    } catch (e: any) {
      console.error('Failed to apply discount code:', e);
      setAppliedDiscount(null);
      toast.error(e?.message || 'Napaka pri preverjanju kode za popust.');
    } finally {
      setDiscountLoading(false);
    }
  }

  // Validate shipping method based on payment
  useEffect(() => {
    if (paymentMethod === 'cash_pickup') {
      setShippingMethod('pickup');
    } else if (paymentMethod === 'cash_delivery') {
      setShippingMethod('delivery');
    }
  }, [paymentMethod]);

  useEffect(() => {
    async function buildUpnQr() {
      if (!orderCreated || paymentMethod !== 'upn' || !orderReference) {
        setUpnQrDataUrl('');
        return;
      }

      const addrParts = companyData.businessAddress.split(',').map((p) => p.trim());
      const recipientAddress = addrParts[0] || companyData.businessAddress;
      const recipientCity = addrParts.slice(1).join(', ') || '';

      const upnPayload = generateUPNQRData({
        iban: companyData.bank.iban,
        amount: createdOrderTotal,
        reference: generateUPNReference(orderReference),
        purpose: `Naročilo ${orderReference}`,
        recipientName: companyData.legalName,
        recipientAddress,
        recipientCity,
      });

      try {
        const dataUrl = await QRCode.toDataURL(upnPayload, {
          margin: 1,
          width: 220,
          errorCorrectionLevel: 'M',
        });
        setUpnQrDataUrl(dataUrl);
      } catch (e) {
        console.error('Failed to generate UPN QR code:', e);
        setUpnQrDataUrl('');
      }
    }

    buildUpnQr();
  }, [orderCreated, paymentMethod, orderReference, createdOrderTotal]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Za naročilo se morate prijaviti ali registrirati.');
      return;
    }

    if (!user.email_confirmed_at) {
      toast.error('Prosimo, potrdite e-poštni naslov (email) pred oddajo naročila.');
      return;
    }
    
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Prosimo, izpolnite vse obvezne podatke');
      return;
    }

    if (!gdprConsent) {
      toast.error('Za nadaljevanje morate sprejeti pogoje obdelave osebnih podatkov (GDPR)');
      return;
    }

    if (hasProducts && shippingMethod !== 'pickup' && (!customerAddress || !customerCity || !customerPostal)) {
      toast.error('Prosimo, vnesite naslov za dostavo');
      return;
    }

    setLoading(true);

    try {
      // Persist customer profile details for logged-in users so next checkout is pre-filled
      if (saveDetailsToProfile) {
        await persistProfileFromCheckout();
      }
      if (paymentMethod === 'card') {
        // Stripe checkout
        await handleStripeCheckout();
      } else {
        // UPN or Cash - create order directly
        await handleDirectOrder();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Prišlo je do napake. Prosimo, poskusite znova.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStripeCheckout() {
    const items = [];
    
    if (isServiceCheckout && serviceDetails) {
      items.push({
        serviceId: serviceDetails.id,
        quantity: 1,
        bookingDate,
        bookingTime,
      });
    }

    if (isEducationCheckout && educationSession) {
      items.push({
        educationCourseId,
        educationSessionId,
        quantity: 1,
      });
    }
    
    cartItems.forEach(item => {
      items.push({
        serviceId: item.type === 'service' ? item.id : undefined,
        productId: item.type === 'product' ? item.id : undefined,
        quantity: item.quantity,
        type: item.type,
        bookingDate: item.bookingDate,
        bookingTime: item.bookingTime,
      });
    });

    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        bookingId,
        customerEmail,
        customerName,
        shippingMethod,
        shippingCost,
        discountCode: appliedDiscount?.code || null,
        metadata: {
          phone: customerPhone,
          address: customerAddress,
          city: customerCity,
          postal: customerPostal,
          notes,
        },
      }),
    });

    const data = await response.json();
    
    if (data.url) {
      clearCart();
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Failed to create checkout session');
    }
  }

  async function handleDirectOrder() {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate order reference
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const reference = `ORI-${timestamp}-${random}`;
    
    // Determine order type for proper filtering in dashboard
    const orderType = isEducationCheckout ? 'education' : (hasProducts ? 'shop' : 'service');
    
    // Create order in database
    const orderData = {
      user_id: user?.id || null,
      subtotal_amount: subtotal,
      discount_code: appliedDiscount?.code || null,
      discount_percent: appliedDiscount?.percent_off || null,
      discount_amount: appliedDiscount ? discountAmount : null,
      total_amount: total,
      currency: 'eur',
      status: paymentMethod === 'upn' ? 'pending_payment' : 'pending',
      payment_method: paymentMethod,
      shipping_method: shippingMethod,
      shipping_cost: shippingCost,
      metadata: {
        reference,
        order_type: orderType,
        discount: appliedDiscount
          ? {
              code: appliedDiscount.code,
              percent_off: appliedDiscount.percent_off,
              applies_to: appliedDiscount.applies_to,
              discount_amount: discountAmount,
            }
          : null,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress,
          city: customerCity,
          postal: customerPostal,
        },
        notes,
        upn_reference: paymentMethod === 'upn' ? generateUPNReference(reference) : null,
      },
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = [];
    const summaryItems: OrderSummaryItem[] = [];

    if (isServiceCheckout && serviceDetails) {
      orderItems.push({
        order_id: order.id,
        service_id: serviceDetails.id,
        quantity: 1,
        unit_price: serviceDetails.price,
        total_price: serviceDetails.price,
        metadata: { bookingDate, bookingTime },
      });

      summaryItems.push({
        id: serviceDetails.id,
        name: serviceDetails.name,
        quantity: 1,
        totalPrice: serviceDetails.price,
        type: 'service',
        bookingDate,
        bookingTime,
      });

      if (bookingId) {
        const { error: bookingUpdateError } = await supabase
          .from('bookings')
          .update({
            status: 'pending',
            notes: `Order: ${reference}`,
            service_id: serviceDetails.id,
          })
          .eq('id', bookingId);
        if (bookingUpdateError) throw bookingUpdateError;
        await syncBookingToCalendar(bookingId);
      } else if (bookingDate && bookingTime) {
        const { data: createdBooking, error: bookingError } = await supabase.from('bookings').insert({
          user_id: user?.id || null,
          service_id: serviceDetails.id,
          date: bookingDate,
          time_slot: bookingTime,
          status: 'pending',
          notes: `Order: ${reference}`,
        }).select().single();
        if (bookingError) throw bookingError;
        await syncBookingToCalendar(createdBooking?.id);
      }
    }

    if (isEducationCheckout && educationSession) {
      const price = Number(educationSession.price || 0);

      summaryItems.push({
        id: educationSession.id,
        name: educationSession.course?.title || 'Izobraževanje',
        quantity: 1,
        totalPrice: price,
        type: 'service',
        bookingDate: educationSession.start_at?.slice(0, 10) || null,
        bookingTime: educationSession.start_at ? educationSession.start_at.slice(11, 16) : null,
      });

      const registrationPayload: any = {
        session_id: educationSessionId,
        user_id: user?.id || null,
        full_name: customerName,
        email: customerEmail,
        phone: customerPhone,
        status: paymentMethod === 'upn' ? 'pending' : 'pending',
        payment_status: paymentMethod === 'upn' ? 'pending' : 'unpaid',
        order_id: order.id,
      };

      const { error: regError } = await supabase
        .from('education_course_registrations')
        .insert(registrationPayload);

      if (regError) throw regError;

      // Do NOT add education items to order_items - they violate the constraint
      // Education registrations are stored separately in education_course_registrations
      // and are fetched directly in the dashboard
    }

    for (const item of cartItems) {
      orderItems.push({
        order_id: order.id,
        service_id: item.type === 'service' ? item.id : null,
        product_id: item.type === 'product' ? item.id : null,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        metadata: item.bookingDate ? { bookingDate: item.bookingDate, bookingTime: item.bookingTime } : null,
      });

      // Create booking for services in cart
      if (item.type === 'service' && item.bookingDate) {
        const { data: cartBooking, error: bookingError } = await supabase.from('bookings').insert({
          user_id: user?.id || null,
          service_id: item.id,
          date: item.bookingDate,
          time_slot: item.bookingTime,
          status: 'pending',
          notes: `Order: ${reference}`,
        }).select().single();
        if (bookingError) throw bookingError;
        await syncBookingToCalendar(cartBooking?.id);
      }

      summaryItems.push({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
        type: item.type,
        bookingDate: item.bookingDate,
        bookingTime: item.bookingTime,
      });
    }

    if (orderItems.length > 0) {
      const { error: orderItemsError } = await supabase.from('order_items').insert(orderItems);
      if (orderItemsError) throw orderItemsError;
    }

    // Deduplicate summary items by id and bookingDate/time
    const uniqueSummary = summaryItems.reduce<OrderSummaryItem[]>((acc, item) => {
      const exists = acc.some(
        i => i.id === item.id && i.bookingDate === item.bookingDate && i.bookingTime === item.bookingTime && i.type === item.type
      );
      if (!exists) acc.push(item);
      return acc;
    }, []);

    // Persist final totals before clearing cart (needed for success screen + UPN QR)
    const finalTotal = total;
    setCreatedOrderTotal(finalTotal);
    setOrderSummaryItems(uniqueSummary);
    setOrderCreatedAt(order.created_at || new Date().toISOString());

    // Clear cart and show success (only if not in education-only mode)
    if (!educationMode) {
      clearCart();
    }
    setOrderReference(reference);
    setOrderCreated(true);
    
    toast.success('Naročilo uspešno ustvarjeno!');
  }

  // Order success view
  if (orderCreated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hvala za naročilo!</h1>
            <p className="text-gray-600 mb-6">
              Vaša referenca naročila: <strong className="text-[#00B5AD]">{orderReference}</strong>
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-xl font-bold mb-4">Podrobnosti naročila</h2>
              <dl className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Status plačila</dt>
                  <dd className="font-semibold">{paymentMethodLabels[paymentMethod]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Datum in ura naročila</dt>
                  <dd className="font-semibold">{formatOrderDateTime(orderCreatedAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Skupni znesek</dt>
                  <dd className="font-bold text-[#00B5AD]">€{createdOrderTotal.toFixed(2)}</dd>
                </div>
              </dl>

              {orderSummaryItems.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Kupljeni artikli</h3>
                  <ul className="space-y-3">
                    {orderSummaryItems.map((item) => (
                      <li key={`${item.id}-${item.bookingDate || ''}-${item.bookingTime || ''}`} className="bg-white rounded-lg p-4 border border-gray-100">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Količina: {item.quantity}</p>
                            {item.type === 'service' && item.bookingDate && item.bookingTime && (
                              <p className="text-sm text-[#00B5AD] mt-1">
                                Termin: {formatSlotDateTime(item.bookingDate, item.bookingTime)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold">€{item.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Education item (from URL) */}
              {isEducationCheckout && educationSession && (
                <div className="flex gap-3 py-3 border-b">
                  <div className="flex-1">
                    <p className="font-semibold">{educationSession.course?.title || 'Izobraževanje'}</p>
                    <p className="text-sm text-gray-500">{educationSession.headline || 'Termin izobraževanja'}</p>
                    {educationSession.start_at && (
                      <p className="text-sm text-[#00B5AD]">{formatOrderDateTime(educationSession.start_at)}</p>
                    )}
                  </div>
                  <p className="font-bold">€{Number(educationSession.price || 0).toFixed(2)}</p>
                </div>
              )}
            </div>

            {paymentMethod === 'upn' && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <QrCode className="text-[#00B5AD]" />
                  Podatki za UPN plačilo
                </h2>

                {upnQrDataUrl && (
                  <div className="mb-5 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                      <img
                        src={upnQrDataUrl}
                        alt="UPN QR"
                        className="w-[220px] h-[220px]"
                      />
                      <div className="mt-3 text-center text-xs text-gray-500">
                        Skenirajte QR kodo v mobilni banki
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500">Prejemnik:</span>
                    <p className="font-semibold">{companyData.legalName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">IBAN:</span>
                    <p className="font-mono font-semibold text-lg">{formatIBAN(companyData.bank.iban)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Znesek:</span>
                    <p className="font-bold text-[#00B5AD] text-lg">€{createdOrderTotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Referenca:</span>
                    <p className="font-mono font-semibold">{generateUPNReference(orderReference)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Namen:</span>
                    <p className="font-semibold">Naročilo {orderReference}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Po prejemu plačila vas bomo obvestili po e-pošti.
                </p>
              </div>
            )}

            {(paymentMethod === 'cash_pickup' || paymentMethod === 'cash_delivery') && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="text-xl font-bold mb-4">
                  {paymentMethod === 'cash_pickup' ? 'Prevzem v trgovini' : 'Plačilo ob dostavi'}
                </h2>
                <p className="text-gray-600">
                  {paymentMethod === 'cash_pickup' 
                    ? `Vaše naročilo bo pripravljeno za prevzem na naslovu: ${companyData.businessAddress}`
                    : `Naročilo bo dostavljeno na vaš naslov. Plačilo: €${createdOrderTotal.toFixed(2)}`
                  }
                </p>
              </div>
            )}

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

  // Empty cart check
  if (!isServiceCheckout && !isEducationCheckout && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Vaša košarica je prazna</h1>
          <p className="text-gray-600 mb-8">Dodajte izdelke ali storitve v košarico za nadaljevanje.</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/trgovina"
              className="px-6 py-3 bg-[#00B5AD] text-white rounded-lg hover:bg-[#009891] transition-colors"
            >
              Trgovina
            </Link>
            <Link
              href="/terapije"
              className="px-6 py-3 bg-[#B8D52E] text-black rounded-lg hover:bg-[#a5c029] transition-colors"
            >
              Terapije
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={isServiceCheckout ? '/terapije' : isEducationCheckout ? '/education' : '/trgovina'} className="inline-flex items-center text-gray-600 hover:text-[#00B5AD] mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Nazaj
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{educationMode ? 'Potrditev vpisa na tečaj' : 'Blagajna'}</h1>
        </div>

        {!authedUser && (
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-2">Prijava / Registracija</h2>
            <p className="text-sm text-gray-600 mb-4">Za naročilo potrebujemo prijavljen račun in potrjen e-poštni naslov.</p>

            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${authMode === 'login' ? 'bg-[#00B5AD] text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Prijava
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${authMode === 'register' ? 'bg-[#00B5AD] text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Registracija
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {authMode === 'register' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ime in priimek</label>
                  <input
                    type="text"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-pošta</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geslo</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-6 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black disabled:opacity-50"
                >
                  {authLoading ? 'Počakajte...' : authMode === 'login' ? 'Prijava' : 'Registracija'}
                </button>
              </div>
            </form>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Info & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Kontaktni podatki</h2>
              <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveDetailsToProfile}
                    onChange={(e) => setSaveDetailsToProfile(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Shrani podatke v moj profil</div>
                    <div className="text-xs text-gray-600">Če je omogočeno, bomo vaše kontaktne podatke in naslov shranili za naslednji nakup.</div>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ime in priimek *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-pošta *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum rojstva <span className="text-gray-400">(opcijsko)</span>
                  </label>
                  <input
                    type="date"
                    value={customerDateOfBirth}
                    onChange={(e) => setCustomerDateOfBirth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                  />
                </div>
              </div>

              {/* GDPR Consent */}
              <div className="mt-6 p-4 rounded-lg border border-gray-200 bg-gray-50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-1 h-5 w-5 text-[#00B5AD] border-gray-300 rounded focus:ring-[#00B5AD]"
                    required
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      Strinjam se z obdelavo osebnih podatkov *
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      S potrditvijo soglašate, da ORI 369 d.o.o. zbira in obdeluje vaše osebne podatke 
                      (ime, e-pošta, telefon) za namene izvedbe naročila in komunikacije. 
                      Vaši podatki so varovani v skladu z GDPR. 
                      <a href="/zasebnost" target="_blank" className="text-[#00B5AD] hover:underline ml-1">
                        Več o politiki zasebnosti
                      </a>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Shipping Address (only for products) */}
            {hasProducts && shippingMethod !== 'pickup' && !educationMode && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Naslov za dostavo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ulica in hišna številka *
                    </label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poštna številka *
                    </label>
                    <input
                      type="text"
                      value={customerPostal}
                      onChange={(e) => setCustomerPostal(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mesto *
                    </label>
                    <input
                      type="text"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Method (only for products) */}
            {hasProducts && !educationMode && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Način dostave</h2>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === 'pickup' ? 'border-[#00B5AD] bg-[#00B5AD]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="pickup"
                      checked={shippingMethod === 'pickup'}
                      onChange={() => setShippingMethod('pickup')}
                      className="sr-only"
                    />
                    <Store className={`mr-3 ${shippingMethod === 'pickup' ? 'text-[#00B5AD]' : 'text-gray-400'}`} size={24} />
                    <div className="flex-1">
                      <p className="font-semibold">Prevzem v trgovini</p>
                      <p className="text-sm text-gray-500">{companyData.businessAddress}</p>
                    </div>
                    <span className="font-bold text-green-600">Brezplačno</span>
                  </label>

                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === 'post' ? 'border-[#00B5AD] bg-[#00B5AD]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="post"
                      checked={shippingMethod === 'post'}
                      onChange={() => setShippingMethod('post')}
                      className="sr-only"
                    />
                    <Truck className={`mr-3 ${shippingMethod === 'post' ? 'text-[#00B5AD]' : 'text-gray-400'}`} size={24} />
                    <div className="flex-1">
                      <p className="font-semibold">Pošta Slovenije</p>
                      <p className="text-sm text-gray-500">Dostava v 2-3 delovnih dneh</p>
                    </div>
                    <span className="font-bold">€{companyData.shipping.post.toFixed(2)}</span>
                  </label>

                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === 'delivery' ? 'border-[#00B5AD] bg-[#00B5AD]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="delivery"
                      checked={shippingMethod === 'delivery'}
                      onChange={() => setShippingMethod('delivery')}
                      className="sr-only"
                    />
                    <Truck className={`mr-3 ${shippingMethod === 'delivery' ? 'text-[#00B5AD]' : 'text-gray-400'}`} size={24} />
                    <div className="flex-1">
                      <p className="font-semibold">Plačilo ob prevzemu (povzetje)</p>
                      <p className="text-sm text-gray-500">Plačate kurirju ob dostavi</p>
                    </div>
                    <span className="font-bold">€{companyData.shipping.payOnDelivery.toFixed(2)}</span>
                  </label>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Način plačila</h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#00B5AD] bg-[#00B5AD]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="sr-only"
                  />
                  <CreditCard className={`mr-3 ${paymentMethod === 'card' ? 'text-[#00B5AD]' : 'text-gray-400'}`} size={24} />
                  <div className="flex-1">
                    <p className="font-semibold">Kreditna kartica</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                  </div>
                  <div className="flex gap-1 text-xs font-semibold text-gray-400">
                    <span className="px-2 py-1 bg-gray-100 rounded">VISA</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">MC</span>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'upn' ? 'border-[#00B5AD] bg-[#00B5AD]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upn"
                    checked={paymentMethod === 'upn'}
                    onChange={() => setPaymentMethod('upn')}
                    className="sr-only"
                  />
                  <Building2 className={`mr-3 ${paymentMethod === 'upn' ? 'text-[#00B5AD]' : 'text-gray-400'}`} size={24} />
                  <div className="flex-1">
                    <p className="font-semibold">UPN nakazilo</p>
                    <p className="text-sm text-gray-500">Bančno nakazilo na TRR</p>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cash_pickup' ? 'border-[#00B5AD] bg-[#00B5AD]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash_pickup"
                    checked={paymentMethod === 'cash_pickup'}
                    onChange={() => setPaymentMethod('cash_pickup')}
                    className="sr-only"
                  />
                  <Store className={`mr-3 ${paymentMethod === 'cash_pickup' ? 'text-[#00B5AD]' : 'text-gray-400'}`} size={24} />
                  <div className="flex-1">
                    <p className="font-semibold">Gotovina ob prevzemu</p>
                    <p className="text-sm text-gray-500">Plačilo v naši trgovini</p>
                  </div>
                </label>

                {hasProducts && (
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cash_delivery' ? 'border-[#00B5AD] bg-[#00B5AD]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cash_delivery"
                      checked={paymentMethod === 'cash_delivery'}
                      onChange={() => setPaymentMethod('cash_delivery')}
                      className="sr-only"
                    />
                    <Truck className={`mr-3 ${paymentMethod === 'cash_delivery' ? 'text-[#00B5AD]' : 'text-gray-400'}`} size={24} />
                    <div className="flex-1">
                      <p className="font-semibold">Plačilo ob dostavi</p>
                      <p className="text-sm text-gray-500">Plačate kurirju ob prevzemu paketa</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Opombe</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Posebne želje ali navodila..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Povzetek naročila</h2>
              
              {/* Service item (from URL) */}
              {isServiceCheckout && serviceDetails && (
                <div className="flex gap-3 py-3 border-b">
                  <div className="flex-1">
                    <p className="font-semibold">{serviceDetails.name}</p>
                    {bookingDate && bookingTime && (
                      <p className="text-sm text-gray-500">{bookingDate} ob {bookingTime}</p>
                    )}
                  </div>
                  <p className="font-bold">€{serviceDetails.price.toFixed(2)}</p>
                </div>
              )}

              {/* Cart items */}
              {!educationMode && cartItems.map((item) => (
                <div key={`${item.id}-${item.bookingDate || ''}`} className="flex gap-3 py-3 border-b">
                  {item.image && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{item.name}</p>
                    {item.bookingDate && (
                      <p className="text-sm text-gray-500">{item.bookingDate} ob {item.bookingTime}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
                    {item.type === 'product' && item.quantity > 1 && (
                      <p className="text-sm text-gray-500">Količina: {item.quantity}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Discount code */}
              {!educationMode && (
                <div className="py-4 border-b">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Koda za popust</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCodeInput}
                      onChange={(e) => setDiscountCodeInput(e.target.value)}
                      placeholder="Vnesite kodo"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={applyDiscountCode}
                      disabled={discountLoading}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black disabled:opacity-50"
                    >
                      {discountLoading ? '...' : 'Uporabi'}
                    </button>
                  </div>
                </div>
              )}
              {appliedDiscount && discountAmount > 0 && (
                <div className="mt-2 text-xs text-green-700">
                  Uporabljena koda: <span className="font-semibold">{appliedDiscount.code}</span>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2 py-4">
                <div className="flex justify-between text-gray-600">
                  <span>Vmesni seštevek</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && discountAmount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Popust ({appliedDiscount.percent_off}%)</span>
                    <span>-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {hasProducts && (
                  <div className="flex justify-between text-gray-600">
                    <span>Dostava</span>
                    <span>{shippingCost === 0 ? 'Brezplačno' : `€${shippingCost.toFixed(2)}`}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Skupaj</span>
                  <span className="text-[#00B5AD]">€{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#00B5AD] text-white font-bold rounded-lg hover:bg-[#009891] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Obdelava...
                  </>
                ) : paymentMethod === 'card' ? (
                  <>
                    <CreditCard size={20} />
                    Plačaj s kartico
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Potrdi naročilo
                  </>
                )}
              </button>

              {/* Security note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Vaši podatki so varno zaščiteni
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
