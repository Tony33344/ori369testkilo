'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { 
  Edit2, Trash2, Save, X, Plus, Calendar, Users, 
  MapPin, Clock, Tag, Globe, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, Loader2, MoreVertical, DollarSign,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

interface Session {
  id: string;
  course_id: string;
  status: 'current' | 'upcoming' | 'past';
  headline: string | null;
  start_at: string;
  end_at: string | null;
  location: string | null;
  language: string;
  format: string;
  price: number;
  max_participants: number;
  registrationsCount: number;
  waitlistCount: number;
}

interface Registration {
  id: string;
  status: string;
  notes: string | null;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
}

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  short_description: string | null;
  long_description: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  organizer: string | null;
  location: string | null;
  cover_image_url: string | null;
  highlight_color: string;
  published: boolean;
  price?: number | null;
  max_attendees?: number | null;
  status?: string | null;
  language?: string | null;
  start_time?: string | null;
  sessions: Session[];
}

export default function EducationManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Course State
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Session State
  const [editingSession, setEditingSession] = useState<Partial<Session> | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Registration State
  const [selectedSessionForRegistrations, setSelectedSessionForRegistrations] = useState<Session | null>(null);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      } else {
        console.warn('No session token available for admin API call');
      }
      
      const response = await fetch('/api/education/admin/courses', { headers });
      if (response.status === 401) {
        toast.error('Nimate pooblastil za dostop. Prosimo, prijavite se kot administrator.');
        return;
      }
      if (response.status === 403) {
        toast.error('Nimate administratorskih pravic.');
        return;
      }
      const data = await response.json();
      
      if (data.error) {
        console.error('API error:', data.error);
        toast.error(data.error);
        return;
      }
      
      // Ensure we handle both potential response formats
      const coursesData = data.courses || [];
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Napaka pri nalaganju tečajev');
    } finally {
      setLoading(false);
    }
  };

  // --- Course Handlers ---

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      const method = editingCourse.id ? 'PUT' : 'POST';
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const payload = {
        ...(editingCourse.id && { id: editingCourse.id }),
        title: editingCourse.title,
        slug: editingCourse.slug,
        subtitle: editingCourse.subtitle,
        short_description: editingCourse.short_description,
        long_description: editingCourse.long_description,
        level: editingCourse.level,
        organizer: editingCourse.organizer,
        location: editingCourse.location,
        cover_image_url: editingCourse.cover_image_url,
        highlight_color: editingCourse.highlight_color,
        published: editingCourse.published,
        price: editingCourse.price,
        max_attendees: editingCourse.max_attendees,
        status: editingCourse.status,
        language: editingCourse.language,
        start_time: editingCourse.start_time,
        sessions: editingCourse.sessions || [],
      };

      const response = await fetch('/api/education/admin/courses', {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingCourse.id ? 'Tečaj posodobljen' : 'Tečaj ustvarjen');
        setShowCourseModal(false);
        setEditingCourse(null);
        loadCourses();
      } else {
        const err = await response.json();
        throw new Error(err.error || 'Napaka pri shranjevanju');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Ali ste prepričani, da želite izbrisati ta tečaj? Vse povezane seje in prijave bodo izbrisane.')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`/api/education/admin/courses?id=${id}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        toast.success('Tečaj izbrisan');
        loadCourses();
      } else {
        throw new Error('Napaka pri brisanju');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // --- Session Handlers ---

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession?.start_at || !selectedCourseId) {
      toast.error('Začetni datum je obvezen');
      return;
    }

    try {
      const method = editingSession.id ? 'PUT' : 'POST';
      const payload = {
        ...editingSession,
        course_id: selectedCourseId
      };

      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/education/admin/sessions', {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingSession.id ? 'Seja posodobljena' : 'Seja ustvarjena');
        setShowSessionModal(false);
        setEditingSession(null);
        loadCourses(); // Reload to see new session
      } else {
        const err = await response.json();
        throw new Error(err.error || 'Napaka pri shranjevanju seje');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Ali ste prepričani, da želite izbrisati to sejo? Prijave bodo izgubljene.')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`/api/education/admin/sessions?id=${sessionId}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        toast.success('Seja izbrisana');
        loadCourses();
      } else {
        throw new Error('Napaka pri brisanju seje');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openNewSessionModal = (courseId: string) => {
    setSelectedCourseId(courseId);
    setEditingSession({
      status: 'upcoming',
      language: 'sl',
      format: 'in_person',
      max_participants: 10,
      price: 0,
      start_at: new Date().toISOString().slice(0, 16) // Default to now
    });
    setShowSessionModal(true);
  };

  const openEditSessionModal = (session: Session, courseId: string) => {
    setSelectedCourseId(courseId);
    setEditingSession({
      ...session,
      start_at: session.start_at ? new Date(session.start_at).toISOString().slice(0, 16) : '',
      end_at: session.end_at ? new Date(session.end_at).toISOString().slice(0, 16) : ''
    });
    setShowSessionModal(true);
  };

  // --- Registration Handlers ---

  const openRegistrationsModal = async (session: Session) => {
    setSelectedSessionForRegistrations(session);
    setShowRegistrationsModal(true);
    setLoadingRegistrations(true);
    setRegistrations([]);

    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (authSession?.access_token) {
        headers['Authorization'] = `Bearer ${authSession.access_token}`;
      }

      const response = await fetch(`/api/education/admin/registrations?session_id=${session.id}`, { headers });
      const data = await response.json();
      if (data.registrations) {
        setRegistrations(data.registrations);
      }
    } catch (error) {
      console.error('Error loading registrations:', error);
      toast.error('Napaka pri nalaganju prijav');
    } finally {
      setLoadingRegistrations(false);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#00B5AD]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ORI Education</h2>
          <p className="text-sm text-gray-500">Upravljanje tečajev, sej in udeležencev</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/education-registrations"
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Vse prijave</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={() => {
              setEditingCourse({
                title: '',
                slug: '',
                level: 'beginner',
                highlight_color: '#00B5AD',
                published: true,
                price: 0,
                max_attendees: 0,
                status: 'active',
                language: 'sl',
                start_time: '',
              });
              setShowCourseModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-[#00B5AD] text-white rounded-lg hover:bg-[#009891] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj tečaj</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: course.highlight_color }}
                  >
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.subtitle || 'Brez podnaslova'}</p>
                    <div className="flex flex-wrap items-center mt-2 gap-3 text-xs text-gray-400">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">{course.level}</span>
                      <span>{course.sessions.length} sej</span>
                      {course.organizer && (
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {course.organizer}
                        </span>
                      )}
                      {course.location && (
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {course.location}
                        </span>
                      )}
                      <span className={`flex items-center ${course.published ? 'text-green-600' : 'text-amber-600'}`}>
                        {course.published ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                        {course.published ? 'Objavljeno' : 'Osnutek'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingCourse(course);
                      setShowCourseModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {expandedCourseId === course.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {expandedCourseId === course.id && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#00B5AD]" />
                      Seje tečaja
                    </h4>
                    <button 
                      onClick={() => openNewSessionModal(course.id)}
                      className="text-sm text-[#00B5AD] hover:underline flex items-center"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Dodaj sejo
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {course.sessions.length > 0 ? (
                      course.sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                            <div>
                              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Datum / Čas</div>
                              <div className="text-sm font-medium text-gray-900">
                                {format(new Date(session.start_at), 'dd. MM. yyyy HH:mm')}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Lokacija</div>
                              <div className="text-sm text-gray-700 truncate max-w-[150px]">{session.location || 'Ni določeno'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Cena</div>
                              <div className="text-sm text-gray-700">{session.price}€</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Udeleženci</div>
                              <div className="text-sm text-gray-700">
                                {session.registrationsCount} / {session.max_participants || '∞'}
                                {session.waitlistCount > 0 && (
                                  <span className="ml-2 text-amber-600">({session.waitlistCount} čakalna lista)</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Status</div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize mt-1
                                ${session.status === 'current' ? 'bg-green-100 text-green-800' : 
                                  session.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                              >
                                {session.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openRegistrationsModal(session)}
                              className="p-1.5 text-gray-400 hover:text-green-600"
                              title="Prijave"
                            >
                              <Users className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => openEditSessionModal(session, course.id)}
                              className="p-1.5 text-gray-400 hover:text-blue-600"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSession(session.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg italic">
                        Ta tečaj še nima razpisanih sej.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCourse?.id ? 'Uredi tečaj' : 'Nov tečaj'}
              </h3>
              <button 
                onClick={() => setShowCourseModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Naslov tečaja</label>
                  <input
                    type="text"
                    required
                    value={editingCourse?.title || ''}
                    onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                    placeholder="npr. Reiki iniciacija"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={editingCourse?.slug || ''}
                    onChange={e => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                    placeholder="npr. reiki-iniciacija"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Podnaslov</label>
                <input
                  type="text"
                  value={editingCourse?.subtitle || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                  placeholder="Kratek privlačen slogan"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Organizator</label>
                  <input
                    type="text"
                    value={editingCourse?.organizer || ''}
                    onChange={e => setEditingCourse({ ...editingCourse, organizer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                    placeholder="npr. Janez Novak"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Lokacija (privzeta)</label>
                  <input
                    type="text"
                    value={editingCourse?.location || ''}
                    onChange={e => setEditingCourse({ ...editingCourse, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                    placeholder="npr. ORI Center, Ljubljana"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Stopnja</label>
                  <select
                    value={editingCourse?.level || 'beginner'}
                    onChange={e => setEditingCourse({ ...editingCourse, level: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none bg-white"
                  >
                    <option value="beginner">Začetni</option>
                    <option value="intermediate">Nadaljevalni</option>
                    <option value="advanced">Napredni</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Poudarjena barva</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={editingCourse?.highlight_color || '#00B5AD'}
                      onChange={e => setEditingCourse({ ...editingCourse, highlight_color: e.target.value })}
                      className="w-10 h-10 border-0 p-0 overflow-hidden rounded-lg cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 uppercase font-mono">{editingCourse?.highlight_color || '#00B5AD'}</span>
                  </div>
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center cursor-pointer space-x-2">
                    <input
                      type="checkbox"
                      checked={editingCourse?.published !== false}
                      onChange={e => setEditingCourse({ ...editingCourse, published: e.target.checked })}
                      className="w-4 h-4 text-[#00B5AD] border-gray-300 rounded focus:ring-[#00B5AD]"
                    />
                    <span className="text-sm font-medium text-gray-700">Objavljeno</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Cena (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingCourse?.price ?? 0}
                    onChange={e => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                    placeholder="npr. 240"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Max udeležencev</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCourse?.max_attendees ?? 0}
                    onChange={e => setEditingCourse({ ...editingCourse, max_attendees: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                    placeholder="npr. 20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <input
                    type="text"
                    value={editingCourse?.status || 'active'}
                    onChange={e => setEditingCourse({ ...editingCourse, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                    placeholder="npr. active / draft / closed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Jezik</label>
                  <input
                    type="text"
                    value={editingCourse?.language || 'sl'}
                    onChange={e => setEditingCourse({ ...editingCourse, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                    placeholder="npr. sl / en"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Čas začetka (hh:mm)</label>
                  <input
                    type="time"
                    value={editingCourse?.start_time || ''}
                    onChange={e => setEditingCourse({ ...editingCourse, start_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Kratek opis</label>
                <textarea
                  value={editingCourse?.short_description || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, short_description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none resize-none"
                  placeholder="Povzetek za kartico tečaja..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Dolg opis (podrobnosti)</label>
                <textarea
                  value={editingCourse?.long_description || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, long_description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                  placeholder="Celoten opis tečaja, cilji, kaj udeleženec pridobi..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">URL naslovne slike</label>
                <input
                  type="text"
                  value={editingCourse?.cover_image_url || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, cover_image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-[#00B5AD]" />
                  Prvo sejo lahko dodate ali uredite v razdelku "Seje tečaja" spodaj
                </h4>
                <p className="text-xs text-gray-500">
                  Kliknite na "Dodaj sejo" v razširjenem pogledu tečaja, da dodate datum, čas in druge podrobnosti seje.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Prekliči
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00B5AD] text-white font-bold rounded-lg hover:bg-[#009891] transition-all shadow-lg shadow-[#00B5AD]/20"
                >
                  Shrani tečaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSession?.id ? 'Uredi sejo' : 'Nova seja'}
              </h3>
              <button 
                onClick={() => setShowSessionModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Začetek</label>
                  <input
                    type="datetime-local"
                    required
                    value={editingSession?.start_at || ''}
                    onChange={e => setEditingSession({ ...editingSession, start_at: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Konec (opcijsko)</label>
                  <input
                    type="datetime-local"
                    value={editingSession?.end_at || ''}
                    onChange={e => setEditingSession({ ...editingSession, end_at: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Naslov termina (opcijsko)</label>
                <input
                  type="text"
                  value={editingSession?.headline || ''}
                  onChange={e => setEditingSession({ ...editingSession, headline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                  placeholder="npr. Marčevska skupina"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Lokacija</label>
                <input
                  type="text"
                  value={editingSession?.location || ''}
                  onChange={e => setEditingSession({ ...editingSession, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                  placeholder="Če se razlikuje od tečaja"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Cena (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={editingSession?.price || 0}
                    onChange={e => setEditingSession({ ...editingSession, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Max udeležencev</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingSession?.max_participants || 10}
                    onChange={e => setEditingSession({ ...editingSession, max_participants: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <select
                    value={editingSession?.status || 'upcoming'}
                    onChange={e => setEditingSession({ ...editingSession, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none bg-white"
                  >
                    <option value="upcoming">Prihaja</option>
                    <option value="current">V teku</option>
                    <option value="past">Zaključeno</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Jezik</label>
                  <select
                    value={editingSession?.language || 'sl'}
                    onChange={e => setEditingSession({ ...editingSession, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5AD]/20 focus:border-[#00B5AD] outline-none bg-white"
                  >
                    <option value="sl">Slovenščina</option>
                    <option value="en">Angleščina</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Prekliči
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00B5AD] text-white font-bold rounded-lg hover:bg-[#009891] transition-all shadow-lg shadow-[#00B5AD]/20"
                >
                  Shrani sejo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registrations Modal */}
      {showRegistrationsModal && selectedSessionForRegistrations && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Prijave za sejo</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(selectedSessionForRegistrations.start_at), 'dd. MM. yyyy HH:mm')}
                </p>
              </div>
              <button 
                onClick={() => setShowRegistrationsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {loadingRegistrations ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-8 h-8 animate-spin text-[#00B5AD]" />
                </div>
              ) : registrations.length > 0 ? (
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <div className="font-semibold text-gray-900">{reg.full_name}</div>
                        <div className="text-sm text-gray-600">{reg.email}</div>
                        <div className="text-sm text-gray-500">{reg.phone}</div>
                        {reg.notes && (
                          <div className="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-300 pl-2">
                            {reg.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                          ${reg.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            reg.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {reg.status}
                        </span>
                        <div className="text-xs text-gray-400 mt-1">
                          {format(new Date(reg.created_at), 'dd. MM. HH:mm')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Za to sejo še ni prijav.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

