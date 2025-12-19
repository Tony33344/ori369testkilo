"use client";

import { useState } from "react";
import { CheckCircle, Zap, TrendingUp, Users, Monitor, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ImageModal from "@/components/ImageModal";

const MOTIOSCAN_MAIN = "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/motioscan/motioscan1.png";
const MOTIOSCAN_SOFT = [
  "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/motioscan/motioscansoft1.png",
  "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/motioscan/motioscansoft2.png",
  "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/motioscan/motioscansoft3.png",
];

export default function MotioScanPage() {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 md:py-56 overflow-hidden bg-gray-900 text-white">
        <div
          className="absolute inset-0 z-0 opacity-50 cursor-pointer group"
          onClick={() => setSelectedImage({ src: MOTIOSCAN_MAIN, alt: "MotioScan Hero" })}
        >
          <Image
            src={MOTIOSCAN_MAIN}
            alt="MotioScan Hero"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent group-hover:via-black/40 transition-colors"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">MotioScan</h1>
            <p className="text-2xl md:text-3xl font-semibold mb-6 text-[#00B5AD]">3D Analiza Telesne Drže</p>
            <p className="text-xl md:text-2xl mb-8 font-bold tracking-widest">
              NE UGIBAJ. IZMERI.
            </p>
            <p className="text-lg mb-10 opacity-90 leading-relaxed">
              Odkrij natančno stanje svojega telesa z inovativno 3D tehnologijo, ki v nekaj sekundah razkrije tvoje skrite asimetrije, obremenitve in neravnovesja.
            </p>
            <Link
              href="/rezervacija?package=motioscan"
              className="inline-block px-10 py-4 bg-[#00B5AD] text-white font-bold rounded-xl hover:bg-[#009891] transition-all transform hover:scale-105 shadow-2xl"
            >
              Naroči svoj termin
            </Link>
          </div>
        </div>
      </section>

      {/* What is MotioScan */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-8 text-gray-900">Kaj je MotioScan?</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                MotioScan (Moti Physio) je napredna 3D naprava za natančno oceno telesne drže, ki s pomočjo vizualnih markerjev in računalniške analitike zajame:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "24 ključnih anatomskih točk",
                  "več kot 87 mišičnih asimetrij",
                  "rotacije, nagibe in obremenitve",
                  "odstopanja hrbtenice in medenice",
                  "statično in dinamično stabilnost",
                  "analizo tveganja poškodb"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <CheckCircle className="text-[#00B5AD] flex-shrink-0" size={20} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-[#00B5AD]/5 rounded-2xl border-2 border-[#00B5AD]/20">
                <p className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <ShieldCheck className="text-[#00B5AD]" />
                  Brez sevanja. Brez bolečin. Brez ugibanja.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div
                className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white cursor-pointer group"
                onClick={() => setSelectedImage({ src: MOTIOSCAN_SOFT[0], alt: "MotioScan Software Analysis" })}
              >
                <Image
                  src={MOTIOSCAN_SOFT[0]}
                  alt="MotioScan Software Analysis"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="text-white" size={24} />
                  </div>
                </div>
              </div>
              <div
                className="absolute -bottom-8 -right-8 w-64 h-48 rounded-xl overflow-hidden shadow-2xl border-4 border-white hidden md:block cursor-pointer group"
                onClick={() => setSelectedImage({ src: MOTIOSCAN_SOFT[1], alt: "MotioScan 3D Model" })}
              >
                <Image
                  src={MOTIOSCAN_SOFT[1]}
                  alt="MotioScan 3D Model"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="text-white" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Software Showcase */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Natančna vizualizacija</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Naša programska oprema omogoča vpogled v vsako podrobnost vaše telesne drže in mišičnega ravnovesja.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="relative h-[350px] rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
              onClick={() => setSelectedImage({ src: MOTIOSCAN_SOFT[2], alt: "MotioScan Detailed Report" })}
            >
              <Image
                src={MOTIOSCAN_SOFT[2]}
                alt="MotioScan Detailed Report"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap className="text-white" size={24} />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#00B5AD] rounded-xl flex items-center justify-center shrink-0">
                    <Monitor className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">3D Digitalni dvojček</h3>
                    <p className="text-gray-600">Sistem izriše vašo držo v digitalnem formatu, kar omogoča rotacijo in pregled iz vseh kotov.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#00B5AD] rounded-xl flex items-center justify-center shrink-0">
                    <Activity className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Mišična napetost</h3>
                    <p className="text-gray-600">Identificiramo preobremenjene mišice in tiste, ki potrebujejo več aktivacije.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why MotioScan */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Zakaj je MotioScan tako učinkovit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="text-[#00B5AD]" size={32} />,
                title: "Objektivna meritev",
                desc: "Natančna meritev v številkah in 3D modelu, ne le na podlagi občutka."
              },
              {
                icon: <TrendingUp className="text-[#00B5AD]" size={32} />,
                title: "Skriti problemi",
                desc: "Mikrozasuki, rotacije in kompenzacije postanejo vidni črno na belem."
              },
              {
                icon: <Users className="text-[#00B5AD]" size={32} />,
                title: "Točen protokol",
                desc: "Na podlagi rezultatov določimo natančen načrt za vaše okrevanje."
              },
              {
                icon: <CheckCircle className="text-[#00B5AD]" size={32} />,
                title: "Merljiv napredek",
                desc: "Primerjava stanja pred in po terapiji za jasno potrditev izboljšanja."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Kako poteka analiza?</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-4">
            {[
              { step: 1, title: "Scan", desc: "30–60s snemanje" },
              { step: 2, title: "3D Model", desc: "Digitalni izris" },
              { step: 3, title: "Analiza", desc: "Pregled asimetrij" },
              { step: 4, title: "Razlaga", desc: "Pogovor s terapevtom" },
              { step: 5, title: "Protokol", desc: "Načrt povratka" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#00B5AD] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg shadow-[#00B5AD]/20">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
                {i < 4 && <div className="hidden lg:block absolute top-1/2 w-full h-1 bg-gray-800 -z-10"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#00B5AD] to-[#009891] p-16 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">NE UGIBAJ. IZMERI.</h2>
              <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                MotioScan ti pokaže realno stanje tvojega telesa. Mi pa poskrbimo za pot nazaj v ravnovesje.
              </p>
              <Link
                href="/rezervacija?package=motioscan"
                className="inline-block px-12 py-5 bg-white text-[#00B5AD] font-bold text-xl rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Naroči svoj termin zdaj
              </Link>
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
