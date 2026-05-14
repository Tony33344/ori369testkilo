'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Clock, Calendar, CheckCircle, AlertCircle, Zap, Euro } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import type { PublicServiceContent } from '@/lib/public-services';

interface TherapyDetailContentProps {
  richContent: PublicServiceContent;
  images: string[];
  backHref: string;
  nextHref?: string;
  nextLabel?: string;
}

export default function TherapyDetailContent({ richContent, images, backHref, nextHref, nextLabel }: TherapyDetailContentProps) {
  const { t } = useLanguage();

  const gallery = images.length > 0 ? images : ['/images/therapies/IMG_5779-768x513.webp'];
  const heroImage = gallery[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={richContent.name}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
            <Link 
              href={backHref}
              className="inline-flex items-center text-[#00B5AD] hover:text-[#009891] transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              {backHref === '/paketi' ? 'Nazaj na pakete' : t('therapyDetail.backToTherapies')}
            </Link>

            {nextHref && nextLabel && (
              <Link 
                href={nextHref}
                className="inline-flex items-center text-[#00B5AD] hover:text-[#009891] transition-colors font-medium"
              >
                <span className="mr-2">Naslednja: {nextLabel}</span>
                <ArrowRight size={20} />
              </Link>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-6">
            {richContent.name}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
            {richContent.shortDescription}
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center space-x-2 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
              <Clock className="text-[#00B5AD]" size={22} />
              <span className="text-gray-700 text-lg"><strong>{richContent.duration} min</strong></span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100">
              <Euro className="text-[#00B5AD]" size={22} />
              <span className="text-gray-700 text-lg"><strong>{richContent.price} €</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {gallery.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {gallery.map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                  <Image
                    src={image}
                    alt={`${richContent.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="mb-16 text-left">
            <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-line">
              {richContent.longDescription}
            </p>
          </div>

          <div className="space-y-16 text-left">
            {richContent.howItWorks && (
              <div className="border-l-4 border-[#00B5AD] pl-8 py-4 bg-gray-50/50 rounded-r-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 flex items-center gap-3">
                  <Zap className="text-[#00B5AD]" size={32} />
                  {t('therapyDetail.howItWorks')}
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-line">
                  {richContent.howItWorks}
                </p>
              </div>
            )}

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
                  href={`/rezervacija?package=${richContent.slug}`}
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
        </div>
      </div>
    </div>
  );
}
