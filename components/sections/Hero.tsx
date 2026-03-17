'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Zap, BookOpen, ArrowUpRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { useLanguage } from '@/lib/i18n';
import { createClient } from '@/lib/supabase';
import 'swiper/css';
import 'swiper/css/effect-fade';

interface HeroService {
  slug: string;
  name: string;
  description: string | null;
}

const heroImages = [
  '/images/therapies/IMG_5779-768x513.webp',
  '/images/therapies/IMG_5787-768x513.webp',
  '/images/therapies/IMG_5867-768x513.webp',
  '/images/therapies/IMG_5889-768x536.webp',
  '/images/therapies/IMG_5926-768x513.webp',
  '/images/therapies/IMG_5929-768x513.webp',
  '/images/therapies/IMG_5931-768x513.webp',
  '/images/therapies/IMG_5935-768x513.webp',
  '/images/therapies/IMG_5938-768x513.webp',
  '/images/therapies/IMG_5939-Copy-768x513.webp',
  '/images/therapies/IMG_5947-768x513.webp',
  '/images/therapies/IMG_5953-768x513.webp',
  '/images/therapies/IMG_5955-768x513.webp',
  '/images/therapies/IMG_5991-768x513.webp',
  '/images/therapies/IMG_5993-768x513.webp',
  '/images/therapies/IMG_5997-768x513.webp',
  '/images/therapies/IMG_6004-768x513.webp',
  '/images/therapies/IMG_6009-Copy-768x513.webp',
];

export default function Hero() {
  const { t } = useLanguage();
  const [heroServices, setHeroServices] = useState<HeroService[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('services')
      .select('slug, name, description')
      .eq('active', true)
      .eq('show_on_hero', true)
      .eq('is_package', false)
      .order('name')
      .then(({ data }) => {
        if (data) setHeroServices(data as HeroService[]);
      });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          speed={1500}
          loop={true}
          className="w-full h-full"
        >
          {heroImages.map((image, index) => (
            <SwiperSlide key={index} className="w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`ORI 369 Center ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 pointer-events-none z-10"></div>
      </div>
      
      {/* Large "369" Brand Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-10 md:-right-32 top-1/2 -translate-y-1/2 text-[10rem] md:text-[30rem] font-bold text-[#00B5AD] opacity-[0.03] leading-none select-none">
          369
        </div>
      </div>

      {/* Animated background elements - ORI 369 Brand Colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#00B5AD]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#00B5AD]/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-[#B8D52E]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#00B5AD]/10 backdrop-blur-sm rounded-full border border-[#00B5AD]/30">
              <Sparkles className="text-[#00B5AD]" size={20} />
              <span className="text-sm font-medium text-[#00B5AD] tracking-wide">{t('hero.tagline')}</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold text-black leading-tight tracking-wider">
              ORI 369
            </h1>
            
            <div className="text-lg md:text-2xl font-medium text-[#00B5AD] tracking-[0.15em] uppercase">
              {t('hero.slogan')}
            </div>

            <p className="text-lg md:text-2xl text-gray-700 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <Link
                href="/rezervacija"
                className="px-8 py-4 bg-[#00B5AD] hover:bg-[#009891] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {t('hero.cta')}
              </Link>
              <Link
                href="/terapije"
                className="px-8 py-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {t('hero.exploreCta')}
              </Link>
              <Link
                href="/education"
                className="px-8 py-4 bg-white text-[#00B5AD] border-2 border-[#00B5AD] font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-[#00B5AD] hover:text-white transform hover:scale-105 transition-all duration-200 flex items-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                ORI Education
              </Link>
            </motion.div>

            {/* Service Highlights */}
            {heroServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-10 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
              >
                {heroServices.map((service) => {
                  const isMotio = service.slug.includes('motio');
                  const href = isMotio ? '/motioscan' : `/terapije/${service.slug}`;
                  return (
                    <Link
                      key={service.slug}
                      href={href}
                      className="group relative flex items-center gap-3 bg-white/85 backdrop-blur-md border border-white/60 shadow-md hover:shadow-xl rounded-2xl px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#00B5AD]/40 min-w-[160px] max-w-[220px]"
                    >
                      {/* Accent bar */}
                      <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-[#00B5AD] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="w-9 h-9 shrink-0 bg-gradient-to-br from-[#00B5AD]/20 to-[#00B5AD]/5 rounded-xl flex items-center justify-center group-hover:from-[#00B5AD]/30 group-hover:to-[#00B5AD]/10 transition-all">
                        <Zap className="text-[#00B5AD]" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-gray-900 leading-tight line-clamp-2">{service.name}</h3>
                        {isMotio && (
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#00B5AD] uppercase tracking-wide">motioscan.si</span>
                        )}
                      </div>
                      <ArrowUpRight className="shrink-0 w-3.5 h-3.5 text-gray-300 group-hover:text-[#00B5AD] transition-colors" />
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-gray-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
