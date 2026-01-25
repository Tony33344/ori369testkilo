'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Shield,
  Zap,
  BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { type EducationCourse } from '@/lib/education';

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

export default function EducationPage() {
  const [courses, setCourses] = useState<EducationCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/education/list'); 
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#00B5AD]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#00B5AD]/10 text-[#00B5AD] rounded-full text-sm font-bold mb-6">
            <BookOpen className="w-4 h-4" />
            <span>ORI EDUCATION PLATFORMA</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Postanite mojster <span className="text-[#00B5AD]">energijskega</span> dela
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Pridružite se našim strokovnim izobraževanjem, kjer združujemo starodavne modrosti z modernimi terapevtskimi pristopi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="#aktualni-tecaji" className="px-8 py-4 bg-[#00B5AD] text-white font-bold rounded-xl hover:bg-[#009891] transition-all shadow-lg shadow-[#00B5AD]/20">
              Preglej aktualne tečaje
            </a>
            <Link href="/kontakt" className="px-8 py-4 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all">
              Več informacij
            </Link>
          </div>
        </div>
      </section>

      {/* Aktualni tečaji */}
      <section id="aktualni-tecaji" className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0 text-center md:text-left">
          <div className="w-full text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Aktualni tečaji</h2>
            <p className="text-gray-500">Izberite izobraževanje, ki bo transformiralo vašo prakso.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-gray-100 h-[400px] rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {courses.map((course) => (
              <div key={course.id} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-md">
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img 
                    src={course.cover_image_url || 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80'} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-sm uppercase`}>
                      {course.level === 'beginner' ? 'Začetni' : course.level === 'intermediate' ? 'Nadaljevalni' : 'Napredni'}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-[#00B5AD] uppercase tracking-wider">
                      {course.sessions[0]?.status === 'current' ? 'Aktualno' : 'Prihaja'}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.sessions[0]?.start_at ? format(new Date(course.sessions[0].start_at), 'd. MMM yyyy', { locale: sl }) : 'Termin sledi'}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00B5AD] transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {course.short_description}
                  </p>

                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>
                        {course.sessions[0]?.start_at
                          ? format(new Date(course.sessions[0].start_at), 'd. MMMM yyyy', { locale: sl })
                          : 'Datum po dogovoru'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-700">
                        {course.sessions[0]?.start_at
                          ? format(new Date(course.sessions[0].start_at), 'HH:mm')
                          : course.start_time || 'Čas po dogovoru'}
                      </span>
                    </div>
                    {course.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span><span className="font-medium text-gray-700">Lokacija:</span> {course.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      {course.sessions[0]?.isFull ? (
                        <span className="text-lg font-bold text-red-600">Polno</span>
                      ) : (
                        <span className="text-2xl font-black text-gray-900">€{course.sessions[0]?.price ?? course.price ?? '0'}</span>
                      )}
                    </div>
                    {course.sessions[0]?.isFull ? (
                      <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gray-300 text-gray-600 text-sm font-bold rounded-xl cursor-not-allowed opacity-60">
                        <span>Polno</span>
                      </div>
                    ) : (
                      <Link 
                        href={`/education/potrdi-rezervacijo?courseId=${course.id}${course.sessions[0]?.id ? `&sessionId=${course.sessions[0].id}` : ''}`}
                        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#00B5AD] text-white text-sm font-bold rounded-xl hover:bg-[#009891] transition-all shadow-md shadow-[#00B5AD]/10"
                      >
                        <span>Potrdi rezervacijo</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured: Začetni tečaji */}
      {courses.some(c => c.level === 'beginner') && (
        <section className="py-24 bg-gray-900 text-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-16">
              <h2 className="text-3xl font-bold mb-4 italic">Začetni tečaji</h2>
              <p className="text-gray-400 text-lg">
                Naši najbolj priljubljeni tečaji za tiste, ki šele vstopajo v svet energijskih terapij.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {courses
                .filter(c => c.level === 'beginner')
                .map((course, idx) => (
                  <div key={`featured-${course.id}`} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${idx > 0 ? 'pt-24 border-t border-gray-800' : ''}`}>
                    <div className={`relative ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#00B5AD]/20 rounded-full blur-2xl"></div>
                      <img 
                        src={course.cover_image_url || "https://images.unsplash.com/photo-1598553165195-06cb1be4de8d?auto=format&fit=crop&w=800&q=80"} 
                        alt={course.title}
                        className="rounded-3xl shadow-2xl relative z-10 w-full h-80 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598553165195-06cb1be4de8d?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#00B5AD] text-white rounded-full text-xs font-bold mb-4">
                          <Star className="w-3 h-3" />
                          <span>PRIPOROČAMO</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-4">{course.title}</h3>
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                            Status: <span className="text-white ml-1 font-semibold">
                              {course.sessions[0]?.status === 'current' ? 'Aktualno' : 'Prihaja'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <Calendar className="w-4 h-4 mr-2 text-[#00B5AD]" />
                            Termin: <span className="text-white ml-1 font-semibold">
                              {course.sessions[0]?.start_at ? format(new Date(course.sessions[0].start_at), "d. M. yyyy 'ob' HH:mm", { locale: sl }) : 'Termin sledi'}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-8">
                          {course.short_description}
                        </p>
                        <Link 
                          href={`/checkout?courseId=${course.id}${course.sessions[0]?.id ? `&sessionId=${course.sessions[0].id}` : ''}`} 
                          className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all group"
                        >
                          <span>Potrdi rezervacijo</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-24 container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-16">Zakaj izbrati ORI Education?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Certificirani mentorji</h3>
            <p className="text-gray-500">Naša ekipa strokovnjakov z dolgoletnimi izkušnjami vas vodi skozi vsak korak procesa.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Praktično znanje</h3>
            <p className="text-gray-500">Fokusiramo se na tehnike, ki jih lahko takoj uporabite v svojem življenju ali terapevtski praksi.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#00B5AD]/10 text-[#00B5AD] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Podporna skupnost</h3>
            <p className="text-gray-500">Po končanem tečaju postanete del naše skupnosti, kjer si izmenjujemo izkušnje in rasti.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
