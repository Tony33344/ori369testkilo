"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, ClipboardList, ShieldCheck, Sparkles, Zap } from "lucide-react";

const HERO_IMAGE = "https://kbmclkpqjbdmnevnxmfa.supabase.co/storage/v1/object/public/servicesimages/motioscan/motioscan1.png";

export default function MotioScanStarterPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Physio Motio uvodni termin"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/55" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-28 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00B5AD]/35 bg-[#00B5AD]/10 px-4 py-2 text-sm font-semibold text-[#5de6e0]">
              <Sparkles className="h-4 w-4" />
              Prvi korak za nove obiskovalce
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Prvi pregled + meritev s Physio Motio + celovit personaliziran plan terapij in vaj
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
              To ni samo meritev. To je uvodni diagnostični obisk za ljudi, ki želijo razumeti svoje stanje,
              dobiti jasno razlago in konkreten načrt, kako začeti pot nazaj v ravnovesje.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/rezervacija?package=uvodni-termin"
                className="inline-flex items-center justify-center rounded-2xl bg-[#00B5AD] px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-200 hover:scale-[1.02] hover:bg-[#009891]"
              >
                Rezerviraj uvodni termin
              </Link>
              <Link
                href="/motioscan"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-[#00B5AD]/45 hover:text-[#7ee9e4]"
              >
                Več o MotioScan analizi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)] md:p-10">
              <h2 className="text-3xl font-bold md:text-4xl">Zakaj je ta uvodni termin drugačen?</h2>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
                Primeren je za človeka, ki čuti, da nekaj ni v redu, vendar ne ve, kje začeti. Najprej izmerimo,
                nato razložimo, nato pa postavimo jasen individualni načrt terapij in vaj.
              </p>

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {[
                  {
                    title: "Objektivna meritev",
                    desc: "Physio Motio analiza pokaže držo, asimetrije, preobremenitve in vzorce, ki jih s prostim očesom pogosto spregledamo.",
                    icon: <Zap className="h-5 w-5 text-[#00B5AD]" />,
                  },
                  {
                    title: "Strokovna razlaga",
                    desc: "Rezultatov ne dobiš brez konteksta. Skupaj pogledamo, kaj pomeni tvoje stanje in zakaj se določene težave ponavljajo.",
                    icon: <ClipboardList className="h-5 w-5 text-[#00B5AD]" />,
                  },
                  {
                    title: "Osebni plan terapij in vaj",
                    desc: "Namesto splošnih priporočil dobiš strukturiran predlog naslednjih korakov za tvoje telo, cilje in omejitve.",
                    icon: <CheckCircle className="h-5 w-5 text-[#00B5AD]" />,
                  },
                  {
                    title: "Več zaupanja pred začetkom",
                    desc: "Če si prvič pri nas, ta obisk zmanjša negotovost in ti pomaga lažje sprejeti odločitev za nadaljevanje terapij.",
                    icon: <ShieldCheck className="h-5 w-5 text-[#00B5AD]" />,
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00B5AD]/10">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] bg-gradient-to-br from-[#00B5AD] to-[#009891] p-8 text-white shadow-[0_18px_60px_rgba(0,181,173,0.22)]">
                <h3 className="text-2xl font-bold">Kaj dobiš na obisku</h3>
                <div className="mt-6 space-y-4">
                  {[
                    "uvodni pogovor o težavah, ciljih in zgodovini telesa",
                    "meritev s sistemom Physio Motio",
                    "razlago ključnih ugotovitev in prioritet",
                    "predlog terapij, vaj in nadaljnjih korakov",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                      <span className="text-sm leading-relaxed text-white/95">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
                <h3 className="text-2xl font-bold text-gray-900">Želiš najprej samo analizo?</h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Če te zanima predvsem 3D meritev in želiš najprej spoznati tehnologijo MotioScan, si poglej tudi osnovno predstavitev analize.
                </p>
                <Link
                  href="/motioscan"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#00B5AD]/25 px-5 py-3 font-semibold text-[#00B5AD] transition-colors hover:border-[#00B5AD] hover:bg-[#00B5AD]/5"
                >
                  Odpri MotioScan predstavitev
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
