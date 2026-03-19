'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft,
  Users,
  CheckCircle,
  BookOpen,
  Star,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

const BUSINESS_TIMEZONE = 'Europe/Vienna';

interface EducationSession {
  id: string;
  status: 'current' | 'upcoming' | 'past';
  headline: string | null;
  start_at: string;
  end_at: string | null;
  location: string | null;
  language: string | null;
  format: string | null;
  price: number | null;
  max_participants: number | null;
  registrationsCount: number;
  availableSpots: number | null;
  isFull?: boolean;
}

interface EducationCourse {
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
  highlight_color: string | null;
  price: number | null;
  max_attendees: number | null;
  status: string | null;
  language: string | null;
  start_time: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  detailed_description: string | null;
  program_schedule: string | null;
  what_youll_get: string | null;
  requirements: string | null;
  sessions: EducationSession[];
}

export default function EducationCoursePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [course, setCourse] = useState<EducationCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/education/list'); 
        const data = await response.json();
        const coursesList: EducationCourse[] = data.courses || [];
        const foundCourse = coursesList.find(c => c.slug === slug);
        setCourse(foundCourse || null);
      } catch (error) {
        console.error('Failed to load course:', error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-[#00B5AD] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Nalaganje...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tečaj ni najden</h1>
          <Link href="/education" className="text-[#00B5AD] hover:underline">
            ← Nazaj na izobraževanja
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [
    course.cover_image_url,
    course.image_url_2,
    course.image_url_3
  ].filter(Boolean) as string[];

  const upcomingSessions = (course.sessions || []).filter((session) => session.status !== 'past');
  const primarySession = upcomingSessions[0] || course.sessions?.[0];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={course.cover_image_url || 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=1600&q=80'}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="absolute top-0 left-0 right-0 p-6">
          <Link 
            href="/education" 
            className="inline-flex items-center text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nazaj na izobraževanja
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 bg-[#00B5AD] text-white text-sm font-bold rounded-full`}>
              {course.level === 'beginner' ? 'Začetni' : course.level === 'intermediate' ? 'Nadaljevalni' : 'Napredni'}
            </span>
            {primarySession?.status === 'current' && (
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                Aktualno
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
          {course.subtitle && (
            <p className="text-xl text-white/90 max-w-2xl">{course.subtitle}</p>
          )}
        </div>
      </section>

      {/* Image Gallery */}
      {allImages.length > 1 && (
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-32 h-24 md:w-48 md:h-32 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img || (!selectedImage && idx === 0)
                      ? 'border-[#00B5AD] shadow-lg' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${course.title} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Short Description */}
            {course.short_description && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">O tečaju</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{course.short_description}</p>
              </div>
            )}

            {/* Detailed Description */}
            {course.detailed_description && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Podroben program</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{course.detailed_description}</p>
                </div>
              </div>
            )}

            {/* Program Schedule */}
            {course.program_schedule && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-[#00B5AD]" />
                  Časovni potek
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <pre className="text-gray-700 whitespace-pre-line font-sans text-sm leading-relaxed">
                    {course.program_schedule}
                  </pre>
                </div>
              </div>
            )}

            {/* What You'll Get */}
            {course.what_youll_get && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-[#00B5AD]" />
                  Kaj boste prejeli
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.what_youll_get.split('\n').filter(Boolean).map((item, idx) => (
                    <div key={idx} className="flex items-start p-4 bg-green-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item.replace(/^[-•*]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-[#00B5AD]" />
                  Zahteve
                </h2>
                <p className="text-gray-600 leading-relaxed">{course.requirements}</p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Session Info Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Termini in lokacija</h3>
                
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="mt-0.5 h-5 w-5 text-[#00B5AD]" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900">
                              {formatInTimeZone(new Date(session.start_at), BUSINESS_TIMEZONE, 'EEEE, d. MMMM yyyy', { locale: sl })}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {session.end_at
                                ? `${formatInTimeZone(new Date(session.start_at), BUSINESS_TIMEZONE, 'HH:mm')} – ${formatInTimeZone(new Date(session.end_at), BUSINESS_TIMEZONE, 'HH:mm')}`
                                : formatInTimeZone(new Date(session.start_at), BUSINESS_TIMEZONE, 'HH:mm')}
                            </p>
                          </div>
                        </div>

                        {(session.location || course.location) && (
                          <div className="mt-4 flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 text-[#00B5AD]" />
                            <p className="text-gray-700">{session.location || course.location}</p>
                          </div>
                        )}

                        {session.max_participants && (
                          <div className="mt-4 flex items-start gap-3">
                            <Users className="mt-0.5 h-5 w-5 text-[#00B5AD]" />
                            <div>
                              <p className="text-gray-700">{session.max_participants} mest</p>
                              {session.availableSpots !== null && session.availableSpots > 0 && (
                                <p className="text-sm font-medium text-green-600">
                                  Še {session.availableSpots} prostih mest
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="mt-5 border-t border-gray-200 pt-4">
                          <div className="mb-4 text-center">
                            <span className="mb-1 block text-sm text-gray-500">Cena</span>
                            <span className="text-3xl font-black text-gray-900">€{session.price ?? course.price ?? '0'}</span>
                          </div>

                          {session.isFull ? (
                            <button disabled className="w-full rounded-xl bg-gray-300 py-4 font-bold text-gray-600 cursor-not-allowed">
                              Polno
                            </button>
                          ) : (
                            <Link
                              href={`/education/potrdi-rezervacijo?courseId=${course.id}&sessionId=${session.id}`}
                              className="block w-full rounded-xl bg-[#00B5AD] py-4 text-center font-bold text-white transition-colors hover:bg-[#009891] shadow-lg shadow-[#00B5AD]/20"
                            >
                              Prijava na ta termin
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Termin bo objavljen kmalu</p>
                )}
              </div>

              {/* Organizer */}
              {course.organizer && (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-2">Organizator</h4>
                  <p className="text-gray-600">{course.organizer}</p>
                </div>
              )}

              {/* Back Link */}
              <Link 
                href="/education" 
                className="flex items-center text-gray-500 hover:text-[#00B5AD] transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                Vsi tečaji
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt={course.title} 
            className="max-w-full max-h-full object-contain"
          />
          <button 
            className="absolute top-4 right-4 text-white p-2"
            onClick={() => setSelectedImage(null)}
          >
            <span className="text-4xl">&times;</span>
          </button>
        </div>
      )}
    </div>
  );
}
