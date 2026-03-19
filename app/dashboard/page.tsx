'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Package, LogOut, User, ShoppingBag, GraduationCap, MapPin, Settings, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import Link from 'next/link';

const BUSINESS_TIMEZONE = 'Europe/Vienna';

// Types
interface Profile {
  email: string;
  full_name: string;
}

interface Booking {
  id: string;
  date: string;
  time_slot: string;
  status: string;
  services: {
    name: string;
    duration: number;
    price: number;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_method: string;
  shipping_method: string;
  order_items: any[];
  metadata: any;
}

interface EducationRegistration {
  id: string;
  full_name: string;
  status: string;
  payment_status: string;
  notes: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  session: {
    id: string;
    headline: string | null;
    start_at: string;
    end_at: string | null;
    location: string | null;
    price: number | null;
    course: {
      title: string;
      short_description: string | null;
      cover_image_url: string | null;
    } | null;
  } | null;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders' | 'education'>('bookings');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [registrations, setRegistrations] = useState<EducationRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        router.push('/prijava?redirect=/dashboard');
        return;
      }

      try {
        setLoading(true);
        
        // Fetch all dashboard data via API route (uses service role to bypass RLS)
        const response = await fetch('/api/dashboard/data', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/prijava?redirect=/dashboard');
            return;
          }
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        
        setProfile(data.profile);
        setBookings(data.bookings || []);
        setRegistrations(data.registrations || []);
        setOrders(data.orders || []);

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-amber-600 bg-amber-100';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Plačano';
      case 'pending': return 'Čaka na plačilo';
      case 'unpaid': return 'Neplačano';
      case 'refunded': return 'Vrnjeno';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-[#00B5AD] animate-spin mb-4" />
          <span className="text-gray-600">Nalaganje...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Moj profil</h1>
            <button onClick={handleSignOut} className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
              <LogOut className="w-5 h-5 mr-2" />
              <span>Odjava</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-[#00B5AD]/10 rounded-full flex items-center justify-center text-[#00B5AD]">
                  <User size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-gray-900 font-bold truncate">{profile?.full_name || 'Uporabnik'}</h3>
                  <p className="text-sm text-gray-500 truncate">{profile?.email}</p>
                </div>
              </div>
              <Link href="/nastavitve" className="flex items-center text-sm text-[#00B5AD] hover:text-[#009ca6]">
                <Settings size={14} className="mr-1" />
                Uredi profil
              </Link>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'bookings' 
                    ? 'bg-[#00B5AD] text-white shadow-lg shadow-[#00B5AD]/20' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Calendar size={20} />
                <span>Moje rezervacije</span>
              </button>

              <button
                onClick={() => setActiveTab('education')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'education' 
                    ? 'bg-[#00B5AD] text-white shadow-lg shadow-[#00B5AD]/20' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <GraduationCap size={20} />
                <span>Moja izobraževanja</span>
                {registrations.length > 0 && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    activeTab === 'education' ? 'bg-white/20 text-white' : 'bg-[#00B5AD]/10 text-[#00B5AD]'
                  }`}>
                    {registrations.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'orders' 
                    ? 'bg-[#00B5AD] text-white shadow-lg shadow-[#00B5AD]/20' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <ShoppingBag size={20} />
                <span>Moja naročila</span>
                {orders.length > 0 && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#00B5AD]/10 text-[#00B5AD]'
                  }`}>
                    {orders.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Rezervacije terapij</h2>
                {bookings.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-gray-900 font-bold mb-2">Ni aktivnih rezervacij</h3>
                    <p className="text-gray-500 mb-6">Rezervirajte svoj termin za terapijo.</p>
                    <Link href="/terapije" className="inline-block px-6 py-2 bg-[#00B5AD] text-white rounded-lg hover:bg-[#009ca6] transition-colors">
                      Poglej terapije
                    </Link>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{booking.services?.name || 'Terapija'}</h3>
                          <div className="flex items-center space-x-4 text-gray-500 text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-[#00B5AD]" />
                              {format(new Date(booking.date), 'd. MMMM yyyy', { locale: sl })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-[#00B5AD]" />
                              {booking.time_slot}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Moja izobraževanja</h2>
                {registrations.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-gray-900 font-bold mb-2">Ni vpisanih izobraževanj</h3>
                    <p className="text-gray-500 mb-6">Pridružite se nam na naslednjem tečaju.</p>
                    <Link href="/education" className="inline-block px-6 py-2 bg-[#00B5AD] text-white rounded-lg hover:bg-[#009ca6] transition-colors">
                      Poglej tečaje
                    </Link>
                  </div>
                ) : (
                  registrations.map((reg) => (
                    <div key={reg.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            {reg.session?.course?.cover_image_url && (
                              <img 
                                src={reg.session.course.cover_image_url} 
                                alt={reg.session.course.title}
                                className="w-20 h-20 object-cover rounded-lg hidden md:block"
                              />
                            )}
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{reg.session?.course?.title || 'Izobraževanje'}</h3>
                              <p className="text-sm text-gray-500 mb-1">{reg.session?.headline}</p>
                              <p className="text-sm text-gray-400">Vpisana oseba: <span className="text-gray-700">{reg.full_name}</span></p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-[#00B5AD]" />
                              <span>{reg.session?.start_at ? formatInTimeZone(new Date(reg.session.start_at), BUSINESS_TIMEZONE, 'd. MMMM yyyy', { locale: sl }) : 'Termin sledi'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-2 text-[#00B5AD]" />
                              <span>{reg.session?.start_at ? formatInTimeZone(new Date(reg.session.start_at), BUSINESS_TIMEZONE, 'HH:mm') : 'Čas sledi'}</span>
                            </div>
                            {reg.session?.location && (
                              <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-2 text-[#00B5AD]" />
                                <span>{reg.session.location}</span>
                              </div>
                            )}
                            {reg.session?.price && (
                              <div className="flex items-center text-gray-600">
                                <span className="font-semibold">€{Number(reg.session.price).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(reg.status)}`}>
                            {reg.status === 'pending' ? 'V obdelavi' : reg.status === 'confirmed' ? 'Potrjeno' : reg.status}
                          </span>
                          <span className={`text-xs ${reg.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                            {getPaymentStatusLabel(reg.payment_status)}
                          </span>
                          <span className="text-xs text-gray-400">
                            Prijava: {format(new Date(reg.created_at), 'd. MMM yyyy HH:mm', { locale: sl })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Orders Tab - ONLY shop products, NO education courses */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Zgodovina naročil iz trgovine</h2>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-gray-900 font-bold mb-2">Ni naročil v trgovini</h3>
                    <p className="text-gray-500 mb-6">Obiščite našo spletno trgovino.</p>
                    <Link href="/trgovina" className="inline-block px-6 py-2 bg-[#00B5AD] text-white rounded-lg hover:bg-[#009ca6] transition-colors">
                      V trgovino
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                        <div className="min-w-0">
                          <div className="text-sm text-gray-400">Referenca</div>
                          <div className="font-mono text-gray-900 truncate">
                            {order.metadata?.reference || order.metadata?.upn_reference || order.id.slice(0, 8)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Datum</div>
                          <div className="text-gray-900">{format(new Date(order.created_at), 'd. MMM yyyy', { locale: sl })}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {(order.order_items || []).map((item: any, idx: number) => {
                          const name = item.shop_products?.name || item.services?.name || 'Artikel';
                          return (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                {item.quantity}x {name}
                              </span>
                              <span className="text-gray-500">€{Number(item.total_price).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <div className="text-gray-900 font-bold">€{Number(order.total_amount).toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
