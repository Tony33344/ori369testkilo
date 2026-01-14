"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle2, Zap, Heart, Shield, Users, Globe, Phone, Award, ChevronDown, ChevronUp } from "lucide-react";
import ImageModal from "@/components/ImageModal";
import { teamData } from "@/lib/servicesData";

const OFFICE_IMAGE = "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/pisarna/pisarna1.webp";
const THERAPY_IMAGES = [
  "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/terapije/terapija1.webp",
  "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/terapije/terapija2.webp",
  "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/terapije/terapija3.webp",
  "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/terapije/terapija4.webp",
  "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/terapije/terapija5.webp",
  "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/terapije/terapija6.webp",
  "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/terapije/terapija7.webp",
];

export default function AboutPage() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black mb-4 md:mb-6 leading-tight">
                O nas – <span className="text-[#00B5AD]">ORI 369</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
                V ORI 369 združujemo napredne tehnologije, celostno razumevanje človeka in strokovne manualne tehnike. 
                Naš način dela bistveno preseže klasične terapije, saj omogoča hitrejše, globlje in trajnejše rezultate.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-gray-100">
                  <Zap className="text-[#00B5AD]" size={20} />
                  <span className="font-medium">Napredna tehnologija</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                  <Heart className="text-[#00B5AD]" size={20} />
                  <span className="font-medium">Celostni pristop</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative w-full">
              <div
                className="relative h-[300px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() => setSelectedImage({ src: OFFICE_IMAGE, alt: "ORI 369 Pisarna" })}
              >
                <Image
                  src={OFFICE_IMAGE}
                  alt="ORI 369 Pisarna"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="text-white" size={24} />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl hidden md:block border border-gray-100">
                <p className="text-3xl font-bold text-[#00B5AD]">3-6-9</p>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Frekvence ravnovesja</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ORI 369 Works - The Comparison */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-black mb-4 md:mb-6">Zakaj ORI 369 deluje?</h2>
            <p className="text-lg text-gray-600">
              Najbolj preprosta primerjava: <span className="font-bold text-black">Lopata ali bager?</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🚜</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Brez tehnologije (Lopata)</h3>
              <p className="text-gray-600 leading-relaxed">
                Z lopato lahko kopljemo jamo za bazen – počasi, z veliko truda in omejenim učinkom. 
                Pri klasičnih terapijah je napredek pogosto počasen, saj se zanašamo le na osnovne metode.
              </p>
            </div>
            <div className="bg-[#00B5AD]/5 p-8 rounded-2xl border border-[#00B5AD]/20">
              <div className="w-12 h-12 bg-[#00B5AD] rounded-full flex items-center justify-center mb-6">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">Z ORI 369 tehnologijo (Bager)</h3>
              <p className="text-gray-600 leading-relaxed">
                Bager isto jamo naredi v enem dnevu. Z naprednimi napravami v ORI 369 vaše telo v eni obravnavi 
                lahko naredi več kot sicer v tednu dni. Uporabljamo opremo, ki ustvarja resnično razliko.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Grid */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-black mb-4">Tehnologije ORI 369</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vse obravnave vključujejo uporabo vrhunskih naprav in metod, ki skupaj delujejo kot integriran sistem regeneracije.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Regeneracija",
                items: ["Tecar terapija", "Magnetna indukcija (MIS)", "Elektrostimulacija (EMS)", "Laser terapija", "Ultrazvok"],
                icon: <Zap className="text-[#00B5AD]" />
              },
              {
                title: "Podpora strukturi",
                items: ["Trakcija hrbtenice", "Manualna terapija", "Holos manual treatment", "Akupunktura"],
                icon: <Shield className="text-[#00B5AD]" />
              },
              {
                title: "Energijska harmonizacija",
                items: ["Frequency therapy", "Skalarni valovi", "IteraCare", "AO Scan (biorezonanca)"],
                icon: <Globe className="text-[#00B5AD]" />
              },
              {
                title: "Nevroreset",
                items: ["Light & Sound Therapy", "Meditape", "Somatika", "Vodeno dihanje", "Ledene terapije"],
                icon: <Users className="text-[#00B5AD]" />
              }
            ].map((cat, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4">{cat.icon}</div>
                <h3 className="text-lg font-bold mb-4">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle2 size={14} className="text-[#00B5AD] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Holistic Approach */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
            <div className="lg:w-1/2 grid grid-cols-2 gap-3 md:gap-4">
              {THERAPY_IMAGES.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className={`relative h-40 md:h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer group ${i % 2 === 1 ? 'md:mt-8' : ''}`}
                  onClick={() => setSelectedImage({ src: img, alt: `Terapija ${i + 1}` })}
                >
                  <Image
                    src={img}
                    alt={`Terapija ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap className="text-white" size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-4xl font-bold text-black mb-6 md:mb-8">Celostni pristop</h2>
              <p className="text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
                Terapevtski proces pri nas nikoli ne zajema samo bolečine ali simptoma. Obravnavo pogledamo širše:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[
                  "Kako se človek giblje",
                  "Drža in poravnava",
                  "Način dihanja",
                  "Prehrana in hidracija",
                  "Način razmišljanja",
                  "Odnos do sebe in drugih",
                  "Odnos do narave",
                  "Energijsko ravnovesje"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <CheckCircle2 className="text-[#00B5AD]" size={18} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-lg font-medium text-black italic">
                "Ko se vse te komponente uskladijo, telo preide v stanje regeneracije, um v jasnost, energija pa v ravnovesje."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery / More Images */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Utrinki iz našega centra</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {THERAPY_IMAGES.slice(4, 7).map((img, i) => (
              <div
                key={i}
                className="relative h-72 rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
                onClick={() => setSelectedImage({ src: img, alt: `Center ORI 369 ${i + 5}` })}
              >
                <Image
                  src={img}
                  alt={`Center ORI 369 ${i + 5}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="text-white" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-black mb-4">{t('team.title')}</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('team.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {teamData.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#00B5AD] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black">{member.name}</h3>
                    <p className="text-[#00B5AD] font-medium">{member.title}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{member.bio}</p>
                
                {/* Expandable Long Bio */}
                {expandedMember === index && (
                  <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                      {member.longBio}
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => setExpandedMember(expandedMember === index ? null : index)}
                  className="mb-4 flex items-center gap-2 text-[#00B5AD] hover:text-[#009891] font-medium transition-colors"
                >
                  {expandedMember === index ? (
                    <>
                      <ChevronUp size={18} />
                      {t('team.hideDetails')}
                    </>
                  ) : (
                    <>
                      <ChevronDown size={18} />
                      {t('team.readMore')}
                    </>
                  )}
                </button>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                    <Award size={18} className="text-[#00B5AD]" />
                    {t('team.qualifications')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(expandedMember === index ? member.qualifications : member.qualifications.slice(0, 4)).map((qual, i) => (
                      <span key={i} className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                        {qual}
                      </span>
                    ))}
                    {expandedMember !== index && member.qualifications.length > 4 && (
                      <span className="bg-[#00B5AD]/10 px-3 py-1 rounded-full text-sm text-[#00B5AD] font-medium">
                        +{member.qualifications.length - 4} {t('team.more')}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Specializations - shown when expanded */}
                {expandedMember === index && member.specializations && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-black mb-2">{t('team.specializations')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specializations.map((spec, i) => (
                        <span key={i} className="bg-[#00B5AD]/10 px-3 py-1 rounded-full text-sm text-[#00B5AD]">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} className="text-[#00B5AD]" />
                  <a href={`tel:${member.phone}`} className="hover:text-[#00B5AD] transition-colors">
                    {member.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-black text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B5AD] opacity-20 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Ste pripravljeni na spremembo?</h2>
              <p className="text-gray-400 mb-8 md:mb-10 text-base md:text-lg">
                Pridružite se številnim, ki so že občutili razliko z našim naprednim pristopom.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <a
                  href="/rezervacija"
                  className="px-8 py-4 bg-[#00B5AD] text-white font-bold rounded-xl hover:bg-[#009891] transition-all transform hover:scale-105"
                >
                  Rezerviraj termin
                </a>
                <a
                  href="/kontakt"
                  className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all"
                >
                  Kontaktirajte nas
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        src={selectedImage?.src || ""}
        alt={selectedImage?.alt || ""}
      />
    </div>
  );
}
