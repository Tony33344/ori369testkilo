'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import Link from 'next/link';
import { ArrowLeft, Loader2, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function EducationReservationPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  
  const router = useRouter();

  useEffect(() => {
    async function init() {
      // 1. Get User
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // 2. Get Courses with Sessions
      const { data, error } = await supabase
        .from('education_courses')
        .select(`
          *,
          sessions:education_course_sessions(*)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (data) {
        setCourses(data);
        // Auto-select first if available
        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
        }
      }
      setLoading(false);
    }
    init();
  }, [supabase]);

  const handleProceed = () => {
    if (!selectedSessionId) return;

    if (!user) {
      // Redirect to login with callback
      const callbackUrl = encodeURIComponent(`/education/potrdi-rezervacijo`);
      router.push(`/prijava?redirect=${callbackUrl}`); 
      return;
    }

    // Go to Checkout in Education Mode
    router.push(`/checkout?courseId=${selectedCourseId}&sessionId=${selectedSessionId}`);
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  // Filter for upcoming sessions
  const sessions = selectedCourse?.sessions?.filter((s: any) => new Date(s.start_at) > new Date()) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#00B5AD] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/education" className="inline-flex items-center text-gray-600 hover:text-[#00B5AD] transition-colors mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Nazaj na izobraževanja
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Potrdi svojo udeležbo</h1>
          <p className="text-gray-600 mt-2">Izberite izobraževanje in termin za nadaljevanje.</p>
        </div>

        {/* Selection Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
          
          {/* Course Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Izobraževanje</label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedSessionId(''); // Reset session
              }}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#00B5AD] focus:border-transparent outline-none transition-all"
            >
              <option value="" disabled>Izberite tečaj</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Session Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Termin</label>
            {!selectedCourseId ? (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 text-sm text-center">
                Najprej izberite izobraževanje zgoraj.
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                Trenutno ni razpisanih terminov za to izobraževanje.
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session: any) => (
                  <div 
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
                      selectedSessionId === session.id 
                        ? 'bg-[#00B5AD]/10 border-[#00B5AD] ring-1 ring-[#00B5AD]' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedSessionId === session.id ? 'border-[#00B5AD]' : 'border-gray-400'
                      }`}>
                        {selectedSessionId === session.id && <div className="w-2.5 h-2.5 bg-[#00B5AD] rounded-full" />}
                      </div>
                      <div>
                        <div className="text-gray-900 font-medium">
                          {format(new Date(session.start_at), 'd. MMMM yyyy', { locale: sl })}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(session.start_at), 'HH:mm')} 
                          {session.duration && ` - ${session.duration} min`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[#00B5AD] font-bold">
                         {session.price > 0 ? `€${session.price}` : 'Brezplačno'}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleProceed}
            disabled={!selectedSessionId}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
              selectedSessionId
                ? 'bg-[#00B5AD] hover:bg-[#009ca6] text-white shadow-lg shadow-[#00B5AD]/20'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Nadaljuj na blagajno</span>
            <CheckCircle className="w-5 h-5" />
          </button>
          
          {!user && selectedSessionId && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Za nadaljevanje se boste morali prijaviti ali registrirati.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
