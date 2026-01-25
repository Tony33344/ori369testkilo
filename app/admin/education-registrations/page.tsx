'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { 
  Users, Calendar, Mail, Phone, 
  CheckCircle, Clock, AlertCircle, 
  ArrowLeft, Search, Filter,
  DollarSign, Edit2, Save, X, CreditCard, Building2, Wallet
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  payment_status: string;
  created_at: string;
  notes: string | null;
  order_id: string | null;
  payment_method?: string;
  session: {
    id: string;
    headline: string | null;
    start_at: string;
    course: {
      title: string;
    } | null;
  } | null;
}

export default function AdminEducationRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: '', payment_status: '' });

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/education/admin/registrations', { headers });
      const data = await response.json();
      
      if (data.registrations) {
        const regs = data.registrations as Registration[];
        const orderIds = regs.map(r => r.order_id).filter(Boolean) as string[];
        
        if (orderIds.length > 0) {
          const { data: orders } = await supabase
            .from('orders')
            .select('id, payment_method')
            .in('id', orderIds);
          
          const orderMap = (orders || []).reduce((acc: Record<string, string | null>, o: { id: string; payment_method: string | null }) => {
            acc[o.id] = o.payment_method;
            return acc;
          }, {} as Record<string, string | null>);
          
          const enriched = regs.map(r => ({
            ...r,
            payment_method: r.order_id ? orderMap[r.order_id] : 'unknown'
          }));
          setRegistrations(enriched);
        } else {
          setRegistrations(regs);
        }
      }
    } catch (error) {
      console.error('Error loading registrations:', error);
      toast.error('Napaka pri nalaganju prijav');
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (regId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/education/admin/registrations', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: regId,
          status: editForm.status,
          payment_status: editForm.payment_status
        }),
      });

      if (response.ok) {
        toast.success('Status posodobljen');
        setEditingId(null);
        fetchRegistrations();
      } else {
        throw new Error('Napaka pri posodabljanju');
      }
    } catch (error) {
      toast.error('Napaka pri posodabljanju statusa');
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.session?.course?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'card': return <CreditCard size={14} className="mr-1" />;
      case 'upn': return <Building2 size={14} className="mr-1" />;
      case 'cash_pickup': 
      case 'cash_delivery': return <Wallet size={14} className="mr-1" />;
      default: return null;
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case 'card': return 'Kartica';
      case 'upn': return 'UPN';
      case 'cash_pickup': return 'Gotovina (prevzem)';
      case 'cash_delivery': return 'Gotovina (dostava)';
      default: return method || 'Neznano';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link href="/admin" className="inline-flex items-center text-sm text-gray-500 hover:text-[#00B5AD] mb-2">
              <ArrowLeft size={16} className="mr-1" />
              Nazaj v admin
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Prijave na izobraževanja</h1>
            <p className="text-gray-500">Pregled vseh študentov in njihovih rezervacij.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Išči po imenu, emailu ali tečaju..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B5AD] outline-none min-w-[300px]"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Vseh prijav</span>
              <Users className="text-[#00B5AD]" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{registrations.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Potrjenih</span>
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {registrations.filter(r => r.status === 'confirmed').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Čakajočih na plačilo</span>
              <DollarSign className="text-yellow-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {registrations.filter(r => r.payment_status === 'pending').length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Študent</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Izobraževanje</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Termin</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prijava</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plačilo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Clock className="animate-spin text-[#00B5AD] mb-2" size={24} />
                        <span className="text-gray-500">Nalaganje prijav...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <AlertCircle size={48} className="mb-4" />
                        <p className="text-lg font-medium">Ni najdenih prijav</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{reg.full_name}</span>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Mail size={12} className="mr-1" />
                            {reg.email}
                          </div>
                          {reg.phone && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Phone size={12} className="mr-1" />
                              {reg.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{reg.session?.course?.title || 'Izobraževanje'}</span>
                          <span className="text-xs text-gray-500 mt-1">{reg.session?.headline}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {reg.session?.start_at ? format(new Date(reg.session.start_at), 'dd. MM. yyyy', { locale: sl }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span>{reg.created_at ? format(new Date(reg.created_at), 'dd. MM. yyyy', { locale: sl }) : 'N/A'}</span>
                          <span className="text-xs text-gray-500">{reg.created_at ? format(new Date(reg.created_at), 'HH:mm', { locale: sl }) : ''}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === reg.id ? (
                          <select 
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-[#00B5AD]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(reg.status)}`}>
                            {reg.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === reg.id ? (
                          <select 
                            value={editForm.payment_status}
                            onChange={(e) => setEditForm({ ...editForm, payment_status: e.target.value })}
                            className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-[#00B5AD]"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                          </select>
                        ) : (
                          <div className="flex flex-col space-y-1">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${getPaymentStatusColor(reg.payment_status)}`}>
                              {reg.payment_status}
                            </span>
                            <div className="flex items-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                              {getPaymentMethodIcon(reg.payment_method)}
                              {getPaymentMethodLabel(reg.payment_method)}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === reg.id ? (
                          <div className="flex items-center space-x-2">
                            <button onClick={() => handleUpdateStatus(reg.id)} className="text-green-600 hover:text-green-700">
                              <Save size={18} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-red-600 hover:text-red-700">
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setEditingId(reg.id);
                              setEditForm({ status: reg.status, payment_status: reg.payment_status });
                            }} 
                            className="text-gray-400 hover:text-[#00B5AD]"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
