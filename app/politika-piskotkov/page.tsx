import { companyData } from "@/lib/companyData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika piškotkov | ORI 369",
  description: "Politika piškotkov spletne strani ORI 369 – katere piškotke uporabljamo in kako jih upravljate.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-10 text-3xl font-bold text-gray-900 md:text-4xl">Politika piškotkov</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900">1. Kaj so piškotki</h2>
            <p>
              Piškotki so majhne besedilne datoteke, ki se shranijo v vašo napravo ob obisku spletne
              strani. Omogočajo osnovno delovanje strani in anonimno statistiko obiskov.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">2. Katere piškotke uporabljamo</h2>
            <p>
              <strong>Nujni piškotki:</strong> potrebni za delovanje strani, prijavo v uporabniški račun,
              košarico in varnost. Teh piškotkov ni mogoče izklopiti.
            </p>
            <p>
              <strong>Analitični piškotki:</strong> anonimizirana statistika obiskov, ki nam pomaga
              izboljševati stran. Naložijo se le z vašo privolitvijo.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">3. Upravljanje piškotkov</h2>
            <p>
              Privolitev za piškotke lahko kadar koli spremenite ali prekličete v nastavitvah svojega
              brskalnika, kjer lahko piškotke tudi izbrišete. Izklop nujnih piškotkov lahko vpliva na
              delovanje strani (npr. prijava in košarica).
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900">4. Kontakt</h2>
            <p>
              Za vprašanja o piškotkih nam pišite na {companyData.email}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
