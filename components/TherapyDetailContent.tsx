'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Clock, Calendar, CheckCircle, AlertCircle, Zap, Euro } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ServiceDetail, servicesData } from '@/lib/servicesData';

interface TherapyDetailContentProps {
  richContent: ServiceDetail;
  therapyImage: string;
}

export default function TherapyDetailContent({ richContent, therapyImage }: TherapyDetailContentProps) {
  const { t } = useLanguage();

  // Find the next therapy for navigation
  const allSlugs = Object.keys(servicesData);
  const currentIndex = allSlugs.indexOf(richContent.slug);
  const nextSlug = allSlugs[(currentIndex + 1) % allSlugs.length];
  const nextTherapyName = servicesData[nextSlug].name;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={therapyImage}
            alt={richContent.name}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <Link 
              href="/terapije"
              className="inline-flex items-center text-[#00B5AD] hover:text-[#009891] transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              {t('therapyDetail.backToTherapies')}
            </Link>

            <Link 
              href={`/terapije/${nextSlug}`}
              className="inline-flex items-center text-[#00B5AD] hover:text-[#009891] transition-colors font-medium"
            >
              <span className="mr-2">Naslednja: {nextTherapyName}</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
            {richContent.name}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-8">
            {richContent.shortDescription}
          </p>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg shadow-sm">
              <Clock className="text-[#00B5AD]" size={20} />
              <span className="text-gray-700"><strong>{richContent.duration} min</strong></span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg shadow-sm">
              <Euro className="text-[#00B5AD]" size={20} />
              <span className="text-gray-700"><strong>{richContent.price} €</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Description */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {richContent.longDescription}
            </p>
          </div>

          <div className="space-y-12">
            {/* How It Works */}
            {richContent.howItWorks && (
              <div className="border-l-4 border-[#00B5AD] pl-6 py-2 bg-gray-50/50 rounded-r-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 flex items-center gap-2">
                  <Zap className="text-[#00B5AD]" size={28} />
                  {t('therapyDetail.howItWorks')}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {richContent.howItWorks}
                </p>
              </div>
            )}

            {/* Benefits */}
            {richContent.benefits && richContent.benefits.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={28} />
                  {t('therapyDetail.benefits')}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {richContent.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indications */}
            {richContent.indications && richContent.indications.length > 0 && (
              <div className="bg-blue-50 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                  {t('therapyDetail.indications')}
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {richContent.indications.map((indication, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-blue-100">
                      <div className="w-2 h-2 bg-[#00B5AD] rounded-full"></div>
                      <span className="text-gray-700">{indication}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contraindications */}
            {richContent.contraindications && richContent.contraindications.length > 0 && (
              <div className="bg-red-50 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 flex items-center gap-2">
                  <AlertCircle className="text-red-600" size={28} />
                  {t('therapyDetail.contraindications')}
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {richContent.contraindications.map((contraindication, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-red-100">
                      <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                      <span className="text-gray-700">{contraindication}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price & Duration Info (Always visible at bottom) */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-black mb-6">{t('therapyDetail.priceAndDuration')}</h2>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-sm border border-gray-100">
                <Euro className="text-[#00B5AD]" size={24} />
                <div>
                  <p className="text-sm text-gray-500">{t('therapyDetail.price')}</p>
                  <p className="text-2xl font-bold text-black">{richContent.price} €</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-sm border border-gray-100">
                <Clock className="text-[#00B5AD]" size={24} />
                <div>
                  <p className="text-sm text-gray-500">{t('therapyDetail.duration')}</p>
                  <p className="text-2xl font-bold text-black">{richContent.duration} min</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-br from-[#00B5AD] to-[#009891] rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">
                {t('therapyDetail.ctaTitle')}
              </h3>
              <p className="text-lg mb-8 opacity-90">
                {t('therapyDetail.ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/rezervacija`}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#00B5AD] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <Calendar size={20} className="mr-2" />
                  {t('therapyDetail.bookAppointment')}
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {t('therapyDetail.contactUs')}
                </Link>
              </div>
            </div>
          </div>

          {/* Related Therapies */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-black mb-6">
              {t('therapyDetail.discoverOther')}
            </h3>
            <Link
              href="/terapije"
              className="inline-block px-6 py-3 border-2 border-[#00B5AD] text-[#00B5AD] font-semibold rounded-lg hover:bg-[#00B5AD] hover:text-white transition-colors"
            >
              {t('therapyDetail.allTherapies')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
