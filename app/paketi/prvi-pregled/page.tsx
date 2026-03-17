import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardList, HeartHandshake, Sparkles, UserRoundSearch } from 'lucide-react';

export default function FirstConsultPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(0,181,173,0.18),_transparent_35%),linear-gradient(135deg,#f8fffe_0%,#ffffff_45%,#f4fbfb_100%)] py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00B5AD]/20 bg-[#00B5AD]/8 px-4 py-2 text-sm font-semibold text-[#00B5AD]">
              <Sparkles className="h-4 w-4" />
              Ne veš, kje začeti? Začni tukaj.
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Prva posvetovalna obravnava za jasen začetek tvoje poti
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl">
              Če si pri nas prvič in želiš razumeti, kaj tvoje telo trenutno potrebuje, je ta uvodni termin najboljši prvi korak.
              Skupaj pogledamo tvoje stanje, razjasnimo prioritete in postavimo usmeritev za nadaljnje terapije.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/rezervacija?package=prvi-pregled"
                className="inline-flex items-center justify-center rounded-2xl bg-[#00B5AD] px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-200 hover:scale-[1.02] hover:bg-[#009891]"
              >
                Rezerviraj prvo obravnavo
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#00B5AD]/20 bg-white px-8 py-4 text-base font-semibold text-[#00B5AD] shadow-sm transition-colors hover:border-[#00B5AD] hover:bg-[#00B5AD]/5"
              >
                Najprej želim posvet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)] md:p-10">
              <h2 className="text-3xl font-bold md:text-4xl">Kaj je namen te prve obravnave?</h2>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
                Namen ni, da dobiš samo termin. Namen je, da dobiš občutek varnosti, razumevanje svojega stanja
                in konkreten naslednji korak, ki ima smisel zate.
              </p>

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {[
                  {
                    title: 'Pogovor in usmeritev',
                    desc: 'Najprej razumemo, kaj te pripelje k nam, kako dolgo težava traja in kaj želiš doseči.',
                    icon: <HeartHandshake className="h-5 w-5 text-[#00B5AD]" />,
                  },
                  {
                    title: 'Ocena trenutnega stanja',
                    desc: 'Pogledamo telo, gibanje in morebitne omejitve, da ne ugibamo, ampak začnemo smiselno.',
                    icon: <UserRoundSearch className="h-5 w-5 text-[#00B5AD]" />,
                  },
                  {
                    title: 'Jasen terapevtski načrt',
                    desc: 'Po obravnavi veš, ali potrebuješ terapije, vaje, nadaljnjo diagnostiko ali kombinacijo pristopov.',
                    icon: <ClipboardList className="h-5 w-5 text-[#00B5AD]" />,
                  },
                  {
                    title: 'Manj negotovosti, več zaupanja',
                    desc: 'Ta obisk je idealen za prve obiskovalce, ki želijo začutiti, ali je naš center prava izbira zanje.',
                    icon: <CheckCircle2 className="h-5 w-5 text-[#00B5AD]" />,
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
                <h3 className="text-2xl font-bold">Za koga je to najboljša izbira?</h3>
                <div className="mt-6 space-y-4">
                  {[
                    'za prve obiskovalce, ki še ne vedo, katera terapija je zanje prava',
                    'za ljudi z več težavami hkrati, ki potrebujejo širšo sliko',
                    'za tiste, ki želijo strokovno usmeritev pred nakupom paketa ali nadaljnjih terapij',
                    'za vsakogar, ki si želi občutek jasnosti, reda in konkretnega načrta',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                      <span className="text-sm leading-relaxed text-white/95">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
                <h3 className="text-2xl font-bold">Če te zanima tudi globlja diagnostična pot</h3>
                <p className="mt-4 leading-relaxed text-gray-600">
                  Poglej še uvodni termin s Physio Motio meritvijo, kjer združimo prvi pregled, meritev in personaliziran plan terapij in vaj.
                </p>
                <Link
                  href="/motioscan/uvodni-termin"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#00B5AD]/25 px-5 py-3 font-semibold text-[#00B5AD] transition-colors hover:border-[#00B5AD] hover:bg-[#00B5AD]/5"
                >
                  Odpri Physio Motio uvodni termin
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
